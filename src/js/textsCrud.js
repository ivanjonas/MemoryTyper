var app = app || {};
app.textsCrud = {
    texts: undefined,
    loadText: function(textObj) {
        app.typingMechanics1.textObj = textObj;
        $(".text").text(textObj.text).fixHeight();
        $(".go").removeAttr("disabled").show();
    },
    /**
     * populate the list with Texts. Runs once on page load.
     */
    load: function() {
        var tc = app.textsCrud;
        var userTexts = $("#user-texts").find("ul").empty(); // DOM el

        tc.texts = JSON.parse(window.localStorage.getItem("texts")); // an array of textObjects

        if (tc.texts === undefined) { return; }
        tc.texts.forEach(function(el, idx, arr) {
            var li = $("<li>");
            li.html(el.title); // TODO use a template to fill in a complex DOM object with the complex data in each el
            li.data("text", el.text);
            li.data("id", el.id);
            userTexts.append(li);
            li.on("click", function() {app.textsCrud.loadText(el);});
        });
    },
    saveText: function(textObj) {
        var tc = app.textsCrud;
        // do some validation first. Is this textObj already there? if so, update.
        tc.texts.push(textObj);
        localStorage.setItem("texts", JSON.stringify(tc.texts));
    },
    delete: function(textObj) {
        var nexTexts = window.localStorage.getItem("texts").filter(function(el, idx, arr) {
            return el.id !== textObj.id;
        });
        localStorage.setItem("texts", JSON.stringify(nexTexts));
    }
};
