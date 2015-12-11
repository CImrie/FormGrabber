var Vue = require('vue');
Vue.config.debug = true;
/*--- Components ---*/
var guide = require('./vue/components/guide.vue');
var siteList = require('./vue/components/site-list.vue');
var listeningPost = require('./vue/components/listening-post.vue');
var dropdownButton = require('./vue/components/dropdown-button.vue');
/*--- End Components ---*/

var listenerVue = Vue.extend(listeningPost);
var vm = new listenerVue({
    el: 'body',
    components: {
        "fg-guide" : guide,
        "fg-sites" : siteList,
        "fg-listening-post" : listeningPost,
        "fg-dropdown-button": dropdownButton
    },
    data: function(){
        return {
            sites: JSON.parse(localStorage.getItem('formgrabber-sites')),
            validLicense: false
        }
    },
    methods: {
        grab: function(){
            this.$emit('send','grab');
            window.close();
        },
        removeSite: function(index){
            this.$emit('send', 'remove-site', index);
        }
    },
    ready: function(){
        this.isExtension = true;
        //check for license
        this.$emit('send', 'license-check');
    },
    events: {
        'trash-clicked': function(index){
            this.removeSite(index);
        },
        'lock-toggled' : function(index){
            this.$emit('send', 'toggle-lock-site', index);
        },
        'license-checked' : function(valid){
            if(valid){
                this.validLicense = true;
            }
        },
        'use-site' : function(site){
            this.$emit('send', 'deploy-site', site);
            window.close();
        }
    }
});