var curIsotopeFilter = '*';
var curIsotopePage = '';
var ppp = 6; /*Set number of items in portfolio*/

jQuery(document).ready(function() {


	// Pretty photo
	jQuery("a[data-rel^='prettyPhoto']").click(function(e) {
		if (jQuery(window).width()<480)	{
			e.stopImmediatePropagation();
			window.location = jQuery(this).attr('href');
		}
		e.preventDefault();
		return false;
	});
	jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({
		markup: '<div class="pp_pic_holder"> \
			<div class="ppt"></div> \
			<div class="pp_content_container"> \
				<div class="pp_left"> \
				<div class="pp_right"> \
					<div class="pp_content"> \
						<div class="pp_loaderIcon"></div> \
						<div class="pp_fade"> \
							<div class="pp_nav"> \
								<a href="#" class="pp_arrow_previous"><span></span></a> \
								<a href="#" class="pp_arrow_next"><span></span></a> \
							</div> \
							<div id="pp_full_res"></div> \
							<div class="pp_details"> \
								<p class="pp_description"></p> \
								<a class="pp_close" href="#"><span></span></a> \
								<a href="#" class="pp_expand" title="Expand the image"><span></span></a> \
							</div> \
						</div> \
					</div> \
				</div> \
				</div> \
			</div> \
		</div> \
		<div class="pp_overlay"></div>',
		social_tools: '',
		theme: 'light_rounded',
		deeplinking: false,
		horizontal_padding: 0,
		overlay_gallery: false
	});


	jQuery('#nav_tabs').tabs('#tab_section > .tab_content', {
		tabs: 'section > .section_header > .section_title',
			effect : 'slide',
			slideUpSpeed: 600,
			slideDownSpeed: 1000,
			initialIndex: 0,
			onClick: function (e, tabIndex) {
				var tabs = jQuery('#nav_tabs > li > a');
				var tab = tabs.eq(tabIndex);
				if(tab.attr('href') === '#portfolio') {
					if(tab.attr('href') === '#portfolio' && jQuery('.portfolio_items').length > 0) {
						jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
					}
				}
				if(tab.attr('href') === '#contacts') {
					function hider_over() {
						jQuery('.map_wrap .map_overlay').fadeOut();
					}
					setTimeout(hider_over, 1000);
					if (window.googlemap_refresh) {googlemap_refresh();}
						googlemap_refreshed = true;					
				}
				if(tab.attr('href') === '#profile') {
					skills_anim();
				}
			}
	});
	jQuery('#page:not(.print) #resume .section-header').click(function(){
		jQuery(this).toggleClass('opened').next().stop().slideToggle();
		var fTop = jQuery(this).offset().top;
		if(jQuery(this).hasClass('opened')){
			jQuery('html, body').animate({scrollTop: fTop-30});
		}
		return false;
	});
	if(jQuery('.portfolio_wrapper').length > 0) {
		jQuery('.portfolio_items')
			.isotope({ 
				itemSelector: '.portfolio_post',
				transformsEnabled : true,
				duration: 750,
				resizable: true,
				resizesContainer: true,
				layoutMode: 'fitRows'
			});
		jQuery('#portfolio_iso_filters li a').click(function(){
			var selector = jQuery(this).attr('data-filter');
			curIsotopeFilter = selector;
			jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
			jQuery(this).parents('#portfolio_iso_filters').find('a').removeClass('current');
			jQuery(this).addClass('current');
			return false;
		});
		jQuery('#portfolio_load_more').on('click', 'a', function(){
			if(!jQuery(this).hasClass('no_results')) {
				var selector = '.portfolio_items article.hidden'+(curIsotopeFilter!='*' ? curIsotopeFilter : '');
				jQuery(selector).each(function(idx) {
					if (idx<ppp) {
						jQuery(this).addClass('visible').removeClass('hidden');
					}
				});
				jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
		
				if(jQuery('.portfolio_items article.visible').length === jQuery('.portfolio_items article').length) {
					jQuery('#more_results').addClass('no_results');
				}
			}	
			return false;
		});
	}	

	// toTop link setup
	jQuery(window).scroll(function() {
		if(jQuery(this).scrollTop() >= 110) {
			jQuery('#toTop').show();	
		} else {
			jQuery('#toTop').hide();	
		}
	});
	jQuery('#toTop').click(function(e) {
		jQuery('body,html').animate({scrollTop:0}, 800);
		e.preventDefault();
	});
});

