const pool = require('../../../lib/db.js');

const addGuestToGroup = async (req, res) => {
    const { groupId, guestId } = req.body;
    try {
        const guest = await pool.query(
            `UPDATE guests SET group_id = $1 WHERE id = $2 RETURNING *`,
            [groupId, guestId]
        );

        if (!guest) {
            return res.status(404).json({ error: 'No guest found' });
        }

        res.status(200).json(guest.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const handler = (req, res) => {
    switch (req.method) {
        case 'POST':
            return addGuestToGroup(req, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;