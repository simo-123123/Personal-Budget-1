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

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});