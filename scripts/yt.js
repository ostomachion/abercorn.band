'use strict';

(function () {
  let videos = [];

  window.onYouTubeIframeAPIReady = function () {
    let yts = document.getElementsByClassName('youtube');
    for (let i = 0; i < yts.length; i++) { setTimeout(() => {
      let youtube = yts[i];
      let videoId = youtube.getAttribute('data-videoId');
      let el = document.createElement('div');
      youtube.appendChild(el);
      videos.push(new YT.Player(el, {
        videoId: videoId,
        playerVars: { rel: 0 },
        events: { 'onStateChange': onPlayerStateChange }
      }));
    }, 500); }    
    function onPlayerStateChange(e) {
      if (e.data === 1) {
        for (let i = 0; i < videos.length; i++) {
          if (e.target !== videos[i]) {
            videos[i].pauseVideo();
          }
        }
      }
    }
  }
})();
