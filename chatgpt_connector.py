import requests

# API Endpoints
STORE_URL = "http://localhost:3000/store"
RETRIEVE_URL = "http://localhost:3000/latest"

# Function to store a message in Rook API
def store_memory(text):
    data = {"text": text}
    response = requests.post(STORE_URL, json=data)
    return response.json()

# Function to retrieve the latest stored memory
def retrieve_memory():
    response = requests.get(RETRIEVE_URL)
    return response.json()

# Simulating AI interaction
if __name__ == "__main__":
    print("\n🔍 Checking AI Memory...")
    memory = retrieve_memory()
    
    if memory.get("text") != "No memory yet.":
        print(f"🧠 AI RECALLS: {memory['text']}")
    else:
        print("🧠 AI has no memory yet.")

    # Simulated AI response
    new_memory = input("\n💬 Enter something for AI to remember: ")
    
    print("\n💾 Storing AI Memory...")
    store_result = store_memory(new_memory)
    print(store_result)

    print("\n✅ AI memory has been updated.")
