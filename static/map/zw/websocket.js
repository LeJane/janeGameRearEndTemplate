/*
 * Created by lZQ on 2017/3/3.
 */
var stompClient;
var webSocket = {
    socket: null,
    subscribeArr:[],
    url:"",
    conFlag:false,
    init: function (url) {
        webSocket.url = url;
    },
    send : function(url,requestStr){
        stompClient.send(url,{},JSON.stringify(requestStr));
    },
    subscribe: function (subUrl,callBack,sendurl,requestStr) {
        if(webSocket.conFlag){
            if(webSocket.subscribeArr.indexOf(subUrl) == -1){
                webSocket.subscribeArr.push(subUrl);
                stompClient.subscribe(subUrl, callBack);
            }
            stompClient.send(sendurl,{},JSON.stringify(requestStr));
        }else{
            webSocket.socket = new SockJS(webSocket.url);
            stompClient = Stomp.over(webSocket.socket);
            stompClient.connect({}, function (frame) {
                webSocket.conFlag = true;
                if(webSocket.subscribeArr.indexOf(subUrl) == -1){
                    webSocket.subscribeArr.push(subUrl);
                    stompClient.subscribe(subUrl, callBack);
                }
                stompClient.send(sendurl,{},JSON.stringify(requestStr));
            });
        }
    },
    unsubscribealarm:function (url,requestStr) {
        if(webSocket.conFlag){
            stompClient.send(url, {}, JSON.stringify(requestStr));
        }else{
            webSocket.socket = new SockJS(webSocket.url);
            stompClient = Stomp.over(webSocket.socket);
            stompClient.connect({}, function (frame) {
                webSocket.conFlag = true;
                stompClient.send(url,{},JSON.stringify(requestStr));
            });
        }
    }

}


