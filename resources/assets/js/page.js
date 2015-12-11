var Vue = require('vue');

var listeningPost = require('./vue/components/listening-post.vue');
var listenerVue = Vue.extend(listeningPost);
var alertsContainer = require('./vue/components/alerts-container.vue');
var float = require('./vue/components/float.vue');

new listenerVue({

    el: 'body',

    components: {
        "fg-alerts-container" : alertsContainer,
        "fg-float": float
    },

    props: {
        chunks: {
            type: Array,
            default: function(){
                return [];
            }
        }
    },

    methods: {
        site: function(){
            return {
                url: window.location.href,
                added: Date.now(),
                data: this.chunks,
                locked: false
            }
        },
        hideFloat: function(message){
            this.$broadcast('hide-float', message);
        },
        showFloat: function(message){
            this.$broadcast('show-float', message);
        }
    },

    data: function(){
        return {
            crawler: {},
            alerts: [],
            floatMessage: ""
        }
    },

    ready: function(){
        console.log('vue-ready');
        this.crawler = new Crawler(this, ['#fg-alerts-container', '.fg-alert', '.fg-alert *']);

        var body = this.$el;
        /* --- Alerts Region at right-hand side --- */
        var element = $(body).append('<fg-alerts-container :alerts="alerts"></fg-alerts-container>');
        this.$compile(element.get(0));

        /* --- Floating Window that follows mouse --- */
        var floatElement = $(body).append('<fg-float></fg-float>');
        this.$compile(floatElement.get(0));
    },

    events: {
        'grab': function(){
            console.log('grab received on page');
            this.crawler.grab();
        },

        'grabbed-one': function(data){
            if(this.chunks.push(data)){
                this.$emit('alert-success', 'Copied', ""+data.substring(0, 40)+"...");
            }
        },

        'crawler-grab-complete': function(e){
            console.log('crawler grab completed');
            this.$emit('send', 'grab-complete', this.site());
            this.alerts = []; //clear all alerts
            this.chunks = []; //reset data
            this.$emit('alert-success', 'Success', 'You can now use the copied data via the extension.' );
        },

        'crawler-grab-cancelled': function(e){
            this.$emit('send', 'grab-cancelled', {});
            this.alerts = [];
            this.chunks = [];
            var self = this;
            this.$emit('alert-error', 'Cancelled', 'You cancelled the script. Start over via the extension or click below.', {text: "Start Over", onClick: function(e){
                self.alerts = [];
                e.stopImmediatePropagation();
                self.$dispatch('grab');
            }});
        },

        'crawler-deploy-cancelled': function(e){
            this.alerts = [];
            this.hideFloat();
            this.$emit('alert-error', 'Cancelled', 'You cancelled the script. To re-attempt pasting, go to the extension window.');
        },

        'deploy-site': function(site){
            console.log('deploying site');
            this.crawler.paste(site);
        },

        'alert-success': function(heading, body, button){
            this.alerts.push({type: "success", heading: heading, body: body, button: button})
        },

        'alert-warning': function(heading, body, button){
            this.alerts.push({type: "warning", heading: heading, body: body, button: button});
        },

        'alert-error': function(heading, body, button){
            this.alerts.push({type: "error", heading: heading, body: body, button: button});
        }
    }
});