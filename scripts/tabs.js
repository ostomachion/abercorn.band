'use strict';

document.addEventListener("DOMContentLoaded", function () {
  let history = '';

  resetSelection();
  showSectionFromHash();

  window.onhashchange = function (e) {
    let index = e.oldURL.indexOf('#');
    history = index === -1 ? '#' : e.oldURL.substr(index);
    showSectionFromHash();
  }

  function resetSelection() {
    let main = document.getElementsByTagName('MAIN')[0];
    let sections = main.children;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].tagName === 'SECTION') {
        selectSection(sections[i].getElementsByTagName('SECTION')[0]);
      }
    }
  }

  function showSectionFromHash() {
    let name = window.location.hash.replace(/^#/, '');
    if (name === '') {
      showMainMenu();
    }
    else {
      showSection(name);
    }
  }

  function showMainMenu() {
    document.body.classList.add('show-main-menu');
  }

  function showSection(name) {
    let section = document.getElementById(name);
    if (section === null || section.tagName !== 'SECTION') {
      console.error('No section with name "' + name + '".');
      return;
    }

    document.body.classList.remove('show-main-menu');
    selectSection(section);
  }

  function selectSection(section) {
    let name = section.id;
    select(document.getElementById(name + '-tab'));
    select(section);
    select(section.parentElement);
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
