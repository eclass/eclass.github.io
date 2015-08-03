/**
 * Scripts
 *
 * Main scripts
 */

/* global $ */

const $ = 'jQuery';

$(window).resize( () => {
	// sectionAutoHeight();
});

/*
$(window).scroll( () => {
	let div;
	let opa;
	// const scrollPosition = '';

	const scrollPosition = $(window).scrollTop();

	if ($(window).width() > 768) {
		// parallax video
		// $('video').css('transform', 'translateY(' + scrollPosition * 0.2 + 'px)');
		// opa = 1 - (scrollPosition / 1000);
		// $('video').css({'opacity': opa});

		// parallax bg hero
		// $('.img-hero-1').css('transform', 'translateY(' + scrollPosition * 0.2 + 'px)');
		$('.img-hero-2').css('transform', 'translateY(-' + scrollPosition * 0.1 + 'px)');
		$('.img-hero-3').css('transform', 'translateY(-' + scrollPosition * 0.2 + 'px)');
	}
});
*/

$(document).ready( () => {
	setTimeout(() => {
		return $('html').addClass('init');
	}, 10);

	setTimeout(() => {
		return $('html').addClass('init-1');
	}, 700);

	// sectionAutoHeight();

	$('.Team-item').on('click', () => {
		const github = $(this).data('github');
		if (github) {
			window.open('https://github.com/' + github, '_blank');
		}
	});
});
