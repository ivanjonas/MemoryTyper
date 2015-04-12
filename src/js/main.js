(function() {
    var text = $(".text").val(),
        output = $(".output");

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

    $(document).on("click", ".go", function(e) {
        e.preventDefault();
        $(e.target).hide();
        $(".text").toggle();
        output.focus();
    });
})();
