<template>
    <div class="fg-float" v-bind:style="'left: '+ (mouseX + 30) +'px ; top: ' + (mouseY + 30) + 'px' ;" v-if="show" transition="bounce">
        <div class="fg-float-heading">Preview</div>
        <div class="fg-float-message">{{{ message }}}</div>
    </div>
</template>
<style>
    .fg-float-heading {
        font-weight:bold;
        font-size: 1.2em;
    }
    .fg-float {
        position:absolute;
        left:0px;
        top:0px;
        z-index:999999;
        border-bottom: 8px solid #8CDDFF;

        background-color: #c2edff;
        padding:12px;
        border-radius: 5px;
        box-shadow: 0;
    }

    .bounce-enter {
        animation: bounce-in .3s;
    }
    .bounce-leave {
        animation: bounce-out .3s;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.25);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes bounce-out {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.25);
        }
        100% {
            transform: scale(0);
        }
    }
</style>
<script>
    module.exports = {
        props: {

        },
        computed: {

        },
        data: function(){
            return {
                mouseX: 0,
                mouseY: 0,
                message: "howdy",
                show: false
            }
        },
        ready: function(){
            var self = this;
            $(document).on('mousemove', function(e){
                self.mouseX = e.pageX;
                self.mouseY = e.pageY;
            });
        },
        events: {
            'show-float': function(message){
                this.message = message;
                this.show = true;
            },
            'hide-float': function(){
                this.show = false;
                //this.message = "";
            }
        }

    }
</script>