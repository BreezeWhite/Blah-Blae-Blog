

function createDrawerItem(text, link) {
  var s = document.createElement("a");
  s.textContent = text;
  s.href = link;
  s.classList.add("mdl-navigation__link");
  
  return s;
}

document.getElementById("drawer-title").textContent = "About Me";

var drawer = document.getElementById("header-drawer-items");
drawer.appendChild(createDrawerItem("Introduction", "intro"));
drawer.appendChild(createDrawerItem("Basic Info", "info"));
drawer.appendChild(createDrawerItem("Skills", "skill"));
drawer.appendChild(createDrawerItem("Expierence", "exp"));
drawer.appendChild(createDrawerItem("Interets", "intrs"));

var sec_sel = document.getElementById("header-drawer-items");
var links = sec_sel.querySelectorAll("a");
links.forEach(function(link) {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    var tab = link.getAttribute("href");
    var target = "profile.html?tab=" + tab;
    location.href = target;
  }); 
});

