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
        }
    },
    events: {
        'grab-complete': function(site){
            //Using arrays in v2.0.0 instead of objects. To prevent loss of data we convert the old object to an array
            if(Object.prototype.toString.call( this.sites ) != '[object Array]'){
                console.log('not an array - converting');
                var self = this;
                this.sites = Object.keys(self.sites).map(function(k) { return self.sites[k] });
            }

            this.sites.push(site);
            this.save();
            //localStorage.setItem('formgrabber-sites', JSON.stringify(this.sites));
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
        }
    }
});