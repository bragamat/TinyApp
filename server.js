const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = process.env.PORT || 8080;
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');


function hashPassword(password){
  let hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
}


generateRandomString = () =>{
  var m = m || 6; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
  return s;
};
let urlDatabase = {
 "b2xVn2": {url: "http://www.lighthouselabs.ca", user_id: 'userRandomID'},
 "9sm5xK": {url: "http://www.google.com", user_id: 'user2RandomID'},
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: hashPassword("purple-monkey-dinosaur")
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: hashPassword("123")
  }
};

const bodyParser = require("body-parser");
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['secret'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.set('view engine', 'ejs');

app.get("/urls", (req, res) => {
  let title = "My URL's";
  let urls = {};
  for (let url in urlDatabase) {
    let obj = urlDatabase[url];
    if (obj.user_id === req.session.user_id) {
      urls[url] = obj;
    }
  }
      // console.log(req.session.user_email, req.session.user_id);

  // console.log('urls', urls);

  let templateVars = { 
    title: title, 
    urls: urls,//urlDatabase[req.cookies.user_id],
    id: req.session.user_id,
    email: req.session.user_email
  };
  res.render('index', templateVars);
  // console.log(title, templateVars);
});

app.get('/urls/new', (req, res) =>{
  let templateVars={
    user_id: req.session.user_id, 
    id: req.session.user_id,
    email: req.session.user_email
  }; if(!req.session.user_email){
    res.redirect('/urls');
  }

  res.render('urls_new', templateVars);
});

app.post('/urls/new', (req, res) =>{
  urlDatabase[generateRandomString()] = { url: req.body.longURL, user_id: req.session.user_id };
   req.session.longURL = req.body.longURL;
// res.cookie('longURL', req.body.longURL);
  res.redirect('/urls');
});

app.delete('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  res.redirect(longURL);
});


app.get('/urls/:id', (req, res) =>{
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase[req.session.user_id],
    username: req.session.username,
    id:req.session.user_id,
    email: req.session.user_email,
  };

  res.render('urls_show', templateVars);
});

app.put('/urls/:id/update', (req, res) =>{
  let newURL = req.body.newURL;
    urlDatabase[req.params.id].url = newURL;
    console.log(req.session.shortURL, newURL);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
   if(req.body.username == "" || req.body.password == ""){
    res.status(400).send("You need to fill the blanks with text and/or numbers");
  }
  for(var ids in users){
    if(users[ids].email === req.body.username && bcrypt.compareSync(req.body.password, users[ids].password)) {
       req.session.user_id = ids;
       // res.cookie('user_id', ids);
       req.session.user_email = req.body.username;
        // res.cookie('user_email', req.body.username);
      return res.redirect('/urls');
    }
  }res.status(403).send("email and password problems");
});

app.post('/logout', (req, res)=>{
  req.session = null;
// res.clearCookie('user_id');

  res.redirect('/urls');
});

app.get('/register', (req, res) =>{
  let usersVars = {
    users: users
  };
  // console.log(users);
  res.render('registration', usersVars);

});
app.get('/registration', (req, res) =>{
  let usersVars = {
    users: users
  };
  // console.log(users);
  res.render('registration', usersVars);

});

app.post('/register', (req, res)=>{
  for (var ids in users) {
    for(var email in users[ids]){
      if(req.body.email == users[ids][email]){
        res.status(400).send("Email already in use");
      }
    }
  }
  if(req.body.email == "" || req.body.password == ""){
    res.status(400).send("You need to fill the blanks with text and/or numbers");
  } else {
let email = req.body.email;
let password =  hashPassword(req.body.password);
let username = req.body.username;
let id = generateRandomString();
        let person = {
          id: id,
          email: email,
          password: password
        };
    users[id] = person;
    req.session.user_id = person.id;
    // res.cookie("user_id", id);
    req.session.user_email = email;
    // res.cookie("user_email", email);
    // console.log(req.session.user_email, req.session.user_id);
    }
  res.redirect('/urls');
}); 

app.listen(PORT, () =>{
  console.log(`${PORT} is the magic port`);
});











