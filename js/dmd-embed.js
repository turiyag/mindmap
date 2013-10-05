
function DermandarEmbedder() {
		
	this.loadPanoramas = function() {
		while (dmdEmbeds.length > 0) {
			var dmdId = dmdEmbeds.pop();
			this.loadPanorama(dmdId);
		}
	};
	
	this.loadPanorama = function(id) {
		var element = document.getElementById('dmd_pano_' + id);
		if (element == null) {
			return;
		}
		element.id = 'dmd_pano_' + id + '_loaded';
		
		if (this.flashSupported) {
			element.innerHTML = "<object id=\"dmd_flash_" + id + "\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"100%\" height=\"100%\">" +
				"<param name=\"movie\" value=\"http://static.dermandar.com/swf/Viewer.swf?v=1.4\"></param>"+
				"<param name=\"allowfullscreen\" value=\"true\"></param>"+
				"<param name=\"allowscriptaccess\" value=\"always\"></param>"+
				"<param name=\"wmode\" value=\"opaque\"></param>"+
				"<param name=\"flashvars\" value=\"pano=" + id + "\"></param>"+
				"<embed name=\"dmd_flash_" + id + "\" src=\"http://static.dermandar.com/swf/Viewer.swf?v=1.4\" "+
				"type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" "+
				"width=\"100%\" height=\"100%\" wmode=\"opaque\" flashvars=\"pano=" + id + "\"></embed></object>";
			this.hookEvent(element);
		} else {
			var width = element.style.width;
			var height = element.style.height;
			element.style.background = '#333 url(http://static.dermandar.com/php/getimage.php?epid=' + id + '&equi=1&w=' + 200*width/height + '&h=' + 200/*height*/ + ') center center no-repeat';
			
			var iOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i);
			if (iOS || null==document.location.toString().match(/^http:\/\/www.dermandar.com/i))
			{
				var playImage = document.createElement('a');
				if (iOS)
					playImage.href = 'http://www.dermandar.com/html5p/' + id;
				else
					playImage.href = 'http://www.dermandar.com/p/' + id;
				playImage.style.background = 'transparent url(http://static.dermandar.com/design/images/dmd_play.png) center center no-repeat';
				playImage.style.padding = '0px';
				playImage.style.margin = '0px';
				playImage.style.border = 'none';
				playImage.style.display = 'block';
				playImage.style.height = '100%';
				element.appendChild(playImage);
			}
		}
	};
	
	this.getFlashVersion = function() {
		var flashVersion = "0,0,0";
		try {
    		try {
      			var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
      			try { axo.AllowScriptAccess = 'always'; }
      			catch(e) { flashVersion = '6,0,0'; }
    		} catch(e) {}
    		flashVersion = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
  		} catch(e) {
    		try {
      			if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
       		 		flashVersion = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      			}
    		} catch(e) {}
  		}
  		flashVersion = flashVersion.split(',').shift();
  		return flashVersion;
	};
	
	this.flashSupported = +this.getFlashVersion() >= 10;
	
	this.handleWheel = function (e) {
		e = e || window.e;
		var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
		var flashApp = e.target || e.srcElement;
		if (!flashApp)
			return true;
		var o = {
			x : e.screenX,
			y : e.screenY,
			delta : wheelData,
			ctrlKey : e.ctrlKey,
			altKey : e.altKey,
			shiftKey : e.shiftKey
		};
		flashApp.handleWheel(o);
		if (e.stopPropagation)
			e.stopPropagation();
		if (e.preventDefault)
			e.preventDefault();
		e.cancelBubble = true;
		e.cancel = true;
		e.returnValue = false;
		return false;
	};

	this.hookEvent = function (element) {
		if (element == null)
			return;
		if (element.addEventListener) {	
			element.addEventListener('DOMMouseScroll', this.handleWheel, false);
			element.addEventListener('mousewheel', this.handleWheel, false);
		} else if (element.attachEvent)
			element.attachEvent('onmousewheel', this.handleWheel);
	};
}

var dmdEmbedder = dmdEmbedder || new DermandarEmbedder();
$(function() {
    dmdEmbedder.loadPanoramas();
});
