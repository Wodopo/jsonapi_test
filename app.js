require('dotenv').config();
const express = require('express');
const peopleRoute = require('./routes/people-router');
const companiesRoute = require('./routes/companies-router');
const citiesRoute = require('./routes/cities-router');

const app = express();

app.use(express.json());

app.use('/api/people', peopleRoute);
app.use('/api/companies', companiesRoute);
app.use('/api/cities', citiesRoute);

// Default error handler
app.use((err, req, res, next) => {
    console.log(err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).send({ message: err.message });
});

const port = process.env.PORT || 5002;
app.listen(port, () => {
    console.log(`Server running. http://localhost:${port}`);
});
