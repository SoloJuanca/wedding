import getPool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pool = getPool();
      const result = await pool.query('SELECT NOW()');
      res.status(200).json({ 
        status: 'ok', 
        message: 'Database connection successful',
        timestamp: result.rows[0].now 
      });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 