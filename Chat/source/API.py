from flask import Flask, render_template, request, jsonify
import openai
import logging
from moderation import moderate_content
from harmful import harmful_word
from textFile import read_text_files
from key import OPENAI_API_KEY

app = Flask(__name__, template_folder='templates')

# Configure logging
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Add a custom formatter to split long messages into multiple lines
class SplitLinesFormatter(logging.Formatter):
    def format(self, record):
        message = super().format(record)
        if len(message) > 100:  # Adjust the character limit as needed
            parts = [message[i:i+100] for i in range(0, len(message), 100)]
            return '\n'.join(parts)
        return message

# Set the custom formatter for the root logger
root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)
handler = logging.FileHandler('app.log')
handler.setFormatter(SplitLinesFormatter())
root_logger.addHandler(handler)

openai.api_key = OPENAI_API_KEY

app.static_folder = 'static'

@app.route('/')
def index():
    return render_template('website.html')

@app.route('/api', methods=['POST'])
def api():
    try:
        data = request.json
        history = data.get('history', [])

        if not isinstance(history, list):
            return jsonify({"error": "'history' must be a list of conversation history"}), 400

        # Extract the latest user input from the history
        user_input = next((entry['content'] for entry in reversed(history) if entry['role'] == 'user'), None)
        if not user_input:
            return jsonify({"error": "No user input found in the conversation history"}), 400

        logging.info("Received user input: %s", user_input)

        moderation_result = moderate_content(user_input, harmful_word)
        if "inappropriate content" in moderation_result.lower():
            return jsonify({"response": moderation_result})

        text_file_content = ""

        if any(keyword in user_input.lower() for keyword in ["degree program", "degree", "uts degree"]):
            text_file_content += read_text_files("degreeProgramme.txt") or ""
            text_file_content += read_text_files("degreeProgramme2.txt") or ""
            text_file_content += read_text_files("degreeProgramme3.txt") or ""
            text_file_content += read_text_files("degreeProgramme4.txt") or ""
        elif any(keyword in user_input.lower() for keyword in ["master program", "master", "uts master","postgraduate", "postgraduate program", "uts postgraduate"]):
            text_file_content += read_text_files("masterProgramme.txt") or ""
            text_file_content += read_text_files("masterProgramme2.txt") or ""
        elif any(keyword in user_input.lower() for keyword in ["foundation program", "foundation", "uts foundation"]):
            text_file_content = read_text_files("foundationProgramme.txt") or ""
        elif any(keyword in user_input.lower() for keyword in ["staff", "uts staff"]):
            text_file_content = read_text_files("staff.txt") or ""
        elif any(keyword in user_input.lower() for keyword in ["uts", "uts sibu"]):
            text_file_content = read_text_files("text.txt") or ""

        # Initial system messages
        system_message = "Provide information only about University of Technology Sarawak." if text_file_content else "You can ask me about anything."
        system_messages = [
            {"role": "system", "content": system_message}
        ]

        # Add the system message to the history
        full_conversation = system_messages + history

        # Add the text file content if available
        if text_file_content:
            full_conversation.append({"role": "system", "content": text_file_content})

        # Generate a response using OpenAI's GPT model
        completion = openai.chat.completions.create(model="gpt-3.5-turbo",
        messages=full_conversation,
        max_tokens=4096)

        if completion.choices and completion.choices[0].message:
            response = completion.choices[0].message.content
            logging.info("Chatbot response: %s", response)
            return jsonify({"response": response})
        else:
            logging.warning("No response from OpenAI")
            return jsonify({"response": "No response from OpenAI"})

    except Exception as e:
        logging.error("Error occurred: %s", e)
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    server_url = 'http://192.168.255.122:5000'  # IPv4 Address
    print(f"Server running at {server_url}")
    app.run(host='0.0.0.0', port=5000, debug=True)
