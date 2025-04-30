
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'OmegaDB', // Updated to match the schema
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();

// Routes
// User API
app.get('/api/user', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM User');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM User WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    res.status(500).json({ message: `Error fetching user ${req.params.id}` });
  }
});

app.post('/api/user', async (req, res) => {
  const { username, email, phone, address } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO User (username, email, phone, address) VALUES (?, ?, ?, ?)',
      [username, email, phone, address]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      username,
      email,
      phone,
      address 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Products API
app.get('/api/product', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Product');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Product WHERE pid = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ message: `Error fetching product ${req.params.id}` });
  }
});

// Billings API
app.get('/api/billing', async (req, res) => {
  try {
    // Join with User table to include customer details
    const [rows] = await pool.query(`
      SELECT b.*, u.username, u.email, u.phone, u.address
      FROM Billing b
      JOIN User u ON b.user_id = u.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching billings:', error);
    res.status(500).json({ message: 'Error fetching billings' });
  }
});

app.get('/api/billing/:id', async (req, res) => {
  try {
    // Join with User table to include customer details
    const [rows] = await pool.query(`
      SELECT b.*, u.username, u.email, u.phone, u.address
      FROM Billing b
      JOIN User u ON b.user_id = u.id
      WHERE b.billing_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Billing not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching billing ${req.params.id}:`, error);
    res.status(500).json({ message: `Error fetching billing ${req.params.id}` });
  }
});

app.get('/api/billing/:id/items', async (req, res) => {
  try {
    // Join with Product table to include product details
    const [rows] = await pool.query(`
      SELECT bi.*, p.model, p.max_watts
      FROM Bill_Items bi
      JOIN Product p ON bi.product_id = p.pid
      WHERE bi.bill_id = ?
    `, [req.params.id]);
    
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching items for billing ${req.params.id}:`, error);
    res.status(500).json({ message: `Error fetching items for billing ${req.params.id}` });
  }
});

app.post('/api/billing', async (req, res) => {
  const { user_id, amount, payment_method, status, billing_date, items } = req.body;
  
  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert billing record
      const [result] = await connection.query(
        'INSERT INTO Billing (user_id, billing_date, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)',
        [user_id, billing_date, amount, payment_method, status]
      );
      
      const billingId = result.insertId;
      
      // Insert bill items if provided
      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          await connection.query(
            'INSERT INTO Bill_Items (bill_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [billingId, item.product_id, item.quantity, item.price]
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      res.status(201).json({
        billing_id: billingId,
        user_id,
        billing_date,
        amount,
        payment_method,
        status
      });
      
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating billing:', error);
    res.status(500).json({ message: 'Error creating billing' });
  }
});

// New endpoint for updating billing status
app.patch('/api/billing/:id/status', async (req, res) => {
  const { status } = req.body;
  const billingId = req.params.id;
  
  try {
    const [result] = await pool.query(
      'UPDATE Billing SET status = ? WHERE billing_id = ?',
      [status, billingId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    
    res.json({ 
      billing_id: billingId, 
      status, 
      message: 'Status updated successfully' 
    });
  } catch (error) {
    console.error(`Error updating billing status ${billingId}:`, error);
    res.status(500).json({ message: 'Error updating billing status' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
