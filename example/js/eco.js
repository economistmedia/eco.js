var startTime, dwellTime, orientationCheck, cacheBuster, ecoPixel, ecoLink, ecoHeatmap, ecoStart, ecoTrackVideo, ecoFullScreenVideo, ecoCustom;

//Google Analytics - Custom implementation which allows file: protocal to be used
(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o),
	m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'js/analytics.js', 'ga');
//End Google Analytics

//isMobile.js
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);
// End isMobile.js

//Core functions
startTime = (new Date).getTime();
dwellTime = function(){return Math.floor(((new Date).getTime()-startTime)/1e3);}
orientationCheck = function(){if(window.innerWidth > window.innerHeight){return "landscape";}else{return "portrait";}}
cacheBuster = function(){return Math.round((new Date).getTime()/1e3)}

//Impression pixel for mobile or tablet.
ecoPixel = function(phone,tablet,macro){
	var image = new Image();
	if (phone && tablet !== undefined) {
		if (macro !== undefined) {
			if (isMobile.phone) {
				image.src = phone.replace(macro, cacheBuster());
				console.log("IMPRESSION PHONE: " +phone.replace(macro, cacheBuster()));
				ga('send', 'event', 'ad', 'view', creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
			} else {
				image.src = tablet.replace(macro, cacheBuster());
				console.log("IMPRESSION TABLET: " +tablet.replace(macro, cacheBuster()));
				ga('send', 'event', 'ad', 'view', creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
			}
		} else {
			if (isMobile.phone) {
				ga('send', 'event', 'ad', 'view', creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
				image.src = phone;
				console.log("IMPRESSION PHONE: " +phone);
			} else {
				ga('send', 'event', 'ad', 'view', creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
				image.src = tablet;
				console.log("IMPRESSION TABLET: " +tablet);
			}
		}
	} else {
		ga('send', 'event', 'ad', 'view', creative.detail(), dwellTime(), {nonInteraction: true});
		console.log("IMPRESSION: No 3rd Party Impression");
	}
}

//Internal Link handler for mobile or tablet.
ecoLink = function(phone,tablet) {
	if (isMobile.phone) {
		console.log("URL PHONE: " + phone);
		window.location = "internal-" + phone;
		ga('send', 'event', 'external', 'link', creative.detail().toLowerCase(), dwellTime());
	} else if (tablet !== undefined) {
		console.log("URL TABLET: " + tablet);
		window.location = "internal-" + tablet;
		ga('send', 'event', 'external', 'link', creative.detail().toLowerCase(), dwellTime());
	} else {
		console.log("URL: " + phone);
		window.location = "internal-" + phone;
		ga('send', 'event', 'external', 'link', creative.detail().toLowerCase(), dwellTime());
	}
}

//Heatmap handler.
ecoHeatmap = function(a) {
	document.getElementById(a).addEventListener('click', function(event) {
		var x = event.pageX;
		var y = event.pageY;
		var tracking = {
			x: x,
			y: y,
			o: orientationCheck(),
		}
		console.log("HEATMAP: " + JSON.stringify(tracking));
		ga('send', 'event', 'heatmap', JSON.stringify(tracking), creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
	});
}

//Video analytics, start, pause, resume, ended, quartiles, completion.
ecoVideo = function(video,trigger) {
	var myVideo = document.getElementById(video);
	var myDuration = function(){return Math.floor(myVideo.duration);}
	var myTime = function(){return Math.floor(myVideo.currentTime);}
	var myQuartile = function(){return Math.floor(100*(myTime()/myDuration()));}
	var played = 0;
	var trigger = document.getElementById(trigger);
	//Event Listners for reporting
	// 25% completion
	myVideo.addEventListener("timeupdate", function(){
		if(myQuartile()>25){
			console.log("firstQuartile: " + creative.detail().toLowerCase()+"|"+video + "|" + myQuartile());
			ga('send', 'event', 'video', 'firstQuartile', creative.detail().toLowerCase()+"|"+video, myQuartile(), {nonInteraction: true});
			this.removeEventListener("timeupdate", arguments.callee);
		}
	});
	// 50% completion
	myVideo.addEventListener("timeupdate", function(){
		if(myQuartile()>50){
			console.log("secondQuartile: " + creative.detail().toLowerCase()+"|"+video + "|" + myQuartile());
			ga('send', 'event', 'video', 'secondQuartile', creative.detail().toLowerCase()+"|"+video, myQuartile(), {nonInteraction: true});
			this.removeEventListener("timeupdate", arguments.callee);
		}
	});
	// 75% completion
	myVideo.addEventListener("timeupdate", function(){
		if(myQuartile()>75){
			console.log("thirdQuartile: " + creative.detail().toLowerCase()+"|"+video + "|" + myQuartile());
			ga('send', 'event', 'video', 'thirdQuartile', creative.detail().toLowerCase()+"|"+video, myQuartile(), {nonInteraction: true});
			this.removeEventListener("timeupdate", arguments.callee);
		}
	});
	myVideo.addEventListener("play",function(){
		if (played == 0) {
			console.log("play: " + creative.detail().toLowerCase()+"|"+video +"|"+ myQuartile());
			ga('send', 'event', 'video', 'play', creative.detail().toLowerCase()+"|"+video, myQuartile());
			// quartileEvents();
			played++;
		} else {
			myVideo.play();
			console.log("Resume: " + creative.detail().toLowerCase()+"|"+video +"|"+ myQuartile());
			ga('send', 'event', 'video', 'resume', creative.detail().toLowerCase()+"|"+video, myQuartile());
		}
	}, false)
	myVideo.addEventListener("pause",function(){
		if(myQuartile()<100){
			console.log("Pause: " + creative.detail().toLowerCase()+"|"+video +"|"+ myQuartile());
			ga('send', 'event', 'video', 'pause', creative.detail().toLowerCase()+"|"+video, myQuartile());
		}
	}, false)
	myVideo.addEventListener("ended",function() {
		console.log("Ended: " + creative.detail().toLowerCase()+"|"+video +"|"+ myQuartile());
		ga('send', 'event', 'video', 'ended', creative.detail().toLowerCase()+"|"+video, myQuartile(), {nonInteraction: true});
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		played = 0;
	}, false)
	document.addEventListener('webkitfullscreenchange'||'mozfullscreenchange'||'fullscreenchange'||'MSFullscreenChange', function(e){
		var isInFullScreen = !(!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement);
		if (isInFullScreen) {
			console.log("Full screen YES");
		} else {
			console.log("Full screen NO");
			myVideo.pause();
		}
	});
	//Triggers available to play video such as a thumbnail or cover image
	if (trigger !== undefined){
		trigger.addEventListener("click", function(){
			myVideo.play();
		}, false);
	}
}

//Custom google event method
ecoCustom = function(action) {ga('send', 'event', 'custom', action , creative.detail().toLowerCase(), dwellTime());}

window.onload = function(){
	ga('create', creative.ga, 'auto');
	ga('set', 'checkProtocolTask', null);
	ga('set', 'checkStorageTask', null);
	ga('send', 'screenview', {
		'appName' : creative.app.toLowerCase(),
		'screenName' : creative.detail().toLowerCase(),
	});
	ga('send', 'event', 'ad', 'load', creative.detail().toLowerCase(), {nonInteraction: true});
	console.log("CAMPAIGN: "+creative.detail().toLowerCase());
	console.log("GA: "+creative.ga);
	if (window.onpagehide || window.onpagehide === null) {
		window.addEventListener('pagehide', function(){
			ga('send', 'event', 'ad', 'hide', creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
		}, false);
	} else {
		window.addEventListener('unload', function(){
			ga('send', 'event', 'ad', 'hide', creative.detail().toLowerCase(), dwellTime(), {nonInteraction: true});
		}, false);
	}
};