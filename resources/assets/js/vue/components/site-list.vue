<template>
    <div class="well-lg" style="padding-top:10px">
        <!--<button id="clear-all" class="btn btn-danger col-md-2 pull-right" v-on:click="trashAll"><i class="fa fa-exclamation-triangle"></i> Forget all</button>-->
        <table id="sites" class="table text-center">
            <thead>
            <tr>
                <th><fg-table-tab>Lock</fg-table-tab></th>
                <th><fg-table-tab>URL</fg-table-tab></th>
                <th><fg-table-tab>Added</fg-table-tab></th>
                <th><fg-table-tab>Use</fg-table-tab></th>
                <th><fg-table-tab>Forget</fg-table-tab></th>
            </tr>
            </thead>
            <tbody id="sites-tbody">
                <tr v-for="site in sites" v-on:click.stop="modalData(site)">
                    <td>
                        <button
                                :class="['fa', 'btn', 'btn-default', site.locked ? 'fa-lock': 'fa-unlock']"
                                v-on:click.stop="toggleLock(site)"
                        ></button>
                    </td>
                    <td class="constrain"><a href="{{site.url}}" target="_blank">{{ humanReadableUrl(site.url) }}</a></td>
                    <td>{{ humanReadableTime(site.added) }}</td>
                    <td><button class="fa fa-download btn btn-default" v-on:click.stop="use(site)"></button></td>
                    <td><button class="fa fa-trash btn btn-danger" v-on:click.stop="trash(site)"></button></td>
                </tr>
            </tbody>
        </table>
        <slot></slot>
        <fg-site-modal></fg-site-modal>
    </div>
</template>
<style>
    .fg-btn-danger{
        color:white;
        background-color:#EF6078;
    }

    /* grey */
    #sites-tbody > tr:hover {
        transition: 0.05s ease-in-out;
        border:solid #bdbfc2;
        border-width: 0 4px;
        background-color: #f4f5f5;
    }

    tr:hover {
        cursor:pointer;
    }

</style>
<script>
    var moment = require('moment');
    var tab = require('./partials/table-tab.vue');
    var siteModal = require('./site-modal.vue');

    module.exports = {
        components: {
            "fg-table-tab": tab,
            "fg-site-modal": siteModal
        },
        props: {
            sites: {
                type: Array,
                default: function(){
                    return [];
                }
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
                    var index = this.sites.indexOf(site);
                    if(index != -1){
                        this.sites.splice(index, 1);
                        this.$dispatch('trash-clicked', index);
                    }
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
                this.$broadcast('show-site-modal', site);
            }
        }
    }
</script>