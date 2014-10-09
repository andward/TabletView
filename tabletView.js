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
		// widget
		var widget = this;

		// Init function(return)
		var init = function() {
			insertPanel();
			widget.css('letter-spacing', '-4px');

			widget.children("div").not('.pop_panel').each(function() {
				/* iterate through array or object */
				$(this).addClass('tablet');
				insertPointer($(this));
				setTabletCSS($(this));
			});
			$(".tablet").click(function() {
				/* Act on the event */
				var current_id = $(".tablet").index($(this));
				$(".pointer").hide();
				$(this).find(".pointer").show();
				showPanel(current_id);
			});
			closePopPanel();
		};

		// Set CSS for signal tablet
		var setTabletCSS = function(tablet) {
			if ($(window).width() > options.deviceWidth) {
				tablet.css('width', widget.width() / options.tabletNumInRow - 1);
				$(".pop_panel").width(widget.width() - options.tabletNumInRow + 1);
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
			widget.append("<div class='pop_panel'><div class='boxclose'></div></div>");
		};

		// Add pointer for tablet
		var insertPointer = function(tablet) {
			tablet.append("<div class='pointer'></div>");
		};

        // Ajax for pop panel
		var ajaxCallback = function() {
			$(".pop_panel").html("");
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
			var id = id + 1;
			var row_id = Math.ceil(id / options.tabletNumInRow) * options.tabletNumInRow;
			if (tabletID === 0 || Math.ceil(id / options.tabletNumInRow) != Math.ceil(tabletID / options.tabletNumInRow)) {
				if ($(".tablet").length - row_id < 0) {
					$(".pop_panel").insertAfter($(".tablet").eq($(".tablet").length - 1));
				} else {
					$(".pop_panel").insertAfter($(".tablet").eq(row_id - 1));
				}
				scrollToMiddle($(".tablet").eq(row_id - 1));
			} else if (tabletID === id) {
				return 0;
			}
			tabletID = id;
			ajaxCallback();
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
			$('.boxclose').live('click', function(event) {
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
		backgroundColor: '#f1f1f1', // Tablet color
		deviceWidth: 400, // device width
		callbackHTML: null, // Ajax callback function
		callbackURL: "", // Ajax url
		callbackParameter: null, // Ajax parameter
	};

})(jQuery);