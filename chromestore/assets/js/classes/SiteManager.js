/**
 * SiteManager class - stores all sites locally/sync'd with cloud
 * @param _sites {object} - the sites given (optional)
 * @constructor
 */

function SiteManager(){
    this._sites = {};
    this._ready = false;
    this._sites = this.loadSites();
    this._ready = true;
    return this;
}

SiteManager.prototype = {

    loadSites: function(){
        var jsonParsed = JSON.parse(localStorage.getItem('formgrabber-sites'));
        sites = {};
        for(var key in jsonParsed){
            sites[key] = new Site(jsonParsed[key]);
        }
        return sites;
    },

    save : function(){
        console.log('saving sites');
        var siteArray = {};
        for (var siteKey in this._sites){
            siteArray[siteKey] = this._sites[siteKey].toObject();
        }
        var json = JSON.stringify(siteArray);
        var sites = {"formgrabber-sites": json};
        //chrome.storage.local.set(sites);
        localStorage.setItem('formgrabber-sites', json);
        return this;
    },

    sites: function(){
        return this._sites;
    },

    site: function(key){
        return this._sites[key];
    },

    updateSite: function(key, updatedSite){
        this._sites[key] = updatedSite;
        this.save();
        return this;
    },

    addSite: function(site){
        console.log('adding site');
        console.log(site);
        this._sites[Object.keys(this._sites).length] = site;
        console.log(this._sites);
        this.save();
        console.log('now saved');
        console.log(this.sites());
        return this;
    },

    removeSite : function(key){
        if(!this._sites[key].locked){
            delete this._sites[key];
            this.save();
        }
        return this;
    },

    clearSites : function(){
        //delete this._sites;
        this._sites = {};
        this.save();
        return this;
    },

    indexOf: function(site){
        for(var index in this._sites)
        {
           if(this._sites[index] == site){
               return index;
           };
        };
    },

    deploy: function(site){
        if(!site.locked){
            delete this._sites[this.indexOf(site)];
        }
        this.save();
        return this;
    }
};