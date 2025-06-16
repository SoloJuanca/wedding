const pool = require('../../../lib/db.js');

const confirmInvitation = async (req, res) => {
        
        const { id, confirmed_invitations } = req.body;
    
        try {
            const group = await pool.query(
                `UPDATE groups SET confirmed_invitations = $1, confirmed_status = true, deny_status = false WHERE id = $2 RETURNING *`,
                [confirmed_invitations, id]
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
            await confirmInvitation(req, res);
            break;
        default:
            res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;