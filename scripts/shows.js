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
    // fetch('shows.txt')
    //   .then((response) => response.text())
    //   .then(parse)
    //   .then(addShows);

    let showData = loadShowData();
    let shows = parse(showData);
    addShows(shows);

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
    return `EP Release Show
    Carnahan Hall
    2200 Elmwood Ave Suite A6
    Lafayette, IN
    February 14, 2020
    7:00 pm
    
    Summer Camp: On the Road Tour
    Carnahan Hall
    2200 Elmwood Ave Suite A6
    Lafayette, IN
    January 17, 2020
    
    Abercorn at the Melody Inn
    Melody Inn
    3826 N Illinois St
    Indianapolis, IN
    January 16, 2020
    8:00 pm
    
    Abercorn at Digby's
    Digby's Pub & Patio
    133 N 4th St
    Lafayette, IN
    January 10, 2020
    9:30 pm
    
    New Year's Eve at Nami's
    Nami's Bar and Grill
    102 N 3rd Street
    Lafayette, IN
    December 31, 2019
    10:00 pm
    
    Irving Theater
    Irving Theater
    5505 E Washington St
    Indianapolis, IN
    December 15, 2019
    6:00 pm
    
    Lafayette Theater
    Lafayette Theater
    600 Main Street
    Lafayette, IN
    December 7, 2019
    8:00 pm
    
    MOKB Presents Battle of the Bands
    Hi-Fi Indy
    1043 Virginia Ave, Suite 4
    Indianapolis, IN
    December 4, 2019
    6:00 pm
    
    Abercorn at The Twisted Hammer
    The Twisted Hammer
    308 W State St
    Lafayette, IN
    November 16, 2019
    8:00 pm
    
    Trust Womxn
    The Spot Tavern
    409 S 4th St
    Lafayette, IN
    November 9, 2019
    
    Abercorn at Digby's
    Digby's Pub & Patio
    133 N 4th St
    Lafayette, IN
    October 25, 2019
    10:00 pm
    
    Abercorn at Nami's
    Nami's Bar and Grill
    102 N 3rd Street
    Lafayette, IN
    October 12, 2019
    10:00 pm
    
    Outdoor Velour's 100th Show
    Carnahan Hall
    2200 Elmwood Ave Suite A6
    Lafayette, IN
    October 11, 2019
    8:00 pm
    
    Abercorn at Teays River
    Teays River Brewing & Public House
    3000 S 9th St Ste A
    Lafayette, IN
    October 2, 2019
    7:00 pm
    
    Abercorn at the Summer Dock
    The Summer Dock at White Oaks
    12024 N White Oaks Dr
    Monticello, IN
    September 28, 2019
    8:00 pm
    
    Ouibache Music Festival
    Tippecanoe County Amphitheater
    4449 N River Rd
    West Lafayette, IN
    September 27, 2019
    6:00 pm
    
    Melody Inn
    Melody Inn
    3826 N Illinois St
    Indianapolis, IN
    September 26, 2019
    8:00 pm
    
    Fall Outta Summer Festival
    Club 41
    10970 N US HWY 41
    Bloomingdale, IN
    September 20, 2019
    5:30 pm
    
    Pork Fest
    Tipton
    Tipton, IN
    September 7, 2019
    6:00 pm
    
    Mosey Down Main St
    Hallmark Mortgage Stage
    6th and Main
    Lafayette, IN
    August 31, 2019
    7:20 pm
    
    Abercorn at the Summer Dock
    The Summer Dock at White Oaks
    12024 N White Oaks Dr
    Monticello, IN
    August 23, 2019
    7:00 pm
    
    Shakedown V
    Wildcat Conservation Club
    8020 W Mulberry Jefferson Rd
    Mulberry, IN
    August 16, 2019
    7:00 pm
    
    Digby's Pub & Patio
    Digby's Pub & Patio
    133 N 4th St
    Lafayette, IN
    August 10, 2019
    9:00 pm
    
    Music Matters
    Music Matters
    6342 N 700 E
    Darlington, IN
    August 3, 2019
    3:45 pm
    
    Abercorn at Teays River
    Teays River Brewing & Public House
    3000 S 9th St Ste A
    Lafayette, IN
    July 24, 2019
    7:00 pm
    
    6th St Dive
    6th Street Dive
    827 N 6th Street
    Lafayette, IN
    July 20, 2019
    9:00 pm
    
    Abercorn at Scotty's Brewhouse
    Scotty's Brewhouse
    Wabash Landing, 352 E State St
    West Lafayette, IN
    July 15, 2019
    7:30 pm
    
    Digby's Pub & Patio
    Digby's Pub & Patio
    133 N 4th St
    Lafayette, IN
    July 13, 2019
    9:00 pm
    
    Burnside Inn
    Burnside Inn
    314 Massachusetts Ave
    Indianapolis, IN
    June 29, 2019
    9:30 pm
    
    Spirit of Monticello Festival
    NIPSCO Bandstand
    112 N Main St
    Monticello, IN
    June 22, 2019
    1:30 pm
    
    TASTE of Tippecanoe 2019
    Market Stage
    5th and Main
    Lafayette, IN
    June 15, 2019
    9:00 pm
    
    Abercorn at Square Cat
    Square Cat Vinyl
    1054 Virginia Ave
    Indianapolis, IN
    June 13, 2019
    7:00 pm
    
    Mosey Down Main St
    Downtown
    11th and Main
    Lafayette, IN
    May 11, 2019
    10:00 pm
    
    Earth Day
    Engineering Fountain
    Purdue Mall
    West Lafayette, IN
    April 12, 2019
    7:00 pm
    
    Thompson House
    The Thompson House
    711 Thompson Rd
    Indianapolis, IN
    March 4, 2019
    8:30 pm
    
    Sofar West Lafayette
    It's a Secret
    Even we don't know
    Shhhh
    February 16, 2019
    7:30 pm
    
    New Year's Eve Show
    Blind Pig
    302 Ferry Street
    Lafayette, IN
    December 31, 2018
    
    Lafayette Beer League
    Bobby T's Campus
    308 W State St
    Lafayette, IN
    November 30, 2018
    
    Battle of the Bands Round 2
    Bobby T's Campus
    308 W State St
    Lafayette, IN
    November 10, 2018
    
    Blind Pig
    Blind Pig
    302 Ferry Street
    Lafayette, IN
    October 26, 2018
    7:30 pm
    
    Battle of the Bands
    Bobby T's Campus
    308 W State St
    Lafayette, IN
    October 17, 2018
    8:00 pm
    
    Secret Show
    It's a Secret
    Even we don't know
    Shhhh
    September 15, 2018
    8:00 pm
    
    Shakedown IV
    Wildcat Conservation Club
    8020 W Mulberry Jefferson Rd
    Mulberry, IN
    September 7, 2018
    11:55 pm
    
    w/ Laurelin & Tree
    6th Street Dive
    827 N 6th Street
    Lafayette, IN
    August 25, 2018
    10:00 pm
    
    Mosey Down Main St
    Downtown
    11th and Main
    Lafayette, IN
    July 14, 2018
    10:00 pm
    
    Debut
    The Spot Tavern
    409 S 4th St
    Lafayette, IN
    June 16, 2018
    10:00 pm`;
  }
});