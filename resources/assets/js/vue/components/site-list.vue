<template>
    <div class="well-md" style="padding-top:10px">
        <div id="clear-all" class="btn btn-danger col-md-2 pull-right"><i class="fa fa-exclamation-triangle"></i> Forget all</div>
        <table id="sites" class="table table-striped">
            <thead>
            <tr>
                <th>Lock</th>
                <th>URL</th>
                <th>Time added</th>
                <th>Use</th>
                <th>Forget</th>
            </tr>
            </thead>
            <tbody id="sites-tbody">
                <tr v-for="site in sites">
                    <td><button :class="['fa', 'btn', 'btn-default', site.locked ? 'fa-lock': 'fa-unlock']" v-on:click="toggleLock(site)"></button></td>
                    <td>{{ site.url }}</td>
                    <td>{{ site.created_at }}</td>
                    <td><button class="fa fa-download btn btn-default"></button></td>
                    <td><button class="fa fa-trash btn btn-danger" v-on:click="trash(site)"></button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    module.exports = {
        props: ['sites'],
        methods: {
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
            'toggleLock': function(site){
                var index = this.sites.indexOf(site);
                site.locked = ! site.locked;
                this.$dispatch('lock-toggled', index);
            }
        }
    }
</script>