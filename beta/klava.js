function setInputWidth() {
    var width = $("#text1").width();
    $("#input_text").width(width < 700 ? 700 : width).focus();
}

function convertToHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function Klava() {
    this.sum_error = 0;
    this.count_error = 0;
    this.sum_time = 0;
    this.sum_length = 0;
    this.lines = [""];
    this.text = [""];
    this.error_symbols = [];
    this.reset_timer = null;
    this.time_start = null;
    this.position = 0;

    this.setLines = function(startIndex) {
        var rand = Math.floor(Math.random() * this.text.length);
        var str = this.text[rand];
        var index = startIndex;
        while (str.length > 0) {
            if (str.length > 80) {
                var line1_pos = str.substring(0, 81).lastIndexOf(" ");
                this.lines[index] = str.substring(0, line1_pos) + String.fromCharCode(160);
                str = str.substring(line1_pos + 1);
            } else {
                this.lines[index] = str + "¶";
                str = "";
            }
            //$("#text" + (index + 1)).html(convertToHtml(this.lines[i]));
            index ++;
        }
        if (this.lines.length < 3 && this.text.length > 1) {
            this.setLines(index);
        }
    }

    this.showLines = function(inputLen) {
        var error_symbols = [];
        for (var i in this.error_symbols) {
            error_symbols[i] = this.error_symbols[i];
        }
        for (var index = 0; index < 3; index ++) {
            var end = this.lines[index].substring(index == 0 ? inputLen : 0);
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
            $("#text" + (index + 1)).html((inputLen > 0 && index == 0 ? '<span class="printed">'+convertToHtml(this.lines[index].substring(0, inputLen))+'</span>' : "")+end_line);
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
            $("#text" + (i + 1)).html(convertToHtml(this.lines[i]));
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
        this.softInit();
    }

    this.softInit = function() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.time_start = null;
        this.count_error = 0;
        $("#input_text").val("").removeClass("error");
        this.lines = [""];
        this.setLines(0);
        this.position = 0;
        this.showLines(0);
        setInputWidth();
    }
}

$(function() {
    var klava = new Klava();

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
        var top_line = klava.lines[0].replace(String.fromCharCode(160), " ");
        var symbol = top_line.substring(klava.position, klava.position + 1).toLowerCase();
        if (top_line.substring(0, input.length) != input) {
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
                if (klava.lines.length < 3) {
                    klava.setLines(klava.lines.length);
                }
                $(this).val("");
                setInputWidth();
                $(this).keyup();
            } else {
                klava.showLines(input.length);
            }
        }
    }).keyup();

    $("#sel_reload").click(function() {
        klava.softInit();
    });

    $("#sel_keyboard").change(function() {
        var keyboard = $(this).val();
        $("div.keyboard").hide();
        if (keyboard == "qwerty") {
            $("#kb_qwerty").show();
        }
        if (keyboard == "dvorak") {
            $("#kb_dvorak").show();
        }
        if (keyboard == "jcuken") {
            $("#kb_jcuken").show();
        }
        $("#input_text").focus();
    }).change();

    $("#sel_language").change(function() {
        $.ajax({
            url: $(this).val() + ".txt",
            success: function(data) {
                klava.text = data.replace(/ {2,}/g, " ").replace(/^ /g, "").replace(/\r/g, "").replace(/\n\n/g,"\n").split("\n");
                klava.init();
            },
            error: function() {
                alert("Error");
            }
        });
        var lang = $(this).val().substring(0, 2);
        if (lang == "en") {
            $("#sel_keyboard").val("qwerty").change();
        }
        if (lang == "ru") {
            $("#sel_keyboard").val("jcuken").change();
        }
    }).change();
});
