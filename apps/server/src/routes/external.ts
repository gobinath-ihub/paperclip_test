import { Router, Request, Response } from 'express';

const router = Router();

const PAPERCLIP_API_URL = process.env.PAPERCLIP_API_URL || 'http://127.0.0.1:3100';
const PAPERCLIP_API_KEY = process.env.PAPERCLIP_API_KEY;
const PAPERCLIP_COMPANY_ID = process.env.PAPERCLIP_COMPANY_ID;
const CEO_AGENT_ID = '01cbd1f8-9442-4ddf-9b09-27214fbb357e'; // CEO agent ID

// POST /api/v1/external/submit
router.post('/submit', async (req: Request, res: Response) => {
  const { title, description, workflow, callbackUrl } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const response = await fetch(`${PAPERCLIP_API_URL}/api/companies/${PAPERCLIP_COMPANY_ID}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAPERCLIP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[${workflow || 'external'}] ${title}`,
        description: `External Submission:\n\n${description}\n\nWorkflow: ${workflow}\nCallback: ${callbackUrl}`,
        assigneeAgentId: CEO_AGENT_ID,
        status: 'todo',
        priority: 'medium',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Paperclip API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to create task in Paperclip' });
    }

    const data: any = await response.json();
    res.status(202).json({
      taskId: data.identifier,
      status: 'pending',
      statusUrl: `/api/v1/external/tasks/${data.identifier}`,
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/external/tasks/:id
router.get('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${PAPERCLIP_API_URL}/api/issues/${id}`, {
      headers: {
        'Authorization': `Bearer ${PAPERCLIP_API_KEY}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Task not found' });
    }

    const data: any = await response.json();
    let finalOutput = null;

    if (data.status === 'done') {
      const docResponse = await fetch(`${PAPERCLIP_API_URL}/api/issues/${id}/documents/result`, {
        headers: {
          'Authorization': `Bearer ${PAPERCLIP_API_KEY}`,
        },
      });
      if (docResponse.ok) {
        const docData: any = await docResponse.json();
        finalOutput = docData.body;
      }
    }
    
    // Aggregated response mapping
    res.json({
      taskId: data.identifier,
      status: data.status,
      workflow: data.title.match(/\[(.*?)\]/)?.[1] || 'unknown',
      progress: data.status === 'done' ? 100 : 50, // Mock progress for now
      startedAt: data.startedAt || data.createdAt,
      currentAgent: data.assigneeAgentId === CEO_AGENT_ID ? 'CEO' : 'Specialist',
      finalOutput
    });
  } catch (error) {
    console.error('Error fetching task status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
