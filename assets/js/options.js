chrome.extension.sendMessage({type:"license-check"}, function(response) {
    if (response) {
        $('#license').append("<pre>" + JSON.stringify(response) + "</pre>");
    }
});
