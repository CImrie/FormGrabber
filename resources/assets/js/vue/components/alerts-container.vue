<template>
    <div id="fg-alerts-container">
        <fg-alert v-for="alert in alerts" :type="alert.type" :message="alert.body" :heading="alert.heading"></fg-alert>
    </div>
</template>

<style scoped>
    #fg-alerts-container {
        z-index:9999999;
        position:fixed;
        height: 100%;
        min-width:300px;
        width:22%;
        right:0;
        bottom:0;
        top:0;
        /*background-color:grey;*/
        pointer-events: none;
        display: flex;
        flex-direction: column-reverse;
    }
</style>

<script>
    var alert = require('./corner-alert.vue');
    module.exports = {
        props: {
            alerts: {
                type: Array,
                default: function(){
                    return [];
                }
            }
        },
        components: {
            "fg-alert" : alert
        }
    }
</script>