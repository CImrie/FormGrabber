<template>
    <fg-modal>
        <h2>Data Stored:</h2>
        <div class="well well-sm" v-for="data in site.data">
            {{{data}}}
        </div>
    </fg-modal>
</template>
<script>
    var modal = require('./modal.vue');

    module.exports = {
        components: {
            "fg-modal": modal
        },
        data: function(){
            return {
                site: {data: {}}
            }
        },
        events: {
            'show-site-modal': function(site){
                this.site = site;
                this.$broadcast('show');
            },
            'hide-site-modal': function(){
                this.$broadcast('hide');
            }
        }
    }
</script>