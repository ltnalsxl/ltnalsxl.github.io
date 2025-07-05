// Basic rating interaction script
// Updates the data-rating-value on click

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.c-rating').forEach(function(ratingEl) {
    var buttons = ratingEl.querySelectorAll('button');
    buttons.forEach(function(btn, idx) {
      btn.addEventListener('click', function() {
        ratingEl.dataset.ratingValue = idx + 1;
      });
    });
  });
});
