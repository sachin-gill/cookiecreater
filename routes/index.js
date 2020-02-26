var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/redirect', function(req, res, next) {  
  console.log("redirect call invoked.!!", req.url);
  res.redirect(req.url)
});1

/* GET home page. */
router.post('/set-cookie', function(req, res, next) {
  console.log(req.get('origin'));
  console.log(req.get('Origin'));
  console.log(req.headers.origin);
  console.log("post call invoked.!!");
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Origin", req.headers.origin ||req.get('origin') ||req.get('Origin') ); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  let randomNumber=Math.random().toString();
  randomNumber=randomNumber.substring(2,randomNumber.length);
  res.cookie('mycokkieName',randomNumber, { domain: 'cookie-validator.herokuapp.com', path: '/', maxAge: 900000, httpOnly: true, secure: true, sameSite: false  })
  res.send('setting cookies.!!');
});

/* GET home page. */
router.get('/get-cookie', function(req, res, next) {
  console.log("get call invoked.!!");
  console.log(req.cookies['mycokkieName']);
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Origin", req.headers.host ||req.get('origin') ||req.get('Origin')); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  response = `Got the cookkie ${req.cookies['mycokkieName']}`;
  res.send(response);
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Client App' });
});


module.exports = router;
