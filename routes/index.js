var express = require('express');
var router = express.Router();
var mongoclient=require('mongodb').MongoClient;
var url='mongodb://localhost/loginapp';



router.get('/', function (req, res) {
	
	res.render('login',{msg:""});
});
 
module.exports = router;