var sectionAutoHeight = function() {
	if ($(window).width() > 768) {
		return $('.u-autoHeight').height($(window).height());
	} else {
		return $('.u-autoHeight').css({
			height: "inherit"
		});
	}
};