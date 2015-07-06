/**
 * Created by Yvonne on 2015-07-05.
 */
var app = app || {};
app.typingMechanics1 = {
    textObj: undefined,
    output: $(".output"),
    timerDisplay: $(".timerDisplay"),

    keyboardInput: function(event) {
        var tm = app.typingMechanics1,
            text = tm.textObj.text;
        var currentOutputLength = tm.output.val().length;
        if (text.length === currentOutputLength) {
            //we're done processing new inputs.
            event.preventDefault();
            return;
        }

        var input = String.fromCharCode(event.keyCode);
        // any additional preprocessing or guard statements go here

        var target = text[currentOutputLength]; // the next element. TODO check for aioobe
        // TODO checks for settings to skip optional punctuation, casing, etcetera

        if (target === input) {
            if (currentOutputLength === 0) {
                // start the timer
                tm.timerDisplay.text("timer running...")
                    .data("start", new Date());
            }
            if (text.length === currentOutputLength + 1) { // this character is the last one
                app.typingMechanics1.finish();
            }
            app.typingMechanics1.inputWasCorrect(input);
        } else {
            app.typingMechanics1.inputWasWrong(input);
            event.preventDefault();
        }
    },
    inputWasCorrect: function(input) {
        //console.log("correct: " + input);
        app.typingMechanics1.output.addClass("correct").removeClass("wrong");
    },
    inputWasWrong: function(input) {
        //console.log("wrong:   " + input);
        app.typingMechanics1.output.addClass("wrong").removeClass("correct");
    },
    finish: function() {
        var end = new Date(),
            duration = end - app.typingMechanics1.timerDisplay.data("start");
        app.typingMechanics1.timerDisplay.text("timer finished.")
            .data("end", end);

        // calculate wpm
        var wordCount = text.split(" ").length,
            wpm = Math.round((wordCount / duration * 100000 * 60)) / 100;

        $(".results").text(wordCount + " words in " + (duration / 1000) + " seconds. " + wpm + " words per minute.")
    }
};

app.typingMechanics1.output
    .on("keypress", app.typingMechanics1.keyboardInput)
    .on("keydown", function(e) {
        var key = e.keyCode;
        if (key == 8 || key == 46) {
            //console.log("delete or backspace");
        }
    });
