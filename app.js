const express = require('express')
const app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const mongoose = require('mongoose')
let isloggedIn = false

mongoose.connect('mongodb+srv://<user>:<password>@cluster0.e8h0z.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("We're connected");
});

var userdata = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
})

var authModel = mongoose.model("authModel",userdata);

// const users = [{ id: 1,name: 'sia',password: '1234'},
//               { id: 2,name: 'shu',password: 'shu'}];

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
  const myData = {
    username: req.body.name,
    password: req.body.password
  }
  authModel.exists(myData,(error,result)=>{
    if (error){
      console.log(error)
    } else{
      //console.log("result:",result)
      if (result === true) { 
        req.session.isloggedIn = true  
        res.send({ redirectUrl: '/home' })
      }else{
        return res.send({ error: 'Invalid Credentials.' })
      }
    }
  })
  //const user = users.find((u) => u.name === name && u.password === password)
  // if(null != user){   
  //  req.session.isloggedIn = true   
  // } else {
  //  return res.send({error: 'Invalid Credentials.'})
  // }
})

app.post('/register', async function(req,res){
  const { name, password } = req.body
  
  const myData = {username: name, 
                  password: password}

  const newauthModel = new authModel(myData)
  const doesUserExists = await authModel.exists(myData)
  console.log(doesUserExists);

  if(doesUserExists===false){
    newauthModel.save((error)=>{
      if(error){
        console.log("error:",error)
      } else{
        console.log("We recieved your data!");
      }
    })
  } 
  else{
    console.log("User already exists!")
  }
  req.session.isloggedIn = true
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
