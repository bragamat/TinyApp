const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

generateRandomString = () =>{
  var m = m || 6; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
  return s;
};
let urlDatabase = {
  "b2xVn2": "http://lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get("/urls", (req, res) => {
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

app.post('/urls/new', (req, res)=>{
  //console.log(req.body);
  let key = generateRandomString();
  urlDatabase[key] = req.body.longURL;
  res.redirect('/urls');
});
app.post('/urls/:id/delete', (req, res) => {
  
// console.log(urlDatabase);
  delete urlDatabase[req.params.id];
  console.log(urlDatabase);

  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get('/urls/:id', (req, res) =>{
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase
  };
  res.render('urls_show', templateVars);
});

app.post('/urls/:id/update', (req, res) =>{
  let newURL = req.body.newURL;
  console.log(newURL);
  urlDatabase[req.params.id] = newURL;
  res.redirect('/urls');
});

app.listen(PORT, () =>{
  console.log(`${PORT} is the magic port`);
});











