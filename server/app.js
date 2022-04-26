const express = require('express')
const path = require('path')
const app = express()

require('./index')
// view engine setup
app.engine('html', require('ejs').__express)
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'dist')));

app.use(function (_, res) {
  res.render('index')
});

app.listen('8086', () => {
  console.log('Server run at http://localhost:8086');
})