'use strict';

window.song = {};
window.transposition = 0;

(function() {
  let NO_LYRICS = '-';
  let NO_CHORD = 'NC';
  let NO_CHORD_KEY = '0';
  let DUMMY_CHORD_KEY = '`';
  let CONTINUED_CHORD_KEY = '~';
  
  song = parseSong(document.body.textContent.trim());
  
  renderSong(song);
  
  function parseSong(text) {
    let song = {};
    let sectionsSource = text.split('\n\n');

    song.metadata = {};
    let metaSource = sectionsSource[0].split('\n');
    song.metadata.title =  metaSource[0];
    for (let i = 1; i < metaSource.length; i++) {
      let n = metaSource[i].indexOf(':');
      let key = metaSource[i].substr(0, n).trim();
      let value = metaSource[i].substr(n + 1).trim();
      song.metadata[key] = value;
    }
    
    let chordsSource = sectionsSource[1].split('\n');
    let index = 1;
    song.chords = {}
    song.chords[DUMMY_CHORD_KEY] = { name: '' };
    song.chords[NO_CHORD_KEY] = { name: NO_CHORD };
    song.chords[CONTINUED_CHORD_KEY] = { name: '(' + CONTINUED_CHORD_KEY + ')' };
    
    for (let i = 0; i < chordsSource.length; i++) {
      let chord = chordsSource[i].split(/ +/);
      
      let name = chord[1].split('=')[0] + ' ';
      // TODO: Find a good monospace font with ♯/♭/etc support.
      // name = name.replace(/([A-G])#/, '$1\u266f');
      // name = name.replace(/([A-G])b/, '$1\u266d');
      
      song.chords[chord[0]] = { name: name };
      if (chord[1].indexOf('=') !== -1) {
        song.chords[chord[0]].longName = chord[1].split('=')[1];
      }
      
      if (chord.length > 2) {
        song.chords[chord[0]].fingering = chord[2];
      }
    }
    let keys = Object.keys(song.chords).sort((a, b) => b.length - a.length);
    
    song.sections = [];
    for (let i = 2; i < sectionsSource.length; i++) {
      let linesSource = sectionsSource[i].split('\n');
      let heading = linesSource[0];
      
      let copy = [];
      for (let section of song.sections) {
        if (section.heading === heading) {
          copy = section.lines;
          break;
        }
      }

      let lines = [];
      for (let j = 1; j < linesSource.length; j++) {
        let line = linesSource[j];
        
        if (line.trim() === '//') {
          let segments = [];
          for (let k = 0; k < copy.length; k++) {
            lines.push(copy[k]);
          }
        }
        else if (line.trim() === '/') {
          lines.push(copy[j - 1]);
        }
        else {
          let segments = [];
          segments.push({
            chord: DUMMY_CHORD_KEY,
            lyrics: line
          });
        
          // Split segments on each key.
          for (let key of keys) {
            let split = true;
            while (split) {
              split = false;
              for (let k = 0; k < segments.length; k++) {
                let text = segments[k].lyrics;
                let index = text.indexOf(key);
                if (index !== -1) {
                  split = true;
                  segments[k].lyrics = text.substr(0, index);
                  let lyrics = text.substr(index + key.length);
                  if (/^( |$)/.test(lyrics) && key != DUMMY_CHORD_KEY) {
                    lyrics = NO_LYRICS + lyrics;
                  }
                  segments.splice(k + 1, 0, { // TODO: Expand continued chords.
                    chord: key,
                    lyrics: lyrics
                  });
                  break;
                }
              }
            }
          }
          lines.push(segments);
        }
      }

      let tempo = '';
      let index = heading.indexOf(':');
      if (index !== -1) {
        tempo = heading.substr(index + 1).trim().split(':');
        heading = heading.substr(0, index).trim();
      }
      song.sections.push({
        heading: heading,
        lines: lines,
        tempo: tempo,
      });
    }
    
    parseTempo(song.sections);
    
    return song;
  }
  
  function parseTempo(sections) {
    let lengths = [];
    let measures = [];
    
    let bpm = null;
    let sig = null;
    
    for (let section of sections) {
      for (let segment of section.tempo) {
        let parts = segment.trim().split(/\s+/);
        
        // Parse bpm.
        for (let i = 0; i < parts.length; i++) {
          if (/bpm$/.test(parts[i])) {
            bpm = parseInt(parts[i].substr(0, parts[i].length - 3));
            parts[i] = null;
            break;
          }
        }
        
        // Parse time signature.
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === null) continue;
          let index = parts[i].indexOf('/');
          if (index !== -1) {
            sig = parseInt(parts[i].substr(0, index));
            parts[i] = null;
            break;
          }
        }
        
        // Parse measure count.
        let x = 0;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] !== null && /x$/.test(parts[i])) {
            x = parseInt(parts[i].substr(0, parts[i].length - 1));
            parts[i] = null;
            break;
          }
        }
        
        if (x === 0) {
          console.log('Could not parse tempo info.');
          return;
        }
        
        for (let part of parts) {
          if (part !== null) {
            console.log('Could not parse tempo info.');
            return;
          }
        }
        
        for (let j = 0; j < x; j++) {
          for (let i = 0; i < sig; i++) {
            if (i === 0)
              measures.push(lengths.length);
            
            lengths.push(60.0 / bpm);
          }
        }
      }
    }
    
    let script = document.createElement('script');
    script.onload = function () {
      metronome.init();
      let button = document.createElement('button');
      button.textContent = 'Metronome';
      button.onclick = function () {
        if (metronome.isPlaying) metronome.stop();
        else metronome.start({ lengths: lengths, measures: measures });
      };
      document.body.appendChild(button);
    };
    script.src = 'res/metronome.js';
    document.head.appendChild(script);
    
  }
  
  function renderSong(song) {
    let link = document.createElement('link');
    link.href = 'res/style.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    document.body.innerHTML = '';

    let h1 = document.createElement('h1');
    h1.classList.add('title');
    h1.textContent = song.metadata.title;
    document.body.appendChild(h1);
    
    if (typeof song.metadata.artist !== 'undefined') {
      let artist = document.createElement('p');
      artist.classList.add('artist');
      artist.textContent = song.metadata.artist;
      document.body.appendChild(artist);
    }
    
    let trs = [];
    for (let key of Object.keys(song.chords)) {
      let chord = song.chords[key];
      if (typeof chord.longName !== 'undefined' || typeof chord.fingering !== 'undefined') {
        let tr = document.createElement('tr');
        
        let nameTd = document.createElement('td');
        nameTd.classList.add('name');
        nameTd.textContent = chord.name;
        if (typeof chord.longName !== 'undefined')
          nameTd.textContent += ' = ' + chord.longName;
        tr.appendChild(nameTd);
        
        if (typeof chord.fingering !== 'undefined') {
          let fingeringTd = document.createElement('td');
          fingeringTd.classList.add('fingering');
          fingeringTd.textContent = chord.fingering;
          tr.appendChild(fingeringTd);
        }
        
        trs.push(tr);
      }
    }
    
    if (trs.length > 0) {
      let table = document.createElement('table');
      table.id = 'chords';
      for (let tr of trs) {
        table.appendChild(tr);
      }
      document.body.appendChild(table);
    }
    
    let headings = {};
    for (let section of song.sections) {
      if (typeof headings[section.heading] === 'undefined') {
        headings[section.heading] = { total: 0, current: 0 };
      }
      headings[section.heading].total++;
    }
    
    for (let section of song.sections) {
      let sectionEl = document.createElement('section');
      
      // Make sure all lines have the same number of segments.
      let n = 0;
      for (let line of section.lines) {
        if (line.length > n) n = line.length;
      }
      for (let line of section.lines) {
        for (let i = line.length; i < n; i++) {
          line.push({chord: DUMMY_CHORD_KEY, lyrics: ''});
        }
      }
      
      let lengths = [];
      for (let i = 0; i < n; i++) {
        let max = 0;
        
        for (let line of section.lines) {
          max = Math.max(max, song.chords[line[i].chord].name.length, line[i].lyrics.length);
        }
        
        lengths.push(max);
      }
      
      if (section.heading !== '') {
        headings[section.heading].current++;
        
        let h2 = document.createElement('h2');
        h2.classList.add('section-heading');
        h2.textContent = section.heading;
        if (headings[section.heading].total > 1) {
          h2.textContent += ' ' + headings[section.heading].current;
        }
        sectionEl.appendChild(h2);
      }

      let ol = document.createElement('ol');

      for (let line of section.lines) {
        let li = document.createElement('li');
        li.classList.add('line');

        let lyrics = document.createElement('pre');
        lyrics.classList.add('lyrics');
        let chordsEl = document.createElement('pre');
        chordsEl.classList.add('chords');
        
        for (let i = 0; i < line.length; i++) {
          let segment = line[i];
          let chord = song.chords[segment.chord].name;
          
          chordsEl.textContent += chord.padEnd(lengths[i]);
          if (i === line.length - 1) {
            lyrics.textContent += segment.lyrics.padEnd(lengths[i]);
          }
          else if (i === 0) {
            lyrics.textContent += segment.lyrics.padStart(lengths[i]); 
          }
          else {
            lyrics.textContent += justify(segment.lyrics, lengths[i]);
          }
        }
        
        if (new RegExp('^( |' + escape(NO_LYRICS) + ')+$').test(lyrics.textContent)) {
          lyrics.textContent = '\u2014'; // EM-DASH
        }
          
        li.appendChild(chordsEl);
        li.appendChild(lyrics);

        ol.appendChild(li);
      }

      sectionEl.appendChild(ol);

      document.body.appendChild(sectionEl);
    }
      
    let tr = document.createElement('input');
    tr.type = 'number';
    tr.min = -12;
    tr.max = 12;
    tr.value = window.transposition;
    tr.id = 'transpose';
    tr.onchange = function () {
      let n = tr.value - window.transposition;
      window.transposition = tr.value;
      transpose(song, n);
    };
    
    document.body.appendChild(tr);
  }
  
  function justify(text, length) {
    let words = text.split(/ +/);
    
    let padLength = length;
    for (let word of words) padLength -= word.length;
    
    let value = '';
    if (words.length === 1) {
      value += words[0].padEnd(length);
    }
    else {
      for (let i = 0; i < words.length - 1; i++) {
        // TODO: More even spacing.
        value += words[i] + ' '.repeat(padLength / (words.length - 1));
      }
      value = value.padEnd(length - words[words.length - 1].length);
      value += words[words.length - 1];
    }
    return value;
  }
  
  function escape(text) {
    return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  
  
  function transpose(song, n) {
    let chords = {}
    for (let key of Object.keys(song.chords)) {
      let name = song.chords[key].name;
      
      if (name === 'NC') continue;
      
      let regex = /[A-G][#b]?/g;
      let result;
      let newName = '';
      let index = 0;
      while (result = regex.exec(name)) {
        newName += name.substring(index, result.index);
        newName += transposeNote(result[0], n);
        index = result.index + result[0].length;
      }
      newName += name.substr(index);
      
      chords[key] = song.chords[key];
      chords[key].name = newName;
      
      if (typeof song.chords[key].longName !== 'undefined') {
        let longName = song.chords[key].longName;
        let newLongName = '';
        index = 0;
        while (result = regex.exec(longName)) {
          newLongName += longName.substring(index, result.index);
          newLongName += transposeNote(result[0], n);
          index = result.index + result[0].length;
        }
        newLongName += longName.substr(index);
        chords[key].longName = newLongName;
      }
    }
    song.chords = chords;
    renderSong(song);
  }
  
  let scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  function transposeNote(note, n) {
    while (n < 0) n += scale.length;
    // TODO: Flats.
    return scale[(scale.indexOf(note) + n) % scale.length];
  }
  
  window.transpose = transpose;
})();
