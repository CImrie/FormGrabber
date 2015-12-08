var active = true;
var inputs = {};
//var superData = {};
var userInputReceived;
var mouseX;
var mouseY;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log('message received at crawler.js');
        //console.log(request);
        if (request.command == "start"){
            crawl();
        }
        if (request.command == "deploy"){
            //console.log('deploying from crawler listener');
            //console.log('data given : ' + request.data);
            deploy(request.data);
        }
    });

var crawl = function()
{
    inputs = {};
    active = true;
    monitorMouseoverInputs();
    monitorKeypresses();
    monitorInputs();
};

var returnInputs = function()
{
    if (!$.isEmptyObject(inputs)) {
        chrome.runtime.sendMessage({type: "site", data: inputs});
        inputs = {};
    }
};

var monitorKeypresses = function() {
    $(document).keypress(function (e) {
        console.log('key pressed');
        //save inputs with enter key
        if (e.keyCode == 13) {
            console.log('input terminated (pressed ENTER)');
            active = false;
            returnInputs();
            e.preventDefault();
            stopKeypressMonitors();
            stopMonitorInputs();
            successMessage();
        }
        //stops the whole script with c button
        if (e.which == 99)
        {
            e.preventDefault();
            cancelledMessage();
            stopMonitorInputs();
            stopKeypressMonitors();
            inputs = {};
        }
        //b cancels last input
        if (e.which == 98)
        {
            e.preventDefault();
            lastRemovedMessage();
            delete inputs[Object.keys(inputs)[Object.keys(inputs).length-1]];
        }
    });
};

var successMessage = function()
{
    var success = new Message('body', 'success-message-formgrabber','alert alert-success col-md-6 col-md-offset-3', '<strong>Everything stored</strong>')
        .show()
        .timeout(2000);
};
var cancelledMessage = function()
{
    var cancelled = new Message('body', 'cancelled-message-formgrabber','alert alert-danger col-md-6 col-md-offset-3', '<strong>Cancelled</strong> (full stop)')
        .show()
        .timeout(2000);
};
var lastRemovedMessage = function(message)
{
    var removed = new Message('body', 'mistake-message-formgrabber','alert alert-info col-md-6 col-md-offset-3', '<strong>Last click forgotten... please proceed</strong>')
        .show()
        .timeout(2000);
}

var monitorInputs = function()
{
    //on an input click, add the input data to your 'data'
    $('body').click(function(event){
        if(active) {
            var value = $(event.target).text();
            if(event.target.nodeName.toLowerCase() === "input"){
                value = $(event.target).val();
            }
            var name = value;
            var inputsLength = inputs.length;
            inputs[name] = value;
            event.preventDefault();
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
    $(document).unbind('keypress');
}

var stopMonitorInputs = function()
{
    $('body').trigger('mouseout');
    $('body').unbind('mouseover mouseout click');
    $('body *').unbind();
}

/** Deploy the information on to a new site forms*/
var deploy = function(data)
{
    $(document).on('mousemove', function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    startInputFloat("click to place '" + data[Object.keys(data)[0]] + "'");
    userInputReceived = false;
    $('body *').unbind();
    $('body *').click(function(event){
        var currentText = $(event.target).val();
        $(event.target).val(currentText + "" + data[Object.keys(data)[0]]);
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
var startFloat = function(message, classText) {
    //create div
    $('body').append('<div id="float">' + message + '</div>');
    $('#float').css('z-index', 999999);
    $('#float').css('position', 'absolute');
    $('#float').addClass(classText);
    //float it
    $('#float').css({
        left: mouseX + 30,
        top: mouseY + 30
    });
    $(document).on('mousemove', function (e) {
        $('#float').css({
            left: e.pageX + 30,
            top: e.pageY + 30
        });
    });
};

var startFinishedFloat = function()
{
    stopFloat();
    startFloat('All done <span class="fa fa-smile-o"></span>', 'btn btn-lg alert-success');
    setTimeout(stopFloat, 1500);
}

var stopFloat = function()
{
    $(document).unbind('mousemove');
    $('#float').removeClass();
    $('#float').remove();
}