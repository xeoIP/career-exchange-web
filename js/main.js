jQuery(function($) {
	highlight();
	equalizeFeatureHeight();
	renderStats();
	enableSidebar();
	competition();
});

function highlight() {
	$("#nav a").each(function() {
		var self = $(this);
		if (window.location.pathname.indexOf(self.attr("href")) !== -1) {
			self.addClass("active");
			self.siblings().removeClass("active");
		}
	});
}

function equalizeFeatureHeight() {
	var start = $("#start");
	if (!start.length) {
		return;
	}
	var page = $(window);
	setInterval(function() {
		var max = 0;
		var items = start.find(".feature p");
		items.css("height", "auto").each(function() {
			var h = $(this).height();
			if (h > max) {
				max = h;
			}
		});
		items.height(max);
	}, 240);
}

function renderStats() {
	var stats = $("#stats");
	if (!stats.length) {
		return;
	}

	var previous = 0;
	var options = {
		useEasing : true,
		useGrouping : true,
		separator : ',',
		decimal : '.'
	}

	var pusher = new Pusher('30c6be5ae705d6b4af61');
	var channel = pusher.subscribe('test_channel');
	channel.bind('my_event', function(data) {
		console.log(data);
		console.log(previous*1, data.views*1);
		var demo = new countUp("myTargetElement", previous*1, data.views*1, 0, 2, options);
		demo.start();
		previous = data.views*1;
	});




}

function enableSidebar() {
	var viewport = $("#viewport");
	$(".lt").on("touchstart click", function(e) {
		e.stopPropagation();
		e.preventDefault();
		viewport.toggleClass("open");
	});
	$(".inner").on("touchstart click", function(e) {
		if (viewport.hasClass("open")) {
			e.stopPropagation();
			viewport.removeClass("open");
		}
	});
}

function competition() {
	var viewport = $("#viewport");
	var toggle = $("#sidebar-toggle");

	toggle.on("click", function(e) {
		e.preventDefault();
		viewport.toggleClass("lt");
	});
	if(window.location.pathname.indexOf('themes') !== -1) {
		$.ajax('#', {
			success: function (data) {
				var tbody = $('.leaderboard tbody');
				var leaderboard = data.leaderboard;
				themes = _.filter(themes, function(theme){
					if(theme) {
						return true;
					} else {
						return false;
					}
				});
				themes = _.map(themes, function(theme){
					theme.votes = leaderboard[theme.slug] || 0;
					return theme;
				});
				themes = _.sortBy(themes, function(theme){
					return -theme.votes;
				});
				var rank = 1;
				_.each(themes, function(theme){
					var row = $('<tr/>');
					row.append($('<td/>').text(rank));
					row.append($('<td/>').text(theme.name));
					row.append($('<td/>').text('#' + theme.slug));
					row.append($('<td/>').text(theme.votes));
					tbody.append(row);
					rank++;
				});
			}
		});
	};
}
