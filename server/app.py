from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS  # Corrected import statement

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to MongoDB
client = MongoClient('mongodb+srv://pd9505424580:2pOoySPF9yTWac3B@cluster0.xhrp6rm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['fakedata']  # Create the 'fakedata' database
collection = db['data']  # Create the 'data' collection

@app.route('/data', methods=['GET'])
def get_data():
    try:
        # Retrieve all documents in the 'data' collection
        documents = list(collection.find({}, {'_id': False}))
        return jsonify(documents), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['POST'])
def post_data():
    try:
        # Check if the request has JSON data
        if not request.is_json:
            return jsonify({"error": "Missing JSON in request"}), 400

        # Insert new document into the 'data' collection
        data = request.get_json()  # This method is more explicit
        if not isinstance(data, dict):
            return jsonify({"error": "Data is not a dictionary"}), 400

        result = collection.insert_one(data)
        return jsonify({'inserted_id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
