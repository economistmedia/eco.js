/**
 * eco.js v0.1.1
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

//Google Analytics
(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments);
	}, i[r].l = 1 * new Date();
	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'js/analytics.js', 'ecoAnalytic');
//End Google Analytics

//isMobile.js
! function(a) {
	var b = /iPhone/i,
		c = /iPod/i,
		d = /iPad/i,
		e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
		f = /Android/i,
		g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
		h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
		i = /IEMobile/i,
		j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
		k = /BlackBerry/i,
		l = /BB10/i,
		m = /Opera Mini/i,
		n = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
		o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
		p = new RegExp('(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)', 'i'),
		q = function(a, b) {
			return a.test(b);
		}, r = function(a) {
			var r = a || navigator.userAgent,
				s = r.split('[FBAN');
			return 'undefined' != typeof s[1] && (r = s[0]), this.apple = {
				phone: q(b, r),
				ipod: q(c, r),
				tablet: !q(b, r) && q(d, r),
				device: q(b, r) || q(c, r) || q(d, r)
			}, this.amazon = {
				phone: q(g, r),
				tablet: !q(g, r) && q(h, r),
				device: q(g, r) || q(h, r)
			}, this.android = {
				phone: q(g, r) || q(e, r),
				tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)),
				device: q(g, r) || q(h, r) || q(e, r) || q(f, r)
			}, this.windows = {
				phone: q(i, r),
				tablet: q(j, r),
				device: q(i, r) || q(j, r)
			}, this.other = {
				blackberry: q(k, r),
				blackberry10: q(l, r),
				opera: q(m, r),
				firefox: q(o, r),
				chrome: q(n, r),
				device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r)
			}, this.seven_inch = q(p, r), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, 'undefined' == typeof window ? this : void 0;
		}, s = function() {
			var a = new r();
			return a.Class = r, a;
		};
		'undefined' != typeof module && module.exports && 'undefined' == typeof window ? module.exports = r : 'undefined' != typeof module && module.exports && 'undefined' != typeof window ? module.exports = s() : 'function' == typeof define && define.amd ? define('isMobile', [], a.isMobile = s()) : a.isMobile = s();
}(this);
// End isMobile.js

//eco.js
(function(global) {
	// Public ecoClass
	var ecoClass = function() { 
		
		// Private
		var _timestamp = function(url, timestamp) {
			var a;
			if (timestamp !== undefined) {
				a = url.replace(timestamp, function() {
					return Math.round((new Date()).getTime() / 1e3);
				});
				return (new Image()).src = a;
			} else {
				a = url;
				return (new Image()).src = a;
			}
		};

		var _orientationCheck = function() {
			if (window.innerWidth > window.innerHeight) {
				return 'landscape';
			} else {
				return 'portrait';
			}
		};
		
		// Public ecoClass methods
		this.config = (function(){
			var param = {};
			return {
				app: function(values) {
					param.app = values;
					return this;
				},
				advertiser: function(values) {
					param.advertiser = values;
					return this;
				},
				campaign: function(values) {
					param.campaign = values;
					return this;
				},
				issue: function(values) {
					param.issue = values;
					return this;
				},
				ga: function(values) {
					param.ga = values;
					return this;
				},
				gaClient: function(values) {
					param.gaClient = values;
					return this;
				},
				getProperty: function(property){
					return param[property];
				},
				getCampaign: function(){
					var a = param.app + '|' + param.advertiser + '|' + param.campaign + '|' + param.issue;
					return a.toLowerCase();
				},
				getAll: function(){
					console.log((new Date()).getTime()-eco.time.load + 'ms: configuration detail', param);
				}
			};
		}());

		this.impression = (function(){
			var impression = {};
			return {
				phone: function(url) {
					impression.phone = url;
					return this;
				},
				tablet: function(url) {
					impression.tablet = url;
					return this;
				},
				timestamp: function(macro) {
					impression.timestamp = macro;
					return this;
				},
				timestampValue: function() {
					return impression.timestamp;
				},
				getAll: function() {
					if (impression.phone && impression.tablet !== undefined) {
						if (impression.timestamp !== undefined) {
							if (isMobile.phone) {
								eco.sendGA('ad','view', eco.time.view(), 'nonInteraction');
								return _timestamp(impression.phone, impression.timestamp);
							} else {
								eco.sendGA('ad','view', eco.time.view(), 'nonInteraction');
								return _timestamp(impression.tablet, impression.timestamp);
							}
						} else {
							if (isMobile.phone) {
								eco.sendGA('ad','view', eco.time.view(), 'nonInteraction');
								return _timestamp(impression.phone, impression.timestamp);
							} else {
								eco.sendGA('ad','view', eco.time.view(), 'nonInteraction');
								return _timestamp(impression.tablet, impression.timestamp);
							}
						}
					} else {
						eco.sendGA('ad','view', eco.time.view(), 'nonInteraction');
					}
				},
				check: function() {
					console.log((new Date()).getTime()-eco.time.load + 'ms: impression detail',impression);
				}				
			};
		}());

		this.heatmap = function() {
			document.addEventListener('click', function(event) {
				var x = event.pageX;
				var y = event.pageY;
				var tracking = {
					x: x,
					y: y,
					o: _orientationCheck(),
				};
				eco.sendGA('heatmap', JSON.stringify(tracking), eco.time.action(), 'nonInteraction');
			});
		};

		this.open = function(url, tabletOptUrl) {
			if (isMobile.phone) {
				if (!_prodReady) {
					window.location = url;
					eco.sendGA('external', url, eco.time.action());
				} else {
					window.location = 'internal-' + url;
					eco.sendGA('external', url, eco.time.action());
				}
			} else if (tabletOptUrl !== undefined) {
				if (!_prodReady) {
					window.location = tabletOptUrl;
					eco.sendGA('external', tabletOptUrl, eco.time.action());
				} else {
					window.location = 'internal-' + tabletOptUrl;
					eco.sendGA('external', tabletOptUrl, eco.time.action());
				}
			} else {
				if (!_prodReady) {
					window.location = url;
					eco.sendGA('external', url, eco.time.action());
				} else {
					window.location = 'internal-' + url;
					eco.sendGA('external', url, eco.time.action());
				}
			}
		};

		this.video = function(video, poster) {
			var myVideo = document.getElementById(video);
			var myDuration = function() {return Math.floor(myVideo.duration);};
			var myTime = function() {return Math.floor(myVideo.currentTime);};
			var myQuartile = function() {return Math.floor(100 * (myTime() / myDuration()));};
			var played = 0;
			poster = document.getElementById(poster);
			myVideo.addEventListener('timeupdate', function() {
				if (myQuartile() > 25) {
					eco.sendGA('video', 'firstQuartile: ' + myVideo.currentSrc, myQuartile(), 'nonInteraction');
					this.removeEventListener('timeupdate', arguments.callee);
				}
			});
			myVideo.addEventListener('timeupdate', function() {
				if (myQuartile() > 50) {
					eco.sendGA('video', 'secondQuartile: ' + myVideo.currentSrc, myQuartile(), 'nonInteraction');
					this.removeEventListener('timeupdate', arguments.callee);
				}
			});
			myVideo.addEventListener('timeupdate', function() {
				if (myQuartile() > 75) {
					eco.sendGA('video', 'thirdQuartile: ' + myVideo.currentSrc, myQuartile(), 'nonInteraction');
					this.removeEventListener('timeupdate', arguments.callee);
				}
			});
			myVideo.addEventListener('play', function() {
				if (played === 0) {
					played++;
					eco.sendGA('video', 'play: ' + myVideo.currentSrc, eco.time.action());
				} else {
					myVideo.play();
					eco.sendGA('video', 'resume: ' + myVideo.currentSrc, myQuartile());
				}
			}, false);
			myVideo.addEventListener('pause', function() {
				if (myQuartile() < 100) {
					eco.sendGA('video', 'pause: ' + myVideo.currentSrc, myQuartile());
				}
			}, false);
			myVideo.addEventListener('ended', function() {
				played = 0;
				eco.sendGA('video', 'ended: ' + myVideo.currentSrc, myQuartile(), 'nonInteraction');
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}, false);
			document.addEventListener('webkitfullscreenchange' || 'mozfullscreenchange' || 'fullscreenchange' || 'MSFullscreenChange', function(e) {
				var isInFullScreen = !(!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement);
				if (isInFullScreen) {
					// console.log("Full screen YES");
				} else {
					// console.log("Full screen NO");
					myVideo.pause();
				}
			});
			//Triggers available to play video such as a thumbnail or cover image
			if (poster !== null) {
				poster.addEventListener('click', function() {
					myVideo.play();
				}, false);
			}
			return this;
		};

		this.event = function(action, optUrl) {
			if (optUrl && eco.impression.timestampValue() !== undefined) {
				_timestamp(optUrl, eco.impression.timestampValue());
				eco.sendGA('custom', action, eco.time.action());
			} else if (optUrl !== undefined) {
				_timestamp(optUrl);
				eco.sendGA('custom', action, eco.time.action());
			} else {
				eco.sendGA('custom', action, eco.time.action());
			}
			return this;
		};

		this.queue = (function(){
			var queue = [];
			return {
				addTask: function(fn) {
					queue.push(fn);
					return this;
				},
				getQueue: function() {
					queue.forEach(function(item, index) {
						console.log((new Date()).getTime()-eco.time.load + 'ms: task ' + index+'\n', item);
						return item, index;
					});
				},
				runQueue: function() {
					if (_debugMode) {
						queue.forEach(function(item, index) {
							// console.log((new Date).getTime()-eco.time.load + 'ms: running task " + index);
						});
					}
					while (queue.length > 0) {
						(queue.shift())();
					}
				}
			};
		}());

		this.ad = {
			debug: function() {
				_debugMode = true;
				console.log((new Date()).getTime()-eco.time.load + 'ms: debug mode on');
				eco.config.getAll();
				eco.impression.check();
				eco.queue.getQueue();
				var readyStateCheckInterval = setInterval(function() {
					console.log((new Date()).getTime()-eco.time.load + 'ms: ecoStart waiting');
					if (_docReady) {
						clearInterval(readyStateCheckInterval);
						_adReady = true;
						ecoStart();
						console.log((new Date()).getTime()-eco.time.load + 'ms: ecoStart complete');
					}
				}, 500);
			},
			run: function() {
				_prodReady = true;
				var readyStateCheckInterval = setInterval(function() {
					if (_docReady) {
						clearInterval(readyStateCheckInterval);
						_adReady = true;
					}
				}, 500);
			}
		};

		this.time = {
			view: function() {
				return Math.floor(((new Date()).getTime() - this.load) / 1e3);
			},

			action: function() {
				return Math.floor(((new Date()).getTime() - this.eco) / 1e3);
			}
		};

		this.sendGA = function(category, action, value, nonInteraction) {
			if(_debugMode) {
				console.log(category, action, value, nonInteraction);
			};
			if (nonInteraction !== undefined) {
				if (eco.config.getProperty('gaClient') !== undefined) {
					ecoAnalytic('send', 'event', category, action, eco.config.getCampaign(), value, {
							nonInteraction: true
						});
					ecoAnalytic('clientTracker.send', 'event', category, action, eco.config.getCampaign(), value, {
							nonInteraction: true
						});
				} else {
					ecoAnalytic('send', 'event', category, action, eco.config.getCampaign(), value, {
							nonInteraction: true
						});	
				}				
			} else {
				if (eco.config.getProperty('gaClient') !== undefined) {
					ecoAnalytic('send', 'event', category, action, eco.config.getCampaign(), value);
					ecoAnalytic('clientTracker.send', 'event', category, action, eco.config.getCampaign(), value);
				} else {
					ecoAnalytic('send', 'event', category, action, eco.config.getCampaign(), value);	
				}	
			}
		};
	};
	// Instantiate ecoClass
	var instantiate = function() {
		var ECO = new ecoClass();
		ECO.class = ecoClass;
		return ECO;
	};

	global.eco = instantiate();

	// Set new load time
	eco.time.load = (new Date()).getTime();
}(this));
// End eco.js

//ecoStart
function ecoStart() {

	if (_adReady) {
		// console.log((new Date).getTime()-eco.time.load + 'ms: ad ready " + _adReady);
		// console.log((new Date).getTime()-eco.time.load + 'ms: start function running");
		eco.time.eco = (new Date()).getTime();
		eco.heatmap();
		eco.impression.getAll();
		eco.queue.runQueue();
		// console.log((new Date).getTime()-eco.time.load + 'ms: start function completed");
	} else {
		// console.log((new Date).getTime()-eco.time.load + 'ms: ad ready " + _adReady);
		// console.log((new Date).getTime()-eco.time.load + 'ms: start function waiting");
		var readyStateCheckInterval = setInterval(function() {
			// console.log((new Date).getTime()-eco.time.load + 'ms: ad ready " + _adReady);
			if (_adReady) {
				clearInterval(readyStateCheckInterval);
				// console.log((new Date).getTime()-eco.time.load + 'ms: start function running");
				eco.time.eco = (new Date()).getTime();
				eco.heatmap();
				eco.impression.getAll();
				eco.queue.runQueue();
				// console.log((new Date).getTime()-eco.time.load + 'ms: start function completed");
			}
		}, 500);
	}
}
//End ecoStart

document.onreadystatechange = function() {
	
	switch (document.readyState) {
		case 'interactive':
			// The document has finished loading. We can now access the DOM elements.
			// console.log((new Date).getTime()-eco.time.load + 'ms: document interactive");
			if (_prodReady !== false) {
				eco.config.ga('UA-69628544-11');
			} else {
				eco.config.ga('UA-69628544-10');
			}
			ecoAnalytic('create', eco.config.getProperty('ga'), 'auto');
			if (_debugMode !== false) {
				ecoAnalytic(function(tracker){
					// console.log((new Date).getTime()-eco.time.load + 'ms: " + (tracker.get('trackingId'))+ " ga created");
				});
			}
			ecoAnalytic('set', 'checkProtocolTask', null);
			ecoAnalytic('set', 'checkStorageTask', null);
			ecoAnalytic('send', 'screenview', {
				'appName': eco.config.getProperty('app'),
				'screenName': eco.config.getCampaign()
			});
			if (eco.config.getProperty('gaClient') !== undefined) {
				ecoAnalytic('create', eco.config.getProperty('gaClient'), 'auto', 'clientTracker');
				if (_debugMode !== false) {
					ecoAnalytic(function(clientTracker){
						// console.log((new Date).getTime()-eco.time.load + 'ms: " + (clientTracker.get('trackingId'))+ " gaClient created");
					});
				}
				ecoAnalytic('clientTracker.set', 'checkProtocolTask', null);
				ecoAnalytic('clientTracker.set', 'checkStorageTask', null);
				ecoAnalytic('clientTracker.send', 'pageview');
			}
			eco.sendGA('ad', 'load', '0', 'nonInteraction');
			if ('onpagehide' in window) {
				window.addEventListener('pagehide', function() {
					ecoAnalytic('send', 'event', 'ad', 'hide', eco.config.getCampaign(), eco.time.action(), {
						nonInteraction: true
					});
					if (eco.config.getProperty('gaClient') !== undefined) {
						ecoAnalytic('clientTracker.send', 'event', 'ad', 'hide', eco.config.getCampaign(), eco.time.action(), {
							nonInteraction: true
						});						
					}
				}, false);
			} else {
				window.addEventListener('unload', function() {
					ecoAnalytic('send', 'event', 'ad', 'hide', eco.config.getCampaign(), eco.time.action(), {
						nonInteraction: true
					});
					if (eco.config.getProperty('gaClient') !== undefined) {
						ecoAnalytic('clientTracker.send', 'event', 'ad', 'hide', eco.config.getCampaign(), eco.time.action(), {
							nonInteraction: true
						});						
					}
				}, false);
			}
			break;
		case 'complete':
			// The page is fully loaded.
			// console.log((new Date).getTime()-eco.time.load + 'ms: document complete");
			_docReady = true;
			break;
	}
};