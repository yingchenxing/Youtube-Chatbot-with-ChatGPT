const GPT_KEY = "your key";
var inputBox = document.querySelector('#input-box');
var sendButton = document.querySelector('#send-button');

window.addEventListener('load', function(){
    var chatArea = document.querySelector('#chat-area');
    // 恢复保存的聊天记录
    chatArea.innerHTML = sessionStorage.getItem('chat-history') || '';
});

function addMessage(message,isAnswer){
    if(message==""){
        return;
    }
    var chatArea = document.querySelector('#chat-area');
    var chatBox = document.createElement('div');
    chatBox.classList.add('chat-box');
    if(isAnswer){
        chatBox.innerHTML = '<br /><br /><div class="chat-bubble chat-left">' + message + '</div>';
    }else{
        chatBox.innerHTML = '<br /><br /><div class="chat-bubble chat-right">' + message + '</div>';
    }
    chatArea.appendChild(chatBox);
    sessionStorage.setItem('chat-history', chatArea.innerHTML);
}

async function getRespond(message){
    // await fetch('https://posthere.io/api/2cfb-4cde-974f', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         message: message
    //     })
    //     })
    //     .then(response => {
    //         console.log(response.url);
    //         addMessage(response.url,true);
    //     })
    //     .then(data => {
    //         console.log(data);
    //     })
    //     .catch(error => console.error(error))

    await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer "+GPT_KEY
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages":[{ "role": "user", "content":message}],
                "temperature": 0.5,
                "max_tokens": 100,
                "stop": null
            })
          })
          .then(async response => {
            console.log(response);
            const jsonString = await response.body.getReader().read().then(({value}) => new TextDecoder().decode(value));
            console.log(jsonString);
            let data = JSON.parse(jsonString).choices[0].message.content;
            console.log(data);
            addMessage(data,true);
          })
    // return message;
}

sendButton.addEventListener('click', async() =>{
    // 获取输入框中的文本
    var message = inputBox.value;
    // 将消息显示在聊天记录区域
    addMessage(message,false);
    console.log(message);
    if(message!=""){
        let respond = await getRespond(message);
        // addMessage(respond,true);
    }
    // 清空输入框
    inputBox.value = '';
});