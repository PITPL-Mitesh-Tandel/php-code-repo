const messageButton = document.getElementById('messageButton');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');

messageButton.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('open');
});
