from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enhanced CORS

# Load models with error handling
try:
    model = joblib.load('spam_model.pkl')
    vectorizer = joblib.load('tfidf_vectorizer.pkl')
    print("✅ Models loaded! Ready for predictions.")
except Exception as e:
    print(f"❌ Model load failed: {e}")
    model = vectorizer = None

@app.route('/')
def home():
    return jsonify({"status": "API running ✅", "endpoint": "/predict"})

@app.route('/predict', methods=['POST', 'OPTIONS'])  # Allow OPTIONS too
def predict():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        if not data or not data.get('message', '').strip():
            return jsonify({"error": "Empty message"}), 400
        
        message = [data['message'].strip()]
        features = vectorizer.transform(message)
        prediction = int(model.predict(features)[0])
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities))
        
        return jsonify({
            "spam": prediction == 1,
            "confidence": confidence,
            "label": "SPAM" if prediction == 1 else "HAM"
        })
        
    except Exception as e:
        print(f"❌ Prediction error: {traceback.format_exc()}")
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
