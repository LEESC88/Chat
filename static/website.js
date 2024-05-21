class ChatMessage 
{
    constructor(role, content) 
    {
        this.role = role;
        this.content = content;
    }

    toMarkdown()
    {
        return this.content.replace(/\n/g, "<br>");
    }
}

class ChatBot 
{
    constructor() 
    {
        this.conversationHistory = [];
        this.isFullscreen = false;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.initEventListeners();
    }

    initEventListeners() 
    {
        document.addEventListener('DOMContentLoaded', () => 
        {
            const chatbotToggler = document.querySelector('.chatbot-toggler');
            const chatbotContainer = document.getElementById('chatbot-container'); 
            chatbotToggler.addEventListener('click', () => 
            {
                chatbotContainer.classList.toggle('hidden');
            });  
            const fullscreenButton = document.getElementById('fullscreen-button');
            if (fullscreenButton) 
            {
                fullscreenButton.addEventListener('click', () => 
                {
                    this.toggleFullScreen();
                });
            } 
            else 
            {
                console.error("Element with id 'fullscreen-button' not found.");
            }
            document.getElementById("user-input").addEventListener("keydown", (event) => 
            {
                if (event.keyCode === 13) 
                {
                    if (!this.isMobile) 
                    {
                        if (!event.shiftKey) 
                        {
                            event.preventDefault();
                            this.sendMessage();
                        }
                    }
                }
            });
        });
    }

    toggleFullScreen() 
    {
        const bodyElement = document.body;
        if (!this.isFullscreen) 
        {
            bodyElement.classList.add('fullscreen');
            this.isFullscreen = true;
        } 
        else 
        {
            bodyElement.classList.remove('fullscreen');
            this.isFullscreen = false;
        }
    }

    sendMessage() 
    {
        const userInput = document.getElementById("user-input").value;
        if (!userInput) return;
        const userMessage = new ChatMessage('user', userInput);
        this.conversationHistory.push(userMessage);
        this.displayMessage("You", userMessage.toMarkdown());
        const typingIndicatorElement = this.displayMessage("UTU", "<span class='typing-animation'>.......</span>");
        fetch('/api', 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ history: this.conversationHistory }),
        })
        .then(response => response.json())
        .then(data => 
        {
            console.log('Response from server:', data);
            if (data && data.response !== undefined) 
            {
                const aiMessage = new ChatMessage('assistant', data.response);
                this.conversationHistory.push(aiMessage);
                this.updateMessage(typingIndicatorElement, aiMessage.toMarkdown());
            } 
            else 
            {
                console.error('Invalid response from server:', data);
                this.updateMessage(typingIndicatorElement, "Sorry, something went wrong.");
            }
        })
        .catch(error => 
        {
            console.error('Error:', error);
            this.updateMessage(typingIndicatorElement, "Sorry, something went wrong.");
        });
        document.getElementById("user-input").value = "";
    }

    displayMessage(sender, message) 
    {
        const chatMessages = document.getElementById("chat-messages");
        const messageElement = document.createElement("div");
        const senderElement = document.createElement("span");
        const senderIcon = document.createElement("img");
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
        const messageText = document.createElement("span");
        messageText.innerHTML = "<br>" + message;
        messageElement.appendChild(messageText);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return messageElement;
    }

    updateMessage(messageElement, newContent) 
    {
        messageElement.querySelector("span:last-child").innerHTML = "<br>" + newContent;
    }
}

function openURL(url) 
{
    window.open(url, '_blank');
}

function openSidebar() 
{
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.add("open");
    const button = document.querySelector('.toggle-button');
    button.style.left = "200px";
}

function closeSidebar() 
{
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("open");
    const button = document.querySelector('.toggle-button');
    button.style.left = "0";
}

function toggleSidebar() 
{
    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("open")) 
    {
        closeSidebar();
    } 
    else 
    {
        openSidebar();
    }
}

const chatBot = new ChatBot();
