<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Window</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Message Button -->
    <button id="messageButton" class="message-button">💬 Message</button>

    <!-- Chat Window -->
    <div id="chatWindow" class="chat-window hidden">
        <div class="chat-header">
            <h4>Chat Support</h4>
            <button id="closeChat" class="close-button">&times;</button>
        </div>
        <div class="chat-body">
            <p>Hi there! How can we assist you today?</p>
        </div>
        <div class="chat-footer">
            <input type="text" placeholder="Type your message..." class="chat-input">
            <button class="send-button">Send</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
