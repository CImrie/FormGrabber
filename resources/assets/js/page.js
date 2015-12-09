var Vue = require('vue');

var listeningPost = require('./vue/components/listening-post.vue');
var listenerVue = Vue.extend(listeningPost);
var alertsContainer = require('./vue/components/alerts-container.vue');

new listenerVue({

    el: 'body',

    components: {
        "fg-alerts-container" : alertsContainer
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
        }
    },

    data: function(){
        return {
            crawler: {},
            alerts: []
        }
    },

    ready: function(){
        console.log('vue-ready');
        this.crawler = new Crawler(this, ['#fg-alerts-container', '.fg-alert', '.fg-alert *']);

        var body = this.$el;
        var element = $(body).append('<fg-alerts-container :alerts="alerts"></fg-alerts-container>');
        this.$compile(element.get(0));
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

        'grab-complete': function(e){
            this.$emit('send', 'grab-complete', this.site());
            console.log('grab-complete sent to listeners');
            this.alerts = []; //clear all alerts
            this.chunks = []; //reset data
            this.$emit('alert-success', 'Success', 'You can now use the copied data via the extension' );
        },

        'grab-cancelled': function(e){
            //this.$emit('send', 'grab-cancelled', {});
            this.alerts = [];
            this.chunks = [];
            this.$emit('alert-error', 'Cancelled', 'You cancelled the script. Start over via the extension if you want to begin again');
        },

        'alert-success': function(heading, body){
            this.alerts.push({type: "success", heading: heading, body: body})
        },

        'alert-warning': function(heading, body){
            this.alerts.push({type: "warning", heading: heading, body: body});//"<strong>Removed the item </strong><small><em>\"" + data + "\"</em></small><strong> from the list</strong>"});
        },

        'alert-error': function(heading, body){
            this.alerts.push({type: "error", heading: heading, body: body});
        }
    }
});