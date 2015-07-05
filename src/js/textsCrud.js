var app = app || {};
app.textsCrud = {
    loadText: function(textObj) {
        $(".text").text(textObj.text).fixHeight();
        $(".go").removeAttr("disabled").show();
    },
    load: function() {
        /**
         * populate the list with Texts. Runs once on page load.
         */
        var texts = JSON.parse(window.localStorage.getItem("texts")); // an array of textObjects
        var userTexts = $("#user-texts ul").empty(); // DOM el
        if (texts === undefined) { return; }
        texts.forEach(function(el, idx, arr) {
            var li = $("<li>");
            li.html(el.title); // TODO use a template to fill in a complex DOM object with the complex data in each el
            li.data("text", el.text);
            li.data("id", el.id);
            userTexts.append(li);
            li.on("click", function() {app.textsCrud.loadText(el);});
        });
    },
    create: function(textObj) {

    },
    delete: function(textObj) {
        var nexTexts = window.localStorage.getItem("texts").filter(function(el, idx, arr) {
            return el.id !== textObj.id;
        });
        Storage.setItem("texts", JSON.stringify(nexTexts));
    }
};
