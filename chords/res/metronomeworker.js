let timerID = null;
let interval = 25;

self.onmessage = function (e) {
	if (e.data === "start") {
		timerID = setInterval(tick, interval)
	}
	else if (e.data === "stop") {
		clearInterval(timerID);
		timerID = null;
	}
};

function tick() { postMessage("tick") }
