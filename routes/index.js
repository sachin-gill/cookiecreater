var express = require('express');
var router = express.Router();
var aws4  = require('aws4')
const request = require('request-promise-native');
var crypto = require('crypto-js');
var permitParams = require('params');

require('dotenv').config()



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
    let params = req.body;
    let bodyparams = {
      reader_params:{
          launch_url: params['launch_presentation_return_url'],
          reader_resource_link_id: params['resource_link_id']
      }
  };

  bodyparams['lti_params'] = permitParams(params).only( 'oauth_consumer_key','oauth_signature_method',
  'oauth_timestamp','oauth_nonce','oauth_version','context_id','context_label','context_title','custom_canvas_enrollment_state',
  'ext_roles','launch_presentation_document_target', 'launch_presentation_locale','lis_person_contact_email_primary','lti_message_type',
  'lti_version','oauth_callback','product_environment','resource_link_id', 'resource_link_title','roles','tool_consumer_info_product_family_code','tool_consumer_info_version',
  'tool_consumer_instance_contact_email', 'tool_consumer_instance_guid','tool_consumer_instance_name','user_id','oauth_signature');
 
  const  options = {
    url: 'https://oehvl9xcv4.execute-api.us-east-1.amazonaws.com/dev/lti/authenticate',
    path: '/dev/lti/authenticate',
    method: 'POST',
    body: JSON.stringify(bodyparams),
    service: 'execute-api',
    region: 'us-east-1',
    host: 'oehvl9xcv4.execute-api.us-east-1.amazonaws.com',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    }
  };

  aws4.sign(options, {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  });


  const ltiResponse = await request(options);
  console.log(ltiResponse);
  res.render('lti-res', { response: ltiResponse });
});


module.exports = router;
