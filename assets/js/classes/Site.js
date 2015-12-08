/**
 * Created by connorimrie on 12/06/2015.
 */
/**
 * Site class - represents a stored tab
 * @param _url - the url of the page where data was taken
 * @param _added - the time the site was created
 * @param _data - the key-value pairs associated with each element that was saved
 * @constructor
 */
//function Site(url, added, data){
//
//    console.log('new site: ');
//    console.log(url);
//    console.log(data);
//    this._locked = false;
//    this._url = url;
//    this._added = added;
//    this._data = data;
//
//    return this;
//}

function Site(json){
    this._locked = json['locked'] ? json['locked'] : false;
    this._url = json['url'];
    this._added = json['added'];
    this._data = json['data'];

    return this;
}

Site.prototype = {

    get locked(){
        return this._locked;
    },

    set locked(shouldBeLocked){
        this._locked = shouldBeLocked;
        return this;
    },

    toggleLock: function(){
        if(this._locked){
            this._locked = false;
        }
        else {
            this._locked = true;
        }
        return this;
    },

    get url(){
        return this._url;
    },

    set url(url){
        this._url = url;
        return this;
    },

    get added() {
        return this._added;
    },

    set added(datetime) {
        this._added = datetime;
        return this;
    },

    get data(){
        return this._data;
    },

    set data(data){
        this._data = data;
        return this;
    },

    set addInput(input){
        this._data[input] = input;
        return this;
    },

    removeLastInput: function(){
        var lastKey = Object.keys(this._data)[(Object.keys(this._data)).length-1];
        delete this._data[lastKey];
        return this;
    },

    toObject: function(){
        return {url:this._url, locked:this._locked, added:this._added, data:this._data};
    }

};