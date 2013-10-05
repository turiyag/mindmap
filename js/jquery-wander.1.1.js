(function($){
	/**
	 * Makes an element wander randomly, its top left corner centered around x and y
	 */
	$.wanderoptions = {
		wanderers:{},
		count:0
	};
	$.fn.wandering = function () {
		$.each($.wanderoptions.wanderers, function (id, opt) {
			var r, d, x, y,sID;
			r = opt.radius * Math.random();
			d = Math.random() * 2 * Math.PI;
			x = Math.floor(opt.pos.left + (Math.sin(d) * r));
			y = Math.floor(opt.pos.top + (Math.cos(d) * r));
			$(opt.elem).animate({left:x + "px"},opt.tick);
			setTimeout(function() {
				if (typeof $.wanderoptions.wanderers[id] !== "undefined") {
					$(opt.elem).animate({top:y + "px"},{ duration: opt.tick, queue: false });
				}
			}, opt.tick / 2);
		});
	};
	$.fn.wander = function (opt) {
		$.each($(this), function(i,obj) {
			$(obj).css({position:"absolute"}); //This call must preceed the call to position() for IE7's sake;	
			var options = {
				elem:obj,
				pos:$(obj).position(),
				radius:200,
				tick:10000
			};
			$.extend(options, opt);
			$(obj).css({top:options.y+"px",left:options.x+"px"});
			$.wanderoptions.wanderers[$(obj).prop('id')] = options;
			$.wanderoptions.wanderers[$(obj).prop('id')].interval = setInterval($.fn.wandering,options.tick);
			$.wanderoptions.count++;
			var r, d, y;
			r = options.radius * Math.random();
			d = Math.random() * 2 * Math.PI;
			y = Math.floor(options.pos.top + (Math.cos(d) * r));
			$(obj).animate({top:y + "px"},{ duration: options.tick / 2, queue: false });
			$.fn.wandering();
		});
		return this;
	};
	$.fn.stopWander = function (jumpToEnd) {
		var sID;
		$.each($(this), function(i,obj) {
			sID = $(obj).prop('id');
			if ($.wanderoptions.wanderers[sID]) {
				$(obj).stop(true, jumpToEnd);
				clearInterval($.wanderoptions.wanderers[sID].interval);
				delete $.wanderoptions.wanderers[sID];
			}
		});
	};
})(jQuery);// JavaScript Document
