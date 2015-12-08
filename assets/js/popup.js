/**
 * Created by connorimrie on 10/06/2015.
 */
//chrome.tabs.insertCSS(null, {file:"assets/css/bootstrap.min.css"});
var sites;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    var bkg = chrome.extension.getBackgroundPage();
    bkg.console.log('message received at popup');
    bkg.console.log(message);
   switch(message.type){
       case "command":
           if(message.command == "refresh"){
                //chrome.runtime.reload();
               refreshMe();
           };
       break;
       case "license-response":
           //console.log('license from bg');
           //console.log(message);
           if(message.valid){
               activeLicense = true;
           }
       break;
   }
});

$(document).ready(function(){
    go();
    monitorButtons();
    $('#grab').click(function()
    {
        chrome.tabs.insertCSS(null, {file:"assets/css/bootstrap.min.css"});
        startCrawl();
        window.close();
    });
});
//json format for a site:
/*
    "sites": {
        "1": {
            "url": "http...",
            "added": "23/07/2015 13:04",
            "locked": false,
            "data": {
                "first_name" : "Connor",
                "password" : "test"
                .
                .
                .
            }
        },

        "2": {


        },
        .
        .
        .
    }
 */
var go = function () {
    // chrome.extension.sendMessage({type:"license-check"}, function(response) {
    //     if (response.valid) {
    //         var stored = new SiteManager().sites();
    //         buildUpTable(stored);
    //     }else {
    //         unlicensedGo();
    //     }
    // });

    var stored = new SiteManager().sites();
    buildUpTable(stored);
    
};

var buildUpTable = function(stored){
    for (var site in stored) {
        //build up accordian table for this element
        var accRows = "";
        for(var input in stored[site]['data']){
            accRows+='<tr><td>"'+ input +'"</td></tr>';
        }
        //build up whole table now
        //console.log(site);
        $('#sites-tbody > tr:last').after(
            '<tr data-toggle="collapse" data-target="#accordian-' + site + '" class="accordion-toggle">' +
            "<td>" + "<span id='"+site+"' class='lock-button btn btn-sm btn-default'>" + (stored[site].locked ? "<i id='"+site+"' class='fa fa-lock'></i>" : "<i id='"+site+"' class='fa fa-unlock-alt'></i>") + "</span>" /*+ stored[key].locked */+ "</td>" +
            "<td class='url-entry'>" + stored[site]['url'] + "</td>" +
            "<td>" + moment(stored[site]['added']).fromNow() + "</td>" +
            "<td>" + '<span id="' + site + '" class="use-button btn btn-xs btn-default fa fa-download"</span>' + "</td>" +
            "<td>" + '<span id="' + site + '" class="delete-button btn btn-xs btn-danger fa fa-remove"></span>' + "</td>" +
            "</tr>" +
                //hidden accordian row
            '<tr>' +
            '<td colspan="12" style="height:0px;">' +
            '<div class="accordian-body collapse col-md-6 col-md-offset-3" id="accordian-' + site + '">' +
            '<table class="table table-striped">' +
            '<thead>' +
            '<tr><th>Data \'pieces\' stored</th></tr>' +
            '</thead>' +
            '<tbody>' +
            accRows +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</td>' +
            '</tr>'
        );
    }
}

var ungo = function(){
    $('#sites-tbody > *:not(.do-not-remove)').empty();
}

//var getSites = function()
//{
//    port.postMessage({type:"command", command:"get-sites"});
//}


/** Message passing ----- */
var startCrawl = function()
{
    //console.log('trying to send start signal from popup to crawler');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:"command", command: "start"});
    });
}

var refreshMe = function()
{
    //ungo then go
    ungo();
    go();
}

var toggleLock = function(key)
{
    chrome.extension.sendMessage({type:"command", command:"toggle-lock", data:key});
    //console.log('sent command to toggle lock on ' + key);
}

var deleteSite = function(key){
    chrome.extension.sendMessage({type:"command", command:"delete-site", data:key});
    //console.log('sent command to delete site ' + key);
}

var monitorButtons = function()
{
    $("table").on("click", ".lock-button", function(event){
        toggleLock($(event.target).attr('id'));
    });
    $("table").on("click", ".delete-button", function(event){
        deleteSite($(event.target).attr('id'));
    });
    $('#clear-all').click(function(event){
        bootbox.confirm("Are you sure you would like to forget all sites?", function(result) {
            if(result){
                clearAll();
            }
        });
    });
    $('table').on('click', '.use-button', function(event){
        useSite($(event.target).attr('id'));
    })
}

var clearAll = function()
{
    chrome.extension.sendMessage({type:"command", command:"clear-all"});
}

var useSite = function(site)
{
    chrome.tabs.insertCSS(null, {file:"assets/css/bootstrap.min.css"});
    chrome.tabs.insertCSS(null, {file:"assets/css/font-awesome.min.css"});
    chrome.extension.sendMessage({type:"command", command:"use-site", data:site});
    window.close();
}

var unlicensedGo = function()
{
    $('#body-container').empty();
    $('#body-container').append('<span class="alert alert-danger">').text("Your license is inactive. Please make payment.");
}
