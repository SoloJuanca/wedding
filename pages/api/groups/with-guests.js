const pool = require('../../../lib/db.js');

const getGroupsWithGroups = async (req, res) => {
    // Get all groups with the guests that belong to that group
    try {
        const groups = await pool.query(
            `SELECT * FROM groups WHERE event_id = $1 ORDER BY name ASC`,
            [2]
        );

        if (!groups) {
            return res.status(404).json({ error: 'No groups found' });
        }

        const groupIds = groups.rows.map(group => group.id);

        const guests = await pool.query(
            `SELECT * FROM guests WHERE group_id = ANY($1)`,
            [groupIds]
        );

        if (!guests) {
            return res.status(404).json({ error: 'No guests found' });
        }

        const groupsWithGuests = groups.rows.map(group => {
            const groupGuests = guests.rows.filter(guest => guest.group_id === group.id);
            return { ...group, guests: groupGuests };
        });

        res.status(200).json(groupsWithGuests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export default getGroupsWithGroups;