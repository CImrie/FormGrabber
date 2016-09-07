var Vue = require('vue');
Vue.use(require('vue-resource'));

/*--- Components ---*/
var listeningPost = require('./vue/components/listening-post.vue');
/*--- End Components ---*/

var listenerVue = Vue.extend(listeningPost);

/* -- Global variables -- */
var GRACE_PERIOD_OFFLINE_HRS = 48;
var CLIENT_ID = "513090491024-p62jb9kk6nb45aoq9crc7voq6i0kstmo.apps.googleusercontent.com";

var user = new User();


var vm = new listenerVue({
    el: 'body',
    components: {},
    data: function(){
        return {
            sites: [],
            userId: null,
            token: "",
            validLicense: false
        }
    },
    ready: function(){
        console.log(this.sites);
        this.isExtension = true;
        user.obtainToken();

        if( ! (localStorage.getItem('formgrabber-sites') === null )){
            console.log('getting sites');
            this.sites = JSON.parse(localStorage.getItem('formgrabber-sites'));
            console.log('checking if valid');
            if(! this.sites || this.sites == null){
                this.sites = [];
            }
        }
    },
    methods: {
        save: function(){
            localStorage.setItem('formgrabber-sites', JSON.stringify(this.sites));
        },
        indexOfSite: function(site){
            var index = this.sites.indexOf(site);
            if(index != -1){
                return index;
            }
            for(var key in this.sites){
                var current = this.sites[key];
                var matches =
                    current.added == site.added
                &&  current.locked == site.locked
                &&  current.url == site.url;
                if(matches){
                    return key;
                }
            }
            return -1;
        },
        obtainLicenseFromGoogle: function(token){
            var self = this;
            var requestData = {
                client_id: CLIENT_ID,
                access_token: token
            };

            this.$http.get("https://www.googleapis.com/chromewebstore/v1.1/userlicenses/" + chrome.runtime.id, requestData,
                function(license, status, request){
                    console.log('Successfully received license object from Google');
                    self.$emit('license-received', license);
                },
            {
                error: function(data, status, request){
                    console.log('Failed to gain access to the Google License API. Check you have not revoked access');
                    if(status === 401){
                        console.log('Retrying with request for new access token');
                        user.clearCachedToken();
                    }
                }
            })
        },
        isValidLicense: function(license){
            return (license.result && (license.accessLevel == "FULL" || license.accessLevel == "FREE_TRIAL"));
        }
    },
    events: {
        'grab-complete': function(site){
            //Using arrays in v2.0.0 instead of objects. To prevent loss of data we convert the old object to an array
            if(Object.keys(this.sites).length > 0){
                console.log('not an array - converting');
                var self = this;
                this.sites = Object.keys(self.sites).map(function(k) { return self.sites[k] });
            }
            console.log(this.sites);
            this.sites.push(site);
            this.save();
        },
        'remove-all': function(){
            var newSites = [];
            for(var key in this.sites){
                if(this.sites[key].locked){
                    newSites.push(this.sites[key]);
                }
            }
            this.sites = newSites;
            this.save();
        },
        'remove-site': function(index){
            if(index != -1){
                this.sites.splice(index, 1);
                this.save();
            }
        },
        'toggle-lock-site': function(index){
            this.sites[index].locked = ! this.sites[index].locked;
            this.save();
        },

        'use-site-complete': function(site){
            if(! site.locked){
                var index = this.indexOfSite(site);
                if(index != -1){
                    this.sites.splice(index,1);
                }
            }
            this.save();
        },

        /* --- License Events --- */
        'license-check': function(){
            this.$emit('send', 'license-checked', this.validLicense);
        },
        'license-received': function(license){
            this.validLicense = this.isValidLicense(license);
            this.$emit('send', 'license-checked', this.validLicense);

        },
        'user-token': function(token){
            this.token = token;
            this.$http.headers.common['Authorization'] = 'Bearer ' + token;
            this.obtainLicenseFromGoogle(token);
        }
    }
});