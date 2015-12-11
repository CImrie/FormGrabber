<template>
    <!--<div class="fg-dropdown-container" v-on:blur="show = false">-->
        <ul class="fg-dropdown" v-on:mouseleave="show = false">
            <span class="fg-dropdown-button text-center" v-on:mouseenter="show = true">
                <i class="fa fa-bars fa-2x"></i>
            </span>
            <li v-show="show" v-for="item in items">{{{ item }}}</li>
        </ul>
    <!--</div>-->
</template>
<style>
    .fg-dropdown-container {
        text-align:center;
    }
    .fg-dropdown-button {
        width:30%;
        margin-left:auto;
        margin-right:auto;
    }
    /** Style Results **/
    .fg-dropdown {
        /*position:absolute;*/
        padding: 0;
        text-align:center;
        width:125px;
    }
    .fg-dropdown li {
        display:block;
        padding:13px;
        text-decoration: none;
        list-style: none;
        background-color:white;
    }

    .fg-dropdown li {
        border-left: 1px solid;
        border-right: 1px solid;
        border-color: #E6E7E8;
    }

    .fg-dropdown li:nth-of-type(1) {
        border-top:1px solid;
        border-color: #E6E7E8;
    }

    .fg-dropdown li:last-child {
        border-bottom: 1px solid;
        border-color: #E6E7E8;
    }

</style>
<script>
    module.exports = {
        props: {
            items: {
                type: Object,
                default: {

                }
            }
        },
        data: function(){
            return {
                show: false
            }
        }
    }
</script>