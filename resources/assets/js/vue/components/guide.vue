<template>
    <fg-modal>
        <div class="instructions-container">
            <div id="instructions-panel" class="row" v-show="show" transition="expand">
                <small class="col-md-12">
                    <strong>Grabbing</strong>
                    <ul>
                        <li>
                            <kbd>Click the Form Grabber Logo<small></small></kbd>
                             <img src="public/images/fg-colour-logo-vibrant-2-aligned-01-01.png" style="max-width:40px;"/>
                            , then <kbd>click all of the elements</kbd> in the page to copy their data. Convenient highlighting shows you exactly which is selected.
                        </li>
                        <li>
                            <kbd>Click 'Enter'</kbd> to save after all have been selected, and this will be available in the site list
                        </li>
                        <li>
                            <kbd>Click 'B'</kbd> to go back one, i.e. if you click an element by mistake
                        </li>
                        <li>
                            <kbd>Click 'C'</kbd> to cancel all and stop the script. It may take a few seconds to cancel the highlighting, but the page is ready to use immediately.
                        </li>
                    </ul>
                </small>
                <small class="col-md-12">
                    <strong>Pasting</strong>
                    <ul>
                        <li><kbd>Click 'use' <i class="fa fa-download"></i></kbd>. This will close the window and start pasting</li>
                        <li><kbd>Click</kbd> where each element should go. The current object to be pasted is given in an floating box that follows your cursor</li>
                        <li>Once all elements have been pasted, you will receive an 'all done' message and the script will end</li>
                    </ul>
                </small>
                <small class="col-md-12">
                    <strong>Popup Window</strong>
                    <ul>
                        <li>To see what data is held for a site, click anywhere on the row for that site (just not on any of the buttons!)</li>
                        <li>To remove all 'unlocked' sites from your list, go to the menu at the top right of the page and <kbd>Double Click</kbd> on 'Forget All'</li>
                    </ul>
                </small>
            </div>
        </div>
    </fg-modal>
</template>

<style>
    .instructions-container {
        text-align:left;
        display:flex;
        align-items:center;
        justify-content:center;
        width:95%;
    }
    /*.expand-transition {*/
        /*transition: all .3s ease;*/
    /*}*/

    /*.expand-enter, .expand-leave {*/
        /*transition: all .3s ease;*/
    /*}*/
</style>

<script>
    var modal = require('./modal.vue');
    module.exports = {
        data: function(){
            return {
                show: true
            }
        },
        components: {
            "fg-modal": modal
        },
        events: {
            'toggle-instructions': function(){
                this.$broadcast('toggle');
            }
        }
    }
</script>