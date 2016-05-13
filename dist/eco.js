/**
 * eco.js v0.1.0
 *
 * A simple library to help build compatabile interactive ads for The Economist apps.
 *
 * @author: Jia Zhuang (jiazhuang@economist.com)
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */

var _docReady = false;
var _adReady = false;
var _prodReady = false;
var _debugMode = false;

//ecoStart
function ecoStart() {
	if (_adReady) {
		console.log((new Date).getTime() + ": ad ready " + _adReady);
		console.log((new Date).getTime() + ": start function running");
		time.eco = (new Date).getTime();
		eco.run.impression();
		eco.run.queue();
		console.log((new Date).getTime() + ": start function completed");
	} else {
		console.log((new Date).getTime() + ": ad ready " + _adReady);
		console.log((new Date).getTime() + ": start function waiting");
		var readyStateCheckInterval = setInterval(function() {
			console.log((new Date).getTime() + ": ad ready " + _adReady);
			if (_adReady) {
				clearInterval(readyStateCheckInterval);
				console.log((new Date).getTime() + ": start function running");
				time.eco = (new Date).getTime();
				eco.run.impression();
				eco.run.queue();
				console.log((new Date).getTime() + ": start function completed");
			}
		}, 500);
	}
}
//End ecoStart

//Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','js/analytics.js','ga');
//End Google Analytics

//isMobile.js
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);
// End isMobile.js

