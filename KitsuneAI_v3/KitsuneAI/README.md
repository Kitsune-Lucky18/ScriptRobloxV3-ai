# 🦊 Kitsune AI — Panduan Lengkap

Asisten AI berbasis **GPT-4o** dengan UI mirip Claude.ai.  
Bisa upload foto, upload file kode, 12 tema warna, dan banyak lagi!

---

## 📁 Struktur Folder

```
KitsuneAI/
├── frontend/
│   ├── index.html      ← Halaman utama (HTML)
│   ├── style.css       ← Semua styling (CSS)
│   └── app.js          ← Logika aplikasi (JavaScript)
│
├── backend-python/
│   ├── server.py       ← Server Flask (Python)
│   ├── requirements.txt
│   └── .env.example
│
├── backend-node/
│   ├── server.js       ← Server Express (Node.js)
│   ├── package.json
│   └── .env.example
│
└── README.md           ← File ini
```

---

## 🚀 Cara 1: Buka Langsung (Paling Mudah)

Cukup **double-click** file `frontend/index.html` di browser.  
Masukkan API Key OpenAI saat diminta, langsung bisa dipakai!

**Keuntungan:** Tidak perlu install apapun.  
**Kekurangan:** API key muncul di network request browser.

---

## 🐍 Cara 2: Pakai Python Backend (Direkomendasikan)

### Langkah-langkah:

**1. Install Python** (versi 3.8+)  
Download di: https://python.org/downloads

**2. Buka terminal di folder `backend-python/`**

**3. Install dependencies:**
```bash
pip install -r requirements.txt
```

**4. Setup API Key:**
```bash
# Copy file .env.example jadi .env
cp .env.example .env

# Edit .env dengan text editor, isi API key kamu:
# OPENAI_API_KEY=sk-proj-xxxxxxxx
```

**5. Jalankan server:**
```bash
python server.py
```

**6. Buka browser:**
```
http://localhost:5000
```

✅ Selesai! Kitsune AI berjalan di Python backend.

---

## 🟢 Cara 3: Pakai Node.js Backend

### Langkah-langkah:

**1. Install Node.js** (versi 18+)  
Download di: https://nodejs.org

**2. Buka terminal di folder `backend-node/`**

**3. Install dependencies:**
```bash
npm install
```

**4. Setup API Key:**
```bash
# Copy file .env.example jadi .env
cp .env.example .env

# Edit .env, isi API key kamu:
# OPENAI_API_KEY=sk-proj-xxxxxxxx
```

**5. Jalankan server:**
```bash
npm start
# atau untuk development (auto-restart):
npm run dev
```

**6. Buka browser:**
```
http://localhost:3000
```

✅ Selesai! Kitsune AI berjalan di Node.js backend.

---

## 🔑 Cara Dapat API Key OpenAI

1. Buka https://platform.openai.com
2. Daftar akun (gratis)
3. Masuk ke menu **API Keys**
4. Klik **"Create new secret key"**
5. Copy key yang dimulai dengan `sk-proj-...`
6. Paste ke Kitsune AI saat diminta

> 💡 Akun baru biasanya dapat **kredit gratis** untuk mencoba!

---

## ✨ Fitur Lengkap

| Fitur | Keterangan |
|-------|------------|
| 🤖 GPT-4o | Model AI paling pintar dari OpenAI |
| 📷 Upload Foto | Kirim gambar, AI akan analisis |
| 💻 Upload Kode | Python, JS, HTML, CSS, dan lainnya |
| 🎨 12 Tema | Ungu, Biru, Hijau, Oranye, Merah, Gelap, Emas, Pink, Tosca, Sage, Lavender, Kopi |
| 🎨 Custom Color | Color picker untuk tiap elemen UI |
| 📝 Markdown | Bold, list, kode, tabel, blockquote |
| 💾 Riwayat | Tersimpan otomatis di browser |
| 🔍 Pencarian | Cari riwayat percakapan |
| 🔒 Privacy | API key hanya di browsermu |
| 📱 Responsive | Bisa dipakai di HP |

---

## 🎨 Daftar Tema

1. **Ungu** — Lembut & elegan (default)
2. **Biru** — Profesional & jernih
3. **Hijau** — Natural & segar
4. **Oranye** — Hangat & energik
5. **Merah** — Bold & berani
6. **Gelap** — Dark mode modern
7. **Emas** — Mewah & elegan
8. **Pink** — Manis & playful
9. **Tosca** — Segar & modern
10. **Sage** — Natural & calm
11. **Lavender** — Soft & dreamy
12. **Kopi** — Cozy & warm

---

## ❓ FAQ

**Q: Apakah API key saya aman?**  
A: Ya! API key hanya disimpan di localStorage browsermu dan dikirim langsung ke OpenAI. Tidak ada server pihak ketiga yang menyimpannya.

**Q: Berapa biaya pakai GPT-4o?**  
A: Kamu bayar langsung ke OpenAI berdasarkan usage. Cek harga di: https://openai.com/pricing

**Q: Bisa pakai model lain selain GPT-4o?**  
A: Bisa! Di Settings, pilih GPT-4o Mini (lebih hemat) atau GPT-4 Turbo.

**Q: Kenapa foto tidak bisa dianalisis?**  
A: Pastikan pakai model GPT-4o atau GPT-4o Mini (yang mendukung vision).

---

## 👑 Credits

- **Owner:** Kitsune_Lucky18
- **AI Engine:** GPT-4o by OpenAI  
- **YouTube:** https://youtube.com/@Kitsune_Lucky18

---

*Kitsune AI v2.0 — Dibuat dengan ❤️*
