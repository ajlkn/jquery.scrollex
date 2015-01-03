/* jquery.scrollwatch vx.x.x | (c) n33 | n33.co @n33co | MIT */

(function($) {

	var $window = $(window),
		ids = 1,
		queue = {};

	/**
	 * Resolves a top/bottom value, optionally relative to an element's height
	 * or the window height.
	 *
	 * @param {integer} x Value.
	 * @param {integer} eHeight Element height.
	 * @param {integer} vHeight Viewport (window) height.
	 * @return {integer} Resolved value.
	 */
	function resolve(x, eHeight, vHeight) {

		if (typeof x === 'string') {

			// Percentage? Relative to element height.
				if (x.slice(-1) == '%')
					x = (parseInt(x.substring(0, x.length - 1)) / 100.00) * eHeight;

			// vh? Relative to viewport height.
				else if (x.slice(-2) == 'vh')
					x = (parseInt(x.substring(0, x.length - 2)) / 100.00) * vHeight;

			// px? Redundant but okay!
				else if (x.slice(-2) == 'px')
					x = parseInt(x.substring(0, x.length - 2));

		}

		return x;

	};

	/**
	 * Window events.
	 */
	$window
		.on('scroll', function() {

			// Get vTop.
				var vTop = $window.scrollTop();

			// Step through handler queue.
				$.map(queue, function(f) {
					(f)(vTop);
				});

		})
		.on('load', function() {
			$window.trigger('scroll');
		});

	/**
	 * Activates scrollwatch on an element.
	 *
	 * @param {object} userOptions Options.
	 * @return {jQuery} jQuery object.
	 */
	jQuery.fn.scrollwatch = function(userOptions) {

		// No elements?
			if (this.length == 0)
				return $(this);

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).scrollwatch(userOptions);

				return $(this);

			}

		// Options.
			var options = jQuery.extend({

				// Top.
					top: 0,

				// Bottom.
					bottom: 0,

				// Mode ('default', 'top', 'middle', 'bottom', 'top-only', 'bottom-only').
					mode: 'default',

				// Enter function.
					enter: null,

				// Leave function.
					leave: null,

				// Init function.
					init: null,

				// Scroll function.
					scroll: null

			}, userOptions);

		// Vars.
			var $this = $(this),
				_this = this,
				id, handler, stateTest;

		// Set scrollwatch data.
		 	id = ids++;

			$this
				.data('scrollwatch-id', id)
				.data('scrollwatch-active', false);

		// Build state test.
			switch (options.mode) {

				// top: Top viewport edge must fall within element boundaries.
					case 'top':

						stateTest = function(vTop, vMiddle, vBottom, eTop, eBottom) {
							return (vTop >= eTop && vTop <= eBottom);
						};

						break;

				// bottom: Bottom viewport edge must fall within element boundaries.
					case 'bottom':

						stateTest = function(vTop, vMiddle, vBottom, eTop, eBottom) {
							return (vBottom >= eTop && vBottom <= eBottom);
						};

						break;

				// middle: Midpoint between top/bottom viewport edges must fall within element boundaries.
					case 'middle':

						stateTest = function(vTop, vMiddle, vBottom, eTop, eBottom) {
							return (vMiddle >= eTop && vMiddle <= eBottom);
						};

						break;

				// top-only: Top viewport edge must be visible
					case 'top-only':

						stateTest = function(vTop, vMiddle, vBottom, eTop, eBottom) {
							return (vTop <= eTop && eTop <= vBottom);
						};

						break;

				// bottom-only: Bottom viewport edge must be visible
					case 'bottom-only':

						stateTest = function(vTop, vMiddle, vBottom, eTop, eBottom) {
							return (vBottom >= eBottom && eBottom >= vTop);
						};

						break;

				// default: Element boundaries must fall within the viewport.
					default:
					case 'default':

						stateTest = function(vTop, vMiddle, vBottom, eTop, eBottom) {
							return (vBottom >= eTop && vTop <= eBottom);
						};

						break;

			}

		// Build handler.
			handler = function(vTop) {

				var	currentState = $this.data('scrollwatch-active'),
					newState = false,
					offset = $this.offset(),
					vHeight, vMiddle, vBottom,
					eHeight, eTop, eBottom,
					h;

				// Viewport values.
					vHeight = $window.height();
					vMiddle = vTop + (vHeight / 2);
					vBottom = vTop + vHeight;

				// Element values.
					eHeight = $this.outerHeight();
					eTop = offset.top + resolve(options.top, eHeight, vHeight);
					eBottom = (offset.top + eHeight) - resolve(options.bottom, eHeight, vHeight);

				// Determine if there's been a state change.
					newState = stateTest(vTop, vMiddle, vBottom, eTop, eBottom);

					if (newState != currentState) {

						// Update state.
							$this.data('scrollwatch-active', newState);

						// Call appropriate function.
							if (newState) {

								if (options.enter)
									(options.enter).apply(_this);

							}
							else {

								if (options.leave)
									(options.leave).apply(_this);

							}

					}

				// Call scroll function.
					if (options.scroll)
						(options.scroll).apply(_this, [
							(vMiddle - eTop) / (eBottom - eTop)
						]);

			};

		// Add handler to queue.
			queue[id] = handler;

		// Call init.
			if (options.init)
				(options.init).apply(this);

		return $this;

	};

	/**
	 * Deactivates scrollwatch on an element.
	 *
	 * @return {jQuery} jQuery object.
	 */
	jQuery.fn.unscrollwatch = function() {

		// No elements?
			if (this.length == 0)
				return $(this);

		// Multiple elements?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).scrollwatch();

				return $(this);

			}

		// Vars.
			var $this = $(this),
				id = $this.data('scrollwatch-id');

		// ID not set? We're not scrollwatched.
			if (!id)
				return $this;

		// Clear scrollwatch data.
			$this
				.removeData('scrollwatch-id')
				.removeData('scrollwatch-active');

		// Remove handler from queue.
			delete queue[id];

		return $this;

	};

})(jQuery);