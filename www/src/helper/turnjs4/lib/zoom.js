/**
 * zoom.js
 * www.turnjs.com
 *
 * Copyright (C) 2012 Emmanuel Garcia
 **/

(function($) {

'use strict';

var has3d,
	zoomOptions = {
		max: 2,
		flipbook: null,
		easeFunction: 'ease-in-out',
		duration: 500,
		when: {}
	};

var zoomMethods = {
	init: function(opts) {

		var that = this, data = this.data(), options = $.extend(zoomOptions, opts);

		if (!options.flipbook || !options.flipbook.turn('is')) {
			throw error('options.flipbook is required');
		}

		has3d = 'WebKitCSSMatrix' in window || 'MozPerspective' in document.body.style;

		if (typeof(options.max)!='function') {
			var max = options.max;
			options.max = function() { return max; };
		}

		data.zoom = {
			opts: options,
			axis: point2D(0, 0),
			scrollPos: point2D(0, 0),
			eventQueue: [],
			eventZoom: function() {
				return zoomMethods._eZoom.apply(that, arguments);
			},
			eventStart: function() {
				return zoomMethods._eStart.apply(that, arguments);
			},
			eventTurning: function() {
				return zoomMethods._eTurning.apply(that, arguments);
			},
			eventTurned: function() {
				return zoomMethods._eTurned.apply(that, arguments);
			},
			mouseupEvent: function() {
				return zoomMethods._eMouseUp.apply(that, arguments);
			},
			eventTouchStart: function() {
				return zoomMethods._eTouchStart.apply(that, arguments);
			},
			eventTouchMove: function() {
				return zoomMethods._eTouchMove.apply(that, arguments);
			},
			eventTouchEnd: function() {
				return zoomMethods._eTouchEnd.apply(that, arguments);
			}
		};

		for (var eventName in options.when) {
			if (Object.prototype.hasOwnProperty.call(options.when, eventName)) {
		
				this.bind('zoom.'+eventName, options.when[eventName]);
			}
		}

		options.flipbook.
			bind('zooming', data.zoom.eventZoom).
			bind('start', data.zoom.eventStart).
			bind('turning', data.zoom.eventTurning).
			bind('turned', data.zoom.eventTurned);

		this.css({
			position: 'relative',
			overflow : 'hidden'
		});

		if ($.isTouch) {

			options.flipbook.
				bind('touchstart', data.zoom.eventTouchStart ).
				bind('touchmove', data.zoom.eventTouchMove).
				bind('touchend', data.zoom.eventTouchEnd);

			this.bind('touchstart', zoomMethods._tap);

		} else {
			this.click(zoomMethods._tap);
		}
	},

	_tap: function(event) {
		
		var that = $(this),
			data = that.data().zoom;
		
		if (isPage($(event.target), that)) {

			zoomMethods._addEvent.call(that, 'tap', event);
			
			var secuence = zoomMethods._eventSeq.call(that);

			if (secuence)
				that.trigger(secuence);

		}

	},

	_addEvent: function(eventName, event) {
		
		var data = this.data().zoom,
			time = (new Date()).getTime(),
			eventObject = {name: eventName, timestamp: time, event: event};
		
		data.eventQueue.push(eventObject);

		if (data.eventQueue.length>10)
			data.eventQueue.splice(0, 1);

	},

	_eventSeq: function() {

		var data = this.data().zoom,
			list = data.eventQueue,
			lastEvent = list.length-1;


		if (lastEvent>0 &&
			list[lastEvent].name=='tap' &&
			list[lastEvent-1].name=='tap' &&
			list[lastEvent].event.pageX == list[lastEvent-1].event.pageX &&
			list[lastEvent].event.pageY == list[lastEvent-1].event.pageY &&
			list[lastEvent].timestamp-list[lastEvent-1].timestamp < 200 &&
			list[lastEvent].timestamp-list[lastEvent-1].timestamp > 50)
		{
	
			return $.extend(list[lastEvent].event, {type: 'zoom.doubleTap'});

		} else if (list[lastEvent].name=='tap') {
			
			return $.extend(list[lastEvent].event, {type: 'zoom.tap'});

		}
			
	},

	_prepareZoom: function () {
		
		var flipPos,
			data = this.data().zoom,
			invz = 1/this.zoom('value'),
			flip = data.opts.flipbook,
			flipData = flip.data(),
			flipOffset = flip.offset(),
			thisOffset = this.offset(),
			flipSize = {height: flip.height()},
			view = flip.turn('view');

			if (flip.turn('display')=='double' && flip.data().opts.autoCenter) {
				if (!view[0]) {
					flipSize.width = flip.width()/2;
					flipPos = point2D(
						flipOffset.left-thisOffset.left+flipSize.width,
						flipOffset.top-thisOffset.top
					);
				} else if (!view[1]) {
					flipSize.width = flip.width()/2;
					flipPos = point2D(
						flipOffset.left-thisOffset.left,
						flipOffset.top-thisOffset.top
					);
				} else {
					flipSize.width = flip.width();
					flipPos = point2D(
						flipOffset.left-thisOffset.left,
						flipOffset.top-thisOffset.top
					);
				}
			} else {
				flipSize.width = flip.width();
				flipPos = point2D(
					flipOffset.left-thisOffset.left,
					flipOffset.top-thisOffset.top
				);
			}

		if (!data.zoomer) {
			data.zoomer = $('<div />',
				{'class': 'zoomer',
					css: {
						overflow:'hidden',
						position: 'absolute',
						zIndex: '1000000'
					}
				}).
			mousedown(function() {
				return false;
			}).appendTo(this);
		}

		data.zoomer.css({
			top: flipPos.y,
			left: flipPos.x,
			width: flipSize.width,
			height: flipSize.height
		});
		
		var zoomerView = view.join(',');

		if (zoomerView!=data.zoomerView) {

			data.zoomerView = zoomerView;
			data.zoomer.find('*').remove();

			for (var p = 0; p<view.length; p++) {

				if (!view[p])
					continue;

				var pos = flipData.pageObjs[view[p]].offset(),
					pageElement = $(flipData.pageObjs[view[p]]);
					
				pageElement.
					clone().
					transform('').
					css({
						width: pageElement.width()*invz,
						height: pageElement.height()*invz,
						position: 'absolute',
						display: '',
						top: (pos.top - flipPos.y)*invz,
						left: (pos.left - flipPos.x)*invz
					}).
					appendTo(data.zoomer);
			}
		}
		
		
		return {pos: flipPos, size: flipSize};

	},

	value: function() {

		var data = this.data().zoom;

		return data.opts.flipbook.turn('zoom');
	},

	zoomIn: function(event) {
		
		var pos,
			that = this,
			data = this.data().zoom,
			flip = data.opts.flipbook,
			flipOffset = flip.offset(),
			thisOffset = this.offset(),
			bound = zoomMethods._prepareZoom.call(this),
			flipPos = bound.pos,
			center = point2D(bound.size.width/2, bound.size.height/2),
			zoom = data.opts.max(),
			prefix = $.cssPrefix(),
			transitionEnd = $.cssTransitionEnd(),
			autoCenter = flip.data().opts.autoCenter;

			data.scale = zoom;
			flip.data().noCenter = true;


		if (typeof(event)!='undefined') {

			if ('x' in event && 'y' in event) {
				
				pos = point2D(event.x-flipPos.x, event.y-flipPos.y);
			
			} else {

				pos = ($.isTouch) ?
					point2D(
						event.originalEvent.touches[0].pageX-flipPos.x-thisOffset.left,
						event.originalEvent.touches[0].pageY-flipPos.y-thisOffset.top
					)
					:
					point2D(
						event.pageX-flipPos.x-thisOffset.left,
						event.pageY-flipPos.y-thisOffset.top
					);

			}

		} else {
			pos = point2D(center.x, center.y);
		}

		if (pos.x<0 || pos.y<0 || pos.x>bound.width || pos.y>bound.height) {
			pos.x = center.x;
			pos.y = center.y;
		}

		var compose = point2D(
				(pos.x-center.x)*zoom + center.x,
				(pos.y-center.y)*zoom + center.y
			),
			move = point2D(
				(bound.size.width*zoom>this.width()) ? pos.x-compose.x : 0,
				(bound.size.height*zoom>this.height()) ? pos.y-compose.y : 0
			),
			maxMove = point2D(
				Math.abs(bound.size.width*zoom-this.width()),
				Math.abs(bound.size.height*zoom-this.height())
			),
			minMove = point2D(
				Math.min(0, bound.size.width*zoom-this.width()),
				Math.min(0, bound.size.height*zoom-this.height())
			),
			realPos = point2D(
				center.x*zoom - center.x - flipPos.x - move.x,
				center.y*zoom - center.y - flipPos.y - move.y
			);

		if (realPos.y>maxMove.y)
			move.y = realPos.y - maxMove.y +  move.y;

		else if (realPos.y<minMove.y)
			move.y = realPos.y - minMove.y +  move.y;

		if (realPos.x>maxMove.x)
			move.x = realPos.x - maxMove.x +  move.x;

		else if (realPos.x<minMove.x)
			move.x = realPos.x - minMove.x +  move.x;

		realPos = point2D(
			center.x*zoom - center.x - flipPos.x - move.x,
			center.y*zoom - center.y - flipPos.y - move.y
		);

		var css = {};

		css[prefix+'transition'] = prefix +
			'transform ' +
			data.opts.easeFunction +
			' ' +
			data.opts.duration +
			'ms';

		var transitionEndCallback = function() {

			that.trigger('zoom.zoomIn');

			data.zoomIn = true;

			data.flipTop = flip.css('top');
			data.flipLeft = flip.css('left');

			flip.turn('zoom', zoom).css({
				position: 'absolute',
				margin: '',
				top:0,
				left:0
			});

			var flipOffset = flip.offset();

			data.axis =  point2D(
				flipOffset.left - thisOffset.left,
				flipOffset.top - thisOffset.top
			);

			if (autoCenter &&
				flip.turn('display')=='double' &&
				!flip.turn('view')[0]
			)
				data.axis.x = data.axis.x + flip.width()/2;

			that.zoom('scroll', realPos);


			that.bind($.mouseEvents.down, zoomMethods._eMouseDown);
			that.bind($.mouseEvents.move, zoomMethods._eMouseMove);
			$(document).bind($.mouseEvents.up, data.mouseupEvent);
			that.bind('mousewheel', zoomMethods._eMouseWheel);

			setTimeout(function() {
				data.zoomer.hide();
				data.zoomer.remove();
				data.zoomer = null;
				data.zoomerView = null;
			}, 50);

		};

		data.zoomer.css(css).show();

		if (transitionEnd)
			data.zoomer.bind(transitionEnd, function() {
				$(this).unbind(transitionEnd);
				transitionEndCallback();
			});
		else
			setTimeout(transitionEndCallback, data.opts.duration);

		data.zoomer.transform(translate(move.x, move.y, true) + scale(zoom, true));
	
	},

	zoomOut: function() {

		var pos, move,
			that = this,
			data = this.data().zoom,
			flip = data.opts.flipbook,
			zoom = data.scale,
			prefix = $.cssPrefix(),
			transitionEnd = $.cssTransitionEnd();

		if (!data.zoomIn)
			return;
		
		data.zoomIn = false;
		data.scale = 1;

		flip.data().noCenter = false;

		that.unbind($.mouseEvents.down, zoomMethods._eMouseDown);
		that.unbind($.mouseEvents.move, zoomMethods._eMouseMove);
		$(document).unbind($.mouseEvents.up, data.mouseupEvent);
		that.unbind('mousewheel', zoomMethods._eMouseWheel);

		var css = {};

		css[prefix+'transition'] = prefix +
			'transform ' +
			data.opts.easeFunction +
			' ' +
			data.opts.duration +
			'ms';

		flip.css(css);

		move = point2D(
			-flip.width()/2,
			-flip.height()/2
		);

		var autoCenter = flip.data().opts.autoCenter;

		if (autoCenter && flip.turn('display')=='double') {

			if (!flip.turn('view')[0])
				move.x = move.x - flip.width()/(zoom*4);
			else if (!flip.turn('view')[1])
				move.x = move.x + flip.width()/(zoom*4);
		}

		var transitionEndCallback = function() {
		
			if (flip[0].style.removeProperty) {
				
				flip[0].style.removeProperty(prefix+'transition');
				flip.transform('none').turn('zoom', 1);
				flip[0].style.removeProperty('margin');
				flip.css({top: data.flipTop, left: data.flipLeft});

			} else {
				
				flip.transform('none').
					turn('zoom', 1).
					css({
						margin: '',
						top: data.flipTop,
						left: data.flipLeft
				});

			}

			if (autoCenter)
				flip.turn('center');

			that.trigger('zoom.zoomOut');
			
		};

		if (transitionEnd) {
			flip.bind(transitionEnd, function() {

				$(this).unbind(transitionEnd);
				transitionEndCallback();

			});
		} else
			setTimeout(transitionEndCallback, data.opts.duration);

		flip.transform(translate(move.x, move.y, true) + scale(1/zoom, true));



	},

	flipbookWidth: function() {
		
		var data = this.data().zoom,
			flipbook = data.opts.flipbook,
			view = flipbook.turn('view');

		return (flipbook.turn('display')=='double' && (!view[0] || !view[1])) ?
			flipbook.width()/2
			:
			flipbook.width();

	},

	scroll: function(to, unlimited, animate) {
		
		var data = this.data().zoom,
			flip = data.opts.flipbook,
			flipWidth = this.zoom('flipbookWidth'),
			prefix = $.cssPrefix();
		
		if (has3d) {

			var css = {};

			if (animate) {
				css[prefix+'transition'] = prefix + 'transform 200ms';
			} else {
				css[prefix+'transition'] = 'none';
			}

			flip.css(css);
			flip.transform(translate(-data.axis.x - to.x, -data.axis.y - to.y, true));

		} else {
			
			flip.css({top: -data.axis.y - to.y, left: -data.axis.x - to.x});

		}

		if (!unlimited) {

			var out,
				minBound = point2D(
					Math.min(0, (flipWidth-this.width())/2),
					Math.min(0, (flip.height()-this.height())/2)),
				maxBound = point2D(
					(flipWidth>this.width()) ? flipWidth-this.width() : (flipWidth-this.width())/2,
					(flip.height()>this.height()) ? flip.height()-this.height() : (flip.height()-this.height())/2
				);

			if (to.y<minBound.y) {
				to.y = minBound.y;
				out = true;
			} else if (to.y>maxBound.y) {
				to.y = maxBound.y;
				out = true;
			}

			if (to.x<minBound.x) {
				to.x = minBound.x;
				out = true;
			} else if (to.x>maxBound.x) {
				to.x = maxBound.x;
				out = true;
			}

			if (out) {
				this.zoom('scroll', to, true, true);
			}

		}

		data.scrollPos = point2D(to.x, to.y);

	},

	resize: function() {

		var data = this.data().zoom,
			flip = data.opts.flipbook;
		
		if (this.zoom('value')>1) {

			var	flipOffset = flip.offset(),
				thisOffset = this.offset();

			data.axis =  point2D(
				(flipOffset.left - thisOffset.left) + (data.axis.x + data.scrollPos.x),
				(flipOffset.top - thisOffset.top) + (data.axis.y + data.scrollPos.y)
			);

			if (flip.turn('display')=='double' && !flip.turn('view')[0])
				data.axis.x = data.axis.x + flip.width()/2;

			this.zoom('scroll', data.scrollPos);
		}

	},

	_eZoom: function() {
		
		var flipPos,
			data = this.data().zoom,
			flip = data.opts.flipbook,
			view = flip.turn('view');

		for (var p = 0; p<view.length; p++) {
			if (view[p])
				this.trigger('zoom.resize',
					[data.scale, view[p], flip.data().pageObjs[view[p]]]
				);
		}
	},

	_eStart: function(event) {

		if (this.zoom('value')!=1) {
			event.preventDefault();
		}

	},

	_eTurning: function(event, page, view) {

		var that = this,
			zoom = this.zoom('value'),
			data = this.data().zoom,
			flip = data.opts.flipbook;

		data.page = flip.turn('page');

		if (zoom!=1) {
			for (var p = 0; p<view.length; p++) {
				if (view[p])
					this.trigger('zoom.resize',
						[zoom, view[p], flip.data().pageObjs[view[p]]]
					);
			}

			setTimeout(function() {
				that.zoom('resize');
			}, 0);
		}

	},

	_eTurned: function (event, page) {
		
		if (this.zoom('value')!=1) {
			var that = this,
				data = this.data().zoom,
				flip = data.opts.flipbook;

			if (page>data.page)
				this.zoom('scroll',
					point2D(0, data.scrollPos.y), false, true);
				
			else if (page<data.page)
				this.zoom('scroll',
					point2D(flip.width(), data.scrollPos.y), false, true);
		
		}
	},

	_eMouseDown: function(event) {
		
		var data = $(this).data().zoom;

		data.dragging = true;

		data.draggingCur = ($.isTouch) ?
			point2D(
				event.originalEvent.touches[0].pageX,
				event.originalEvent.touches[0].pageY
			)
			:
			point2D(event.pageX, event.pageY);
		
		return false;
	},

	_eMouseMove: function(event) {

		var data = $(this).data().zoom;
				
		if (data.dragging) {

			var cur = ($.isTouch) ?
				point2D(
					event.originalEvent.touches[0].pageX,
					event.originalEvent.touches[0].pageY
				)
				:
				point2D(event.pageX, event.pageY),
				motion = point2D(
					cur.x- data.draggingCur.x,
					cur.y-data.draggingCur.y
				);

			$(this).zoom('scroll',
				point2D(
					data.scrollPos.x-motion.x,
					data.scrollPos.y-motion.y
				), true
			);

			data.draggingCur = cur;

			return false;
		}

	},

	_eMouseUp: function(event) {

		var data = $(this).data().zoom;

		if (data.dragging) {
			$(this).zoom('scroll', data.scrollPos);
		}

		data.dragging = false;

	},

	_eMouseWheel: function(event, delta, deltaX, deltaY) {
		
		var data = $(this).data().zoom,
			cur = point2D(
				data.scrollPos.x + deltaX*10,
				data.scrollPos.y - deltaY*10
			);
		
		$(this).zoom('scroll', cur, false, true);
		
	},

	_eTouchStart: function(event) {
		
		var data = $(this).data().zoom,
			flip = data.opts.flipbook,
			finger = point2D(
				event.originalEvent.touches[0].pageX,
				event.originalEvent.touches[0].pageY
			);

		data.touch = {};
		data.touch.initial = finger;
		data.touch.last = finger;
		data.touch.timestamp = (new Date()).getTime();
		data.touch.speed = point2D(0, 0);
	},

	_eTouchMove: function(event) {
		
		var data = $(this).data().zoom,
			zoom = $(this).zoom('value'),
			flip = data.opts.flipbook,
			time = (new Date()).getTime(),
			finger = point2D(
				event.originalEvent.touches[0].pageX,
				event.originalEvent.touches[0].pageY
			);
		
		if (data.touch && zoom==1 && !flip.data().mouseAction) {
			data.touch.motion = point2D(
				finger.x-data.touch.last.x,
				finger.y-data.touch.last.y);

		
			data.touch.speed.x = (data.touch.speed.x===0) ?
				data.touch.motion.x / (time-data.touch.timestamp) :
				(data.touch.speed.x + (data.touch.motion.x / (time-data.touch.timestamp)))/2;

			data.touch.last = finger;
			data.touch.timestamp = time;
		}

	},

	_eTouchEnd: function(event) {

		var data = $(this).data().zoom;

		if (data.touch && $(this).zoom('value')==1) {

			var y = Math.abs(data.touch.initial.y - data.touch.last.y);

			if (y<50 && (data.touch.speed.x<-1 || data.touch.last.x-data.touch.initial.x<-100)) {
				
				this.trigger('zoom.swipeLeft');

			} else if(y<50 && (data.touch.speed.x>1 || data.touch.last.x-data.touch.initial.x>100)){
				
				this.trigger('zoom.swipeRight');

			}

		}
	}
};

function isPage(element, last) {

	if (element[0]==last[0])
		return false;

	if (element.attr('page'))
		return true;
	
	return (element.parent()[0]) ?
		isPage(element.parent(), last)
		:
	false;

}

function error(message) {

	function TurnJsError(message) {
		this.name = "TurnJsError";
		this.message = message;
	}

	TurnJsError.prototype = new Error();
	TurnJsError.prototype.constructor = TurnJsError;

	return new TurnJsError(message);

}

function translate(x, y, use3d) {
	
	return (has3d && use3d) ? ' translate3d(' + x + 'px,' + y + 'px, 0px) '
	: ' translate(' + x + 'px, ' + y + 'px) ';

}

function scale(v, use3d) {
	
	return (has3d && use3d) ? ' scale3d(' + v + ', ' + v + ', 1) '
	: ' scale(' + v + ') ';

}

function point2D(x, y) {
	
	return {x: x, y: y};

}

$.extend($.fn, {
	zoom: function() {
		
		var args = arguments;

		if (!args[0] || typeof(args[0])=='object')
			return zoomMethods.init.apply($(this[0]), args);
		else if (zoomMethods[args[0]])
			return zoomMethods[args[0]].apply($(this[0]), Array.prototype.slice.call(args, 1));
		else
			throw error(args[0] + ' is not a method');

	}
});

})(jQuery);
