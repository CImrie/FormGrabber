var Vue = require('vue');
Vue.config.debug = true;
/*--- Components ---*/
var guide = require('./vue/components/guide.vue');
var siteList = require('./vue/components/site-list.vue');
var listeningPost = require('./vue/components/listening-post.vue');
var dropdownButton = require('./vue/components/dropdown-button.vue');
var modal = require('./vue/components/modal.vue');
/*--- End Components ---*/
//
var about = "This extension was developed by Random State Ltd. If you have any Feedback or Concerns/Issues please report them to support@randomstate.co.uk ";
//

var listenerVue = Vue.extend(listeningPost);
var vm = new listenerVue({
    el: 'body',
    components: {
        "fg-guide" : guide,
        "fg-sites" : siteList,
        "fg-listening-post" : listeningPost,
        "fg-dropdown-button": dropdownButton,
        "fg-modal" : modal
    },
    data: function(){
        return {
            sites: JSON.parse(localStorage.getItem('formgrabber-sites')),
            validLicense: true,
            dropdownItems: [
                "<div v-on:dblclick='this.$dispatch(\"trash-all-clicked\")'>Forget All</div>",
                "<div v-on:click='displayModal(\"" + about + "\")'>About</div>"
            ]
        }
    },
    methods: {
        grab: function(){
            this.$emit('send','grab');
            window.close();
        },
        removeSite: function(index){
            this.$emit('send', 'remove-site', index);
        },
        toggleInstructions: function(){
            this.$broadcast('toggle-instructions');
        }
    },
    ready: function(){
        this.isExtension = true;
        //check for license
        // this.$emit('send', 'license-check');
    //    No longer checking as the extension is free.
    },
    events: {
        'trash-clicked': function(index){
            this.removeSite(index);
        },
        'trash-all-clicked': function(){
            window.close();
            this.$emit('send', 'remove-all');
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