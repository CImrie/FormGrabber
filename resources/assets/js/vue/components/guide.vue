<template>
    <div class="instructions-container">
        <button id="instructions-button" class="btn btn-default fa fa-info-circle" v-on:click="show= !show"></button>
        <div id="instructions-panel" class="row" v-show="show" transition="expand">
            <small class="col-md-12">
                <strong>Grabbing</strong>
                <ul>
                    <li>
                        <kbd>Click 'Start Grabbing'</kbd>, then <kbd>click all of the elements</kbd> in the page to copy their data. Convenient highlighting shows you exactly which is selected.
                    </li>
                    <li>
                        <kbd>Click 'Enter'</kbd> to save after all have been selected, and this will be available in the list below
                    </li>
                    <li>
                        <kbd>Click 'B'</kbd> to go back one, i.e. if you click an element by mistake
                    </li>
                    <li>
                        <kbd>Click 'C'</kbd> to cancel all and stop the script. It may take 7 seconds to cancel the highlighting, but the page is ready to use immediately.
                    </li>
                </ul>
            </small>
            <small class="col-md-12">
                <strong>Pasting</strong>
                <ul>
                    <li><kbd>Click 'use' <i class="fa fa-download"></i></kbd>. This will close the window and start pasting</li>
                    <li><kbd>Click</kbd> where each element should go. The current object to be pasted is given in an alert box following your cursor</li>
                    <li>Once all elements have been pasted, you will receive an 'all done' message and the script will end</li>
                </ul>
            </small>
        </div>
    </div>
</template>

<style>
    /*.expand-transition {*/
        /*transition: all .3s ease;*/
    /*}*/

    /*.expand-enter, .expand-leave {*/
        /*transition: all .3s ease;*/
    /*}*/
</style>

<script>
    module.exports = {
        data: function(){
            return {
                show: false
            }
        }
    }
</script>