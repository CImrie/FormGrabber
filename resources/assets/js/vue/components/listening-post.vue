<script>
    module.exports = {
        data: function(){
            return {
                isExtension: false
            }
        },
        methods: {
            send: function(event){
                chrome.runtime.sendMessage(event);
                if(this.isExtension){
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, event);
                    });
                }
            }
        },
        events: {
            'send': function(name, data){
                console.log('sending message: ' + name);
                this.send({name: name, data: data});
            }
        },
        ready: function(){
            var vm = this;
            chrome.runtime.onMessage.addListener(function(event){
                console.log('received message: ' + event.name);
//                vm.$dispatch(event.name, event.data);
//                vm.$broadcast(event.name, event.data);
                vm.$emit(event.name, event.data);
            });
        }
    }
</script>