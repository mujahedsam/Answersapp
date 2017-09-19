function regsubmit(){
    //reg validations
    var name = document.form.name.value; 
	var username = document.form.username.value;
	var password = document.form.password.value;
	var email=document.form.email.value;
	var emailRegex = /^[A-Za-z0-9._]*\@[A-Za-z]*\.[A-Za-z]{2,5}$/; 


	if( name == "" )
   {
     document.form.name.focus() ;
  document.getElementById("errorBox").innerHTML = "Enter your Name";
     return false;
   }
 if( username == "" )
   {
     document.form.username.focus() ;
   document.getElementById("errorBox").innerHTML = "Enter the User Name";
     return false;
   }
    
   if (email == "" )
 {
  document.form.email.focus();
  document.getElementById("errorBox").innerHTML = "Enter the Email";
  return false;
  }else if(!emailRegex.test(email)){
  document.form.email.focus();
  document.getElementById("errorBox").innerHTML = "Enter the valid Email";
  return false;
  }
   
   
   
 if(password == "")
  {
   document.form.password.focus();
   document.getElementById("errorBox").innerHTML = "Enter the Password";
   return false;
  }



}

// module.exports.wrong = function wrongpass() {
//   document.getElementById("errorBox").innerHTML = "Enter correct password";
//   // body...
// }

//login validations
function loginval(){
	var username2 = document.logform.username.value;
	var password2 = document.logform.password.value;
    
    if( username2 == "" )
   {
     document.logform.username.focus() ;
   document.getElementById("errorBox").innerHTML = "Enter the user Name";
     return false;
   }


 if(password2 == "")
  {
   document.logform.password.focus();
   document.getElementById("errorBox").innerHTML = "Enter the Password";
   return false;
  }
           
}

//question input validations

function quesval(){
  var question=document.qform.question.value;
  var description=document.qform.description.value;
  
  if( question==""){
    document.qform.question.focus();
    document.getElementById("errorBox").innerHTML = "Enter the Question here";
     return false;
  }
  if( description==""){
    document.qform.description.focus();
    document.getElementById("errorBox").innerHTML = "Enter the Description";
     return false;
  }

  
}

function ansval(){
      var answer=document.ansform.answer.value;
      if( answer==""){
    document.ansform.answer.focus();
    document.getElementById("errorBox").innerHTML = "Enter the Answer here";
     return false;
  }

}

