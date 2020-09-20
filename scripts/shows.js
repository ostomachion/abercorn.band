'use strict';

document.addEventListener("DOMContentLoaded", function() {
  resetSelection();

  let shows = document.getElementsByClassName('show');
  for (let i = 0; i < shows.length; i++) {
    shows[i].onclick = () => select(shows[i]);
  }
  
  function resetSelection() {
    let shows = document.getElementsByClassName('show');
    for (let i = 0; i < shows.length; i++) {
      select(shows[i].children[0]);
    }
  }

  // Adds the 'selected' class to the element and removes it from any siblings.
  function select(el) {
    let siblings = el.parentElement.children;
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === el) {
        siblings[i].classList.add('selected');
      }
      else {
        siblings[i].classList.remove('selected');
      }
    }
  }
});
