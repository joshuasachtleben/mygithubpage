var $menuOpen = $("#menuOpen"),
    $menuClose = $("#menuClose"),
    $menuLinks = $(".nav_menu").find("a");

$menuClose.hide();

$menuOpen.click(function() {
  openMenu();
});

$menuClose.click(function() {
  closeMenu();
});

$menuLinks.click(function() {
  closeMenu();
});

var openMenu = function() {
  $(".nav_menu").slideToggle("slow", function() {
    $menuOpen.hide();
    $menuClose.show();
  });
};

var closeMenu = function () {
  $(".nav_menu").slideToggle("slow", function() {
    $menuClose.hide();
    $menuOpen.show();
  });
};
