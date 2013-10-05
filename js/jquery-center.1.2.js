(function($){
	 $.fn.extend({
		  center: function (options) {
			   var options =  $.extend({ // Default values
					position:'absolute', //Position (to accomodate relative positions)
					inside:this.parent(), // element, center into window
					transition: 0, // millisecond, transition time
					minX:0, // pixel, minimum left element value
					minY:0, // pixel, minimum top element value
					vertical:true, // boolean, center vertical
					withScrolling:true, // boolean, take care of element inside scrollTop when minX < 0 and window is small or when window is big
					horizontal:true // boolean, center horizontal
			   }, options);
			   return this.each(function() {
					var props = {position:options.position};
					$(this).css(props);
					four = 3;
					if (options.vertical) {
						//console.log($(options.inside).height() + " - " + $(this).outerHeight() + " / 2");
						var top = ($(options.inside).height() - $(this).outerHeight()) / 2;
						if (options.withScrolling) top += $(options.inside).scrollTop() || 0;
						top = (top > options.minY ? top : options.minY);
						$.extend(props, {top: top+'px'});
					}
					if (options.horizontal) {
						//console.log($(options.inside).width() + " - " + $(this).outerWidth() + " / 2");
						var left = ($(options.inside).width() - $(this).outerWidth()) / 2;
						if (options.withScrolling) left += $(options.inside).scrollLeft() || 0;
						left = (left > options.minX ? left : options.minX);
						$.extend(props, {left: left+'px'});
					}
					if (options.transition > 0) $(this).animate(props, options.transition);
					else $(this).css(props);
					return $(this);
			   });
		  }
	 });
})(jQuery);// JavaScript Document