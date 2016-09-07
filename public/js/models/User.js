/**
 * Created by connorimrie on 14/06/2015.
 */
function User()
{
    //this.obtainToken();
    this.tokenRefreshes = 0;
}

User.prototype = {

    obtainToken: function(){
        var user = {};
        var self = this;
        chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
            self.token = token;
            chrome.runtime.sendMessage({name: 'user-token', data:token});
        });
    },
    clearCachedToken: function(){
        this.tokenRefreshes++;
        chrome.identity.removeCachedAuthToken({token: this.token});
        if(this.tokenRefreshes < 3){
            this.obtainId();
        }
    }

};