var inputBox = document.querySelector('#input-box');
var sendButton = document.querySelector('#send-button');

sendButton.addEventListener('click', function() {
    // 获取输入框中的文本
    var message = inputBox.value;
    // 将消息显示在聊天记录区域
    var chatArea = document.querySelector('#chat-area');
    var chatBox = document.createElement('div');
    chatBox.classList.add('chat-box');
    chatBox.innerHTML = '<div class="chat-bubble chat-left">' + message + '</div>';
    chatArea.appendChild(chatBox);
    // 发送POST请求到ChatGPT的API
    fetch('https://api.chatgpt.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        // 显示ChatGPT的回答
        var answer = data.message;
        // 将回答显示在聊天记录区域
        var chatBox = document.createElement('div');
        chatBox.classList.add('chat-box');
        chatBox.innerHTML = '<div class="chat-bubble chat-right">' + answer + '</div>';
        chatArea.appendChild(chatBox);
        chatArea.innerHTML += '<hr>';
    });
    // 清空输入框
    inputBox.value = '';
});