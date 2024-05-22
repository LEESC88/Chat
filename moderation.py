import random

def check_for_harmful_words(input_text, harmful_words):
    text = input_text.lower()
    words = text.split()
    
    detected_words = [word for word in words if word in harmful_words]
    
    return bool(detected_words)

def moderate_content(input_text, harmful_words=[]):
    try:
        if not input_text or not isinstance(input_text, str):
            return "Invalid input text."

        if check_for_harmful_words(input_text, harmful_words):
            responses = [
                "Your message contains inappropriate content. Please refrain from using offensive language.",
                "We're sorry, but your message has been flagged for inappropriate content.",
                "Your message has been removed due to violating community guidelines.",
                "Inappropriate content detected in your message. Please adhere to community standards.",
                "Message flagged for harmful content. Please avoid using such language."
            ]
            
            return random.choice(responses)
            
        return ""
    except Exception as e:
        return f"Error: {str(e)}"
