function connectStream() {
	document.getElementById('peers').style.display = 'block'
	document.getElementById('chat').style.display = 'flex'
	let pc = new RTCPeerConnection({
		iceServers: [{
				urls: "stun:relay.metered.ca:80",
			},
			{
				urls: "turn:relay.metered.ca:80",
				username: "f656bb327ada11408d2cd592",
				credential: "D5FTwyiln3XE0vFq",
			},
		],
	})

	pc.ontrack = function (event) {
		if (event.track.kind === 'audio') {
			return
		}

		col = document.createElement("div")
		col.className = "column is-6 peer"
		let el = document.createElement(event.track.kind)
		el.srcObject = event.streams[0]
		el.setAttribute("controls", "true")
		el.setAttribute("autoplay", "true")
		el.setAttribute("playsinline", "true")
		let playAttempt = setInterval(() => {
			el.play()
				.then(() => {
					clearInterval(playAttempt);
				})
				.catch(error => {
					console.log('unable to play the video, user has not interacted yet');
				});
		}, 3000);

		col.appendChild(el)
		document.getElementById('noonestream').style.display = 'none'
		document.getElementById('nocon').style.display = 'none'
		document.getElementById('videos').appendChild(col)

		event.track.onmute = function (event) {
			el.play()
		}

		event.streams[0].onremovetrack = ({
			track
		}) => {
			if (el.parentNode) {
				el.parentNode.remove()
			}
			if (document.getElementById('videos').childElementCount <= 2) {
				document.getElementById('noonestream').style.display = 'flex'
			}
		}
	}

	let ws = new WebSocket(StreamWebsocketAddr)
	pc.onicecandidate = e => {
		if (!e.candidate) {
			return
		}

		ws.send(JSON.stringify({
			event: 'candidate',
			data: JSON.stringify(e.candidate)
		}))
	}

	ws.addEventListener('error', function (event) {
		console.log('error: ', event)
	})

	ws.onclose = function (evt) {
		console.log("websocket has closed")
		pc.close();
		pc = null;
		pr = document.getElementById('videos')
		while (pr.childElementCount > 2) {
			pr.lastChild.remove()
		}
		document.getElementById('noonestream').style.display = 'none'
		document.getElementById('nocon').style.display = 'flex'
		setTimeout(function () {
			connectStream();
		}, 1000);
	}

	ws.onmessage = function (evt) {
		let msg = JSON.parse(evt.data)
		if (!msg) {
			return console.log('failed to parse msg')
		}

		switch (msg.event) {
			case 'offer':
				let offer = JSON.parse(msg.data)
				if (!offer) {
					return console.log('failed to parse answer')
				}
				pc.setRemoteDescription(offer)
				pc.createAnswer().then(answer => {
					pc.setLocalDescription(answer)
					ws.send(JSON.stringify({
						event: 'answer',
						data: JSON.stringify(answer)
					}))
				})
				return

			case 'candidate':
				let candidate = JSON.parse(msg.data)
				if (!candidate) {
					return console.log('failed to parse candidate')
				}

				pc.addIceCandidate(candidate)
		}
	}

	ws.onerror = function (evt) {
		console.log("error: " + evt.data)
	}
}

connectStream();