
firebase.auth().onAuthStateChanged(function(user) {
  if (user){
    //console.log(JSON.stringify(user));
    var link = document.getElementById("login_btn");
    link.textContent = "LOGOUT";
    link.classList.add("logout");
  }
  else{
    document.getElementById("login_btn").text = "LOGIN";
  }
});

function handleLoginButton() {
  var link = document.getElementById("login_btn");
  if (link.classList.contains("logout")) {
    firebase.auth().signOut();
    
    link.classList.remove("logout");
    link.classList.add("login");
    link.textContent = "LOGIN";
  }
  else {
    location.href = "auth.html";
  }
}

window.onload = function(){
  document.getElementById("login_btn").addEventListener('click', handleLoginButton);
}