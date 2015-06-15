/**
 * Created by connorimrie on 12/06/2015.
 */
var APP_ID = "dchkbanpgboppemgcafbdbefnanhimli";
var CLIENT_ID = "513090491024-s8atoku95h5e7plmtqqfldeuq9ovv0na.apps.googleusercontent.com";
var SCOPES = ["https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/chromewebstore.readonly"];
var currentLicense;
var GRACE_PERIOD_OFFLINE_HRS = 24;

function LicenseManager(){
    this.user = new User();
    this.licenseRefresh();
}

LicenseManager.prototype = {

    current: function()
    {
        return this.parseLicenseJSON(currentLicense);
    },

    /**
     * Method takes care of all pre-processing and refreshing cached copies to yield whether the license is acceptable
     * @returns {boolean} - final verdict on whether the license is active or not
     */
    licenseRefresh: function(){
        var cachedOn = localStorage.getItem('formgrabber-license-checked');
        var license = JSON.parse(localStorage.getItem('formgrabber-license'));
        currentLicense = license;
        this.isActive(license,cachedOn);
    },

    //handle response of an API call (license) and determine if the user has access (caching etc)
    isActive: function(license, cachedOn){
        console.log("Time since cached: " + (Date.now()-cachedOn)/1000);
        timeSince = (Math.abs((Date.now()-cachedOn)/(1000)));
        if(timeSince > license.maxAgeSecs){
            if(!this.parseLicenseJSON(license)){
                //only refresh if invalid license otherwise use grace
                console.log('refreshing cache license');
                this.checkWithGoogle();
            }
            console.log('hours since cached: ' + timeSince/(60*60));
            if(timeSince/(60*60) > GRACE_PERIOD_OFFLINE_HRS){
                console.log('refreshing cache license');
                this.checkWithGoogle();
            }
        }
        else {
            console.log('doing someting else');
            console.log(license);
            if(this.parseLicenseJSON(license)){
                currentLicense = license;
            }
        }
    },

    parseLicenseJSON: function(license){
        if(license == undefined){
            return false;
        }
        if(license.result && (license.accessLevel == "FULL" || license.accessLevel == "FREE_TRIAL")){
            return true;
        }
        else {
            return false;
        }
    },

    //make an API call to retrieve user license
    checkWithGoogle: function()
    {
        var user = this.user;
        user.obtainId();
        $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/chromewebstore/v1.1/userlicenses/" + APP_ID,
            data: {
                client_id: CLIENT_ID,
                access_token:user.token()
            },
            contentType: "application/json",
            success: function(response){
                console.log(response);
                localStorage.setItem("formgrabber-license", JSON.stringify(response));
                localStorage.setItem("formgrabber-license-checked", JSON.stringify(Date.now()));
                currentLicense = response;
            },
            error: function(response){
                console.log('Could not obtain license information. This may be an issue with your internet connection, firewall or Google\'s servers. Please try again later');
            }
        });
    }
};