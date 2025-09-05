from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  

genai.configure(api_key="AIzaSyA7aLunJ6T-TxJ7VtERoaA1BpSnkhIrlYs")
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"answer": "No text provided."})

    try:
        prompt = (
            f"Explain the following text clearly and factually in the style of Wikipedia. "
            f"Keep the explanation under 100 words. Do not ask questions or provide extra commentary. "
            f"Just provide concise information.\n\nText: {text}"
        )

        response = model.generate_content(prompt)
        return jsonify({"answer": response.text.strip()})
    except Exception as e:
        return jsonify({"answer": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
