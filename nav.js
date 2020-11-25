window.onscroll = function () {
  myFunction();
};

var header = document.getElementById("profile_navigation");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

function mobileNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "top-navbar") {
    x.className += " responsive";
  } else {
    x.className = "top-navbar";
  }
}

function dropdownNavAdd() {
  var r = document.getElementById("add-icon");
  var p = document.getElementById("profile");

  if (r.className === "dropdown") {
      r.className += " show";
      p.className = "dropdown";
  } else {
      r.className = "dropdown";
  }
}
function dropdownNavProfile() {
  var r = document.getElementById("profile");
  var p = document.getElementById("add-icon");

  if (r.className === "dropdown") {
      r.className += " show";
      p.className = "dropdown";
  } else {
      r.className = "dropdown";
  }
}
