"""
=============================================
 KITSUNE AI — Python Backend (Flask)
 File: backend-python/server.py
 
 Jalankan:
   pip install flask flask-cors openai python-dotenv
   python server.py
 
 Akses frontend di: http://localhost:5000
=============================================
"""

import os
import json
import base64
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # Load dari file .env

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Izinkan cross-origin requests

# ============ SERVE FRONTEND ============
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend', path)

# ============ CHAT ENDPOINT ============
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        api_key   = data.get('api_key') or os.getenv('OPENAI_API_KEY', '')
        model     = data.get('model', 'gpt-4o')
        messages  = data.get('messages', [])
        
        if not api_key:
            return jsonify({'error': {'message': 'API key tidak ditemukan', 'code': 'no_api_key'}}), 400
        
        if not messages:
            return jsonify({'error': {'message': 'Messages kosong', 'code': 'no_messages'}}), 400
        
        # Validasi model
        allowed_models = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
        if model not in allowed_models:
            model = 'gpt-4o'
        
        client = OpenAI(api_key=api_key)
        
        system_prompt = """Kamu adalah Kitsune AI, asisten AI super cerdas milik Kitsune_Lucky18. 
Sifat kamu: ramah, cermat, informatif, dan sedikit playful. 
Selalu jawab dalam Bahasa Indonesia yang natural dan mudah dipahami. 
Kalau ada gambar, analisis dengan sangat detail. 
Kalau ada kode, bantu debug/jelaskan dengan baik. 
Gunakan markdown untuk formatting jawaban yang panjang."""
        
        # Tambahkan system message
        full_messages = [{'role': 'system', 'content': system_prompt}] + messages
        
        response = client.chat.completions.create(
            model=model,
            messages=full_messages,
            max_tokens=2048,
            temperature=0.75,
        )
        
        reply = response.choices[0].message.content
        
        return jsonify({
            'choices': [{
                'message': {
                    'role': 'assistant',
                    'content': reply
                }
            }],
            'model': model,
            'usage': {
                'prompt_tokens':     response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens':      response.usage.total_tokens,
            }
        })
        
    except Exception as e:
        err_str = str(e)
        if 'invalid_api_key' in err_str or 'Incorrect API key' in err_str:
            return jsonify({'error': {'message': 'API key tidak valid', 'code': 'invalid_api_key'}}), 401
        if 'insufficient_quota' in err_str:
            return jsonify({'error': {'message': 'Kredit API habis', 'code': 'insufficient_quota'}}), 429
        return jsonify({'error': {'message': str(e), 'code': 'server_error'}}), 500


# ============ HEALTH CHECK ============
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'app':    'Kitsune AI',
        'version': '2.0',
        'backend': 'Python/Flask'
    })


# ============ MODELS LIST ============
@app.route('/api/models', methods=['GET'])
def models():
    return jsonify({
        'models': [
            {'id': 'gpt-4o',       'name': 'GPT-4o',       'vision': True,  'recommended': True},
            {'id': 'gpt-4o-mini',  'name': 'GPT-4o Mini',  'vision': True,  'recommended': False},
            {'id': 'gpt-4-turbo',  'name': 'GPT-4 Turbo',  'vision': True,  'recommended': False},
            {'id': 'gpt-3.5-turbo','name': 'GPT-3.5 Turbo','vision': False, 'recommended': False},
        ]
    })


# ============ MAIN ============
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'true').lower() == 'true'
    
    print(f"""
╔════════════════════════════════════╗
║        🦊 KITSUNE AI SERVER        ║
║  Backend: Python + Flask           ║
║  Port: {port}                         ║
║  URL: http://localhost:{port}         ║
╚════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
