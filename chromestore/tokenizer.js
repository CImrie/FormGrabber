/**
 * Created by connorimrie on 12/06/2015.
 */
//need to tokenize words and wrap in span elements

//also need to disable link redirection
//.ticketpostcontentsdetailscontainer:first

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

/*



 if($.trim( $(element).text() ).length > 0){
 var lines = $(element).text().split('\n');
 $.each(lines, function(i, v) {
 console.log('emptying element: -------- ' + $(element).text());
 $(element).empty();
 $(element).append($("<span>").text(" " + v)).append('</br>');
 });
 }
 $(element).click(function(event){
 event.preventDefault();
 });




 $(element).empty();
 var lines = $(element).text().split('\n');
 $.each(lines, function(i, v) {
 $(element).append($("<span>").text(" " + v))
 });
 $(element).find('span').append('</br>');
 */