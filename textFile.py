import os
import openai
from moderation import moderate_content

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key not found. Set the OPENAI_API_KEY environment variable.")

openai.api_key = OPENAI_API_KEY

class TextProcessor:
    def read_text_files(self, filename):
        directory = os.path.join("source", "textfile")
        file_path = os.path.join(directory, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read().strip()
        except FileNotFoundError:
            return f"Error: File '{filename}' not found in directory '{directory}'."
        except Exception as e:
            return f"Error: Unable to read file '{filename}' - {str(e)}"

    def process_text(self, text):
        if not text:
            return "No text to process."
        try:
            response = openai.chat.completions.create(model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": text}
            ],
            max_tokens=4096)
            return response.choices[0].message.content.strip()
        except openai.InvalidRequestError as e:
            return f"Error: OpenAI request failed - {str(e)}"
        except Exception as e:
            return f"Error: An unexpected error occurred - {str(e)}"

class ContentModerator(TextProcessor):
    def process_text(self, text):
        moderation_result = moderate_content(text)
        print("Moderation Result:", moderation_result)

        if "inappropriate content" in moderation_result.lower():
            return moderation_result
        else:
            return super().process_text(text)

def main():
    filenames = [
        "degreeProgramme.txt", 
        "degreeProgramme2.txt",
        "degreeProgramme3.txt", 
        "degreeProgramme4.txt",
        "text.txt", 
        "masterProgramme.txt",
        "masterProgramme2.txt", 
        "foundationProgramme.txt", 
        "staff.txt"
    ]

    moderator = ContentModerator()

    for filename in filenames:
        print(f"Processing file: {filename}")
        text = moderator.read_text_files(filename)
        if "Error" not in text:
            response = moderator.process_text(text)
            print("Response:")
            print(response)
        else:
            print(text)

if __name__ == "__main__":
    main()