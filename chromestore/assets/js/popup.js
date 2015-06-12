/**
 * Created by connorimrie on 10/06/2015.
 */
//chrome.tabs.insertCSS(null, {file:"assets/css/bootstrap.min.css"});
var sites;
var port = chrome.runtime.connect({name:"background"});
port.onMessage.addListener(function(msg) {
    console.log(msg);
    switch(msg.type){
        case "sites":
            switch(msg.sites){
                case "sites":
                    //update sites
                    alert('got sites');
                    console.log(msg.sites);
                    sites = msg.sites;
                break;
            }
        break;
    }
});

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
   }
});

$(document).ready(function(){
    if(summaryCheckLicense()){
        go();
        monitorButtons();
        $('#grab').click(function()
        {
            chrome.tabs.insertCSS(null, {file:"assets/css/bootstrap.min.css"});
            startCrawl();
            window.close();
        });
    }
    else {
        unlicensedGo();
    }
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
    var stored = JSON.parse(localStorage.getItem('sites'));
    console.log(stored);
    for (var key in stored) {
        //build up accordian table for this element
        var accRows = "";
        for(var input in stored[key]['data']){
            accRows+='<tr><td>"'+ input +'"</td></tr>';
        }
        //build up whole table now
        console.log(key);
        $('#sites-tbody > tr:last').after(
        '<tr data-toggle="collapse" data-target="#accordian-' + key + '" class="accordion-toggle">' +
            "<td>" + "<span id='"+key+"' class='lock-button btn btn-sm btn-default'>" + (stored[key].locked ? "<i id='"+key+"' class='fa fa-lock'></i>" : "<i id='"+key+"' class='fa fa-unlock-alt'></i>") + "</span>" /*+ stored[key].locked */+ "</td>" +
            "<td class='url-entry'>" + stored[key]['url'] + "</td>" +
            "<td>" + moment(stored[key]['added']).fromNow() + "</td>" +
            "<td>" + '<span id="' + key + '" class="use-button btn btn-xs btn-default fa fa-download"</span>' + "</td>" +
            "<td>" + '<span id="' + key + '" class="delete-button btn btn-xs btn-danger fa fa-remove"></span>' + "</td>" +
        "</tr>" +
        //hidden accordian row
        '<tr>' +
            '<td colspan="12" style="height:0px;">' +
                '<div class="accordian-body collapse col-md-6 col-md-offset-3" id="accordian-' + key + '">' +
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
};

var ungo = function(){
    $('#sites tbody > *:not(.do-not-remove)').empty();
}

var getSites = function()
{
    port.postMessage({type:"command", command:"get-sites"});
}


/** Message passing ----- */
var startCrawl = function()
{
    console.log('trying to send start signal from popup to crawler');
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
    console.log('sent command to toggle lock on ' + key);
}

var deleteSite = function(key){
    chrome.extension.sendMessage({type:"command", command:"delete-site", data:key});
    console.log('sent command to delete site ' + key);
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
    chrome.extension.sendMessage({type:"command", command:"use-site", data:site});
    window.close();
}


//Licensing ------------------  ---                 ----------------

var appId = "dchkbanpgboppemgcafbdbefnanhimli";
var TRIAL_PERIOD_DAYS = 30;

var getLicenseAndProcess = function()
{
    var currentUser = chrome.identity.getAuthToken();

    var CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/' + appId;
    var req = new XMLHttpRequest();
    req.open('GET', CWS_LICENSE_API_URL + chrome.runtime.id);
    req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            var license = JSON.parse(req.responseText);
            verifyAndSaveLicense(license);
        }
    }
    req.send();
};

var verifyAndSaveLicense = function(license)
{
    /*
     {
     "kind": "chromewebstore#license",
     "itemId": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
     "createdTime": "1377660091254",
     "result": true,
     "accessLevel": "FULL",
     "maxAgeSecs": "2052"
     }
     */

    if(license.result){
        chrome.storage.sync.set({'formgrabber-license-expiry':(moment().add(license.maxAgeSecs, 'seconds'))});
        chrome.storage.sync.set({'formgrabber-license-key':license.itemId});
    }
}

var checkLocalLicenseActive = function()
{
    var expiryDate = chrome.storage.sync.get('formgrabber-license-expiry', function()
    {
        if(chrome.runtime.lastError)
        {
            //if there is an error, check for local version
            chrome.storage.local.get('formgrabber-license-expiry'), function(date){
               if(chrome.runtime.lastError){
                   //return false, no active license
                   return false;
               }
                else {
                   //grace period of 7 days before requiring internet
                   if(moment(date).add(7, 'days') > moment()){
                       return true;
                   }
                   //otherwise inactive
                   else {
                       return false;
                   }
               }
            };
        }
    });
    var now = moment();
    if(now > expiryDate){
        return false;
    }
    return true;
}

var checkAccessLevel = function(license)
{
    var licenseStatus;
    if (license.result && license.accessLevel == "FULL") {
        console.log("Fully paid & properly licensed.");
        licenseStatus = "FULL";
    } else if (license.result && license.accessLevel == "FREE_TRIAL") {
        var daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
        daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
        if (daysAgoLicenseIssued <= TRIAL_PERIOD_DAYS) {
            console.log("Free trial, still within trial period");
            licenseStatus = "FREE_TRIAL";
        } else {
            console.log("Free trial, trial period expired.");
            licenseStatus = "FREE_TRIAL_EXPIRED";
        }
    } else {
        console.log("No license ever issued.");
        licenseStatus = "NONE";
    }
    chrome.sync.set({'formgrabber-license-type':licenseStatus});
    return licenseStatus;
}

var summaryCheckLicense = function()
{
    if(checkLocalLicenseActive()){
        return true;
    }
    else {
        getLicenseAndProcess();
        return checkLocalLicenseActive();
    }
    return false;
}

var unlicensedGo = function()
{
    $('#body-container').empty();
    $('#body-container').append('<span class="alert alert-danger">').text("Your license is inactive. Please make payment.");
}