const pool = require('../../../lib/db.js');

// Generate secure random ID
const generateSecureId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  let randomPart = '';
  
  // Generate 8 random characters
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Combine timestamp and random part for uniqueness
  return `${timestamp}_${randomPart}`;
};

const getGroups = async (req, res) => {
    try {
        const groups = await pool.query(
            `SELECT * FROM groups WHERE event_id = $1 ORDER BY name ASC`,
            [2]
        );

        if (!groups) {
            return res.status(404).json({ error: 'No groups found' });
        }

        res.status(200).json(groups.rows);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const createGroup = async (req, res) => {
    try {
        const { name, total_invitations } = req.body.group;
        const secureId = generateSecureId();
        
        const group = await pool.query(
            `INSERT INTO groups (
                id,
                name, 
                total_invitations, 
                confirmed_invitations,
                confirmed_status,
                opened_status,
                sent_status,
                event_id,
                created_at,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [secureId, name, total_invitations, 0, false, false, false, 2, new Date(), new Date()]
        );

        if (!group) {
            return res.status(404).json({ error: 'No groups found' });
        }

        res.status(200).json(group.rows);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }

}

const handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            return getGroups(req, res);
        case 'POST':
            return createGroup(req, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;