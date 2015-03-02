/*
 * users.js defines the routes that are use to get, post and delete data from the DB
 */

var express = require('express');
var router = express.Router();

//retrieves users
router.get('/userlist', function(req, res){
	var db = req.db;
	db.collection('userlist').find().toArray(function(err, items){
		res.json(items);
	});
});

//adds users
router.post('/adduser', function(req, res){
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		if (err === null){
			res.send({msg : ''});
		}
		else{
			res.send({msg:'Error adding user: ' + err});
		}
	});
});

//delete users
router.delete('/deleteuser/:id', function(req, res){
	var db = req.db;
	var deleteUser = req.params.id;

	db.collection('userlist').removeById(deleteUser, function(err, result){
		if (err === null){
			res.send({msg : ''});
		}
		else{
			res.send({msg:'Error deleting user: ' + err});
		}
	});
});

module.exports = router;
