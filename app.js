const express = require('express')
const app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res){
  res.render('index')
})





const port = "3000" || process.env.PORT



app.listen(port,()=>{
  console.log(`serving at port: ${port}`)
})


