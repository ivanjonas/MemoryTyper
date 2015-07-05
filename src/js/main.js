// polyfills
(function($) {
    $.fn.fixHeight = function() { // TODO namespace my own jQuery extensions
        if (this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false) {
            this.innerHeight(this.get(0).scrollHeight);
        }
        if (this.innerHeight() < 30) {
            this.innerHeight(30);
        }
    }
})(jQuery);

// main code
$(function() {
    var domText = $(".text"),
        text = domText.val(),
        output = $(".output"),
        timerDisplay = $(".timerDisplay");
    app.textsCrud.load();
    domText.fixHeight();
    output.focus();

    // parsing algorithm option 1
    $(document).on("keypress", ".output", function(e) {

        if (text.length === output.val().length) {
            //we're done processing new inputs.
            e.preventDefault();
            return;
        }

        var input = String.fromCharCode(e.keyCode);
        // any additional preprocessing or guard statements go here

        var target = text[output.val().length]; // the next element. TODO check for aioobe
        // TODO checks for settings to skip optional punctuation, casing, etcetera

        if (target === input) {
            if (output.val().length === 0) {
                // start the timer
                timerDisplay.text("timer running...")
                    .data("start", new Date());
            }
            if (text.length === output.val().length + 1) { // this character is the last one
                finish();
            }
            correctInput(input);
        } else {
            wrongInput(input);
            e.preventDefault();
        }
    });

    $(document).on("keydown", output, function(e) {
        var key = e.keyCode;
        if (key == 8 || key == 46) {
            //console.log("delete or backspace");
        }
    });

    function correctInput(input) {
        //console.log("correct: " + input);
        output.addClass("correct").removeClass("wrong");
    }

    function wrongInput(input) {
        //console.log("wrong:   " + input);
        output.addClass("wrong").removeClass("correct");
    }

    function finish() {
        var end = new Date(),
            duration = end - timerDisplay.data("start");
        timerDisplay.text("timer finished.")
            .data("end", end);

        // calculate wpm
        var wordcount = text.split(" ").length,
            wpm = Math.round((wordcount / duration * 100000 * 60)) / 100;


        $(".results").text(wordcount + " words in " + (duration / 1000) + " seconds. " + wpm + " words per minute.")
    }

    $(document).on("click", ".go", function(e) {
        e.preventDefault();
        $(e.target).hide();
        $(".text").toggle();
        output.focus();
    });

    $(document).on("change", ".text", function(e) {
        text = $(".text").val();
    });
});
