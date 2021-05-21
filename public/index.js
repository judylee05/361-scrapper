var express = require('express');
var cors = require('cors');
var app = express();
var request = require('request'); // using request library (npm install request --save)

app.set('port', 2405);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

var apiurl = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=cat"

app.post('/apicall', function(req,res,next){
  console.log("node received get request");
  var context = {};
  request(apiurl, function(err, response, body){
    if(err){
      next(err);
      return;
    }
    else{
      // unwrap the JSON data
      let wikiresponse = JSON.parse(body);
      let parsed_info = wikiresponse['query']['pages'];
      let id_num = Object.keys(parsed_info);
      let scrapped_data = parsed_info[id_num]['extract'];

      console.log(scrapped_data);
      res.send(scrapped_data)
    }
  })
})


app.use(function(req,res){
  console.log("404")
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  // console.error(err.stack);
  console.log("500")
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});