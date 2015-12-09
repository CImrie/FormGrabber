function Crawler(vue, ignored){
    this.vue = vue;
    this.ignored = ignored;
    return this;
}

Crawler.prototype = {

    bind: function(){
        var vue = this.vue;
        //Mouse Events
        $('body')
            .mouseover(function(e){
                $(e.target).addClass('fg-hover');
             })
            .mouseout(function(e){
                $(e.target).removeClass('fg-hover');
            })
            .click(function(e){
                $(e.target).addClass('fg-clicked');
                e.preventDefault();
                e.stopImmediatePropagation();
                vue.$emit('grabbed-one', $(e.target).text());

                setTimeout(function()
                {
                    $(e.target).removeClass('fg-clicked');
                }, 500);
            })
            .focus(function(e){
                $(e.target).blur();
                e.stopImmediatePropagation();
                e.preventDefault();
            })
        ;

        var self = this;
        //Keypress Events
        $(document).keydown(function(e){
            //Save input with 'Enter' key
            if (e.keyCode == 13) {
                e.preventDefault();
                self.unbind();
                vue.$emit('grab-complete');
            }

        });
        $(document).keypress(function(e){
            //Stop on 'C' key
            if (e.which == 99)
            {
                e.preventDefault();
                self.unbind();
                vue.$emit('grab-cancelled');
            }
        });

        //go through ignored elements and unbind
        for(exception in this.ignored){
            $(exception).unbind('mouseover').unbind('mouseout').unbind('click').unbind('focus');
        }
    },

    unbind: function(){
        $('body').unbind('mouseover').unbind('mouseout').unbind('click');
        $('.fg-hover').removeClass('fg-hover');
        $('.fg-clicked').removeClass('fg-clicked');
        $(document).unbind('keydown').unbind('keypress');
    },

    grab: function(){
        this.bind();
    },

    paste: function(){

    }
};