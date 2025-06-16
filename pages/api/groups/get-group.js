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

        const groupsWithGuests = { ...group.rows[0], guests: groupGuests.rows };

        res.status(200).json(groupsWithGuests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export default getGroup;