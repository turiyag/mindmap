(function($){
	var num = function (value) {
			return parseInt(value, 10) || 0;
		};

	/**
	 * Sets or gets the values for min-width, min-height, max-width
	 * and max-height.
	 */
	$.each(['min', 'max'], function (i, name) {
		$.fn[name + 'Size'] = function (value) {
			var width, height;
			if (value) {
				if (value.width !== undefined) {
					this.css(name + '-width', value.width);
				}
				if (value.height !== undefined) {
					this.css(name + '-height', value.height);
				}
				return this;
			}
			else {
				width = this.css(name + '-width');
				height = this.css(name + '-height');
				// Apparently:
				//  * Opera returns -1px instead of none
				//  * IE6 returns undefined instead of none
				return {'width': (name === 'max' && (width === undefined || width === 'none' || num(width) === -1) && Number.MAX_VALUE) || num(width), 
						'height': (name === 'max' && (height === undefined || height === 'none' || num(height) === -1) && Number.MAX_VALUE) || num(height)};
			}
		};
	});

	/**
	 * Returns whether or not an element is visible.
	 */
	$.fn.isVisible = function () {
		return this.is(':visible');
	};

	/**
	 * Sets or gets the values for border, margin and padding.
	 */
	$.each(['border', 'margin', 'padding'], function (i, name) {
		$.fn[name] = function (value) {
			if (value) {
				if (value.top !== undefined) {
					this.css(name + '-top' + (name === 'border' ? '-width' : ''), value.top);
				}
				if (value.bottom !== undefined) {
					this.css(name + '-bottom' + (name === 'border' ? '-width' : ''), value.bottom);
				}
				if (value.left !== undefined) {
					this.css(name + '-left' + (name === 'border' ? '-width' : ''), value.left);
				}
				if (value.right !== undefined) {
					this.css(name + '-right' + (name === 'border' ? '-width' : ''), value.right);
				}
				return this;
			}
			else {
				return {top: num(this.css(name + '-top' + (name === 'border' ? '-width' : ''))),
						bottom: num(this.css(name + '-bottom' + (name === 'border' ? '-width' : ''))),
						left: num(this.css(name + '-left' + (name === 'border' ? '-width' : ''))),
						right: num(this.css(name + '-right' + (name === 'border' ? '-width' : '')))};
			}
		};
	});
	$.fn.box = function() {
		var margin = this.margin(), border = this.border(), padding = this.padding();
		return {
			top: margin.top + border.top + padding.top,
			bottom: margin.bottom + border.bottom + padding.bottom,
			left: margin.left + border.left + padding.left,
			right: margin.right + border.right + padding.right,
			vertical: margin.top + border.top + padding.top + margin.bottom + border.bottom + padding.bottom,
			horizontal: margin.left + border.left + padding.left + margin.right + border.right + padding.right
		};
	}

	$.fn.sizeRatio = function () {
		var jqObj;
		jqObj = this;
		return {
			isWider: function (selector) {
				var refObj = (selector ? $(selector) : jqObj.parent());
				return (jqObj.outerWidth() / jqObj.outerHeight()) > (refObj.width() / refObj.height());
			},
			isEqual: function (selector) {
				var refObj = (selector ? $(selector) : jqObj.parent());
				return (jqObj.outerWidth() / jqObj.outerHeight()) == (refObj.width() / refObj.height());
			},
			isTaller: function (selector) {
				var refObj = (selector ? $(selector) : jqObj.parent());
				return (jqObj.outerWidth() / jqObj.outerHeight()) < (refObj.width() / refObj.height());
			},
			fillResize: function (opt) {
				return jqObj.each(function (i) {
					var ratio;
					if ($.data(this,"ratio")) {
						ratio = $.data(this,"ratio");
					} else {
						ratio = $(this).width() / $(this).height();
						if (!isNaN(ratio)) {
							$.data(this, "ratio", ratio);
						}
					}
					if (!isNaN(ratio)) {
						var options = {
							inside:$(this).parent(),
							minHeight:0, // pixel, minimum height value
							minWidth:0, // pixel, minimum width value
							maxHeight:Number.MAX_VALUE, // pixel, maximum height value
							maxWidth:Number.MAX_VALUE, // pixel, maximum width value
							subHeight:0, //pixel, value to subtract from height after all calculations
							subWidth:0, //pixel, value to subtract from width after all calculations
							vertical:true, // boolean, resize vertical
							horizontal:true, // boolean, resize horizontal
							easing:"swing", // string, easing function
							transition: 0, // millisecond, transition time
							callback: function () {}
						};
						$.extend(options, opt);
						var props, height, width, containerIsWider;
						props = {};
						childIsWider = (ratio) > ((options.inside.width() - $(this).box().horizontal) / (options.inside.height() - $(this).box().vertical));
						if (options.vertical) {
							if (childIsWider) {
								height = (options.inside.width() - $(this).box().horizontal) / ratio;
							} else {
								height = options.inside.height() - $(this).box().vertical;
							}
							height = (height < options.minHeight ? options.minHeight : height);
							height = (height > options.maxHeight ? options.maxHeight : height);
							height -= options.subHeight;
							$.extend(props, {height: height + 'px'});
						}
						if (options.horizontal) {
							if (childIsWider) {
								width = options.inside.width() - $(this).box().horizontal;
							} else {
								width = (options.inside.height() - $(this).box().vertical) * ratio;
							}
							width = (width < options.minWidth ? options.minWidth : width);
							width = (width > options.maxWidth ? options.maxWidth : width);
							width -= options.subWidth;
							$.extend(props, {width: width + 'px'});
						}
						if (options.transition > 0) {
							if (options.easing != "") {
								$(this).animate(props, options.transition, options.easing, options.callback);
							}
						} else {
							$(this).css(props);
						}
					}
				})
			}
		}
	}
	
	/**
	 * Draws a wandering bubble
	 */
	$.fn.bubble = function (options) {
		var i, sOut, el, ctx, opt = {
			parent:this,
			id:$.rstring(),
			cid:$.rstring(),
			x:0,
			y:0,
			radius:$.rbetween(70,120),
			wanderradius: 70,
			color:$.rcolor(),
			text:"",
			link:"",
			pic:"",
			callback: function(bubble) {return;}
		};
		$.extend(opt,options);
		$(opt.parent).append('<a href="' + opt.link + '" id="' + opt.id + '" class="bubble" width="' + (opt.radius * 2) + '" height="' + (opt.radius * 2) + '"></a>');
		jLink = $("#" + opt.id);
		jLink.append('<canvas id="' + opt.cid + '" class="bubble" width="' + (opt.radius * 2) + '" height="' + (opt.radius * 2) + '"></canvas>');
		el = $("#" + opt.cid)[0];
		if (G_vmlCanvasManager) {
			G_vmlCanvasManager.initElement(el);
		}
		ctx = el.getContext("2d");
		ctx.fillStyle = opt.color;
		ctx.beginPath();
		ctx.arc(opt.radius, opt.radius, opt.radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
		jLink.css({position:"absolute",top:opt.y + "px",left:opt.x + "px"});
		jLink.wander({
			radius:opt.wanderradius
		});
		if(opt.pic) {
			jLink.append('<img src="' + opt.pic + '" />');
			$("#" + opt.id + " img").load(function() {
				$("#" + opt.id + " img").center({vertical:false});
				$("#" + opt.id + " img").css({top:"20px"});
			});
		}
		jLink.append('<p>' + opt.text + '</p>');
		opt.callback(opt);
		return this;
	}
	
	/*
		Makes a random integer number between min (inclusive) and max (exclusive)
	*/
	$.rbetween = function (min,max) {
		if (typeof max === "undefined") {
			return Math.floor(Math.random() * min);
		}
		return Math.floor((Math.random() * (max - min)) + min);
	}
	
	/*
		Makes a string of random characters
	*/
	$.rstring = function (options) {
		var i, sOut, opt = {
			length:20,
			charset:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		};
		$.extend(opt,options);
		sOut = "";
		for (i = 0; i < opt.length; i++) {
			sOut += opt.charset.charAt($.rbetween(opt.charset.length));
		}
		return sOut;
	}
	$.rcolor = function () {
		if (availableColors.length < 1) {
			availableColors = PALETTE.slice(0);
		}
		return availableColors.splice($.rbetween(availableColors.length),1)[0];
	}
	
	$.fn.hoverOrClick = function (callIn, callOut, callFinal) {
		$.each($(this),function(key,elem) {
			var jThis = $(this);
			//alert(jThis.html());
			if (Modernizr.touch){
				jThis.click(function(event) {
					//alert(jThis.data("secondTouch"));
					if(!jThis.data("secondTouch")) {
						callIn(event,jThis);
						setTimeout(function() {
							callOut(event,jThis);
							jThis.data({"secondTouch":false});
						},7000);
						jThis.data("secondTouch",true);
					} else {
						callFinal(event,jThis);
					}
				});
			} else {
				jThis.click(callFinal).hover(callIn, callOut);
			}
			return this;
		});
	}
})(jQuery);// JavaScript Document
