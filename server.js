const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

let urlDatabase = {
  "b2xVn2": "http://lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// app.get('/urls.json', (req, res) =>{
//   res.json(urlDatabase);
// });
app.get("/url", (req, res) => {
  let title = "My URL's";
  let templateVars = { 
    title: title, 
    urls: urlDatabase 
  };
  res.render('index', templateVars);
  console.log(title, templateVars);
});

app.get('/urls/new', (req, res) =>{
  res.render('urls_new');
});

app.get('/urls/:id', (req, res) =>{
  let templateVars = {
    shortURL: req.params.id
  };
  res.render('urls_show', templateVars);
});



app.post('/urls/new', (req, res)=>{
  //console.log(req.body);
  res.render('urls_new');
});

app.listen(PORT, () =>{
  console.log(`${PORT} is the magic port`);
});




generateRandomString = () =>{
  return Math.random().toString(36).replace(/[a-zA-Z0-9]+/g, '').substr(0, 5);
};







