import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { Product, Order } from '@fashionhub/shared';

interface AdminProps {
  token: string | null;
}

export const Admin: React.FC<AdminProps> = ({ token }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<(Order & { user: { name: string; email: string } })[]>([]);
  const [stats, setStats] = useState<{
    totalSales: number;
    orderCount: number;
    visitorCount: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [prodRes, orderRes, statsRes] = await Promise.all([
          axios.get('/api/admin/products', { headers }),
          axios.get('/api/admin/orders', { headers }),
          axios.get('/api/admin/stats', { headers }),
        ]);
        setProducts(prodRes.data);
        setOrders(orderRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="admin-loading">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">FashionHub Admin</div>
        <ul>
          <li
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
          <li 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </li>
          <li className="disabled">Customers</li>
          <li className="disabled">Settings</li>
          </ul>
          </aside>
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <>
            <h2>Store Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Sales</div>
                <div className="stat-value">${(stats?.totalSales || 0).toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Orders</div>
                <div className="stat-value">{stats?.orderCount || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Visitors</div>
                <div className="stat-value">{stats?.visitorCount || 0}</div>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Recent Orders</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.user.name || order.user.email}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <div className="admin-header-actions">
              <h2>Product Management</h2>
              <button className="btn btn-accent">Add Product</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img src={product.image} alt={product.name} style={{ width: '40px' }} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category?.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <button className="btn-icon">Edit</button>
                      <button className="btn-icon btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h2>Order History</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.user.name || order.user.email}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await axios.patch(
                              `/api/admin/orders/${order.id}`,
                              { status: newStatus },
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            // Refresh orders
                            const orderRes = await axios.get('/api/admin/orders', {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            setOrders(orderRes.data);
                          } catch (err) {
                            console.error('Failed to update order status', err);
                          }
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};
