
const GPT_KEY = "put your key here";

var inputBox = document.querySelector('#input-box');
var sendButton = document.querySelector('#send-button');
// transcript = await getTranscriptStr();
var messageList;


window.addEventListener('load', function(){
    var chatArea = document.querySelector('#chat-area');
    // 恢复保存的聊天记录
    chatArea.innerHTML = sessionStorage.getItem('chat-history') || '';
});

function addMessage(message,type){
    if(message==""){
        return;
    }
    var chatArea = document.querySelector('#chat-area');
    var chatBox = document.createElement('div');
    chatBox.classList.add('chat-box');
    if(type==0){
        chatBox.innerHTML = '<br /><br /><div class="chat-bubble chat-left">' + message + '</div>';
    }else if(type==1){
        chatBox.innerHTML = '<br /><br /><div class="chat-bubble chat-right">' + message + '</div>';
    }else{
        chatBox.innerHTML = '<br /><br /><div class="chat-bubble chat-warning">' + message + '</div>';
    }
    chatArea.appendChild(chatBox);
    sessionStorage.setItem('chat-history', chatArea.innerHTML);
}

async function getRespond(message){
    let question = {
        "role": "user",
        "content": message
    };
    messageList.push(question);

    await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer "+GPT_KEY
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages":messageList,
                "temperature": 0.5,
                "max_tokens": 100,
                "stop": null
            })
          })
          .then(async response => {
            console.log(response);
            if(response.ok){
                const jsonString = await response.body.getReader().read().then(({value}) => new TextDecoder().decode(value));
                let data = JSON.parse(jsonString).choices[0].message.content;
                console.log(data);
                addMessage(data,0);
                let answer = {
                    "role": "system",
                    "content": data
                };
                messageList.push(answer);
            }else if(response.status==401){
                addMessage("please configure the correct key ",2);
            }else if(response.status==400){
                addMessage("Sorry! The video is too long ㄟ( ▔, ▔ )ㄏ",2);
            }
          })
    // return message;
}

sendButton.addEventListener('click', async() =>{
    // 获取输入框中的文本
    var message = inputBox.value;
    // 清空输入框
    inputBox.value = '';
    // 将消息显示在聊天记录区域
    addMessage(message,1);
    console.log(message);
    if(message!=""){
        await getRespond(message);
    }
});

async function main(){
    transcript = await getTranscriptStr();
    console.log(typeof transcript);
    let initial = {
        "role": "assistant",
        "content": transcript
    };
    console.log(initial);
    messageList=[initial];
}
main();