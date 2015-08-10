/**
 * Scripts
 *
 * @author Raúl Hernández M. <raulghm@gmail.com>
 * @since 2015-07-27
 */

/* global $ */

$(window).scroll( () => {
	const scrollPosition = $(window).scrollTop();

	if ($(window).width() > 768) {
		$('.Hero-images img:nth-child(1)').css('transform', 'translateY(-' + scrollPosition * 0.17 + 'px)');
		$('.Hero-images img:nth-child(2)').css('transform', 'translateY(-' + scrollPosition * 0.16 + 'px)');
		$('.Hero-images img:nth-child(3)').css('transform', 'translateY(-' + scrollPosition * 0.15 + 'px)');
		$('.Hero-images img:nth-child(4)').css('transform', 'translateY(-' + scrollPosition * 0.08 + 'px)');
		$('.Hero-images img:nth-child(5)').css('transform', 'translateY(-' + scrollPosition * 0.05 + 'px)');
		$('.Hero-images img:nth-child(6)').css('transform', 'translateY(-' + scrollPosition * 0.05 + 'px)');
	}
});

$(document).ready( () => {
	setTimeout( () => {
		return $('html').addClass('init');
	}, 10);

	setTimeout( () => {
		return $('html').addClass('init-1');
	}, 200);

	setTimeout( () => {
		return $('html').addClass('init-2');
	}, 700);
});
