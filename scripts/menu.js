var $menuOpen = $("#menuOpen"),
    $menuClose = $("#menuClose"),
    $navMenu = $(".nav_menu"),
    $menuLinks = $(".nav_menu").find("a");

$menuClose.addClass("hidden");
$navMenu.addClass("hidden");

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
  $menuOpen.addClass("hidden");
  $menuClose.removeClass("hidden");
  $navMenu.removeClass("hidden");
};

var closeMenu = function () {
  $menuClose.addClass("hidden");
  $menuOpen.removeClass("hidden");
  $navMenu.addClass("hidden");
};
