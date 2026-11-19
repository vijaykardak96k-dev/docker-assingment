from flask import Flask, request, jsonify
from datetime import datetime, timezone
import re

app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "flask-backend"}), 200

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({"error": "Invalid email address"}), 400

    return jsonify({
        "message": "Registration processed successfully!",
        "name": name,
        "email": email,
        "processed_at": datetime.now(timezone.utc).isoformat()
    }), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
