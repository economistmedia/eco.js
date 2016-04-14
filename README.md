# eco.js-readme

A simple JS script to simplify the tracking and reporting of creative within The Economist Digital Edition, Espresso, and Global Business Review app.

## Features

 - phone and tablet
 - 3rd party impression and click tracking with cachebusting
 - video reporting with quartile and completion rates
 - interaction heatmap
 - google analytic custom events

## Install

Add the configuration script in the HEAD of your index.html :
```
	<script type="text/javascript">
		var creative = {
			app: "app",
			issue: "yyymmdd",
			advertiser: "advertiser",
			campaign: "campaign",
			ga: "UA-69628544-10",
			detail: function(){return this.app+"|"+this.issue+"|"+this.advertiser+"|"+this.campaign;}
		}
	</script>
```

Then include the eco.js file just before the closing BODY tag in your index.html :
```
	<script src="js/eco.js" type="text/javascript" charset="utf-8"></script>
```

## Basic Usage

* `ecoPixel('pixel');` : tracks ad view using 3rd party impression pixel
* `ecoLink('link');` : opens link in webview
* `ecoHeatmap('heatmap');` : tracks x, y coordinates of interactions within ad
* `ecoVideo('video');` : tracks video quartile and completion rates using a video ID

index.html :
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"/>
    <link rel="stylesheet" href="css/normalize.min.css">
	<script type="text/javascript">
	var creative = {
		app: "app",
		issue: "yyymmdd",
		advertiser: "advertiser",
		campaign: "campaign",
		ga: "UA-XXXXXXXX-XX",
		detail: function(){return this.app+"|"+this.issue+"|"+this.advertiser+"|"+this.campaign;}
	}
	</script>
</head>
<body>
	<div id="wrapper">
		<a id="a" onclick=ecoLink('phonelink','tabletlink');>
			Link to open up webview window
		</a>
		<video id="video" webkit-playsinline controls>
			<source src="http://html5demos.com/assets/dizzy.mp4" type="video/mp4" />
		</video>
	</div>
	<script src="js/eco.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript">
	// app signels the creative to begin animation
	ecoStart = function() {
		// viewable impression reporting (supports mobile and tablet with timestamp to cache bust)
		ecoPixel('phonepixel','tabletpixel','[timestamp]');
		// animation start up code here
	}
	// heatmap reporting insert wrapper ID
	ecoHeatmap('wrapper');
	// video reporting 
	ecoVideo('video');
	</script>
</body>
</html>
```

## Dependencies

[kaimallea/isMobile](https://github.com/kaimallea/isMobile)
[Google/Universal Analytics](https://www.google-analytics.com/analytics.js)

## Contributing

Contributions welcome; Please submit all pull requests against the master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Thanks!

## Author

Jia Zhuang <jiazhuang@economist.com.com> https://github.com/EconomistAds
