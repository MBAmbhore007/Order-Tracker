import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { customer_name, order_date, total_amount, status } = req.body;
  if (!customer_name || !order_date || !status || total_amount < 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }
  const validStatuses = ['Pending', 'Shipped', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, order_date, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [customer_name, order_date, total_amount, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { total_amount, status } = req.body;
  const validStatuses = ['Pending', 'Shipped', 'Delivered'];
  if (total_amount < 0 || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid update data' });
  }
  try {
    const result = await pool.query(
      'UPDATE orders SET total_amount=$1, status=$2 WHERE id=$3 RETURNING *',
      [total_amount, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Ids array required' });
  }
  try {
    await pool.query('DELETE FROM orders WHERE id = ANY($1)', [ids]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
