from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import re
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')
BLOOMS_FILE = os.path.join(DATA_DIR, 'blooms.json')

# ── Ensure data dirs exist (works with gunicorn too) ──
os.makedirs(DATA_DIR, exist_ok=True)
for _f in [MESSAGES_FILE, BLOOMS_FILE]:
    if not os.path.exists(_f):
        with open(_f, 'w') as _fp:
            json.dump([], _fp)

# ── Helpers ──
def read_json(filepath):
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_json(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

# ── Page Routes ──
@app.route('/')
def landing():
    return send_from_directory('.', 'puzzle.html')

@app.route('/main')
def main_site():
    return send_from_directory('.', 'index.html')

# ── Blooms API ──
@app.route('/api/blooms', methods=['POST'])
def create_bloom():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'Invalid JSON.'}), 400

    words = data.get('words', [])
    tide_level = data.get('tideLevel', 50)
    seed = data.get('seed', 0)

    if not words or len(words) < 1:
        return jsonify({'success': False, 'error': 'Words are required.'}), 400

    blooms = read_json(BLOOMS_FILE)
    entry = {
        'id': len(blooms) + 1,
        'words': words[:3],
        'tideLevel': int(tide_level),
        'seed': seed,
        'timestamp': datetime.now().isoformat()
    }
    blooms.append(entry)
    write_json(BLOOMS_FILE, blooms)

    print(f'[{datetime.now().strftime("%H:%M:%S")}] 🌸 Bloom saved: {" + ".join(words[:3])} @ tide {tide_level}%')
    return jsonify({'success': True, 'bloom': entry, 'message': 'Bloom saved to the tide!'}), 201

@app.route('/api/blooms', methods=['GET'])
def get_blooms():
    return jsonify({'blooms': read_json(BLOOMS_FILE)})

@app.route('/api/blooms/<int:bloom_id>', methods=['DELETE'])
def delete_bloom(bloom_id):
    blooms = read_json(BLOOMS_FILE)
    blooms = [b for b in blooms if b.get('id') != bloom_id]
    write_json(BLOOMS_FILE, blooms)
    return jsonify({'success': True, 'message': 'Bloom removed.'})

# ── Contact API ──
@app.route('/api/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'Invalid JSON.'}), 400
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    subject = (data.get('subject') or '').strip()
    message = (data.get('message') or '').strip()
    if not name or not email or not message:
        return jsonify({'success': False, 'error': 'Name, email, and message are required.'}), 400
    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return jsonify({'success': False, 'error': 'Invalid email format.'}), 400
    messages = read_json(MESSAGES_FILE)
    entry = {
        'id': len(messages) + 1,
        'name': name, 'email': email, 'subject': subject, 'message': message,
        'timestamp': datetime.now().isoformat()
    }
    messages.append(entry)
    write_json(MESSAGES_FILE, messages)
    return jsonify({'success': True, 'message': 'Message received!'}), 201

@app.route('/api/contact', methods=['GET'])
def get_contacts():
    return jsonify({'messages': read_json(MESSAGES_FILE)})

# ── Start ──
if __name__ == '__main__':
    print('\n🌸 BloomTide AI Server')
    print('🚀 Landing page:  http://localhost:3000')
    print('🏠 Main site:     http://localhost:3000/main')
    print('🌊 Blooms API:    http://localhost:3000/api/blooms')
    print('\nPress Ctrl+C to stop.\n')
    app.run(host='0.0.0.0', port=3000, debug=False)