function getIsotopeFilter() {
	var flt = curIsotopeFilter!='*' ? curIsotopeFilter : '';
	flt += curIsotopePage!='' ? ((flt!='' ? '' : '') + curIsotopePage) : '';
	flt=='' ? '*' : '';
	return flt;
}
function pagesClear() {
	jQuery('.portfolio_items article').removeClass('visible').removeClass('hidden');
	jQuery("#portfolio_load_more").hide();
	curIsotopePage = '';
}
function pagesBuild() {
	var selector = '.portfolio_items article'+(curIsotopeFilter!='*' ? curIsotopeFilter : '');
	var items = jQuery(selector);
	var total = items.length;
	jQuery("#portfolio_load_more").hide();
	if (total > ppp) {
		var pagesList = '<a href="#" data-filter=".visible" id="more_results"><span>More Results</span></a>';
		items.each(function(idx, obj) {
			var pg = Math.floor(idx/ppp)+1;
			jQuery(obj).addClass(pg==1 ? 'visible' : 'hidden');
		});
		jQuery("#portfolio_load_more").show();
		jQuery("#portfolio_load_more").html(pagesList);
		curIsotopePage = '.visible';
	}
}
function skills_anim(){
	if(!jQuery('#page').hasClass('print')) {
		if(jQuery('#resume .widgets_section.section-header:visible').length > 0) {
			var wnd = jQuery(window).scrollTop()+jQuery(window).height();
			var oft = jQuery('#resume:visible .widgets_section.section-header').offset().top+
						jQuery('.widgets_section.section-header').height()+200;
			if(jQuery(window).scrollTop == ''){
				wnd = 800;
			}
			if(wnd >= oft){
				jQuery('.widget_skills .skills_row .progress').each(function(){
					var val = jQuery(this).find('.value').text();
						jQuery(this).animate({'width':val}, 1000, 'easeInQuint');
				});	
			}	
		}	
	}	
	else {
		return false;
	}
}
function formValidate(form, opt) {
	var error_msg = '';
	form.find(":input").each(function() {
		if (error_msg!='' && opt.exit_after_first_error) return;
		for (var i = 0; i < opt.rules.length; i++) {
			if (jQuery(this).attr("name") == opt.rules[i].field) {
				var val = jQuery(this).val();
				var error = false;
				if (typeof(opt.rules[i].min_length) == 'object') {
					if (opt.rules[i].min_length.value > 0 && val.length < opt.rules[i].min_length.value) {
						if (error_msg=='') jQuery(this).get(0).focus();
						error_msg += '<p class="error_item">' + (typeof(opt.rules[i].min_length.message)!='undefined' ? opt.rules[i].min_length.message : opt.error_message_text ) + '</p>'
						error = true;
					}
				}
				if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].max_length) == 'object') {
					if (opt.rules[i].max_length.value > 0 && val.length > opt.rules[i].max_length.value) {
						if (error_msg=='') jQuery(this).get(0).focus();
						error_msg += '<p class="error_item">' + (typeof(opt.rules[i].max_length.message)!='undefined' ? opt.rules[i].max_length.message : opt.error_message_text ) + '</p>'
						error = true;
					}
				}
				if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].mask) == 'object') {
					if (opt.rules[i].mask.value != '') {
						var regexp = new RegExp(opt.rules[i].mask.value);
						if (!regexp.test(val)) {
							if (error_msg=='') jQuery(this).get(0).focus();
							error_msg += '<p class="error_item">' + (typeof(opt.rules[i].mask.message)!='undefined' ? opt.rules[i].mask.message : opt.error_message_text ) + '</p>'
							error = true;
						}
					}
				}
				if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].equal_to) == 'object') {
					if (opt.rules[i].equal_to.value != '' && val!=jQuery(jQuery(this).get(0).form[opt.rules[i].equal_to.value]).val()) {
						if (error_msg=='') jQuery(this).get(0).focus();
						error_msg += '<p class="error_item">' + (typeof(opt.rules[i].equal_to.message)!='undefined' ? opt.rules[i].equal_to.message : opt.error_message_text ) + '</p>'
						error = true;
					}
				}
				if (opt.error_fields_class != '') jQuery(this).toggleClass(opt.error_fields_class, error);
			}
		}
	});
	if (error_msg!='' && opt.error_message_show) {
		error_msg_box = form.find(".result");
		if (error_msg_box.length == 0) {
			form.append('<div class="result"></div>');
			error_msg_box = form.find(".result");
		}
		if (opt.error_message_class) error_msg_box.toggleClass(opt.error_message_class, true);
		error_msg_box.html(error_msg).fadeIn();
		setTimeout("error_msg_box.fadeOut()", opt.error_message_time);
	}
	return error_msg!='';
}
jQuery(window).scroll(function(){
	skills_anim();
});
jQuery(window).load(function(){
	skills_anim();
	pagesBuild();
	if(jQuery('.portfolio_items').length) {
		jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
		jQuery('.portfolio_items').css('height', '300px').find('article').css('transform' ,'none');
	}
});