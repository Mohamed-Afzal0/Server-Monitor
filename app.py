from flask import Flask, jsonify, send_from_directory
from agent.monitor import get_all_metrics

app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

@app.route('/metrics')
def metrics():
    data = get_all_metrics()
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)