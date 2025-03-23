/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// Mobile menu functionality
$(function() {
  // Toggle mobile menu visibility
  $('.mobile-menu-toggle a').on('click', function(e) {
    e.preventDefault();
    $('#mobile-menu').addClass('visible');
    $('body').addClass('mobile-menu-visible');
  });
  
  // Close menu when close button is clicked
  $('.close-mobile-menu').on('click', function(e) {
    e.preventDefault();
    $('#mobile-menu').removeClass('visible');
    $('body').removeClass('mobile-menu-visible');
  });
  
  // Close menu when clicking outside
  $(document).on('click', function(e) {
    if ($('#mobile-menu').hasClass('visible')) {
      if ($(e.target).closest('#mobile-menu').length === 0 && 
          $(e.target).closest('.mobile-menu-toggle').length === 0) {
        $('#mobile-menu').removeClass('visible');
        $('body').removeClass('mobile-menu-visible');
      }
    }
  });
  
  // Close menu when menu item is clicked
  $('.mobile-menu-panel a[href]').on('click', function() {
    $('#mobile-menu').removeClass('visible');
    $('body').removeClass('mobile-menu-visible');
  });
});
