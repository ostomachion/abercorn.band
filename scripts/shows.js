'use strict';

class Show {
  constructor(name, address, date, time) {
    this.name = name;
    this.address = address;
    this.date = date;
    this.time = time;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadShows();

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

  function loadShows() {
    fetch('shows.txt')
      .then((response) => response.text())
      .then(parse)
      .then(addShows);

    resetSelection();
  }

  function parse(showData) {
    return showData.split(/\n\s*\n/).map(parseShow);
  }

  function parseShow(showData) {
    let value = new Show();

    let lines = showData.split('\n');
    value.name = lines[0].trim();
    let last = lines.slice(-1)[0].trim();
    if (/^\s*\d+:\d+\s*[ap]\.?\s*m\.?\s*$/i.test(last)) {
      value.date = new Date(lines.slice(-2)[0].trim());
      value.time = last;
      value.address = lines.slice(1, -2).map(x => x.trim());
    }
    else {
      value.date = new Date(last);
      value.time = null;
      value.address = lines.slice(1, -1).map(x => x.trim());
    }

    return value;
  }

  function addShows(shows) {
    let today = new Date();
    let pastShows = shows.filter(x => today - x.date > 86400000).sort((a, b) => b.date - a.date);
    let upcomingShows = shows.filter(x => today - x.date <= 86400000).sort((a, b) => a.date - b.date);

    for (let show of pastShows) {
      addShow('past-shows', show);
    }

    for (let show of upcomingShows) {
      addShow('upcoming-shows', show);
    }

    if (upcomingShows.length === 0) {
      let ul = document.getElementById('upcoming-shows').getElementsByClassName('shows')[0];
      let li = document.createElement('li');
      li.classList.add('no-shows');
      li.innerHTML = 'No upcoming shows.<br>Check back soon!';
      ul.append(li);
    }
  }

  function addShow(id, show) {
    let ul = document.getElementById(id).getElementsByClassName('shows')[0];
    let li = document.createElement('li');
    li.classList.add('show');
    let html = `<h1 class="name">${show.name}</h1>`;
    html += `<div class="bottom">`;
    html += `<div class="venue-name">${show.address[0]}</div>`;
    if (show.address.length > 1)
      html += `<div class="venue-address">${show.address.slice(1).join('<br>')}</div>`;
    html += `<div class="datetime">${formatDate(show.date)}`;
    if (show.time)
      html += `<br>${show.time}`;
    html += `</div></div>`;
    li.innerHTML = html;
    ul.append(li);
  }

  function formatDate(date) {
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }




  function loadShowData() {
    fetch('shows.txt')
  }
});