document.addEventListener('DOMContentLoaded', function () 
{
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbotContainer = document.getElementById('chatbot-container');

    chatbotToggler.addEventListener('click', function () 
    {
        chatbotContainer.classList.toggle('hidden');
    });
});

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

var conversationHistory = [];

function convertToMarkdown(text) 
{
    var markdownText = text.replace(/\n/g, "<br>");
    return "\n" + markdownText + "\n";
}

function sendMessage() 
{
    var userInput = document.getElementById("user-input").value;
    if (!userInput) return; // Do nothing if the input is empty

    // Convert user's input to Markdown format
    var userInputMarkdown = convertToMarkdown(userInput);
    // Update the conversation history with the user's message
    conversationHistory.push({ role: 'user', content: userInput });

    displayMessage("You", userInputMarkdown); // Display user's message

    // Show the "typing" indicator for the AI
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
        // Log the response to inspect what's returned
        console.log('Response from server:', data);
        // Display AI's response if it's not undefined
        if (data && data.response !== undefined) 
        {
            // Update the conversation history with the AI's response
            conversationHistory.push({ role: 'assistant', content: data.response });
            // Convert AI's response to Markdown format
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

    document.getElementById("user-input").value = ""; // Clear input field after sending message
}

function displayMessage(sender, message) 
{
    var chatMessages = document.getElementById("chat-messages");
    var messageElement = document.createElement("div");
    
    // Create an element for the sender with an icon
    var senderElement = document.createElement("span");
    var senderIcon = document.createElement("img");

    // Set the source and alt attributes for the icon
    if (sender === "You") 
    {
        senderIcon.src = "static/images/user 16x16.png"; // Relative path from your HTML file
        senderIcon.alt = "User Icon";
    } 
    else if (sender === "UTU") 
    {
        senderIcon.src = "static/images/favicon-16x16.png"; // Relative path from your HTML file
        senderIcon.alt = "Assistant Icon";
    }

    senderIcon.style.width = "16px"; // Set width for the icon
    senderIcon.style.height = "16px"; // Set height for the icon
    senderIcon.style.marginRight = "5px"; // Optional: space between icon and text

    senderElement.appendChild(senderIcon);
    senderElement.appendChild(document.createTextNode(sender + ": "));
    messageElement.appendChild(senderElement);

    // Create an element for the message content
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
    // Add event listener to input field for sending message or inserting newline based on key press
    document.getElementById("user-input").addEventListener("keydown", function(event) 
    {
        if (event.keyCode === 13) 
            { // Check if the key pressed is the Enter key
            if (event.shiftKey) 
            {
                // If Shift is also held down, just insert a newline (default behavior, no need to prevent default)
            } 
            else 
            {
                // If only Enter is pressed, prevent default behavior and send the message
                event.preventDefault();
                sendMessage();
            }
        }
    });
});
function openURL(url) 
{
    window.open(url, '_blank'); // Opens the URL in a new tab
}

function openSidebar() 
{
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.add("open"); // Add the "open" class to display the sidebar
    var button = document.querySelector('.toggle-button');
    button.style.left = "200px"; // Move the button to the right
}

function closeSidebar() 
{
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("open"); // Remove the "open" class to hide the sidebar
    var button = document.querySelector('.toggle-button');
    button.style.left = "0"; // Move the button back to its original position
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

