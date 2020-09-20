
var hasPlayed = false;

function playAudio() {
    var audio = document.getElementsByTagName("AUDIO")[0];
    audio.play();
}

function pauseAudio() {
    var audio = document.getElementsByTagName("AUDIO")[0];
    audio.pause();
}

function toggleAudio() {
    var audio = document.getElementsByTagName("AUDIO")[0];
    audio.paused ? playAudio() : pauseAudio();
}

function handleFirstPlay(event) {
    event.target.onplay = null;
    hasPlayed = true;
}

document.addEventListener("click", function () {
    if (!hasPlayed)
        playAudio();
});

document.addEventListener("keypress", function () {
    if (!hasPlayed)
        playAudio();
});

document.addEventListener("wheel", function () {
    if (!hasPlayed)
        playAudio();
});

document.addEventListener("touchstart", function () {
    if (!hasPlayed)
        playAudio();
});