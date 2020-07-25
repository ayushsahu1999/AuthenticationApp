const express = require('express')
const app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')
let isloggedIn = false

const users = [{ id: 1,name: 'sia',password: '1234'},
              { id: 2,name: 'shu',password: 'shu'},
              { id: 3, name: 'zec',password: 'zec'}];

const redirectLogin = (req,res,next)=>{
  if(req.session.isloggedIn===false){
    res.redirect('/')
  }else{
    next()
  }
}
const redirectHome = (req, res, next) => {
  if (req.session.isloggedIn===false) {
    res.redirect('/home')
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
  
  if(req.session.isloggedIn === true){
    res.send('Your data is confidential!!!')
    console.log("you are logged in session")  
  } else{
    res.render('index')
  }
})

app.get('/check-login', (req, res) => {
  res.send(`isLoggedIn ${req.session.isloggedIn}`)
})

app.post('/login', redirectHome, function(req,res){
  const {name, password} = req.body
  const user = users.find((u) => u.name === name && u.password === password)
  
  if(null != user){   
   req.session.isloggedIn = true   
  } else {
   return res.send({error: 'Invalid Credentials.'})
  }
  res.send({redirectUrl: '/home'})
})

app.post('/register', redirectHome, function(req,res){
  const { name, password } = req.body
  myobject = { name, password }
  req.session.isloggedIn = true
  console.log(myobject)
  users.push(myobject)
  res.send({ redirectUrl: '/home' })
})

app.get('/home', redirectLogin, function(req,res){
  res.send(`<h1> WELCOME </h1>
            <a href="/logout">Logout</a>`)
})

app.get('/logout', redirectLogin, (req, res) => {
  req.session.isloggedIn = false
  res.send(`<h2>Logged out successfully...</h2><a href="/">Login again</a>`)
})





const port = "3000" || process.env.PORT
app.listen(port,()=>{
  console.log(`serving at port: ${port}`)
})