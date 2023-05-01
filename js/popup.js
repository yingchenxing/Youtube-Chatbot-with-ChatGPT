console.log($);

const GPT_KEY = "enter your key here";
var inputBox = document.querySelector('#input-box');
var sendButton = document.querySelector('#send-button');
// transcript = await getTranscriptStr();
var messageList;


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
            const jsonString = await response.body.getReader().read().then(({value}) => new TextDecoder().decode(value));
            console.log(jsonString);
            let data = JSON.parse(jsonString).choices[0].message.content;
            console.log(data);
            addMessage(data,true);
            let answer = {
                "role": "system",
                "content": data
            };
            messageList.push(answer);
          })
    // return message;
}

sendButton.addEventListener('click', async() =>{
    // 获取输入框中的文本
    var message = inputBox.value;
    // 清空输入框
    inputBox.value = '';
    // 将消息显示在聊天记录区域
    addMessage(message,false);
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