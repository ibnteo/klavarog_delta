/*if(typeof(localStorage) == 'undefined' ) {
	alert('Ваш браузер не поддерживает localStorage()');
} else {
	try {
		localStorage.setItem('name', 'Hello World!'); //сохраняет строку "Hello World" по ключу name
	} catch (e) {
		if (e == QUOTA_EXCEEDED_ERR) {
			alert('Кончилось место'); //данные не сохранены, так как кончилось доступное место
		}
	}
	console.log(localStorage.getItem('name')); //Hello World!
	localStorage.removeItem('name'); //удаляет значение по ключу name
}*/	

var metronome = 0;
//var metronome = 400;
$(function() {
	metronome = parseInt($('#info_metronome').text());
    $($.browser.mozilla ? document : document.body).keydown(function(e) {
		var $input = $('#input input');
		if (e.keyCode == 82 && e.ctrlKey) {
			$input.val('');
			$('#text').data('mode', null).data('line', null);
			linesDraw();
			return false;
		}
		if (e.keyCode == 27 || e.keyCode == 13) {
			if ($('div.annotation').is(':visible')) $('div.annotation').click();
		}
	});
	$('#input input').keydown(function(e) {
		if (e.keyCode == 8 && $(this).val() == '') {
			return false;
		}
	});
	$('div.annotation').click(function() {
		$('#input input').focus();
		$('div.annotation').fadeOut();
		$('#info').css({fontSize: 12});
		$('#input').data('error_words', {});
		$('#input input').data('errors', 0).val('');
	});
	$('#input input').focus().data('prev', '').data('len', 0).data('errors', 0).keyup(function() {
		textDraw();
	}).keydown(function() {
		setTimeout(function() {
			textDraw();
		}, 0);
	}).focusout(function() {
		if ($('#input input').val() != '') {
			setTimeout(function() {$('#input input').focus();}, 0);
		}
	});
	var text = $('#dict').val();
	//var lines = text.replace(/\r/g, "\n").replace(/\n{2,}/g, "\n").replace(/\t/g,' ').replace(/ {2,}/g,' ').replace(/^ +/g, "").replace(/\n +/g, "\n").replace(/ +$/g, "").replace(/ +\n/g, "\n").replace(/^\n/, '').replace(/`(.)/g, '$1́').split("\n");
	var lines = text.replace(/\r/g, "\n").replace(/\n{2,}/g, "\n").replace(/\t/g,' ').replace(/ {2,}/g,' ').replace(/^ +/g, "").replace(/\n +/g, "\n").replace(/ +$/g, "").replace(/ +\n/g, "\n").replace(/^\n/, '').split("\n");
	$('#text').data('lines', lines);
	
	//$('#input').data('error_words', {'test':2, 'abc':3, 'the':1});
	//$('#text').data('line', 1);
	
	linesDraw();
	setInterval(function() {textDraw();}, 100);
});

