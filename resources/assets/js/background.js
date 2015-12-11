var Vue = require('vue');
Vue.use(require('vue-resource'));

/*--- Components ---*/
var listeningPost = require('./vue/components/listening-post.vue');
/*--- End Components ---*/

var listenerVue = Vue.extend(listeningPost);
var vm = new listenerVue({
    el: 'body',
    components: {},
    data: function(){
        return {
            license: JSON.parse(localStorage.getItem('formgrabber-license')),
            sites: JSON.parse(localStorage.getItem('formgrabber-sites'))
        }
    },
    ready: function(){
        console.log(this.sites);
        this.isExtension = true;
        //this.sites = [];
        //this.save();
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
        isLicenseCached: function(){

        }
    },
    events: {
        'grab-complete': function(site){
            console.log('background.js grab complete triggered');
            //Using arrays in v2.0.0 instead of objects. To prevent loss of data we convert the old object to an array
            if(Object.prototype.toString.call( this.sites ) != '[object Array]'){
                console.log('not an array - converting');
                var self = this;
                this.sites = Object.keys(self.sites).map(function(k) { return self.sites[k] });
            }

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
            console.log('use-site-complete detected in background');
            console.log(site);
            if(! site.locked){
                var index = this.indexOfSite(site);
                console.log(index);
                if(index != -1){
                    this.sites.splice(index,1);
                }
            }
            this.save();
        },

        /* --- License Events --- */
        'license-check': function(){
            console.log('checked');
            this.$emit('send', 'license-checked', true);
        }
    }
});