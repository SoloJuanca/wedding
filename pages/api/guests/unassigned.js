const pool = require('../../../lib/db.js');

const getUnassignedGuests = async (req, res) => {
    try {
        const guests = await pool.query(
            `SELECT * FROM guests WHERE group_id IS NULL`
        );

        if (!guests) {
            return res.status(404).json({ error: 'No guests found' });
        }

        res.status(200).json(guests.rows);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            return getUnassignedGuests(req, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;