function linesDraw() {
	$('#info').data('aspeed', {time: 0, maxlen: 0, len: 0, errors: 0});
	var lines = $('#text').data('lines');
	var error_words = $('#input').data('error_words');
	var error_words_len = 0;
	var words = [];
	for (var item in error_words) {
		for (var i=0; i<error_words[item]; i++) {
			words[words.length] = item;
		}
	}
	$('#input').data('error_words', {});
	$('div.annotation p').hide();
	$('#text').data('is_metronom', true);
	if (words.length > 3 && ! $('#set_metronome').get(0).checked) {
		$('#text').data('mode', 'words');
		$('#text').html('');
		var i = 0;
		var max = (words.length > 5) ? ((words.length > 10) ? 5 : 4) : 3;
		for (var i=0; i<max; i++) {
			var str = '';
			while (str.length < 70) {
				str = str + words[random(words.length)] + ' ';
			}
			$('#text').append('<div'+(i>=3 ? ' class="hide"' : '')+'></div>');
			$('#text div:last').text(str);
		}
		$('#annotation_error').show();
	} else {
		var line = $('#text').data('line');
		var attempts = $('#text').data('attempts');
		if (! line || attempts >= 5 || $('#text').data('mode') == 'text') {
			line = 0;
			var i = 0;
			while (line == 0 && i < 1000) {
				line = random(lines.length);
				if (lines[line].length < 20) line = 0;
				i ++;
			}
			$('#text').data('attempts', 1);
			if ($('#text').data('mode') == 'text') $('#annotation_next').show();
		} else {
			$('#text').data('attempts', attempts ? attempts + 1 : 1);
			$('#annotation_rev').show();
		}
		$('#text').data('mode', 'text');
		var text = lines[line];
		var len = 0;
		$('#text').html('');
		$('#text').data('line', line);
		var i = 0;
		while (len < text.length && i < 10) {
			var end = text.lastIndexOf(' ', len + 76);
			var str = (end >= 0 && (text.length - len) > 74) ? text.substr(len, end - len + 1) : text.substr(len) ;
			$('#text').append('<div'+(i>=3 ? ' class="hide"' : '')+'></div>');
			$('#text div:last').text(str);
			i ++;
			len += str.length;
		}
		$('#annotation_text').show();
	}
	$('div.annotation').show();
	if (parseInt($('#info span.icon_speed').text()) == 0) $('#info').css({fontSize: 20}); else $('#info').animate({fontSize: 20});
	textDraw();
}
function random(num) {
	return Math.floor(Math.random() * num);
}
function textDraw() {
	var hide_error = $('#hide_error').get(0).checked;
	var $input = $('#input input');
	var errors = $input.data('errors');
	var mode = $('#text').data('mode');
	var len = $input.data('len');
	var prev = $input.data('prev');
	var now = (new Date()).getTime();
	var last = $input.data('last');
	if (last && (now - last) > 20000) {
		$input.data('last', null);
		$input.val('');
	}
	var val = $input.val();
	if (val != prev) {
		len += Math.abs(val.length - prev.length);
		$input.data('last', (new Date()).getTime());
	}
	if (val == '') {
		//$('#text').data('is_metronom', random(4) > 0);
		errors = 0;
		len = 0;
		$input.data('errors', errors);
		$input.data('len', len);
	}
	$input.data('len', len);
	var str1 = $('#text div:eq(0)').text().replace(/ /g, ' ');
	var start = $('#input').data('start');
	var str1_if = str1.replace(/ё/gi, 'е');
	var val_if = val.replace(/ё/gi, 'е');
	if (str1_if.substr(0, val_if.length) == val_if && val_if.length >= str1_if.length && val_if != '') {
		val = val.substr(str1.length);
		$input.val(val);
		if (mode == 'text') {
			var aspeed = $('#info').data('aspeed');
			aspeed['time'] = aspeed['time'] + (now - start);
			aspeed['maxlen'] = aspeed['maxlen'] + str1.length - 1;
			aspeed['len'] = aspeed['len'] + str1.length - 1;
			aspeed['errors'] = aspeed['errors'] + errors;
			$('#info').data('aspeed', aspeed);
			var speed = Math.floor(aspeed['len'] / (aspeed['time'] / 60000));
			var maxspeed = Math.floor(aspeed['maxlen'] / (aspeed['time'] / 60000));
			if (! $('#set_metronome').get(0).checked) {
				if ((! $('#text').data('is_metronom')) && str1.length > 50) metronome = speed;
				if (mode!='words' && maxspeed>metronome && str1.length > 50) metronome = maxspeed;
				if (mode!='words' && aspeed['maxspeed'] > metronome) metronome = aspeed['maxspeed'];
				$('#info_metronome').text(metronome);
			}
			$('#info span.icon_speed').text(speed);
			//$('#info span.icon_errors').text((aspeed['len'] ? Math.round(aspeed['errors'] / aspeed['len'] * 10000) / 100 : 0)+'%');
			$('#input').data('start', now);
		}
		$('#text').data('is_metronom', true);
		start = now;
		errors = 0;
		$input.data('errors', errors);
		$('#text').data('pos', val.length);
		for (var i = 0; i < 9; i ++) {
			$('#text').find('div').eq(i).text(nbsp($('#text').find('div').eq(i+1).text()));
		}
		$('#text div:eq(9)').text('');
		var str1 = $('#text div:eq(0)').text();
		if (str1 == '') {
			linesDraw();
			return;
		}
	} else if (str1_if.substr(0, val_if.length) == val_if) {
		$input.removeClass('error');
		$input.removeClass('set_error');
		$('#text').removeClass('error');
		$('#text').data('pos', val.length);
		if (val == '') {
			start = null;
			$('#input').data('start', start);
		} else {
			if (start == null) {
				start = (new Date()).getTime();
				$('#input').data('start', start);
			}
		}
	} else {
		var old = $('#text div:eq(0) span.old').text();
		if (old.length > 0 && (! $input.hasClass('set_error')) && mode == 'words') {
			var pos = str1.lastIndexOf(' ', old.length-1);
			if (pos>=0) {
				val = val.substr(0, pos+1).replace(/[ ]+$/, ' ');
			} else {
				val = '';
			}
			$input.val(val);
		} else if (old.length > 0 && ! $input.hasClass('set_error')) {
			errors ++;
			$input.data('errors', errors);
			var pos = val.length - 1;
			var str1e = str1.replace(/[-_]/g, ' ');
			var startpos = str1e.lastIndexOf(' ', pos)>=0?str1e.lastIndexOf(' ',pos):0;
			var word = str1e.substr(startpos, str1e.indexOf(' ',pos)>=0?str1e.indexOf(' ',pos)-startpos:null).replace(/[^a-zA-Zа-яА-Я0-9']/g, '').toLowerCase();
			if (word.length > 2 && mode != 'words') {
				var error_words = $('#input').data('error_words');
				if (! error_words) error_words = {};
				error_words[word] = error_words[word] ? error_words[word] ++ : 1;
				$('#input').data('error_words', error_words);
			}
			$input.data('error_pressed', 0);
		} else if (val.length < prev.length) {
			var error_pressed = $input.data('error_pressed');
			error_pressed ++;
			if (error_pressed > 3 && mode != 'words') {
				$('#text').data('is_metronom', false);
				error_pressed = 0;
				$input.data('last', null);
				$input.val('');
				return;
			}
			$input.data('error_pressed', error_pressed);
		}
		if (str1 != '' && (errors / str1.length) > 0.05 && mode != 'words') {
			$('#text').data('is_metronom', false);
			$input.data('errors', 0);
			$input.val('');
			textDraw();
			return;
		}
		if (! hide_error) {
			$input.addClass('error');
			$('#text').addClass('error');
		}
		$input.addClass('set_error');
	}
	var pos = $('#text').data('pos');
	var is_metronom = $('#text').data('is_metronom') || $('#show_metronome').get(0).checked || $('#set_metronome').get(0).checked;
	if (isNaN(pos)) pos = 0;
	var posmetronome = 0;
	if (is_metronom && start != null && mode != 'words') {
		var now = (new Date()).getTime();
		posmetronome = Math.floor(((now - start) / 1000 / 60) * metronome);
	}
	var text;
	if ($('#show_metronome').get(0).checked) {
		if (posmetronome > pos) {
			text = '<span class="metronome"><span class1="old">'+nbsp(str1.substr(0, pos))+'</span>'+'<span class1="cursor">'+nbsp(str1.substr(pos, 1))+'</span>'+nbsp(str1.substr(pos+1, posmetronome - (pos + 1)))+'</span>'+nbsp(str1.substr(posmetronome));
		} else {
			text = '<span class1="old"><span class="metronome">'+nbsp(str1.substr(0, posmetronome))+'</span>'+nbsp(str1.substr(posmetronome, pos - posmetronome))+'</span><span class1="cursor">'+nbsp(str1.substr(pos, 1))+'</span>'+nbsp(str1.substr(pos + 1));
		}
	} else {
		text = '<span class="old">'+nbsp(str1.substr(0, pos))+'</span>'+'<span class="cursor">'+nbsp(str1.substr(pos, 1))+'</span>'+((posmetronome > pos + 1) ? '<span class="metronome">'+nbsp(str1.substr(pos+1, posmetronome - (pos + 1)))+'</span>'+nbsp(str1.substr(posmetronome)) : nbsp(str1.substr(pos+1)));
	}
	$('#text div:eq(0)').html(text);
	$input.data('prev', val);
	if (str1 != '' && start!=null && start!=0 && mode != 'words' && (posmetronome - pos) > 10 && $('#set_metronome').get(0).checked) {
		$('#text').data('is_metronom', false);
		$input.data('errors', 0);
		//$input.data('last', null);
		$input.val('');
	}
}
function nbsp(text) {
	return text.replace(/ /g, ' ');
}
function set_metronome(checked) {
	if (checked) {
		$('#info_metronome').html('<input type="number" style="width:3em;" value="'+metronome+'" onchange="metronome=parseInt(this.value,10); $(\'#input input\').focus();"/>');
	} else {
		$('#info_metronome').text(metronome);
	}
}
