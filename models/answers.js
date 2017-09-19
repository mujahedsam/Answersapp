var mongoose=require('mongoose');

//answer schemaa
var answerschema=mongoose.Schema({
	
	subid:{
		type:String,
	},
	answer:{
		type:String,
	},
	user:{
		type:String
	}
});

//exporting answerschema data
var answer = module.exports=mongoose.model('answer',answerschema);

//to find answer data in DB & export answr data
module.exports.getAnswers = function(subid, callback){
	var query = {subid: subid};
	answer.find(query, callback);
}
//to findone and delete an answer
module.exports.ansdel = function(_id, callback){
	var query = {_id:_id};
	answer.remove(query, callback);
}