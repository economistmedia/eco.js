# eco.js-readme

A simple JS library to simplify the tracking setup and initialization of Rich Media ads on The Economist Digital Edition, Espresso, and Global Business Review app.

## Features

 - support phone and tablet impression and click tracking
 - support 3rd party tracking with cachebusting
 - support html5 video reporting with quartile and completion rates (iframe video embeds not supported)
 - support interaction heatmap
 - support google analytics custom events
 - support queueing of tasks before initialization
 - support console output of debug information

## Install

Include the eco.js script in the HEAD of your index.html :
```
	<script src="js/eco.js" type="text/javascript" charset="utf-8"></script>
```

## Global Functions

### eco.config

* `eco.config.app('string');`
 STRING. configure the name of the app
* `eco.config.advertiser('string');`
 STRING. configure the name of the advertiser
* `eco.config.campaign('string');`
 STRING. configure the name of the campaign
* `eco.config.issue('string');`
 STRING. configure the date of the issue
* `eco.config.gaClient('UA-XXXXXXXX-X');`
 STRING. configure the client GA property ID

### eco.impression

* `eco.impression.phone('url');`
 STRING. configure the 3rd party impression url for phone
* `eco.impression.tablet('url');`
 STRING. configure the 3rd party impression url for tablet
* `eco.impression.timestamp('string');`
 STRING. configure the 3rd party impression cache buster macro

### eco.heatmap

* `eco.heatmap();`
 Add interaction heatmap to the creative by recording all x, y cooridnates of clicks on document object.

### eco.open

* `eco.open('url','tabletOptUrl');`
 STRING. Open a url with the in-app browser. Optional url can be applied to track url opened with tablets.

### eco.video

* `eco.video('id');`
 STRING. Add video tracking using the ID of the video object. Note that videos embeded via iframes are not supported. 

### eco.event

* `eco.event('action','optUrl');`
 STRING. Track event action with an optional impression url.

### eco.queue

* `eco.queue.addTask(fn);`
 FUNCTION. Quene custom functions into the task queue.

### eco.ad

* `eco.ad.debug();`
 Run the ad in debug mode for browser testing. Removed for production.
* `eco.ad.run();`
 Run the ad in production mode (will not work in browser). Set the ad to run when supplying creative to The Economist production team.

## Usage Example

index.html :
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"/>
	<script src="js/eco.min.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
	<div id="wrapper">
		<a id="a" onclick=eco.open('http://google.com/phoneUrl','http://google.com/tabletUrl');>
			Link to open up webview window
		</a>
		<video id="video1" webkit-playsinline controls preload="none">
			<source src="http://html5demos.com/assets/dizzy.mp4" type="video/mp4" />
		</video>
		<video id="video2" webkit-playsinline controls preload="none">
			<source src="http://html5demos.com/assets/dizzy.mp4" type="video/mp4" />
		</video>
	</div>
	<script type="text/javascript">
	// 1. Create any custom code required for your ad to work here
	function task1() {
		console.log((new Date()).getTime()+": task 1 running");
	}
	
	function task2() {
		console.log((new Date()).getTime()+": task 2 running");
	}

	// 2. Configure the ad with important campaign details
	eco.config.app('economist').advertiser('advertiser').campaign('rich media').issue('issue').gaClient('UA-XXXXXXXX-X');

	// 3. Add impression tracking to the or video and heatmap to the ad
	eco.impression.phone('https://upload.wikimedia.org/wikipedia/commons/2/23/1x1.GIF?device=phone&ord=[timestamp]');
	eco.impression.tablet('https://upload.wikimedia.org/wikipedia/commons/2/23/1x1.GIF?device=tablet&ord=[timestamp]');
	eco.impression.timestamp('[timestamp]');
	eco.heatmap();
	eco.video('video1').video('video2');

	// 4. Add your custom tasks to the task queue
	eco.queue.addTask(task1).addTask(task2);

	// 5. Run your ad
	eco.ad.debug();
	// eco.ad.run();

	</script>
</body>
</html>
```

## Dependencies

[kaimallea/isMobile](https://github.com/kaimallea/isMobile)

## Contributing

Contributions welcome; Please submit all pull requests against the master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Thanks!

## Author

Jia Zhuang <jiazhuang@economist.com.com> https://github.com/EconomistAds
