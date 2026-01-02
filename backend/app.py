from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import traceback

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models safely
try:
    model = joblib.load(os.path.join(BASE_DIR, "spam_model.pkl"))
    vectorizer = joblib.load(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))
    print("✅ Models loaded! Ready for predictions.")
except Exception as e:
    print("❌ Model load failed:", e)
    model = vectorizer = None

@app.route("/")
def home():
    return jsonify({
        "status": "API running ✅",
        "endpoint": "/predict"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if not model or not vectorizer:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.get_json()
        if not data or not data.get("message", "").strip():
            return jsonify({"error": "Empty message"}), 400

        message = [data["message"].strip()]
        features = vectorizer.transform(message)

        prediction = int(model.predict(features)[0])
        confidence = float(model.predict_proba(features)[0].max())

        return jsonify({
            "spam": prediction == 1,
            "label": "SPAM" if prediction == 1 else "HAM",
            "confidence": confidence
        })

    except Exception:
        print(traceback.format_exc())
        return jsonify({"error": "Prediction failed"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

