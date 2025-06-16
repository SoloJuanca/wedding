const pool = require('../../../lib/db.js');

const exportGroupsAsCsv = async (req, res) => {
    try {
        const groups = await pool.query(
            `SELECT * FROM groups WHERE event_id = $1`,
            [2]
        );

        if (!groups) {
            return res.status(404).json({ error: 'No groups found' });
        }

        const guests = await pool.query(
            `SELECT * FROM guests`
        );

        if (!guests) {
            return res.status(404).json({ error: 'No guests found' });
        }

        const groupsWithGuests = groups.rows.map(group => {
            const groupGuests = guests.rows.filter(guest => guest.group_id === group.id);
            return { ...group, guests: groupGuests };
        });

        console.log(groupsWithGuests)

        // Create CSV with the following format:
        // name, total_invitations, confirmed_invitations, confirmed_status, deny_status, guests
        // Example:
        // "Group 1", 10, 5, true, false, "Guest 1, Guest 2, Guest 3"
        // "Group 2", 10, 5, true, false, "Guest 1, Guest 2, Guest 3"

        
        const csv = groupsWithGuests.map(group => {
            return `"${group.name}", ${group.total_invitations}, ${group.confirmed_invitations}, ${group.confirmed_status}, ${group.deny_status}`
        }).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=groups.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export default exportGroupsAsCsv;