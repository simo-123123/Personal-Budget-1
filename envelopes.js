const express = require('express');
const envelopesRouter = express.Router();

const { getAllEnvelopes,
    getSingleEnvelope,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
    increaseBudget,
    spendBudget } = require('./utils/db-functions');

const { validateBody, validateEnvelope, validateAmount } = require('./utils/validation');

envelopesRouter.param('id', (req, res, next, id) => {
    const envelope = getSingleEnvelope(id);

    if (!envelope) {
        return res.sendStatus(404);
    }

    req.envelope = envelope;
    next();
});

envelopesRouter.get('/', (req, res) => {
    res.json({ envelopes: getAllEnvelopes() });
});

envelopesRouter.get('/:id', (req, res) => {
    res.json({ envelope: req.envelope });
});

envelopesRouter.post('/', validateBody, validateEnvelope, (req, res) => {
    const createdEnvelope = createEnvelope(req.newEnvelope);
    res.status(201).json({ envelope: createdEnvelope });
});

envelopesRouter.put('/:id', validateBody, validateEnvelope, (req, res) => {
    const updatedEnvelope = updateEnvelope(req.params.id, req.newEnvelope);
    res.json({ envelope: updatedEnvelope });
});

envelopesRouter.delete('/:id', (req, res) => {
    deleteEnvelope(req.params.id);
    res.sendStatus(204);
});

envelopesRouter.post('/:id/increase', validateBody, validateAmount, (req, res) => {
    const updatedEnvelope = increaseBudget(req.envelope, req.amount);

    if (!updatedEnvelope) {
        return res.sendStatus(400);
    }

    res.status(201).json({ envelope: updatedEnvelope });
});

envelopesRouter.post('/:id/spend', validateBody, validateAmount, (req, res) => {
    const updatedEnvelope = spendBudget(req.envelope, req.amount);

    if (!updatedEnvelope) {
        return res.sendStatus(400);
    }
    
    res.status(201).json({ envelope: updatedEnvelope });
});

module.exports = envelopesRouter;