const express = require('express');
const envelopesRouter = express.Router();

const { getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
    increaseBudget,
    spendBudget, 
    transferBudget} = require('./utils/db-functions');

const { validateBody, validateEnvelope, validateAmount } = require('./utils/validation');

envelopesRouter.param('id', (req, res, next, id) => {
    try {
        const envelope = getSingleEnvelope(id);

        if (!envelope) {
            return res.status(404).json({ message: 'Envelope not found' });
        }

        req.envelope = envelope;
        next();
    } catch(err) {
        next(err);
    }
});

envelopesRouter.get('/', (req, res, next) => {
    try {
        res.json({ envelopes: getAllEnvelopes() });
    } catch(err) {
        next(err);
    }
});

envelopesRouter.get('/:id', (req, res) => {
    res.json({ envelope: req.envelope });
});

envelopesRouter.post('/', validateBody, validateEnvelope, (req, res, next) => {
    try {
        const createdEnvelope = createEnvelope(req.newEnvelope);
        res.status(201).json({ envelope: createdEnvelope });
    } catch(err) {
        next(err);
    }
});

envelopesRouter.put('/:id', validateBody, validateEnvelope, (req, res, next) => {
    try {
        const updatedEnvelope = updateEnvelope(req.params.id, req.newEnvelope);
        res.json({ envelope: updatedEnvelope });
    } catch(err) {
        next(err);
    }
});

envelopesRouter.delete('/:id', (req, res, next) => {
    try {
        deleteEnvelope(req.params.id);
        res.status(204).send();
    } catch(err) {
        next(err);
    }
});

envelopesRouter.post('/:id/increase', validateBody, validateAmount, (req, res, next) => {
    try {
        const updatedEnvelope = increaseBudget(req.envelope, req.amount);
        res.json({ envelope: updatedEnvelope });
    } catch(err) {
        next(err);
    }
});

envelopesRouter.post('/:id/spend', validateBody, validateAmount, (req, res, next) => {
    try {
        const updatedEnvelope = spendBudget(req.envelope, req.amount);

        if (!updatedEnvelope) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        res.json({ envelope: updatedEnvelope });
    } catch(err) {
        next(err);
    }
});

envelopesRouter.post('/transfer/:from/:to', validateBody, validateAmount, (req, res, next) => {
    try {
        const from = getSingleEnvelope(req.params.from);
        const to = getSingleEnvelope(req.params.to);

        if (!from || !to) {
            return res.status(404).json({ message: 'Envelope(s) not found' });
        }

        const updatedEnvelopes = transferBudget(from, to, req.amount);

        if (!updatedEnvelopes.from || !updatedEnvelopes.to) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        res.json(updatedEnvelopes);
    } catch(err) {
        next(err);
    }
});

module.exports = envelopesRouter;