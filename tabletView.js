/*  Tablet View Plugin

Author: Andward
Date: 2014/9/16

Example: $("div").tabletView();

*/

(function($) {
	$.fn.tabletView = function(options) {

		// Overide settings
		options = $.extend({}, $.fn.tabletView.options, options);

		// Record tablet parameter
		var tabletID = 0;

		// Tablet total number 
		var tabletsNum = 0;
		
		// widget
		var widget = this;

		// Init function(return)
		var init = function() {
			insertPanel();
			widget.css('letter-spacing', '-4px');

			widget.children("div").not('.pop_panel').each(function() {
				/* Add class and style for each tablet */
				$(this).addClass('tablet');
				tabletsNum = $(".tablet").length;
				insertPointer($(this));
				setTabletCSS($(this));
			});

			$(".tablet").click(function() {
				/* Signal table click event */
				var current_id = $(".tablet").index($(this));
				showPanel(current_id);
				if (current_id === 0) {
					$(".arrow_left").hide();
				} else if (current_id === tabletsNum - 1) {
					$(".arrow_right").hide();
				}
				$(this).find(".pointer").show();
			});

			$(".arrow_left").live('click', function(event) {
				/* Slide left event */
				var previous_id = tabletID - 2;
				var previous_tablet = $(".tablet").eq(previous_id);
				if (previous_id < 0) {
					console.log("no such element");
				} else {
					showPanel(previous_id);
					previous_tablet.find('.pointer').show();
				}
			});

			$(".arrow_right").live('click', function(event) {
				/* Slide right event */
				var next_id = tabletID;
				var next_tablet = $(".tablet").eq(next_id);
				if (next_id > tabletsNum - 1) {
					console.log("no such element");
				} else {
					showPanel(next_id);
					next_tablet.find('.pointer').show();
				}
			});
			closePopPanel();
		};

		// Set CSS for signal tablet
		var setTabletCSS = function(tablet) {
			if ($(window).width() > options.deviceWidth) {
				tablet.css('width', widget.width() / options.tabletNumInRow - options.tabletMargin);
				$(".pop_panel").width(widget.width() - options.tabletMargin);
			} else {
				widget.width("100%");
				tablet.width("100%");
				$(".pop_panel").width("100%");
				options.tabletNumInRow = 1;
			}
			tablet.css({
				'height': options.tabletHeight,
				'background-color': options.backgroundColor
			});
			$(".pop_panel").css('background-color', options.backgroundColor);
			$(".pointer").css('background-color', options.backgroundColor);
		};

		// Add pop panel
		var insertPanel = function() {
			widget.append("<div class='pop_panel'></div>");
		};

		// Add pointer for tablet
		var insertPointer = function(tablet) {
			tablet.append("<div class='pointer'></div>");
		};

		// Ajax for pop panel
		var ajaxCallback = function() {
			$(".pop_panel").html("<div class='box_close'></div> \
				<div class='arrow_left'></div> \
				<div class='arrow_right'></div>");
			$.ajax({
				url: options.callbackURL,
				type: 'POST',
				dataType: 'json',
				data: options.callbackParameter,
			})
				.done(function() {
					console.log("AJAX success");
					$(".pop_panel").append(options.callbackHTML);
				})
				.fail(function() {
					console.log("AJAX error");
				})
				.always(function() {
					console.log("AJAX complete");
				});
		};

		// Display panel under focused tablet row
		var showPanel = function(id) {
			id = id + 1;
			var row_id = Math.ceil(id / options.tabletNumInRow) * options.tabletNumInRow;
			if (tabletID === 0 || Math.ceil(id / options.tabletNumInRow) != Math.ceil(tabletID / options.tabletNumInRow)) {
				if (tabletsNum - row_id < 0) {
					$(".pop_panel").insertAfter($(".tablet").eq(tabletsNum - 1));
				} else {
					$(".pop_panel").insertAfter($(".tablet").eq(row_id - 1));
				}
				scrollToMiddle($(".tablet").eq(row_id - 1));
			} else if (tabletID === id) {
				return 0;
			}
			tabletID = id;
			console.log(tabletID);
			ajaxCallback();
			$(".pointer").hide();
			$(".pop_panel").show();
			return 1;
		};

		// Scroll page to focused tablet
		var scrollToMiddle = function(element) {
			if (element.length > 0) {
				$("html, body").animate({
					scrollTop: element.offset().top
				}, 300);
			}
		};

		// Close pop panel
		var closePopPanel = function() {
			$('.box_close').live('click', function(event) {
				/* Act on the event */
				$(".pop_panel").hide();
				$(".pointer").hide();
				tabletID = 0;
			});
		};

		return init();

	};

	$.fn.tabletView.options = {
		tabletHeight: '200px', // Tablet min width
		tabletNumInRow: 5, // Tablet number of each row
		tabletMargin: 1, // Tablet distance
		backgroundColor: 'white', // Tablet color
		deviceWidth: 400, // device width
		callbackHTML: null, // Ajax callback function
		callbackURL: "", // Ajax url
		callbackParameter: null, // Ajax parameter
	};

})(jQuery);