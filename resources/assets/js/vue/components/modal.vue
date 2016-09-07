<template>
    <div class="modal-inner-container">
        <div class="modal-mask" v-if="show" @click="toggle">
        </div>
        <div class="modal-window" v-if="show">
            <div class="modal-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function(){
            return {
                show: false
            }
        },
        methods: {
            toggle: function(){
                this.show = ! this.show;
            }
        },
        events: {
            'show': function(){
                this.show = true;
            },
            'hide': function(){
                this.show = false;
            },
            'toggle' : function(){
                this.toggle();
            }
        }
    };
</script>