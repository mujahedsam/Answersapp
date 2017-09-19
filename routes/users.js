var express = require('express');
var router = express.Router();
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var mongoclient=require('mongodb').MongoClient;
var url='mongodb://localhost/loginapp';


var User = require('../models/user');
var quest = require('../models/query');
var answer = require('../models/answers');

// Register
router.get('/register', function(req, res){
	console.log("Register's get method");
	res.render('register');
});

// Login
router.get('/login', checkSignIn,function(req, res){
	console.log("Login's get method");
	//var txt= "Invalid Password";
	if (!req.session.user) {
		res.render('login', {msg:""});
	}else{
	res.render('homepage', {msg:""});
         }
});
//for question
router.get('/homepage',checkSignIn,function (req, res) {

	console.log("homepage's get method");

	if (!req.session.user) {
		res.render('login');
	}else{
		console.log(req.session.user);
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('homepage');
	}

});

router.get('/about',function (req, res) {

	console.log("abouts's get method");

	res.render('about');
});

router.get('/logout', function(req, res){
      req.session.destroy(function(){

        console.log("user logged out.")
    });
	//req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});
//to delete an answer2ndtym
router.get('/delete',function(req,res){

	var did= req.query.did;
	var qid= req.query.qid;
	console.log(req.query.did+"this is ans did,qid is-->"+ req.query.qid);
	  answer.ansdel(did,function(err,answer){
	  	console.log("Deleted Answer");

	  });
	  //to get quetions,answers and to render back to smepage
	  var newuser = req.session.user;
     quest.getQuestion1(qid, function (err, quests) {
					console.log(quests.question);
					answer.getAnswers(qid, function (err, answer) {
					console.log(answer + " first Im answer");
					console.log(newuser + "/id");
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('answerpage', {id:qid, ans:answer, quests:quests, user:newuser,empty:""});
				})
				})
 })

//Answer Get
router.get('/:id', function (req, res) {
	var url = req.url.toString();
	var newurl = url.replace('/', '');
	console.log(url);
	console.log(newurl);
	var id =newurl;
	var newuser = req.session.user;

	quest.getQuestion1(newurl, function (err, quests) {
					console.log(quests.question);
					answer.getAnswers(id, function (err, answer) {
					console.log(answer + " first Im answer");
					console.log(newuser + "/id");
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('answerpage', {id:id, ans:answer, quests:quests, user:newuser,empty:""});
				})
				})

})

// //to delete an answer1tym nt wrkng
// router.get('/delete',function(req,res){
//        answer.findOneAndDelete({ "id": "id" }, { justOne: true } )
//        console.log("deleted an answer");
//        res.redirect('answerpage');
//  })


//to verify user
function checkSignIn(req, res,next,err){
    if(req.session.user){
    	console.log("from checksgnin");
        next();     //If session exists, proceed to page
    } else {
            console.log("erorr from checksignin ");
    console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
    }
}



router.post('/homepage',checkSignIn,function(req,res){
	var question= req.body.question;
	var description = req.body.description;
	//date and tym creation
	var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
 if(day<10)  { day='0'+day } 
    if(month<10)  { month='0'+month } 
    if(year<10){ year='0'+year } 
newdate = day + "-" + month + "-" + year;
//console.log(newdate+"is d date");
 
//fr tym
var date_format = '12'; /* FORMAT CAN BE 12 hour (12) OR 24 hour (24)*/
var d       = new Date();
var hour    = d.getHours();  /* Returns the hour (from 0-23) */
var minutes = d.getMinutes();  /* Returns the minutes (from 0-59) */
var result  = hour;
var ext     = '';
 
if(date_format == '12'){
    if(hour > 12){
        ext = 'PM';
        hour = (hour - 12);
     
        if(hour < 10){
            result = "0" + hour;
        }else if(hour == 12){
            hour = "00";
            ext = 'AM';
        }
    }
    else if(hour < 12){
        result = ((hour < 10) ? "0" + hour : hour);
        ext = 'AM';
    }else if(hour == 12){
        ext = 'PM';
    }
}
 
if(minutes < 10){
    minutes = "0" + minutes; 
}
 
var timeresult = newdate+" at "+result + ":" + minutes + ' ' + ext; 
 
console.log(timeresult+"is d tym");
 

//Question Validation
	req.checkBody('question', 'Question is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();

	var error2 = req.validationErrors();
	var newuser = req.session.user; 
	console.log(newuser.name+"this is newuser frm hmpg post mthd");
	if(question == '' && description == ''){
		console.log(error2);
		
		
	} else {
		var newquestion = new quest({
			question: question,
			description:description,
			timeresult:timeresult,
			//person who posted the question is quser!
			quser:newuser.name,
		});
		console.log(newquestion);
		 

		quest.create(newquestion, function(err, user){
			if(err){
				console.log("CREATE QUESTIION ERRO");
			} else{
				quest.getQuestions(function (err, quests) {
					//console.log(quests.question);
					console.log(newuser + "/homepage");
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('homepage', {quests:quests, user:newuser,});
				})	
			}
		});
	}
});

router.post('/answer', function (req, res) {
	var id = req.body.id;
	var ans = req.body.answer;

	var newuser = req.session.user;
	var user = newuser.name;
	quest.getQuestion1(id, function (err, quests) {
		if(err){
			console.log("Answer Error");
		}else{ 
	if(ans==''){
		console.log('Empty Answer');
		//var txt3="Enter your Answer plz";
                  //   var txt2 = txt3;
		//res.render('answerpage', {id:id, ans:answer, quests:quests,empty:txt2});

	}else{			
	var newanswerone = new answer({
			subid: id,
			answer:ans,
			user: user
		});
	console.log(newanswerone+"this is new answerone");
		
				answer.create(newanswerone, function(err, user){
			if(err){
				console.log("CREATE Answer ERROr");
			} else{
				console.log("Created Answer");
				console.log(id);
				answer.getAnswers(id, function (err, answer) {
					console.log(answer + " Im answers");
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('answerpage', {id:id, ans:answer, quests:quests});
				})
				
			}
		})
	    }
	}
	})

})
//router.get('/answer', function (req, res) {

//})


// Register User
router.post('/register', function(req, res){

	console.log("register's data post method");
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
    //test
     console.log(name);
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		console.log(errors);
		 //res.send(errors)
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});


router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username=="" || password=="") {
              	console.log("missing fields in login post method");
                     var txt="Enter UserName & Password";
                     var txt1 = txt;
      			res.render('login',{msg:txt});
              }

   User.getUserByUsername(username, function(err, user){
      	if(user){
      		User.comparePassword(password, user.password, function(err, isMatch){
      		console.log("into d compre mthd!!");

      		if(err) console.log('password error');
                    
      		if(isMatch){

      			     req.session.user = user;
      			     var newuser = req.session.user;
      			console.log(newuser + "Im Session User");
      		console.log(user +" Im user");

      		               
      		              console.log("rendering to homepage!!");               
                         quest.getQuestions(function (err, quests) {
					//console.log(quests);
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					res.render('homepage', {quests:quests, user:newuser });
				})
                      
      		     
      		} else { 
      			console.log("invaliddd passwrd");
                     var txt="Invalid User or Password";
                     var txt1 = txt;
      			res.render('login',{msg:txt});
      		}
      	});
      	}else{
      		//res.render('login');
      		console.log("user error");
           var txt="Invalid User!";
                     var txt1 = txt;
      			res.render('login',{msg:txt});
      	}

   	
  });
});




module.exports = router;