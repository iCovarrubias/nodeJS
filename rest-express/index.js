var express = require('express'),
	mongoskin = require('mongoskin'),
	bodyParser = require('body-parser'),
	logger	=	require('morgan')

var app = express()

app.set('port', 3000)


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(logger())

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe: true})

var id = mongoskin.helper.toObjectID

app.param('collectionName', function(req, res, next, collectionName) {
	req.collection = db.collection(collectionName)
	return next()
})

app.get('/', function(req, res, next) {
	res.send('Select a collection, e.g., /collections/messages')
})

app.get('/collections/:collectionName', function(req, res, next) {
	req.collection.find({}, {
		limit: 10, sort: [['_id', -1]]
	}).toArray(function(e, results) {
		if(e) 
			return next(e)
		res.send(results)
	})
})

app.post('/collections/:collectionName', function(req, res, next) {
	req.collection.insert(req.body, {}, function(e, results) {
		if(e)
			return next(e)
		res.send(results)
	})
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
	req.collection.findOne({
		_id: id(req.params.id)
	}, function(e, result) {
		if(e)
			return next(e)
		res.send(result)
	})
})

app.put('/collections/:collectionName/:id', function(req, res, next) {
	req.collection.update({
		_id: id(req.params.id)
	}, {$set:req.body}, {safe:true, multi:false},
	function(e, result) {
		if(e) 
			return next(e)
		res.send((result === 1)? {msg: 'success'}: {msg: 'error'})
	})
})

function getlarec() {
	return 'req';
}
app.del('/collections/:collectionName/:id', function(req, res, next) {
	req.collection.remove({
		_id: id(req.params.id)
	},
	function(e, result) {
		if(e) return next(e)
			res.send((result === 1)? {msg:'success'}:{msg:'error'})

		// console.log(eval('req'));
		// eval('console.log(req)');
		// eval('console.log(r' + 'e' + 'q' + ')');
		// eval('console.log(' + getlarec() + ')');
		// eval('console.log( getlarec() )');

	})
})

app.listen(app.get('port'), function() {
	console.log('Server is running on port:', app.get('port'))
})