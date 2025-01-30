const db = require('./db-connect');
const roundToDecimal = require('./round-to-decimal');

const getAllEnvelopes = () => {
    const allEnvelopes = db.prepare('SELECT * FROM Envelope').all();
    return allEnvelopes.map(envelope => {
        envelope.budget = roundToDecimal(envelope.budget / 100);
        return envelope;
    });
}

const getSingleEnvelope = id => {
    const envelope = db.prepare('SELECT * FROM Envelope WHERE id = $id').get({ id });
    if (!envelope) return;

    envelope.budget = roundToDecimal(envelope.budget / 100);
    return envelope;
}

const createEnvelope = envelope => {
    const { title, budget } = envelope;
    const insert = db.prepare('INSERT INTO Envelope (title, budget) VALUES ($title, $budget)').run({ title, budget: Math.round(budget * 100) });

    return getSingleEnvelope(insert.lastInsertRowid);
}

const updateEnvelope = (id, newEnvelope) => {
    const { title, budget } = newEnvelope;
    db.prepare('UPDATE Envelope SET title = $title, budget = $budget WHERE id = $id').run({ title, budget: Math.round(budget * 100), id });

    return getSingleEnvelope(id);
}

const deleteEnvelope = id => {
    db.prepare('DELETE FROM Envelope WHERE id = $id').run({ id });
}

const increaseBudget = (envelope, amount) => {
    const { id, budget } = envelope;
    const newBudget = Math.round((budget + amount) * 100);
    
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
    const remainder = roundToDecimal(amount - (amountForEach * envelopes.length));

    if (remainder < 0) {
        throw new Error('Remainder is negative');
    }

    const updatedEnvelopes = envelopes.map(envelope => increaseBudget(envelope, amountForEach));
    return { updatedEnvelopes, remainder }
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