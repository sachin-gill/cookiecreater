var express = require('express');
var router = express.Router();
var aws4  = require('aws4')
const request = require('request-promise-native');



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
  res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Expose-Headers', 'Authorization, Cache-Control, Content-Length, Date, Expires, Server, Origin, Set-cookie');
  let randomNumber=Math.random().toString();
  randomNumber=randomNumber.substring(2,randomNumber.length);
  res.cookie('mycokkieName',randomNumber, { domain: '.cokkie-validator.herokuapp.com', path: '/', httpOnly: true, secure: true, sameSite: false })
  res.send('setting cookies.!!');
});

/* GET home page. */
router.get('/get-cookie', function(req, res, next) {
  console.log("get call invoked.!!");
  console.log(req.cookies['mycokkieName']);
  console.log(req.get('origin'));
  console.log(req.get('Origin'));
  console.log(req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Origin", req.headers.origin ||req.get('origin') ||req.get('Origin')); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Expose-Headers', 'Authorization, Cache-Control, Content-Length, Date, Expires, Server, Origin, Set-cookie');
  response = `Got the cookkie ${req.cookies['mycokkieName']}`;
  res.send(response);
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Client App' });
});

router.get('/lti-launch', function(req, res, next) {
  res.render('lti', { title: 'Client App' });
});


router.post('/launch-lti', async (req, res) => {

  const  options = {
    path: '/lti-launch',
    uri: 'https://55zdx6j9gf.execute-api.us-east-1.amazonaws.com/test',
    method: "POST",
    body: "Hello",
    service: 'execute-api',
    region: 'us-east-1',
    json: true,
    host: '55zdx6j9gf.execute-api.us-east-1.amazonaws.com', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    }
  };
  aws4.sign(options, {
    accessKeyId: "..",
    secretAccessKey: ".."
  });
  console.log("requestOptions==", options);

  //Call tp aws api gateway and reciev response
  //show response on html page.
  // const uri = `https://55zdx6j9gf.execute-api.us-east-1.amazonaws.com/test/lti-launch`

  const ltiResponse = await request(options);
  console.log(ltiResponse);
  res.render('lti-res', { title: 'Client App' });
});


module.exports = router;
