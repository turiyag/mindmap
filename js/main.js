var G_vmlCanvasManager;
var PALETTE = ['#f99f1c','#52a6ec','#8fc747','#ee6d7a','#6d81c0','#7a6eea','#839df0','#d283f0','#f083b1'];
var availableColors = PALETTE.slice(0);
var patharray = window.location.pathname.split('/');
var age = (window.location.pathname.indexOf("grownups") !== -1) ? "grownups" : "kids";
$(function() {
	$("#nav" + age + "link").css({"background-position":"0 0"});
	resized();
	$(window).resize(resized);

});

function loadBubbles(bubbles) {
	if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))) {
		$("#bubblebox").bubble({x:240,y:650,color:"#bbbbbb",radius:$.rbetween(5,30)});
		$("#bubblebox").bubble({x:700,y:700,color:"#bbbbbb",radius:$.rbetween(5,30)});
		$("#bubblebox").bubble({x:100,y:350,color:"#bbbbbb",radius:$.rbetween(5,30)});
		$("#bubblebox").bubble({x:980,y:550,color:"#bbbbbb",radius:$.rbetween(5,30)});
		$("#bubblebox").bubble({x:980,y:350,color:"#bbbbbb",radius:$.rbetween(5,30)});
	}
	$("#bubblebox").bubble({x:100,y:250,radius:100,text:bubbles[0].text,link:bubbles[0].link,pic:bubbles[0].pic});
	$("#bubblebox").bubble({x:100,y:450,radius:100,text:bubbles[1].text,link:bubbles[1].link,pic:bubbles[1].pic});
	$("#bubblebox").bubble({x:890,y:250,radius:100,text:bubbles[2].text,link:bubbles[2].link,pic:bubbles[2].pic});
	$("#bubblebox").bubble({x:890,y:450,radius:100,text:bubbles[3].text,link:bubbles[3].link,pic:bubbles[3].pic});
}

function resized() {
	if ($(window).width() < 900) {
		$("#footer").css({"text-align":"right"});
	} else {
		$("#footer").css({"text-align":"center"});
	}
}

