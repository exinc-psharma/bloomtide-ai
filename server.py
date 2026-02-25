from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import json
import os
import re
import io
import base64
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')
BLOOMS_FILE = os.path.join(DATA_DIR, 'blooms.json')
IMAGES_DIR = os.path.join(DATA_DIR, 'blooms_img')

HF_API_KEY = os.getenv('HF_API_KEY', '')
HF_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
HF_URL = f'https://router.huggingface.co/hf-inference/models/{HF_MODEL}'

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

# ── AI Bloom Generation ──
@app.route('/api/generate-bloom', methods=['POST'])
def generate_bloom():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'Invalid JSON.'}), 400

    word1 = (data.get('word1') or '').strip()[:30]
    word2 = (data.get('word2') or '').strip()[:30]
    word3 = (data.get('word3') or '').strip()[:30]
    tide_level = data.get('tideLevel', 50)

    if not word1 or not word2 or not word3:
        return jsonify({'success': False, 'error': 'All 3 words are required.'}), 400

    if not HF_API_KEY or HF_API_KEY == 'your_huggingface_api_key_here':
        return jsonify({'success': False, 'error': 'HuggingFace API key not configured. Add it to .env file.'}), 500

    # Build a smart prompt that uses all 3 words to influence the flower
    tide_pct = int(tide_level)
    if tide_pct < 33:
        tide_mood = 'calm, serene, gentle, soft pastel'
        tide_desc = 'low gentle tide'
    elif tide_pct < 66:
        tide_mood = 'balanced, vibrant, natural, harmonious'
        tide_desc = 'moderate flowing tide'
    else:
        tide_mood = 'powerful, bold, intense, dramatic, tropical'
        tide_desc = 'high surging tide'

    prompt = (
        f"A stunning artistic bloom flower inspired by the words '{word1}', '{word2}', and '{word3}'. "
        f"The flower embodies the essence of {word1}, the spirit of {word2}, and the nature of {word3}. "
        f"Set against a {tide_desc} ocean background. {tide_mood} mood. "
        f"Beautiful digital art, high detail, vibrant colors, dark background with ocean waves, "
        f"fantasy botanical illustration, glowing petals, magical atmosphere, 4k quality"
    )

    negative_prompt = "text, watermark, ugly, blurry, low quality, distorted, deformed, nsfw"

    print(f'[{datetime.now().strftime("%H:%M:%S")}] Generating bloom: "{word1}" + "{word2}" + "{word3}" @ tide {tide_pct}%')
    print(f'  Prompt: {prompt[:120]}...')

    try:
        response = requests.post(
            HF_URL,
            headers={'Authorization': f'Bearer {HF_API_KEY}'},
            json={
                'inputs': prompt,
                'parameters': {
                    'negative_prompt': negative_prompt,
                    'width': 512,
                    'height': 512,
                    'num_inference_steps': 30,
                    'guidance_scale': 7.5
                }
            },
            timeout=120
        )

        if response.status_code == 200 and response.headers.get('content-type', '').startswith('image'):
            # Save image to file
            bloom_id = len(read_json(BLOOMS_FILE)) + 1
            img_filename = f'bloom_{bloom_id}.png'
            img_path = os.path.join(IMAGES_DIR, img_filename)
            with open(img_path, 'wb') as f:
                f.write(response.content)

            # Save bloom metadata
            blooms = read_json(BLOOMS_FILE)
            entry = {
                'id': bloom_id,
                'words': [word1, word2, word3],
                'tideLevel': tide_pct,
                'image': img_filename,
                'timestamp': datetime.now().isoformat()
            }
            blooms.append(entry)
            write_json(BLOOMS_FILE, blooms)

            # Return image as base64
            img_b64 = base64.b64encode(response.content).decode('utf-8')
            print(f'  ✅ Bloom #{bloom_id} generated and saved!')

            return jsonify({
                'success': True,
                'bloom': entry,
                'image': f'data:image/png;base64,{img_b64}'
            })
        else:
            error_msg = 'AI model is loading, please wait 30s and try again.'
            try:
                err_data = response.json()
                if 'error' in err_data:
                    error_msg = err_data['error']
                if 'estimated_time' in err_data:
                    error_msg += f' (estimated wait: {int(err_data["estimated_time"])}s)'
            except:
                pass
            print(f'  ❌ API error: {error_msg}')
            return jsonify({'success': False, 'error': error_msg}), 503

    except requests.Timeout:
        return jsonify({'success': False, 'error': 'AI took too long. Please try again.'}), 504
    except Exception as e:
        print(f'  ❌ Error: {str(e)}')
        return jsonify({'success': False, 'error': f'Generation failed: {str(e)}'}), 500

# ── Serve bloom images ──
@app.route('/api/blooms/img/<filename>')
def serve_bloom_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

# ── Blooms API ──
@app.route('/api/blooms', methods=['GET'])
def get_blooms():
    return jsonify({'blooms': read_json(BLOOMS_FILE)})

@app.route('/api/blooms/<int:bloom_id>', methods=['DELETE'])
def delete_bloom(bloom_id):
    blooms = read_json(BLOOMS_FILE)
    blooms = [b for b in blooms if b.get('id') != bloom_id]
    write_json(BLOOMS_FILE, blooms)
    return jsonify({'success': True, 'message': 'Bloom removed.'})

# ── Contact API (existing) ──
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
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)
    for f in [MESSAGES_FILE, BLOOMS_FILE]:
        if not os.path.exists(f):
            write_json(f, [])

    print('\n🌸 BloomTide AI Server')
    print('🚀 Landing page:  http://localhost:3000')
    print('🏠 Main site:     http://localhost:3000/main')
    print('🌊 Blooms API:    http://localhost:3000/api/blooms')
    print('🤖 AI Generate:   http://localhost:3000/api/generate-bloom')
    if HF_API_KEY and HF_API_KEY != 'your_huggingface_api_key_here':
        print('✅ HuggingFace API key loaded!')
    else:
        print('⚠️  No HuggingFace API key! Add HF_API_KEY to .env file')
    print('\nPress Ctrl+C to stop.\n')
    app.run(host='0.0.0.0', port=3000, debug=False)
