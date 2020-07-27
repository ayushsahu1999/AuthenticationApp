const express = require('express')
const app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
let isloggedIn = false
mongoose.connect('mongodb+srv://ShriyaMadan:jorsebolojaimatadi@cluster0.e8h0z.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("We're connected");
});

var userdata = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
})
var datum = mongoose.model("auth-app",userdata);

const users = [{ id: 1,name: 'sia',password: '1234'},
              { id: 2,name: 'shu',password: 'shu'},
              { id: 3, name: 'zec',password: 'zec'}];

const redirectHome= (req,res,next)=>{
  if(req.session.isloggedIn===true){
    res.redirect('/home')
  }else{
    next()
  }
}
const redirectLogin = (req, res, next) => {
  if (req.session.isloggedIn===false) {
    return res.render('index')
  }else {
    next()
  }
}
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ secret: "shriyashriya", saveUninitialized: true, resave: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.redirect('/home')
})

app.get('/check-login', (req, res) => {
  res.send(`isLoggedIn ${req.session.isloggedIn}`)
})

app.post('/login', function(req,res){
  const {name, password} = req.body
  const user = users.find((u) => u.name === name && u.password === password)
  
  if(null != user){   
   req.session.isloggedIn = true   
  } else {
   return res.send({error: 'Invalid Credentials.'})
  }
  res.send({redirectUrl: '/home'})
})

app.post('/register', function(req,res){
  //console.log("req.body", req.body)
  console.log("users", users)
  const { name, password } = req.body
  myobject = { name, password }
  req.session.isloggedIn = true
  users.push(myobject)
  res.send({ redirectUrl: '/home' })
})

app.get('/home', redirectLogin, function(req,res){
  res.send(`<h1> WELCOME </h1>
            <a href="/logout">Logout</a>`)
})

app.get('/logout', (req, res) => {
  req.session.isloggedIn = false
  res.redirect('/')
})





const port = "3000" || process.env.PORT
app.listen(port,()=>{
  console.log(`serving at port: ${port}`)
})