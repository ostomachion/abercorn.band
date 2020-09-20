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
    else if (name === 'subscribe-popup') {
      showSubscribePopup();
    }
    else if (name.startsWith('show-popup-')) {
      let show = window.location.hash.substr('#show-popup-'.length);
      showShowPopup(show);
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
    hideSubscribePopup();
    selectSection(section);
  }

  document.getElementById('subscribe-popup').getElementsByClassName('exit')[0].onclick = hideSubscribePopup;
  document.getElementById('subscribe-popup').onclick = function (e) {
    if (e.target === document.getElementById('subscribe-popup')) hideSubscribePopup();
  };

  function showSubscribePopup() {
    document.body.classList.add('show-subscribe-popup');
    document.body.classList.remove('show-main-menu');
    document.body.classList.remove('show-show-popup');
    document.getElementById('subscribe-popup').classList.add('selected');
  }

  function hideSubscribePopup() {
    let subscribePopup = document.getElementById('subscribe-popup');
    if (subscribePopup.classList.contains('selected')) {
      window.location.hash = history;
      subscribePopup.classList.remove('selected');
    }
    document.body.classList.remove('show-subscribe-popup');
  }

  document.getElementById('show-popup').getElementsByClassName('exit')[0].onclick = hideShowPopup;
  document.getElementById('show-popup').onclick = function (e) {
    if (e.target === document.getElementById('show-popup')) hideShowPopup();
  };

  function showShowPopup(show) {
    document.body.classList.add('show-show-popup');
    document.body.classList.remove('show-main-menu');
    document.body.classList.remove('show-subscribe-popup');
    document.getElementById('show-popup').classList.add('selected');

    let form = document.getElementById('show-popup').getElementsByTagName('FORM')[0];
    form.action = '#show-popup-' + show;
    document.getElementsByName('tag')[0].value = 'show-' + show; // TODO:
  }

  function hideShowPopup() {
    let subscribePopup = document.getElementById('show-popup');
    if (subscribePopup.classList.contains('selected')) {
      window.location.hash = history;
      subscribePopup.classList.remove('selected');
    }
    document.body.classList.remove('show-show-popup');
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
