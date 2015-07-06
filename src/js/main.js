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
    app.textsCrud.load();
    $(".text").fixHeight();
    $(".output").focus();

    $(document).on("click", ".go", function(e) {
        e.preventDefault();
        $(e.target).hide();
        $(".text").toggle();
        $(".output").focus();
    });

    //$(document).on("change", ".text", function(e) {
    //    text = $(".text").val();
    //}); TODO we want to prevent edits to the text outside a dedicated Edit modal
});
