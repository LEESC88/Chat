import random

def check_for_harmful_words(input_text, harmful_words):
    text = input_text.lower()
    words = text.split()
    
    detected_words = [word for word in words if word in harmful_words]
    
    if detected_words:
        return True
    else:
        return False

def moderate_content(input_text, harmful_words=[]):
    try:
        if not input_text or not isinstance(input_text, str):
            return "Invalid input text."

        if check_for_harmful_words(input_text, harmful_words):

            random_number = random.random()
            
            if random_number < 0.33 :
                
                return "Your message contains inappropriate content. Please refrain from using offensive language."

            elif random_number < 0.66 : 
                return "We're sorry, but your message has been flagged for inappropriate content."
            
            else:
                return "Your message has been removed due to violating community guidelines."
            
        return ""
    except Exception as e:
        return f"Error: {str(e)}"
