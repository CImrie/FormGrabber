<template>
    <div class="modal-inner-container">
        <div class="modal-mask" v-show="show" @click="toggle">
        </div>
        <div class="modal-window" v-show="show">
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
            }
        },
        props: {
            show: false
        },
        methods: {
            toggle: function(){
                this.show = ! this.show;
            }
        },
        events: {
            'toggle' : function(){
                this.toggle();
            }
        }
    };
</script>