const pool = require('../../../lib/db.js');

const denyInvitation = async (req, res) => {

    const { id } = req.body;

    try {
        const group = await pool.query(
            `UPDATE groups SET deny_status = true, confirmed_status = false, confirmed_invitations = 0 WHERE id = $1 RETURNING *`,
            [id]
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
            await denyInvitation(req, res);
            break;
        default:
            res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;