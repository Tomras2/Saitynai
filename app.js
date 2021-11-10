const Joi = require('joi');
const express = require('express');
const { countReset } = require('console');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.json());

app.use(bodyParser.json({
    type: "*/*"
}));

const sportsRouter = require('./routes/sports')
const clubsRouter = require('./routes/clubs')
const productsRouter = require('./routes/products')


app.use("/api/sports", sportsRouter)
app.use(clubsRouter)
app.use(productsRouter)

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '',
    database : 'sportsdb'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

app.get('/', (req, res) => {
    res.send('Home page');
});


app.all('*', function(req, res) {
    throw new Error("Bad request")
})

app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).json({error: {msg: e.message, stack: e.stack}});
    }
});

//PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

function validateSport(sport) {
    const schema = {
        name: Joi.string().required()
    };
    return Joi.validate(sport, schema);
};
function validateClub(club) {
    const schema = {
        name: Joi.string().required(),
        city: Joi.string().required()
    };
    return Joi.validate(club, schema);
};
function validateProduct(product) {
    const schema = {
        name: Joi.string().required()
    };
    return Joi.validate(product, schema);
};