//eco.js
(function(global) {
	// Private methods
	var _timestamp = function(url, timestamp) {
		if (timestamp !== undefined) {
			var a = url.replace(timestamp, function() {
				return Math.round((new Date).getTime() / 1e3)
			});
			return (new Image).src = a;
		} else {
			var a = url;
			return (new Image).src = a;
		}
	}
	var _orientationCheck = function() {
		if (window.innerWidth > window.innerHeight) {
			return "landscape";
		} else {
			return "portrait";
		}
	}
	// Public classes
	var timeClass = function() {
		this.load = (new Date).getTime();
		this.view = function() {
			return Math.floor(((new Date).getTime() - this.load) / 1e3);
		}
		this.action = function() {
			return Math.floor(((new Date).getTime() - this.eco) / 1e3);
		}
		return this;
	}
	var ecoClass = function() {
		// Private vars
		var param = {};
		var impression = {};
		var queue = [];
		// Public methods
		this.config = {
			app: function(app) {
				param.app = app;
			},
			advertiser: function(advertiser) {
				param.advertiser = advertiser;
			},
			campaign: function(campaign) {
				param.campaign = campaign;
			},
			issue: function(issue) {
				param.issue = issue;
			},
			ga: function(ga) {
				param.ga = ga;
			},
			gaClient: function(gaClient) {
				param.gaClient = gaClient;
			}
		}
		this.impression = {
			phone: function(url) {
				impression.phone = url;
			},
			tablet: function(url) {
				impression.tablet = url;
			},
			timestamp: function(macro) {
				impression.timestamp = macro;
			}
		}
		this.open = function(url, tabletOptUrl) {
			if (isMobile.phone) {
				if (!_prodReady) {
					window.location = url;
				} else {
					window.location = "internal-" + url;
					ga('send', 'event', 'external', url, eco.run.config(), time.action());
				}
			} else if (tablet !== undefined) {
				if (!_prodReady) {
					window.location = tabletOptUrl;
				} else {
					window.location = "internal-" + tabletOptUrl;
					ga('send', 'event', 'external', tabletOptUrl, eco.run.config(), time.action());
				}
			} else {
				if (!_prodReady) {
					window.location = url;
				} else {
					window.location = "internal-" + url;
					ga('send', 'event', 'external', url, eco.run.config(), time.action());
				}
			}
		}
		this.heatmap = function(element) {
			document.getElementById(element).addEventListener('click', function(event) {
				var x = event.pageX;
				var y = event.pageY;
				var tracking = {
					x: x,
					y: y,
					o: _orientationCheck(),
				}
				ga('send', 'event', 'heatmap', JSON.stringify(tracking), eco.run.config(), time.action(), {
					nonInteraction: true
				});
			});
		}
		this.video = function(video, poster) {
			var myVideo = document.getElementById(video);
			var myDuration = function() {
				return Math.floor(myVideo.duration);
			}
			var myTime = function() {
				return Math.floor(myVideo.currentTime);
			}
			var myQuartile = function() {
				return Math.floor(100 * (myTime() / myDuration()));
			}
			var played = 0;
			var poster = document.getElementById(poster);
			myVideo.addEventListener("timeupdate", function() {
				if (myQuartile() > 25) {
					ga('send', 'event', 'video', 'firstQuartile: ' + myVideo.currentSrc, eco.run.config(), myQuartile(), {
						nonInteraction: true
					});
					this.removeEventListener("timeupdate", arguments.callee);
				}
			});
			myVideo.addEventListener("timeupdate", function() {
				if (myQuartile() > 50) {
					ga('send', 'event', 'video', 'secondQuartile: ' + myVideo.currentSrc, eco.run.config(), myQuartile(), {
						nonInteraction: true
					});
					this.removeEventListener("timeupdate", arguments.callee);
				}
			});
			myVideo.addEventListener("timeupdate", function() {
				if (myQuartile() > 75) {
					ga('send', 'event', 'video', 'thirdQuartile: ' + myVideo.currentSrc, eco.run.config(), myQuartile(), {
						nonInteraction: true
					});
					this.removeEventListener("timeupdate", arguments.callee);
				}
			});
			myVideo.addEventListener("play", function() {
				if (played == 0) {
					ga('send', 'event', 'video', 'play: ' + myVideo.currentSrc, eco.run.config(), myQuartile());
					// quartileEvents();
					played++;
				} else {
					myVideo.play();
					ga('send', 'event', 'video', 'resume: ' + myVideo.currentSrc, eco.run.config(), myQuartile());
				}
			}, false)
			myVideo.addEventListener("pause", function() {
				if (myQuartile() < 100) {
					ga('send', 'event', 'video', 'pause: ' + myVideo.currentSrc, eco.run.config(), myQuartile());
				}
			}, false)
			myVideo.addEventListener("ended", function() {
				ga('send', 'event', 'video', 'ended: ' + myVideo.currentSrc, eco.run.config(), myQuartile(), {
					nonInteraction: true
				});
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
			document.addEventListener('webkitfullscreenchange' || 'mozfullscreenchange' || 'fullscreenchange' || 'MSFullscreenChange', function(e) {
				var isInFullScreen = !(!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement);
				if (isInFullScreen) {
					console.log("Full screen YES");
				} else {
					console.log("Full screen NO");
					myVideo.pause();
				}
			});
			//Triggers available to play video such as a thumbnail or cover image
			if (poster !== undefined) {
				poster.addEventListener("click", function() {
					myVideo.play();
				}, false);
			}
		}
		this.event = function(action, optUrl) {
			if (url && impression.timestamp !== undefined) {
				_timestamp(optUrl, impression.timestamp);
				ga('send', 'event', 'custom', action, eco.run.config(), time.action());
			} else if (url !== undefined) {
				_timestamp(optUrl);
				ga('send', 'event', 'custom', action, eco.run.config(), time.action());
			} else {
				ga('send', 'event', 'custom', action, eco.run.config(), time.action());
			}
		}
		this.queue = function(fn) {
			queue.push(fn);
		}
		this.run = {
			config: function(property) {
				if (property !== undefined) {
					return param[property];
				} else {
					var a = param.app + "|" + param.advertiser + "|" + param.campaign + "|" + param.issue;
					return a.toLowerCase();
				}
			},

			impression: function() {
				if (impression.phone && impression.tablet !== undefined) {
					if (impression.timestamp !== undefined) {
						if (isMobile.phone) {
							_timestamp(impression.phone, impression.timestamp);
							ga('send', 'event', 'ad', 'view', eco.run.config(), time.view(), {
								nonInteraction: true
							});
						} else {
							_timestamp(impression.tablet, impression.timestamp);
							ga('send', 'event', 'ad', 'view', eco.run.config(), time.view(), {
								nonInteraction: true
							});
						}
					} else {
						if (isMobile.phone) {
							_timestamp(impression.phone, impression.timestamp);
							ga('send', 'event', 'ad', 'view', eco.run.config(), time.view(), {
								nonInteraction: true
							});
						} else {
							_timestamp(impression.tablet, impression.timestamp);
							ga('send', 'event', 'ad', 'view', eco.run.config(), time.view(), {
								nonInteraction: true
							});
						}
					}
				} else {
					ga('send', 'event', 'ad', 'view', eco.run.config(), time.view(), {
						nonInteraction: true
					});
				}
			},

			queue: function() {
				if (_debugMode) {
					queue.forEach(function(item, index) {
						console.log((new Date).getTime() + ": running task " + index);
					})
				}
				while (queue.length > 0) {
					(queue.shift())();
				}
			},

			ad: function(debug) {
				if (debug !== undefined) {
					console.log((new Date).getTime() + ": debug mode on");
					_debugMode = true;
					var readyStateCheckInterval = setInterval(function() {
						if (_docReady) {
							clearInterval(readyStateCheckInterval);
							_adReady = true;
							eco.check.config();
							eco.check.impression();
							eco.check.queue();
							ecoStart();
						}
					}, 500);
				} else {
					_prodReady = true;
					var readyStateCheckInterval = setInterval(function() {
						if (_docReady) {
							clearInterval(readyStateCheckInterval);
							_adReady = true;
						}
					}, 500);
				}
			}
		}
		this.check = {
			config: function(property) {
				if (property !== undefined) {
					console.log((new Date).getTime() + ": configuration property");
					console.log(param[property]);
					return param[property];
				} else {
					console.log((new Date).getTime() + ": configuration detail");
					console.log(param);
					return param;
				}
			},

			impression: function() {
				console.log((new Date).getTime() + ": impression detail");
				console.log(impression);
			},

			queue: function() {
				console.log((new Date).getTime() + ": task queue detail");
				queue.forEach(function(item, index) {
					console.log((new Date).getTime() + ": task " + index, item);
				})
			},

			ad: function() {
				return _adReady;
			}
		}
		return this;
	}
	// Instantiate public classes
	var instantiateEco = function() {
		var ECO = new ecoClass();
		ECO.class = ecoClass;
		return ECO;
	}
	var instantiateTime = function() {
		var TIME = new timeClass();
		TIME.class = timeClass;
		return TIME;
	}
	global.time = instantiateTime();
	global.eco = instantiateEco();
}(this));
// End eco.js

document.onreadystatechange = function() {
	switch (document.readyState) {
		case "interactive":
			// The document has finished loading. We can now access the DOM elements.
			console.log((new Date).getTime() + ": document interactive");
			if (_prodReady !== false) {
				eco.config.ga("UA-69628544-11");
			} else {
				eco.config.ga("UA-69628544-10");
			}
			ga('create', eco.run.config("ga"), 'auto');
			ga('set', 'checkProtocolTask', null);
			ga('set', 'checkStorageTask', null);
			ga('send', 'screenview', {
				'appName': eco.run.config("app"),
				'screenName': eco.run.config()
			});
			ga('send', 'event', 'ad', 'load', eco.run.config(), {
				nonInteraction: true
			});
			if (_debugMode !== false) {
				console.log((new Date).getTime() + ": " + eco.run.config("ga") + " ga sent");
			}
			if (eco.run.config("gaClient") !== undefined) {
				ga('create', eco.run.config("gaClient"), 'auto', 'clientTracker');
				ga('clientTracker.set', 'checkProtocolTask', null);
				ga('clientTracker.set', 'checkStorageTask', null);
				ga('clientTracker.send', 'pageview');
				ga('clientTracker.send', 'event', 'ad', 'load', eco.run.config(), {
					nonInteraction: true
				});
				if (_debugMode !== false) {
					console.log((new Date).getTime() + ": " + eco.run.config("gaClient") + " gaClient sent");
				}
			}
			if (window.onpagehide || window.onpagehide === null) {
				window.addEventListener('pagehide', function() {
					ga('send', 'event', 'ad', 'hide', eco.run.config(), time.action(), {
						nonInteraction: true
					});
				}, false);
			} else {
				window.addEventListener('unload', function() {
					ga('send', 'event', 'ad', 'hide', eco.run.config(), time.action(), {
						nonInteraction: true
					});
				}, false);
			}
			break;
		case "complete":
			// The page is fully loaded.
			console.log((new Date).getTime() + ": document complete");
			_docReady = true;
			break;
	}
}