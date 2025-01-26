const express = require('express');
const app = express();

require('dotenv').config();

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const envelopesRouter = require('./envelopes');
app.use('/api/envelopes', envelopesRouter);

const server = app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

// Gracefully shuts down everything when Ctrl+C is pressed
process.on('SIGINT', () => {
    const db = require('./utils/db-connect');
    db.close();

    server.close(() => {
        console.log('\nServer closed');
        process.exit(0);
    });

    setTimeout(() => {
        console.log('\nForcing shutdown...');
        process.exit(1);
    }, 10000).unref();
});