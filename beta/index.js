jQuery.cookie = function(name, value, options) {
if (typeof value != 'undefined') { 
options = options || {};
if (value === null) {
value = '';
options.expires = -1;
}
var expires = '';
if (options.expires && typeof options.expires == 'number') {
var date;
date = new Date();
date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
expires = '; expires=' + date.toUTCString(); 
}
document.cookie = [name, '=', encodeURIComponent(value), expires].join('');
} else { 
var cookieValue = null;
if (document.cookie && document.cookie != '') {
var cookies = document.cookie.split(';');
for (var i = 0; i < cookies.length; i++) {
var cookie = jQuery.trim(cookies[i]);
if (cookie.substring(0, name.length + 1) == (name + '=')) {
cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
break;
}
}
}
return cookieValue;
}
};
function setInputWidth() {
var width = $("#text1").width();
$("#input_text").width(width < 700 ? 700 : width).focus();
}
function convertToHtml(text) {
return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function Klava() {
this.maxLinesText = 3;
this.maxLinesDict = 5;
this.sum_error = 0;
this.count_error = 0;
this.sum_time = 0;
this.sum_length = 0;
this.lines = [{text: "", id: 0}];
this.text = [""];
this.error_symbols = [];
this.reset_timer = null;
this.time_start = null;
this.position = 0;
this.mode = "text";
this.currentLine = 0;
this.currentText = 0;
this.setLines = function(startIndex) {
var rand = Math.floor(Math.random() * this.text.length);
var str = this.text[rand];
if (this.mode == "dict") {
var alang = str.split(" = ");
var avars = alang.length > 1 ? alang[1].split(" ; ") : [];
if (startIndex == this.currentLine) {
$("#question").text(alang[0]);
this.currentText = rand;
}
var text = "";
if (avars.length > 0) {
var rand2 = Math.floor(Math.random() * avars.length);
text = avars[rand2] + "¶";
}
this.lines[startIndex] = {text: text, id: rand};
if (startIndex < (this.maxLinesDict - 1)) {
this.setLines(startIndex + 1);
}
} else {
var index = startIndex;
while (str.length > 0) {
if (str.length > 80) {
var line1_pos = str.substring(0, 81).lastIndexOf(" ");
this.lines[index] = {text: str.substring(0, line1_pos) + String.fromCharCode(160), id: rand};
str = str.substring(line1_pos + 1);
} else {
this.lines[index] = {text: str + "¶", id: rand};
str = "";
}
index ++;
}
if (this.lines.length < (this.maxLinesText - 1) && this.text.length > 1) {
this.setLines(index);
}
}
}
this.showLines = function(inputLen) {
var error_symbols = [];
for (var i in this.error_symbols) {
error_symbols[i] = this.error_symbols[i];
}
for (var index = 0; index < (this.mode == "dict" ? this.maxLinesDict : this.maxLinesText); index ++) {
var end = this.lines[index].text.substring(index == 0 ? inputLen : 0);
var end_line = "";
for (var i = 0; i < end.length; i ++) {
var symbol = end.substring(i, i + 1);
if (error_symbols[symbol.toLowerCase()] > 0) {
end_line = end_line + '<span class="error">' + convertToHtml(symbol) + '</span>';
error_symbols[symbol.toLowerCase()] --;
} else {
end_line = end_line + convertToHtml(symbol);
}
}
$("#text" + (index + 1)).html((inputLen > 0 && index == 0 ? '<span class="printed">'+convertToHtml(this.lines[index].text.substring(0, inputLen))+'</span>' : "")+end_line);
}
}
this.selLanguage = function() {
}
this.showStat = function(speed, errors) {
var abs_speed = (this.sum_time == 0 ? 0 : (this.sum_length / this.sum_time) * 60);
var out_abs_error = (this.sum_length == 0 ? 0 : (Math.round((this.sum_error / this.sum_length) * 100 * 100) / 100));
var out_error = (Math.round(errors * 100) / 100);
$("#stat").html(
"["+Math.round(speed)+"/"+Math.round(abs_speed)+"]/min"+
"&nbsp;&nbsp;&nbsp;&nbsp;"+
"["+out_error.toFixed(2)+"/"+out_abs_error.toFixed(2)+"]%"
);
}
this.linesUp = function() {
for (var i = 0; i < this.lines.length - 1; i ++) {
this.lines[i] = this.lines[i + 1];
$("#text" + (i + 1)).html(convertToHtml(this.lines[i].text));
}
this.lines.pop();
}
this.init = function() {
this.sum_error = 0;
this.sum_time = 0;
this.sum_error = 0;
this.sum_length = 0;
this.showStat(0, 0);
this.error_symbols = [];
this.currentLine = (this.mode == "dict" ? Math.floor(Math.random() * 7) : 0);
this.softInit();
$("#question").toggle(this.mode == "dict");
$("div.data").toggleClass("dict", this.mode == "dict");
$("div.text").show();
for (var i = ((this.mode == "dict" ? this.maxLinesDict : this.maxLinesText) + 1); i <= 7; i ++) {
$("#text" + i).parent("div.text").hide();
}
}
this.softInit = function() {
if (this.timer) {
window.clearTimeout(this.timer);
}
this.time_start = null;
this.count_error = 0;
$("#input_text").val("").removeClass("error");
this.lines = [{text: "", id: 0}];
this.setLines(0);
this.position = 0;
this.showLines(0);
setInputWidth();
}
this.initLanguage = function() {
var language = $("#sel_language").val();
var klava = this;
$.ajax({
url: language + ".txt",
success: function(data) {
klava.text = data.replace(/ {2,}/g, " ").replace(/^ /g, "").replace(/\r/g, "").replace(/\n\n/g,"\n").split("\n");
if (language.indexOf("dict_") == 3) {
klava.mode = "dict";
} else {
klava.mode = "text";
}
klava.init();
},
error: function() {
alert("Error");
}
});
var lang = language.substring(0, 2);
if (lang == "en" && ! $("#sel_keyboard option:selected").hasClass("en")) {
$("#sel_keyboard").val("qwerty").change();
}
if (lang == "ru" && ! $("#sel_keyboard option:selected").hasClass("ru")) {
$("#sel_keyboard").val("rus_win").change();
}
$("#sel_keyboard option").hide();
$("#sel_keyboard ." + lang).show();
}
this.initKeyboard = function() {
var keyboard = $("#sel_keyboard").val();
$("div.keyboard").hide();
$("#kb_" + keyboard).show();
if (keyboard == "dzen") {
$("#show_color").hide();
} else {
$("#show_color").show();
}
}
this.initColor = function() {
if ($("#show_color").get(0).checked) {
$("#keyboard div.block").removeClass("bw");
} else {
$("#keyboard div.block").addClass("bw");
}
}
}
$(function() {
var klava = new Klava();
$("#sel_reload").click(function() {
klava.softInit();
});
if ($.cookie("klavarog_language"))
$("#sel_language").val($.cookie("klavarog_language"));
$("#sel_language").change(function() {
var language = $(this).val();
$.cookie("klavarog_language", language, {expires: 100});
klava.initLanguage();
$("#input_text").focus();
});
klava.initLanguage();
if ($.cookie("klavarog_keyboard"))
$("#sel_keyboard").val($.cookie("klavarog_keyboard"));
$("#sel_keyboard").change(function() {
var keyboard = $(this).val();
$.cookie("klavarog_keyboard", keyboard, {expires: 100});
klava.initKeyboard();
$("#input_text").focus();
});
klava.initKeyboard();
if ($.cookie("klavarog_color"))
$("#show_color").get(0).checked = ($.cookie("klavarog_color") != "false");
$("#show_color").change(function() {
$.cookie("klavarog_color", $(this).get(0).checked, {expires: 100});
klava.initColor();
$("#input_text").focus();
}).click(function() {
$(this).change();
});
klava.initColor();
$("div.mac_enter").css({position: "absolute", marginLeft: ($.browser.opera ? 489 : 0), zIndex: -2, display: "inline", height: 56});
$("#input_text").keyup(function(event) {
if (klava.reset_timer) {
window.clearTimeout(klava.reset_timer);
}
klava.reset_timer = window.setTimeout(function() {
$("#input_text").val("").keyup();
}, 15000);
if (klava.time_start == null) {
klava.time_start = new Date();
}
var input = $(this).val();
if (event.which == 13) {
input = input + "¶";
$(this).val(input);
}
if (input == "") {
klava.time_start = null;
klava.count_error = 0;
}
if (klava.mode == "dict") {
var is_not_error = false;
for (var i = 0; i < klava.maxLinesDict; i ++) {
if (klava.lines[i].text.substring(0, input.length) == input) {
is_not_error = true;
}
klava.showLines(klava.position);
}
$(this).toggleClass("error", ! is_not_error);
} else {
var top_line = klava.lines[0].text.replace(String.fromCharCode(160), " ");
var symbol = top_line.substring(klava.position, klava.position + 1).toLowerCase();
if (top_line.substring(0, input.length) != input.substring(0, top_line.length)) {
if ( ! $(this).hasClass("error")) {
klava.count_error ++;
if (symbol != " " && symbol != "¶") {
klava.error_symbols[symbol] = (klava.error_symbols[symbol] ? klava.error_symbols[symbol] + 7 : 7);
}
window.status = event.which;
$(this).addClass("error");
klava.showLines(klava.position);
}
} else if (top_line != "") {
if (klava.error_symbols[symbol] > 0 && klava.position < input.length) {
klava.error_symbols[symbol] = klava.error_symbols[symbol] - 1;
}
klava.position = input.length;
$(this).removeClass("error");
if (input.length >= top_line.length) {
$(this).val(input.substring(top_line.length));
var time_stop = new Date();
var time = (time_stop - klava.time_start) / 1000;
klava.sum_time += time;
klava.sum_length += top_line.length;
var speed = (input.length / time) * 60;
var errors = (klava.count_error / input.length) * 100;
klava.sum_error += klava.count_error;
klava.count_error = 0;
klava.position = 0;
klava.time_start = null;
klava.showStat(speed, errors);
klava.linesUp();
if (klava.lines.length < klava.maxLinesText) {
klava.setLines(klava.lines.length);
}
setInputWidth();
$(this).keyup();
} else {
klava.showLines(input.length);
}
}
}
}).keyup();
});
