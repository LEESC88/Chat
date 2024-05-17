import os
import openai
from key import OPENAI_API_KEY
from moderation import moderate_content

openai.api_key = OPENAI_API_KEY

def read_text_files(filename):
    directory = os.path.join("source", "textfile")
    file_path = os.path.join(directory, filename)
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        return f"Error: File '{filename}' not found in directory '{directory}'."
    except Exception as e:
        return f"Error: Unable to read file '{filename}' - {str(e)}"

def process_text(text):
    if not text:
        return "No text to process."
    try:
        moderation_result = moderate_content(text)
        print("Moderation Result:", moderation_result)

        if "inappropriate content" in moderation_result.lower():
            return moderation_result

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

    for filename in filenames:
        print(f"Processing file: {filename}")
        text = read_text_files(filename)
        if "Error" not in text:
            response = process_text(text)
            print("Response:")
            print(response)
        else:
            print(text)

if __name__ == "__main__":
    main()
