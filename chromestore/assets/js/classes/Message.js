/**
 * Created by connorimrie on 12/06/2015.
 */
/**
 * Message class to handle user notification in tab
 * @param prependTo
 * @param divId
 * @param cssClass
 * @param messageText
 * @constructor
 */
function Message(prependTo, divId, cssClass, messageText){
    this._prependTo = prependTo;
    this._divId = divId;
    this._cssClass = cssClass;
    this._messageText = messageText;
    return this;
};

Message.prototype = {
    set prependTo(selector){
        this._prependTo = selector;
        return this;
    },

    get prependTo(){
        return this._prependTo;
    },

    set divId(id){
        this._divId = id;
        return this;
    },

    get divId(){
        return this.divId;
    },

    set cssClass(cssClasses){
        this._cssClass = cssClasses;
        return this;
    },

    get messageText(){
        return this.messageText;
    },

    set messageText(text){
        this.text = text;
        return this;
    },

    hide: function(){
        $(this._prependTo + " > #row-" + this._divId).remove();
        return this;
    },

    timeout: function(time) {
        var prependTo = this._prependTo;
        var divId = this._divId;
        var id = prependTo + " #row-" + divId + ":first";
        setTimeout(function() {
            $(id).remove();
            console.log('tried to remove"' + id + '"');
        }, time, id);
        return this;
    },

    show: function(){
        $(this._prependTo).prepend('' +
            '<div id="row-' + this._divId + '" class="row">' +
                '<div id="' + this._divId + '" class="' + this._cssClass + '">' +
                    this._messageText +
                '</div>' +
            '</div>'
        );
        $("#"+this._divId).attr('style', 'z-index:999999');
        return this;
    }
}