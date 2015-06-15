var siteManager = new SiteManager();
var licenseManager = new LicenseManager();
var licenseActive = true;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.type == "site")
        {
            chrome.tabs.query({active:true, currentWindow:true},function(tabs){
                var site = new Site({url: tabs[0].url, added: Date.now(), data: request.data});
                console.log('adding in background.js');
                console.log(site);
                siteManager.addSite(site);
                sendRefreshSignal();
            });
        }
    }
);

var sendRefreshSignal = function()
{
    siteManager = new SiteManager();
    chrome.tabs.query({active:true, currentWindow:true},function(tabs){
        chrome.extension.sendMessage({type:"command", command:"refresh"});
    });
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
        switch(request.type){
            case "command":
                if(request.command == "clear-all"){
                    siteManager.clearSites();
                    sendRefreshSignal();
                }
                if(request.command == "toggle-lock"){
                    console.log('locking this site...');
                    console.log(siteManager.site(request.data));
                    console.log('----');
                    siteManager.site(request.data).toggleLock();
                    siteManager.save();
                    sendRefreshSignal();
                }
                if(request.command == "delete-site"){
                    siteManager.removeSite(request.data);
                    console.log(request.data);
                    sendRefreshSignal();
                }
                if(request.command == "use-site"){
                    deploySite(request.data);
                    sendRefreshSignal();
                }
            break;
            case "license-check":
                console.log("sending response: " + licenseManager.current());
                licenseManager.licenseRefresh();
                sendResponse({type:"license-response", valid: licenseManager.current()});
            break;
        }
    }
);

var deploySite = function(site)
{
    var site = siteManager.site(site);
    deployCrawler(site.data);
    siteManager.deploy(site);
}

var deployCrawler = function(siteData){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:"command", command: "deploy", data:siteData});
    });
}