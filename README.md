# Quik.do

<div align="center">
	<img height="300px" src="doc/quik.do.png">
	<p>
		<strong><code>Quik.do - v0.1.0</code></strong> <br>
		talk, easily. <br>
	</p>
</div>

<hr>

**Note:**  
This project is heavily under development.  
IT IS NOT PRODUCTION READY YET.  
DO NOT USE IT.

## What

Quik.do is a video conferencing tool.

## Why

We want to be able to talk in the simplest way. That's why we created Virtuell.

**Accountless**  
You don't need to create any account to use Quik.do, Just use it!

**No installation**  
You don't need to install anything. Simply use it in your browser, in any device.

**No money charge**  
Free, forever.

**Share as stream**  
You will be able share your video meeting to the world as stream.

**Self hosted**  
If you wish, you can run this application as self-hosted for your own domain.

## Preview

<img src="doc/preview.gif">

## Behind

Quik.do works on Pion ecosystem. Used technologies are below;

- Pion/WebRTC
- Pion/Turn
- Fiber
- FastHTTP Websocket

## TODOs

- [ ] Automatically changing bitrate according to user's internet speed.  
- [ ] Screen sharing.  
- [ ] UI improvements.  
- [ ] Calendar option for scheduled meetings.  
- [ ] Admin area for self-hosted managements.  
- [ ] Structure for scalability.  
- [ ] GCP and Heroku installation buttons.  
- [ ] Well written readme for installation stages.  

## Development

Build images;  
```sh
make build-dev
```

For development;  
```sh
make run-dev
```

For production;  
```sh
make run-prod
```
