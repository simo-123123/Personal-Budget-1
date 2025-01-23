const db = require('./db-connect');

const getAllEnvelopes = () => {
    return db.prepare('SELECT * FROM Envelope').all();
}

const getSingleEnvelope = id => {
    return db.prepare('SELECT * FROM Envelope WHERE id = $id').get({ id });
}

const createEnvelope = envelope => {
    const { title, budget } = envelope;
    const insert = db.prepare('INSERT INTO Envelope (title, budget) VALUES ($title, $budget)').run({ title, budget });

    return getSingleEnvelope(insert.lastInsertRowid);
}

const updateEnvelope = (id, newEnvelope) => {
    const { title, budget } = newEnvelope;
    db.prepare('UPDATE Envelope SET title = $title, budget = $budget WHERE id = $id').run({ title, budget, id });

    return getSingleEnvelope(id);
}

const deleteEnvelope = id => {
    db.prepare('DELETE FROM Envelope WHERE id = $id').run({ id });
}

module.exports = {
    getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope
}