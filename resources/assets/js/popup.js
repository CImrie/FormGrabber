var Vue = require('vue');

/*--- Components ---*/
var guide = require('./vue/components/guide.vue');
var siteList = require('./vue/components/site-list.vue');
var listeningPost = require('./vue/components/listening-post.vue');
/*--- End Components ---*/

var listenerVue = Vue.extend(listeningPost);
var vm = new listenerVue({
    el: 'body',
    components: {
        "fg-guide" : guide,
        "fg-sites" : siteList,
        "fg-listening-post" : listeningPost
    },
    data: function(){
        return {
            sites: JSON.parse(localStorage.getItem('formgrabber-sites'))
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
        console.log(this.sites[0]);
    },
    events: {
        'trash-clicked': function(index){
            this.removeSite(index);
        },
        'lock-toggled' : function(index){
            this.$emit('send', 'toggle-lock-site', index);
        }
    }
});