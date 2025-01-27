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

const increaseBudget = (envelope, amount) => {
    const { id, budget } = envelope;
    const newBudget = budget + amount;
    
    if (newBudget < 0) return;

    db.prepare('UPDATE Envelope SET budget = $newBudget WHERE id = $id').run({ newBudget, id });
    return getSingleEnvelope(id);
}

const spendBudget = (envelope, amount) => increaseBudget(envelope, -amount);

const transferBudget = (from, to, amount) => {
    return {
        from: spendBudget(from, amount),
        to: increaseBudget(to, amount)
    }
}

const distributeBudget = (envelopes, amount) => {
    const amountForEach = Math.floor(amount / envelopes.length * 100) / 100;
    const updatedEnvelopes = envelopes.map(envelope => increaseBudget(envelope, amountForEach));

    return {
        updatedEnvelopes,
        remainder: amount - (amountForEach * envelopes.length)
    }
}

module.exports = {
    getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
    increaseBudget,
    spendBudget,
    transferBudget,
    distributeBudget
}