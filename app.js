const express = require('express');
const { countReset } = require('console');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

// var corsOptions = {
//     origin: "http://localhost:8081"
//   };

  const corsOptions = {
    origin:'*', 
 }
  
app.use(cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

app.use(bodyParser.json({
    type: "*/*"
}));
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.use((err, req, res, next) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.sendStatus(400); // Bad request
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome');
});


require("./routes/sports.js")(app);
require("./routes/clubs.js")(app);
require("./routes/products.js")(app);
require('./routes/auth.routes.js')(app);


app.all('*', function(req, res) {
    throw new Error("Bad request")
})

app.use(function(e, req, res, next) {
    if (e.message === "Bad request") {
        res.status(400).json({error: {msg: e.message, stack: e.stack}});
    }
});

//PORT
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => console.log(`Listening on port ${app.get('port')}`));

