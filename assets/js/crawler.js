//chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//    console.log(response.farewell);
//});
var active = true;
var inputs = {};
var superData = {};
var userInputReceived;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('message received at crawler.js');
        console.log(request);
        if (request.command == "start"){
            crawl();
        }
        if (request.command == "deploy"){
            console.log('deploying from crawler listener');
            console.log('data given : ' + request.data);
            deploy(request.data);
        }
    });

var crawl = function()
{
    //var a = chrome.extension.getURL("assets/css/bootstrap.min.css");
    //$('<link rel="stylesheet" type="text/css" href="' + a + '" >').appendTo("head");
    monitorMouseoverInputs();
    monitorKeypresses();
    monitorInputs();
};

var returnInputs = function()
{
    if (!$.isEmptyObject(inputs)) {
        console.log('crawler tried to send a message');
        console.log(inputs);
        chrome.runtime.sendMessage({type: "site", data: inputs});
        console.log('----- > sent');
        inputs = {};
    }
};

var monitorKeypresses = function() {
    $(document).keypress(function (e) {
        console.log('key pressed');
        //save inputs with enter key
        if (e.keyCode == 13) {
            active = false;
            returnInputs();
            e.stopPropagation();
            stopKeypressMonitors();
            stopMonitorInputs();
            successMessage();
        }
        //stops the whole script with c button
        if (e.which == 99)
        {
            e.preventDefault();
            cancelledMessage("");
            stopMonitorInputs();
            stopKeypressMonitors();
            inputs = {};
        }
        //b cancels last input
        if (e.which == 98)
        {
            e.preventDefault();
            lastRemovedMessage("");
            delete inputs[Object.keys(inputs)[Object.keys(inputs).length-1]];
            //inputs[inputs.length-1] = null;
        }
    });
};

var successMessage = function()
{
    $('body').prepend('<div class="row"><div id="success-message-formgrabber" class="alert alert-success col-md-6 col-md-offset-3"><strong>POW!</strong> (stored) </div></div>');
    $('#success-message-formgrabber').attr('style', 'z-index:999999');
    setTimeout(function(){
        $('#success-message-formgrabber').remove();
    }, 2000);
};
var cancelledMessage = function(message)
{
    $('body').prepend('<div class="row"><div id="cancelled-message-formgrabber" class="alert alert-danger col-md-6 col-md-offset-3"><strong>' + (message == "" ? "Major non-pow!-al" : message) + '</strong></div></div>');
    $('#cancelled-message-formgrabber').attr('style', 'z-index:999999');
    setTimeout(function(){
        $('#cancelled-message-formgrabber').remove();
    }, 2000);
};
var lastRemovedMessage = function(message)
{
    $('body').prepend('<div class="row"><div id="mistake-message-formgrabber" class="alert alert-info col-md-6 col-md-offset-3"><strong>' + (message == "" ? "Un-</strong>pow!" : message + "</strong>") + '</div></div>');
    $('#mistake-message-formgrabber').attr('style', 'z-index:999999');
    setTimeout(function(){
        $('#mistake-message-formgrabber').remove();
    }, 2000);
}

var monitorInputs = function()
{
    //on an input click, add the input data to your 'data'
    $('body').click(function(event){
        if(active) {
            var name = $(event.target).name ? $(event.target).name : $(event.target).text();
            var value = $(event.target).text();
            var inputsLength = inputs.length;
            inputs[name] = value;
        }
        else {
            returnInputs();
        }
    });
}

var monitorMouseoverInputs = function()
{
    $("body")
        .mouseover(function (event) {
            //$(event.target).addClass('hover-element');
            $(event.target).css('background-color', '#FFC400');
            setTimeout(function(){
                $(event.target).css('background-color', '');
            }, 7000);
        })
        .mouseout(function (event) {
            $(event.target).css('background-color', '');
        })
        .click(function(event){
            $(event.target).css('background-color', '#45D147');
            setTimeout(function()
            {
                $(event.target).css('background-color', '');
            }, 500);
        });
}

var stopKeypressMonitors = function()
{
    //$(document).removeEventListener('keypress');
    $(document).unbind('keypress');
}

var stopMonitorInputs = function()
{
    //$('body').removeEventListener('click');
    $('body').trigger('mouseout');
    $('body').unbind('mouseover mouseout click');
    $('body *').unbind();
}

var checkIfEmpty = function(ad){
    for(var prop in ad) {
        if (ad.hasOwnProperty(prop)) {
            // handle prop as required
            return false;
        }
    }
    return true;
}

/** Deploy the information on to a new site forms*/
var deploy = function(data)
{
    console.log('data deployed : ');
    console.log(data);
    startInputFloat("click to place '" + data[Object.keys(data)[0]] + "'");
    userInputReceived = false;
    $('body *').unbind();
    $('body *').click(function(event){
        //$(event.target).text(data[Object.keys(data)[0]]);
        var currentText = $(event.target).val();
        $(event.target).val(currentText + "" + data[Object.keys(data)[0]]);
        //$(event.target).attr('value', data[Object.keys(data)[0]]);
        delete data[Object.keys(data)[0]];
        userInputReceived = true;
        $('body *').unbind();
        event.stopPropagation();
    });
    var clock = setInterval(function()
    {
        if(userInputReceived){
            stopFloat();
            if (data[Object.keys(data)[0]] !== undefined) {
                deploy(data);
            }
            else {
                startFinishedFloat();
                clearInterval(clock);
            }
        }
    }, 1000);
}


/*   Floating Div following cursor       */
var startInputFloat = function(message){
    startFloat(message, 'btn alert-info')
}
var startFloat = function(message, classText){
    //create div
    $('body').append('<div id="float">' + message + '</div>');
    //float it
    $(document).on('mousemove', function(e){
        $('#float').css({
            left:  e.pageX + 30,
            top:   e.pageY + 30
        });
        $('#float').css('z-index', 999999);
        $('#float').css('position', 'absolute');
        $('#float').addClass(classText);
    });
}

var startFinishedFloat = function()
{
    stopFloat();
    startFloat('All done <i class="fa fa-smile-o"></i>', 'btn btn-lg alert-success');
    setTimeout(stopFloat, 1500);
}

var stopFloat = function()
{
    $(document).unbind('mousemove');
    $('#float').removeClass();
    $('#float').remove();
}