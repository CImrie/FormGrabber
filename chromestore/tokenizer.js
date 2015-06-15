/**
 * Created by connorimrie on 12/06/2015.
 */
//need to tokenize words and wrap in span elements

//also need to disable link redirection
//.ticketpostcontentsdetailscontainer:first

//tokenizer bookmarklet
javascript:(function () {
    var script = document.createElement("script");
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
    document.head.appendChild(script);

    var tokenize = function(){
        var selector = '.ticketpostcontentsdetailscontainer:first';
        var lines = $(selector).text().split('\n');

        $(selector).empty();
        for(var line in lines)
        {
            console.log(lines[line]);

            var words = lines[line].split(' ');
            for(var word in words)
            {
                console.log(words[word]);
                $(selector).append($('<span>').text(words[word] + " "));
            }
            $(selector).append($('<br>'));
        }
    };

    var interval = setInterval(function()
    {
        if(window.jQuery){
            tokenize();
            clearInterval(interval);
        }
        $('body *').click(function(event){
            event.preventDefault();
        });
        $('body *').removeAttr('onclick');
    }, 200);
})();



//close ticket bookmarklet
javascript:(function () {
    document.getElementById('selectgenticketstatusid').value = "6";
    document.getElementById('View_Ticketform_submit_1').click();
})();