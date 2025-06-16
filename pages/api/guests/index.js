const pool = require('../../../lib/db.js');

const getGuests = async (req, res) => {
    try {
        const guests = await pool.query(
            `SELECT g.* FROM guests g 
             LEFT JOIN groups gr ON g.group_id = gr.id 
             WHERE g.group_id IS NULL OR gr.event_id = $1`,
            [2]
        );

        if (!guests) {
            return res.status(404).json({ error: 'No guests found' });
        }

        res.status(200).json(guests);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const addGuest = async (req, res) => {
    const { guest } = req.body;
    const { name, email, phone, group_id } = guest;

    try {
        const newGuest = await pool.query(
            `INSERT INTO guests (name, email, phone_number, group_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, email, phone, group_id, new Date(), new Date()]
        );

        if (!newGuest) {
            return res.status(400).json({ error: 'Could not add guest' });
        }

        res.status(200).json(newGuest);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const updateGuest = async (req, res) => {
    const { guest } = req.body;
    const { id, name, email, phone_number } = guest;

    try {
        const updatedGuest = await pool.query(
            `UPDATE guests SET name = $1, email = $2, phone_number = $3, updated_at = $4 WHERE id = $5 RETURNING *`,
            [name, email, phone_number, new Date(), id]
        );

        if (!updatedGuest) {
            return res.status(400).json({ error: 'Could not update guest' });
        }
        console.log(updatedGuest);
        res.status(200).json(updatedGuest);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }

}

const deleteGuest = async (req, res) => {
    const { id } = req.body;

    try {
        const deletedGuest = await pool.query(
            `DELETE FROM guests WHERE id = $1 RETURNING *`,
            [id]
        );

        if (!deletedGuest) {
            return res.status(400).json({ error: 'Could not delete guest' });
        }

        res.status(200).json(deletedGuest);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }

}

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            await getGuests(req, res);
            break;
        case 'POST':
            await addGuest(req, res);
            break;
        case 'PUT':
            await updateGuest(req, res);
            break;
        case 'DELETE':
            await deleteGuest(req, res);
            break;
        default:
            res.status(400).json({ error: 'Invalid method' });
            break;
    }
}

export default handler;