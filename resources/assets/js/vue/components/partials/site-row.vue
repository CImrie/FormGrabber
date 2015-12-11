<template>
    <tr v-for="site in sites" v-on:click="modalData(site)">
        <td>
            <button
                    :class="['fa', 'btn', 'btn-default', site.locked ? 'fa-lock': 'fa-unlock']"
                    v-on:click="toggleLock(site)"
            ></button>
        </td>
        <td class="constrain"><a href="{{site.url}}" target="_blank">{{ humanReadableUrl(site.url) }}</a></td>
        <td>{{ humanReadableTime(site.added) }}</td>
        <td><button class="fa fa-download btn btn-default" v-on:click="use(site)"></button></td>
        <td><button class="fa fa-trash btn btn-danger" v-on:click="trash(site)"></button></td>
    </tr>
</template>

<script>
    module.exports = {
        props: {
            site: {
                type: Object,
                required: true
            }
        },
        methods: {
            'humanReadableTime': function(epoch){
                return moment(epoch).fromNow();
            },
            'humanReadableUrl': function(url){
                var parser = document.createElement('a');
                parser.href = url;

                return parser.hostname;
            },
            'trash': function(site){
                //only if not locked
                if( ! site.locked ){
                    this.$dispatch('trash-clicked', site);
                }
            },
            'trashAll': function(){
                this.$dispatch('trash-all-clicked');
            },
            'use': function(site){
                this.$dispatch('use-site', site);
            },
            'toggleLock': function(site){
                var index = this.sites.indexOf(site);
                site.locked = ! site.locked;
                this.$dispatch('lock-toggled', index);
            },
            'modalData': function(site){
                this.$broadcast('toggle', site.data);
            }
        }
    }
</script>