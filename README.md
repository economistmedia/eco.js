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
 configure the name of the app
* `eco.config.advertiser('string');`
 configure the name of the advertiser
* `eco.config.campaign('string');`
 configure the name of the campaign
* `eco.config.issue('string');`
 configure the date of the issue
* `eco.config.gaClient('UA-XXXXXXXX-X');`
 configure the client GA property ID

### eco.impression

* `eco.impression.phone('url');`
 configure the 3rd party impression url for phone
* `eco.impression.tablet('url');`
 configure the 3rd party impression url for tablet
* `eco.impression.timestamp('string');`
 configure the 3rd party impression cache buster macro

### eco.open

* `eco.open('url','tabletOptUrl');`
 Open a url with the in-app browser. Optional url can be applied to track url opened with tablets.

### eco.heatmap

* `eco.heatmap('element');`
 Add interaction heatmap to the html object ID that wraps your content.

### eco.video

* `eco.video('id');`
 Add video tracking using the ID of the video object. Note that videos embeded via iframes are not supported.

### eco.event

* `eco.event('action','optUrl');`
 Track event action with an optional impression url.

### eco.queue

* `eco.queue(fn);`
 Quene custom functions into the task queue.

### eco.run

* `eco.run.ad('debugMode');`
 Run the ad in debug mode for browser testing.

* `eco.run.ad());`
 Run the ad in production mode. Will not work in browser.

## Usage Example

index.html :
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"/>
	<script src="js/eco.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
	<div id="wrapper">
		<a id="a" onclick=eco.open('http://google.com/phoneUrl','http://google.com/tabletUrl');>
			Link to open up webview window
		</a>
		<video id="video" webkit-playsinline controls preload="none">
			<source src="http://html5demos.com/assets/dizzy.mp4" type="video/mp4" />
		</video>
	</div>
	<script type="text/javascript">
	// 1. Create any custom code required for your ad to work here
	function task() {
		console.log((new Date).getTime()+": custom task running");
	}

	// 2. Configure the ad with important campaign details
	eco.config.app('economist');
	eco.config.advertiser('advertiser');
	eco.config.campaign('rich media');
	eco.config.issue('issue');
	eco.config.gaClient('UA-XXXXXXXX-X');

	// 3. Add impression tracking to the or video and heatmap to the ad
	eco.impression.phone('https://upload.wikimedia.org/wikipedia/commons/2/23/1x1.GIF?device=phone&ord=[timestamp]');
	eco.impression.tablet('https://upload.wikimedia.org/wikipedia/commons/2/23/1x1.GIF?device=tablet&ord=[timestamp]');
	eco.impression.timestamp('[timestamp]');
	eco.heatmap('wrapper');
	eco.video('video');

	// 4. Add your custom tasks to the task queue
	eco.queue(task);

	// 5. Run your ad
	eco.run.ad('debugMode');
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
