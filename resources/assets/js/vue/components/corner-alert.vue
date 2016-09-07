<template>
    <div v-bind:class="['fg-alert', alertClass ? alertClass : '']" v-if="show" transition="bounce">
        <div class="fg-alert-heading">{{ heading }}</div>
        <div>{{{ message }}}</div>
        <div class="fg-alert-button" v-if="button != undefined"><button v-on:click="button.onClick">{{button.text}}</button></div>
    </div>
</template>
<script>
    module.exports = {
        props: {
            heading: {
                type: String,
                default: "Information"
            },
            message: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                default: ""
            },
            button: {
                type: Object
            }
        },
        computed: {
            alertClass: function(){
                var lookup = {"success": "fg-alert-success", "warning" : "fg-alert-warning", "error" : "fg-alert-error"};
                console.log(this.type);
                if(lookup[this.type] != undefined){
                    return lookup[this.type];
                }
            }
        },
        data: function(){
            return {
                show: true
            }
        },
        ready: function(){
            var self = this;
            setTimeout(function(){
                self.show = false;
            }, 4000)
        }
    }
</script>
<style scoped>
    .fg-pull-right {
        float:right;
    }

    .fg-icon {
        color:grey;
        font-size: 0.85em;
        pointer-events: auto;
        cursor:pointer;
    }

    .fg-alert-heading{
        font-size: 1.1em;
        font-weight: bold;
        padding-bottom:10px;
    }

    .fg-alert-button {
        padding-top:10px;
    }

    .fg-alert-button button{
        padding:10px;
        font-weight:bold;

        border: 1px solid rgb(248, 101, 116);
        background-color: rgb(255, 134, 147);
        border-radius:3px;
        box-shadow: 0;

        pointer-events:auto;
        cursor:pointer;
    }

    .fg-alert-button button:focus {
        outline:0;
    }

    .fg-alert {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color:black;
        margin:15px;
        margin-top: 0px;
        padding:20px;
    }

    .fg-alert-success {
        border-bottom: 8px solid #B9EB6C;
        background-color: #d0f29c;
        border-radius: 5px;
    }

    .fg-alert-warning {
        border-bottom: 8px solid #FFB488;
        background-color: #ffd5bd;
        border-radius: 5px;
    }

    .fg-alert-error {
        border-bottom: 8px solid #FF8693;
        background-color: #ffbdc4;
        border-radius: 5px;
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