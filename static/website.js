document.addEventListener('DOMContentLoaded', function () 
{
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbotContainer = document.getElementById('chatbot-container');

    chatbotToggler.addEventListener('click', function () 
    {
        chatbotContainer.classList.toggle('hidden');
    });
});

document.addEventListener('DOMContentLoaded', function() 
{
    var isFullscreen = false;
    function toggleFullScreen() 
    {
        var bodyElement = document.body;
        if (!isFullscreen) 
            {
                bodyElement.classList.add('fullscreen');
                isFullscreen = true;
            } 
            else 
            {
                bodyElement.classList.remove('fullscreen');
                isFullscreen = false;
            }
    }

    var fullscreenButton = document.getElementById('fullscreen-button');
    if (fullscreenButton) 
        {
            fullscreenButton.addEventListener('click', function() 
            {
                toggleFullScreen();
            });
        } 
        else 
        {
            console.error("Element with id 'fullscreen-button' not found.");
        }
        
    document.addEventListener('keydown', function(event) 
    {
        if (event.key === 'Escape' && isFullscreen) 
            {
                toggleFullScreen();
            }
        });
});

var conversationHistory = [];

function convertToMarkdown(text) 
{
    var markdownText = text.replace(/\n/g, "<br>");
    return "\n" + markdownText + "\n";
}

function sendMessage() 
{
    var userInput = document.getElementById("user-input").value;
    if (!userInput) return; 

    var userInputMarkdown = convertToMarkdown(userInput);
    conversationHistory.push({ role: 'user', content: userInput });
    displayMessage("You", userInputMarkdown);

    var typingIndicatorElement = displayMessage("UTU", "<span class='typing-animation'>.......</span>");
    fetch('/api', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history: conversationHistory }),
    })
    .then(response => response.json())
    .then(data => 
    {
        console.log('Response from server:', data);
        if (data && data.response !== undefined) 
        {
            conversationHistory.push({ role: 'assistant', content: data.response });
            var aiResponseMarkdown = convertToMarkdown(data.response);
            updateMessage(typingIndicatorElement, aiResponseMarkdown);
        } 
        else 
        {
            console.error('Invalid response from server:', data);
            updateMessage(typingIndicatorElement, "Sorry, something went wrong.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        updateMessage(typingIndicatorElement, "Sorry, something went wrong.");
    });

    document.getElementById("user-input").value = ""; 
}

function displayMessage(sender, message) 
{
    var chatMessages = document.getElementById("chat-messages");
    var messageElement = document.createElement("div");
    
    var senderElement = document.createElement("span");
    var senderIcon = document.createElement("img");

    if (sender === "You") 
    {
        senderIcon.src = "static/images/user 16x16.png"; 
        senderIcon.alt = "User Icon";
    } 
    else if (sender === "UTU") 
    {
        senderIcon.src = "static/images/favicon-16x16.png"; 
        senderIcon.alt = "Assistant Icon";
    }

    senderIcon.style.width = "16px"; 
    senderIcon.style.height = "16px"; 
    senderIcon.style.marginRight = "5px";

    senderElement.appendChild(senderIcon);
    senderElement.appendChild(document.createTextNode(sender + ": "));
    messageElement.appendChild(senderElement);

    var messageText = document.createElement("span");
    messageText.innerHTML = message;
    messageElement.appendChild(messageText);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageElement;
}

function updateMessage(messageElement, newContent) 
{
    messageElement.querySelector("span:last-child").innerHTML = newContent;
}

document.addEventListener('DOMContentLoaded', function () 
{
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    document.getElementById("user-input").addEventListener("keydown", function(event) 
    {
        if (event.keyCode === 13) 
            {
            if (!isMobile) 
                {
                if (!event.shiftKey) 
                    {
                    event.preventDefault();
                    sendMessage();
                }
            }
        }
    });
});

function openURL(url) 
{
    window.open(url, '_blank'); 
}

function openSidebar() 
{
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.add("open"); 
    var button = document.querySelector('.toggle-button');
    button.style.left = "200px"; 
}

function closeSidebar() 
{
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("open"); 
    var button = document.querySelector('.toggle-button');
    button.style.left = "0"; 
}

function toggleSidebar() 
{
    var sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("open")) 
    {
        closeSidebar();
    } 
    else 
    {
        openSidebar();
    }
}

