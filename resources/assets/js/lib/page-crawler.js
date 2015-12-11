function Crawler(vue, ignored){
    this.vue = vue;
    this.ignored = ignored;
    this.site = {};
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
                vue.$emit('grabbed-one', $(e.target).text().trim());

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
                e.stopImmediatePropagation();
                e.preventDefault();
                self.unbind();
                vue.$emit('crawler-grab-complete');
            }

        });
        $(document).keypress(function(e){
            //Stop on 'C' key
            if (e.which == 99)
            {
                e.stopImmediatePropagation();
                e.preventDefault();
                self.unbind();
                vue.$emit('crawler-grab-cancelled');
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

    paste: function(site){
        var vue = this.vue;
        var pasteData = site.data.slice();
        this.pasteData(pasteData);
        this.site = site;
    },

    /* This is a bit procedural but not sure if it can be improved with the way javascript works */
    pasteData: function(data){
        var vue = this.vue;
        vue.showFloat("Click to place \"" + data[Object.keys(data)[0]] + "\"");
        var self = this;
        pasted = false;

        this.bindForPaste();

        $('body').unbind('click');
        $('body').click(function(event){
            var currentText = $(event.target).val();
            $(event.target).val(currentText + "" + data[Object.keys(data)[0]]);
            delete data[Object.keys(data)[0]];
            pasted = true;
            $('body').unbind('click');
            event.stopImmediatePropagation();
        });
        var clock = setInterval(function()
        {
            if(pasted){
                if (data[Object.keys(data)[0]] !== undefined) {
                    self.pasteData(data);
                }
                else {
                    var count = 2;
                    var countdown = setInterval(function(){
                        if(count > 0){
                            vue.showFloat('All done. The script will now finish in ' + count + "...");
                            count = count -1;
                        }else{
                            vue.hideFloat();
                            vue.$emit('send', 'use-site-complete', self.site);
                            clearInterval(countdown);
                        }
                    }, 1000);
                    clearInterval(clock);
                }
            }
        }, 200);

    },

    bindForPaste: function(){
        var self = this;
        var vue = this.vue;
        $(document).keypress(function(e){
            //Stop on 'C' key
            if (e.which == 99)
            {
                e.stopImmediatePropagation();
                e.preventDefault();
                self.unbindPaste();
                vue.$emit('crawler-deploy-cancelled');
            }
        });
    },

    unbindPaste: function(){
        $(document).unbind('keypress');
        $('body').unbind('click');
    }
};