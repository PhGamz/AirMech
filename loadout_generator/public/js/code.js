function liRnd(){
	return (Math.round(Math.random())-0.5);
}

$(document).ready(function(){

	$.cookie.defaults = {
		expires: 365,
		path: '/',
	};

	$.expr[":"].econtains = function(obj, index, meta, stack){
		return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
	}

	// Make selectors enabled
	$( ".selectable" ).bind("mousedown", function(e) {
		e.metaKey = true;
	}).selectable({
		stop: function() {
			var a_units		= [];
			var a_airmech	= [];
			var a_pilot		= [];
			var a_item		= [];
			var a_flairs	= [];
			var a_color		= [];
			
			// Grab element names, and push to needed arrays
			$('#units_selectable_list li.ui-selected').each(function(index, value){
				a_units.push( $(value).html() );
			});
			
			$('#airmechs_selectable_list li.ui-selected').each(function(index, value){
				a_airmech.push( $(value).html() );
			});

			$('#pilots_selectable_list li.ui-selected').each(function(index, value){
				a_pilot.push( $(value).html() );
			});

			$('#items_selectable_list li.ui-selected').each(function(index, value){
				a_item.push( $(value).html() );
			});

			$('#flairs_selectable_list li.ui-selected').each(function(index, value){
				a_flairs.push( $(value).html() );
			});

			$('#colors_selectable_list li.ui-selected').each(function(index, value){
				a_color.push( $(value).html() );
			});
			
			
			$.cookie('selected_entries', JSON.stringify({
				units	: a_units,
				airmech	: a_airmech,
				pilot	: a_pilot,
				item	: a_item,
				flairs	: a_flairs,
				color	: a_color,
			}));
		}
	});
	
	/*
		===== Load units =====
	*/
	
	// If we have cookie with saved items, let's load them.
	// Select what to put in entries, if we have cookie, we just load it
	if( $.cookie('selected_entries') !== null ){
		var entries = JSON.parse( $.cookie('selected_entries') );
	}else { // Otherwise let's load default loadout
		var entries = {
			units	: [
				'Seeker', 'Soldier', 'Zipper', 'T99', 'Jackal', 'Patcher', 'Longhorn', 'Light Mine'
			],
			airmech : ['Striker'],
			pilot	: ['No pilot'],
			color	: ['Blue 1'],
			item	: ['No item'],
			flairs	: ['No Flair'],
		}
	}

	entries['units']	.forEach(function(key){ $( '#units_selectable_list li:econtains(\''		+ key + '\')', 0).addClass('ui-selected'); });
	entries['airmech']	.forEach(function(key){ $( '#airmechs_selectable_list li:econtains(\''	+ key + '\')', 0).addClass('ui-selected'); });
	entries['pilot']	.forEach(function(key){ $( '#pilots_selectable_list li:econtains(\''	+ key + '\')', 0).addClass('ui-selected'); });
	entries['item']		.forEach(function(key){ $( '#items_selectable_list li:econtains(\''		+ key + '\')', 0).addClass('ui-selected'); });
	entries['flairs']	.forEach(function(key){ $( '#flairs_selectable_list li:econtains(\''	+ key + '\')', 0).addClass('ui-selected'); });
	entries['color']	.forEach(function(key){ $( '#colors_selectable_list li:econtains(\''	+ key + '\')', 0).addClass('ui-selected'); });
		
	delete entries;
	

	/*
		===== Load units =====
	*/
	var down = 0;	// Scroll down just once

	// Generate loadout!
	$('#generate_button').click(function() {
		var units = $('#units_selectable_list li.ui-selected');
		var airmech = $('#airmechs_selectable_list li.ui-selected');
		var pilot = $('#pilots_selectable_list li.ui-selected');
		var item = $('#items_selectable_list li.ui-selected');
		var flairs = $('#flairs_selectable_list li.ui-selected');
		var color = $('#colors_selectable_list li.ui-selected');
		
		
		// Just check if entries selected or not
		if(units.length === 0){
			$.jGrowl("No units selected, will be used all units", { header: 'Warning (no units)' });
			units = $('#units_selectable_list li');
		}
		if(pilot.length === 0){
			$.jGrowl("No pilots selected, will be used all pilots", { header: 'Warning (no pilot)' });
			pilot = $('#pilots_selectable_list li');
		}
		if(airmech.length === 0){
			$.jGrowl("No airmech selected, will be used all airmechs", { header: 'Warning (no airmech)' });
			airmech = $('#airmechs_selectable_list li');
		}
		if(item.length === 0){
			$.jGrowl("No items selected, will be used all items", { header: 'Warning (no items)' });
			item = $('#items_selectable_list li');
		}
		if(flairs.length === 0){
			$.jGrowl("No flairs selected, will be used all flairs", { header: 'Warning (no flairs)' });
			flairs = $('#flairs_selectable_list li');
		}
		if(color.length === 0){
			$.jGrowl("No colors selected, will be used all colors", { header: 'Warning (no colors)' });
			color = $('#colors_selectable_list li');
		}
		
		// Now let's sort every entry array, and get single one from thoose which need us.
		units	= units		.sort(liRnd).slice(0,8); // Only 8 units
		airmech = airmech	.sort(liRnd)[0];
		pilot	= pilot		.sort(liRnd)[0];
		item	= item		.sort(liRnd)[0];
		flairs	= flairs	.sort(liRnd).slice(0,3); // Only 3 flairs
		color	= color		.sort(liRnd)[0];
		
		// Allright, we have all items, now let's fill bottom ul with our items
		
		// http://i.imgur.com/bk6lu.jpg
		// AirMech, Pilot, Item (with flairs, single block, later)
		// 4 units, color, next units
		var loadout = $('#units_loadout');
		var item_slot = $('<ul/>', {});
		
		item_slot.append( $( item ).clone() );
		item_slot.append( $( flairs ).clone() );
		
		// Add empty flairs
		if(flairs.length < 3)
			for(var i=0; i < 3 - flairs.length; i++)
				item_slot.append( $( "#flairs_selectable_list li:econtains('No Flair')" ).clone() );
		
		// Clear it first
		loadout.empty();
		
		
		// Now make loadout itself.
		loadout.append( $(airmech).clone()	);
		loadout.append( $(pilot).clone()	);

		//Append li with ul inside
		loadout.append(
			$(
				$('<li/>', {id : 'units_loadout_item_slot'}).append( item_slot )
			)
		);
		loadout.append( $( units.slice(0,4) ).clone() );
		loadout.append( $( color ).clone() );
		loadout.append( $( units.slice(4) ).clone() );
		
		$('#random_row').slideDown('slow');
		if(down === 0){
			$('footer').ScrollTo({duration: 1500});
			down = 1;
		}

		$('#units_loadout li')
			.removeClass('color_green')
			.removeClass('color_red')
			.removeClass('color_blue');

		$('#units_loadout li')
			.addClass('color_' + $( color ).text().split(' ')[0].toLowerCase() );

		$('li#units_loadout_item_slot')
			.removeClass('color_green')
			.removeClass('color_red')
			.removeClass('color_blue');

		$(this).text('Generate again?');
	});
});