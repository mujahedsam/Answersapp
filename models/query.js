var mongoose=require('mongoose');

//question schemaa
var questschema=mongoose.Schema({
	
	question:{
		type:String,
	},
	description:{
		type:String,
	},
	timeresult:{
		type:String,
	},
	quser:{
		type:String,
	},

});

//exporting questschema data
var quests = module.exports=mongoose.model('quest',questschema);

//to find quest data in DB & export question data
module.exports.getQuestions = function(callback){
	var query = {};
	quests.find(query, callback);
}
// to find one required question
module.exports.getQuestion1=function(id,callback){
	var query={_id:id};
	quests.findOne(query,callback);
}