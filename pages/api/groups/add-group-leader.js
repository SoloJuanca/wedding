const pool = require('../../../lib/db.js');

const addGroupLeader = async (req, res) => {
    const { groupId, guestId } = req.body;
    console.log("addGroupLeader -> groupId", groupId)
    console.log("addGroupLeader -> guestId", guestId)
    try {
        const group = await pool.query(
            `UPDATE groups SET leader_id = $1 WHERE id = $2 RETURNING *`,
            [guestId, groupId]
        )

        if (!group) {
            return res.status(404).json({ error: 'No group found' });
        }

        const groupGuests = await pool.query(
            `SELECT * FROM guests WHERE group_id = $1`,
            [groupId]
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

export default addGroupLeader;