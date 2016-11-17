var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/duck_db');
var DuckSchema = new mongoose.Schema({
 name: String,
 color: String
})
mongoose.model('Duck', DuckSchema);
var Duck = mongoose.model('Duck')

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

//show
app.get('/', function(req, res) {
 	Duck.find({}, function(err, result){
    	res.render('index', {ducks: result});
	})
})

//new duck form
app.get('/ducks/new', function(req, res) {
	res.render('addDuck')
})

//one duck detail
app.get('/ducks/:id', function(req, res) {
	Duck.find({_id: req.params.id}, function(err, result){
		if(err){console.log(err);}
	
	res.render('oneDuck', {duck: result[0]})
	})
})

//create new
app.post('/ducks', function(req, res) {
  console.log("POST DATA", req.body);

  var duck = new Duck({name: req.body.name, color: req.body.color});
  
  duck.save(function(err) {
    
    if(err) {
      console.log('something went wrong');
    } else {
      console.log('successfully added a duck!');
      res.redirect('/');
    }
  })
})

//edit form
app.get('/ducks/:id/edit', function(req, res){
	Duck.find({_id: req.params.id}, function(err, result){
		if(err){console.log(err);}
	res.render('edit', {duck: result[0]})	
	})
})

//edit duck
app.post('/:id', function(req, res){
  Duck.update({ _id: req.params.id }, req.body, function(err, result){
    if (err) { console.log(err); }
    res.redirect('/');
  })
})

//delete duck
app.get('/ducks/:id/destroy', function(req, res){
	Duck.remove({_id: req.params.id}, function(err, result){
		if (err){console.log(err);}
		res.redirect('/');
	})
})


//listening on localhost 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})