const Joi = require('joi');
const express = require('express');
const { countReset } = require('console');
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());

app.use(bodyParser.json({
    type: "*/*"
}));

const sports = [
    {id: 1, name: 'Basketball'},
    {id: 2, name: 'Football'},
    {id: 3, name: 'Tennis'},
    {id: 4, name: 'Tennis2'},
];
const clubs = [
    {id: 1, name: 'Zalgiris', city: 'Kaunas'},
    {id: 2, name: 'Rytas', city: 'Vilnius'},
];

const products = [
    {id: 1, name: 'Ball'},
    {id: 2, name: 'Racket'}
]

app.get('/', (req, res) => {
    res.send('Home page');
});


app.get('/api/sports', (req, res) => {
    res.send(sports);
});

app.get('/api/sports/:id/clubs', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.id));
    if (!sport) return res.status(404).send('Sport with the given id not found')
    res.send(clubs);
})

app.get('/api/sports/:sid/clubs/:cid/products', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    res.send(products);
})

app.post('/api/sports', (req, res) => {
    const { error } = validateSport(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);   
    }
    const sport = {
        id: sports.length + 1,
        name: req.body.name
    };
    sports.push(sport);
    res.status(201).send(sport);
});

app.post('/api/sports/:sid/clubs', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')
    const { error } = validateClub(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);   
    }
    const club = {
        id: clubs.length + 1,
        name: req.body.name,
        city: req.body.city
    };
    clubs.push(club);
    res.status(201).send(club);

})

app.post('/api/sports/:sid/clubs/:cid/products', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);   
    }
    const product = {
        id: products.length + 1,
        name: req.body.name,
    };
    products.push(product);
    res.status(201).send(product);

})

app.put('/api/sports/:id', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.id));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const { error } = validateSport(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    sport.name = req.body.name;
    res.send(sport);
})

app.put('/api/sports/:sid/clubs/:cid', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    const { error } = validateClub(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    club.name = req.body.name;
    club.city = req.body.city;
    res.send(club);
})

app.put('/api/sports/:sid/clubs/:cid/products/:pid', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    const product = products.find(c => c.id === parseInt(req.params.pid));
    if (!product) return res.status(404).send('Product with the given id not found')

    const { error } = validateProduct(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    product.name = req.body.name;
    res.send(product);
})

app.get('/api/sports/:id', (req, res) => {
   const sport = sports.find(c => c.id === parseInt(req.params.id));
   if (!sport) return res.status(404).send('Sport with the given id not found')
   res.send(sport);
});

app.get('/api/sports/:id/clubs/:cid', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.id));
    if (!sport) return res.status(404).send('Sport with the given id not found')
    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')
    res.send(club);
 });
 app.get('/api/sports/:id/clubs/:cid/products/:pid', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.id));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    const product = products.find(c => c.id === parseInt(req.params.pid));
    if (!product) return res.status(404).send('Product with the given id not found')

    res.send(product);
 });


app.delete('/api/sports/:id', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.id));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const index = sports.indexOf(sport);
    sports.splice(index, 1);

    res.send(sport);
})

app.delete('/api/sports/:sid/clubs/:cid', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    const index = clubs.indexOf(club);
    clubs.splice(index, 1);

    res.send(club);
})

app.delete('/api/sports/:sid/clubs/:cid/products/:pid', (req, res) => {
    const sport = sports.find(c => c.id === parseInt(req.params.sid));
    if (!sport) return res.status(404).send('Sport with the given id not found')

    const club = clubs.find(c => c.id === parseInt(req.params.cid));
    if (!club) return res.status(404).send('Club with the given id not found')

    const product = products.find(c => c.id === parseInt(req.params.pid));
    if (!product) return res.status(404).send('Product with the given id not found')

    const index = products.indexOf(product);
    products.splice(index, 1);

    res.send(product);
})

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