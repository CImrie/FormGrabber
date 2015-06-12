chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log('message');
        console.log(request.data);
        if(request.type == "site")
        {
            chrome.tabs.query({active:true, currentWindow:true},function(tabs){
                addSite(tabs[0].url, Date.now(), request.data);
                chrome.extension.sendMessage({type:"command", command:"refresh"});
            });
        }
    }
);

var sendRefreshSignal = function()
{
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
        chrome.extension.sendMessage({type:"command", command:"refresh"});
    });
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
        switch(request.type){
            case "command":
                if(request.command == "clear-all"){
                    clearSites();
                    sendRefreshSignal();
                }
                if(request.command == "toggle-lock"){
                    toggleLock(request.data);
                    sendRefreshSignal();
                }
                if(request.command == "delete-site"){
                    removeSite(request.data);
                    sendRefreshSignal();
                }
                if(request.command == "use-site"){
                    deploySite(request.data);
                    sendRefreshSignal();
                }
            break;
        }
    }
)

var addSite = function(url, time_added, data){
    var currentlyStored = getCurrentSites();
    var length = 0;
    if(!$.isEmptyObject(currentlyStored)){
        length = Object.keys(currentlyStored).length;
    }
    else {
        currentlyStored = {};
    }
    currentlyStored[length] = {locked:false, "url":url , "added":time_added, "data":data};
    console.log('stored in localstorage : :');
    console.log(currentlyStored[length]);
    setSites(currentlyStored);
    return true;
};
var toggleLock = function(id)
{
    var currentSites = getCurrentSites();
    console.log('current lock: ' + currentSites[id].locked);
    if(currentSites[id].locked + "" == "true"){
        currentSites[id].locked = false;
    }
    else {
        currentSites[id].locked = true;
    }
    setSites(currentSites);
    console.log('site toggled to: ' + currentSites[id].locked);
    console.log('site in storage toggled to: ' + getCurrentSites()[id].locked);
    return true;
};

var removeSite = function(site)
{
    var currentSites = getCurrentSites();
    if(!isSiteLocked(site)){
        delete currentSites[site];
    }
    setSites(currentSites);
    console.log('site removed');
    return true;
};
var clearSites = function()
{
    var currentSites = getCurrentSites();
    for(var site in currentSites){
        if(!currentSites[site]['locked']){
            removeSite(site);
        }
    }
    return true;
};

var getCurrentSites = function()
{
    return JSON.parse(localStorage.getItem('sites'));
}

var setSites = function(sites)
{
    var json = JSON.stringify(sites);
    localStorage.setItem('sites', json);
    return true;
}

var isSiteLocked = function(site){
    var currentSites = getCurrentSites();
    return currentSites[site]['locked'];
}

var deploySite = function(site)
{
    var currentSites = getCurrentSites();
    var data = currentSites[site].data;
    console.log('deploying crawler');
    console.log(data);
    deployCrawler(data);
    console.log('crawler successful, removing site');
    if(!isSiteLocked(site)){
        removeSite(site);
    }
}

var deployCrawler = function(siteData){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:"command", command: "deploy", data:siteData});
    });
    console.log('------');
    //chrome.runtime.sendMessage({type:"command", command:"deploy", data:siteData});
    //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, {type:"command", command:"deploy", data:siteData});
    //});
    console.log('tried to deploy site');
}