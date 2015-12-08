/**
 * Created by connorimrie on 14/06/2015.
 */
var APP_ID = "dchkbanpgboppemgcafbdbefnanhimli";
var CLIENT_ID = "513090491024-3j2tfjte10152oef9lmsvmip5ok60itg.apps.googleusercontent.com";
var SCOPES = ["https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/chromewebstore.readonly"];
function User()
{
    this.obtainId();
};

User.prototype = {

    token : function(){
        return localStorage.getItem('formgrabber-userToken');
    },
    setId: function(id)
    {
        this.id = id;
    },

    obtainId: function(){
        var user = {};
        chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
            localStorage.setItem('formgrabber-userToken', token);
            chrome.identity.getProfileUserInfo(function(resp){
                //console.log('accounts....');
                //console.log(resp);
                user.id = resp.id;
                localStorage.setItem('formgrabber-userId', resp.id);
            });
            //$.ajax({
            //    beforeSend: function (xhr) {
            //        xhr.setRequestHeader("Authorization", "Oauth2 " + token)
            //    },
            //    type: "GET",
            //    url: "https://www.googleapis.com/chromewebstore/v1/licenses/"+APP_ID+"/"+token,//this.user.userToken,
            //    contentType: "application/json",
            //    success: function(response){
            //        this.response = response;
            //        console.log(response);
            //    },
            //    error: function(response){
            //        console.log(response);
            //    }
            //});
        });
        this.id = localStorage.getItem('formgrabber-userId');
    }

};