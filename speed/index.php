<?php
if (isset($_GET['dict'])) :
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title><?php echo htmlspecialchars($_GET['dict']); ?> | klava.org</title>
<link rel="shortcut icon" type="image/x-icon" href="../favicon.ico"/>
<script type="text/javascript" src="jquery-1.6.4.min.js"></script>
<link rel="stylesheet" type="text/css" href="style.css?5"/>
<script type="text/javascript" src="script.js?8" charset="utf-8"></script>
</head>
<body>
<div id="kb">
<div id="user">
anonymous
</div>
<div id="info">
<span class="icon_speed" title="Speed-Max speed">0</span>
<!--
<span class="icon_errors" title="Errors">0%</span>
-->
<span class="icon_metronome" id="info_metronome" title="Metronome speed">200</span>
<input type="checkbox" id="set_metronome" onclick="set_metronome(this.checked); $('#input input').focus();" title="Set metronome speed"/>
<span class="icon_metronome" title="Show metronome">
<input type="checkbox" id="show_metronome" title="Show metronome" onclick="$('#input input').focus();"/>
</span>
<span class="icon_errors" title="Hide errors">
<input type="checkbox" id="hide_error" title="Hide error" onclick="$('#input input').focus();"/>
</span>
</div>
<div id="input"><input type="text" autocomplete="off" placeholder="|&lt;&lt;&lt;" spellcheck="false" formnovalidate="formnovalidate" value=""/></div>
<div id="text"></div>
<div class="annotation">
<span class="close" title="Close"></span>
<div class="close_title">(Click, Enter, Esc)</div>
<p id="annotation_next" style="display: none;">Отлично, отдохните немного перед набором другого предложения.</p>
<p id="annotation_rev" style="display: none;">Повторите набор этого же предложения, старайтесь не отставать от метронома.</p>
<p id="annotation_text" style="display: none;">Набирайте текст с максимальной скоростью, в случае критических ошибок придется набирать строку заново.</p>
<p id="annotation_error" style="display: none;">Набирайте тренировочные слова без ошибок. <a href="#" onclick="$('#text').data('line', null); linesDraw(); return false;">Пропустить</a></p>
</div>
<textarea id="dict" style="display: none;"><?php
	$dict = split("\n", file_get_contents('../dict/'.$_GET['dict'].'.txt'));
	define('strings', 100);
	$start = rand(0, count($dict) - strings);
	$sdict = array_slice($dict, $start, strings);
	echo htmlspecialchars(join("\n", $sdict));
?></textarea>
</div>
</body>
</html>
<?php
else :
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>klava.org | Keyboard Trainer | Клавиатурный тренажёр</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
<body>
<div id="kb">
<p><img src="../logo.png" width="74" height="70" alt="Клавиатурный тренажёр"/></p>
<p>Вы находитесь в экспериментальной части клавиатурного тренажера Klava.org. Режим "Speed" предназначен для уже продвинутых пользователей машинописи, развивает скорость и безошибочность набора текста.</p>
<hr/>
<p>Выберите словарь, из которого будут браться тексты для вашей тренировки:</p>
<p><a href="?dict=eng_kg">English</a></p>
<p><a href="?dict=rus_kg2">Русский</a></p>
<hr/>
<p>По всем вопросам пишите письма на электронный ящик: <a href="mailto:ibnteo@gmail.com">Vladimir &lt;ibnteo@gmail.com&gt;</a></p>
</div>
</body>
</html>
<? endif;
// end index.php
