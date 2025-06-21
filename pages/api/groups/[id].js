const pool = require('../../../lib/db.js');

const getGroup = async (req, res) => {
    const { id } = req.query;
    try {
        const group = await pool.query(
            `SELECT * FROM groups WHERE id = $1`,
            [id]
        );

        if (!group) {
            return res.status(404).json({ error: 'No group found' });
        }

        const groupGuests = await pool.query(
            `SELECT * FROM guests WHERE group_id = $1`,
            [id]
        );

        if (!groupGuests) {
            return res.status(404).json({ error: 'No guests found' });
        }

        // Marcar la invitación como abierta si no lo está ya
        if (!group.rows[0].opened_status) {
            await pool.query(
                `UPDATE groups SET opened_status = true, opened_at = $1 WHERE id = $2`,
                [new Date(), id]
            );
        }

        const groupsWithGuests = { ...group.rows[0], guests: groupGuests.rows };

        res.status(200).json(groupsWithGuests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const deleteGroup = async (req, res) => {
    const { id } = req.query;
    try {
        const group = await pool.query(
            `DELETE FROM groups WHERE id = $1`,
            [id]
        );

        if (!group) {
            return res.status(404).json({ error: 'No group found' });
        }

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const updateGroup = async (req, res) => {
    const { group } = req.body;
    const { id } = req.query;
    const { name, total_invitations, confirmed_invitations } = group || {};

    try {
        const updatedGroup = await pool.query(
            `UPDATE groups SET name = $1, total_invitations = $2, confirmed_invitations = $3, updated_at = $4 WHERE id = $5 RETURNING *`,
            [name, total_invitations, confirmed_invitations, new Date(), id]
        );
        console.log(updatedGroup)
        if (!updatedGroup) {
            return res.status(400).json({ error: 'Could not update group' });
        }

        res.status(200).json(updatedGroup);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            return getGroup(req, res);
        case 'PUT':
            return updateGroup(req, res);
        case 'DELETE':
            return deleteGroup(req, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

export default handler;