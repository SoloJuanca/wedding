const pool = require('../../../lib/db.js');

// Change the opened_status to true and save opened_at timestamp
const openInvitation = async (req, res) => {
    const { id } = req.body;
    try {
        const group = await pool.query(
            `UPDATE groups SET opened_status = true, opened_at = $1 WHERE id = $2 RETURNING *`,
            [new Date(), id]
        );

        if (!group) {
            return res.status(404).json({ error: 'No group found' });
        }

        res.status(200).json(group.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const handler = async (req, res) => {
    switch (req.method) {
        case 'PUT':
            await openInvitation(req, res);
            break;
        default:
            res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;