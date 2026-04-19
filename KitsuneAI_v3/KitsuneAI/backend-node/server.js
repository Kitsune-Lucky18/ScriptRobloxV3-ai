/**
 * =============================================
 *  KITSUNE AI — Node.js Backend (Express)
 *  File: backend-node/server.js
 *
 *  Jalankan:
 *    npm install
 *    node server.js
 *    atau: npm start
 *
 *  Akses frontend di: http://localhost:3000
 * =============================================
 */

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json({ limit: '20mb' }));  // Support base64 images
app.use(express.urlencoded({ extended: true }));

// ============ SERVE FRONTEND ============
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ============ HELPER ============
function getClient(apiKey) {
    // Use dynamic import for OpenAI (ESM compatibility)
    const { OpenAI } = require('openai');
    return new OpenAI({ apiKey });
}

// ============ CHAT ENDPOINT ============
app.post('/api/chat', async (req, res) => {
    try {
        const { api_key, model = 'gpt-4o', messages = [] } = req.body;
        
        const apiKey = api_key || process.env.OPENAI_API_KEY || '';
        
        if (!apiKey || !apiKey.startsWith('sk-')) {
            return res.status(400).json({
                error: { message: 'API key tidak valid atau kosong', code: 'invalid_api_key' }
            });
        }
        
        if (!messages.length) {
            return res.status(400).json({
                error: { message: 'Messages tidak boleh kosong', code: 'no_messages' }
            });
        }
        
        // Validasi model
        const allowedModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
        const safeModel = allowedModels.includes(model) ? model : 'gpt-4o';
        
        const { OpenAI } = require('openai');
        const client = new OpenAI({ apiKey });
        
        const systemPrompt = `Kamu adalah Kitsune AI, asisten AI super cerdas milik Kitsune_Lucky18. Sifat kamu: ramah, cermat, informatif, dan sedikit playful. Selalu jawab dalam Bahasa Indonesia yang natural dan mudah dipahami. Kalau ada gambar, analisis dengan sangat detail. Kalau ada kode, bantu debug/jelaskan dengan baik. Gunakan markdown untuk formatting jawaban yang panjang.`;
        
        const completion = await client.chat.completions.create({
            model: safeModel,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            max_tokens: 2048,
            temperature: 0.75,
        });
        
        const reply = completion.choices[0].message.content;
        
        res.json({
            choices: [{
                message: { role: 'assistant', content: reply }
            }],
            model: safeModel,
            usage: completion.usage
        });
        
    } catch (err) {
        console.error('Chat error:', err.message);
        
        const code = err.code || err.type || 'server_error';
        const status = code === 'invalid_api_key' ? 401
                     : code === 'insufficient_quota' ? 429 : 500;
        
        res.status(status).json({
            error: { message: err.message, code }
        });
    }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({
        status:  'ok',
        app:     'Kitsune AI',
        version: '2.0',
        backend: 'Node.js/Express',
        node:    process.version,
    });
});

// ============ MODELS LIST ============
app.get('/api/models', (req, res) => {
    res.json({
        models: [
            { id: 'gpt-4o',        name: 'GPT-4o',        vision: true,  recommended: true },
            { id: 'gpt-4o-mini',   name: 'GPT-4o Mini',   vision: true,  recommended: false },
            { id: 'gpt-4-turbo',   name: 'GPT-4 Turbo',   vision: true,  recommended: false },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', vision: false, recommended: false },
        ]
    });
});

// ============ 404 FALLBACK ============
app.use((req, res) => {
    res.status(404).json({ error: 'Route tidak ditemukan' });
});

// ============ START SERVER ============
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════╗
║        🦊 KITSUNE AI SERVER        ║
║  Backend: Node.js + Express        ║
║  Port: ${PORT}                         ║
║  URL: http://localhost:${PORT}         ║
╚════════════════════════════════════╝
    `);
});

module.exports = app;
