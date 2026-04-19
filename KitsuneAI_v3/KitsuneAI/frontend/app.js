/* =============================================
   KITSUNE AI — app.js  v3.0
   Script Hub + Chat + Semua Bahasa Pemrograman
   ============================================= */
'use strict';

// ===== STATE =====
let API_KEY        = localStorage.getItem('kit_key') || '';
let selectedModel  = localStorage.getItem('kit_model') || 'gpt-4o';
let messages       = [];
let loading        = false;
let pendingImgB64  = null;
let pendingImgMime = null;
let pendingCode    = null;
let pendingCodeName= null;
let chatHistory    = JSON.parse(localStorage.getItem('kit_history') || '[]');
let currentTab     = 'chat';
let markdownEnabled= true;
let scripts        = JSON.parse(localStorage.getItem('kit_scripts') || '[]');
let scriptFilter   = 'all';
let scriptSearch   = '';

// ===== THEMES =====
const THEMES = [
  {name:'Ungu',    accent:'#7c6fcd',accent2:'#c46b9a',bg:'#f5f4f0',bg2:'#ffffff',bg3:'#ececea',sidebar:'#eeede8',text:'#1a1a1a',text2:'#6b6b6b'},
  {name:'Biru',    accent:'#2563eb',accent2:'#0ea5e9',bg:'#f0f4ff',bg2:'#ffffff',bg3:'#e0e8ff',sidebar:'#e8eef8',text:'#0f172a',text2:'#475569'},
  {name:'Hijau',   accent:'#16a34a',accent2:'#65a30d',bg:'#f0fdf4',bg2:'#ffffff',bg3:'#dcfce7',sidebar:'#e8f5ed',text:'#14532d',text2:'#4b7c5a'},
  {name:'Oranye',  accent:'#ea580c',accent2:'#d97706',bg:'#fff7ed',bg2:'#ffffff',bg3:'#fed7aa',sidebar:'#faebd7',text:'#431407',text2:'#7c3c1a'},
  {name:'Merah',   accent:'#e11d48',accent2:'#be185d',bg:'#fff1f2',bg2:'#ffffff',bg3:'#fecdd3',sidebar:'#ffe4e8',text:'#4c0519',text2:'#9d174d'},
  {name:'Gelap',   accent:'#818cf8',accent2:'#a78bfa',bg:'#111827',bg2:'#1f2937',bg3:'#374151',sidebar:'#0d1117',text:'#f9fafb',text2:'#9ca3af'},
  {name:'Emas',    accent:'#d4af37',accent2:'#c0a060',bg:'#0a0a0a',bg2:'#141414',bg3:'#202020',sidebar:'#0d0d0d',text:'#f5f5f0',text2:'#888880'},
  {name:'Pink',    accent:'#ec4899',accent2:'#f43f5e',bg:'#fdf2f8',bg2:'#ffffff',bg3:'#fce7f3',sidebar:'#fce8f8',text:'#500724',text2:'#9d174d'},
  {name:'Tosca',   accent:'#0891b2',accent2:'#0d9488',bg:'#f0fdff',bg2:'#ffffff',bg3:'#cffafe',sidebar:'#e0f9fd',text:'#0c4a6e',text2:'#0e7490'},
  {name:'Sage',    accent:'#84cc16',accent2:'#22d3ee',bg:'#f8fef0',bg2:'#ffffff',bg3:'#ecfccb',sidebar:'#f0fae0',text:'#1a2e05',text2:'#4d7c0f'},
  {name:'Lavender',accent:'#9b59b6',accent2:'#8e44ad',bg:'#faf5ff',bg2:'#ffffff',bg3:'#f3e8ff',sidebar:'#f5f0ff',text:'#3b1f5e',text2:'#7c5cbf'},
  {name:'Kopi',    accent:'#92400e',accent2:'#78350f',bg:'#fdf8f0',bg2:'#ffffff',bg3:'#fef3c7',sidebar:'#fef7ec',text:'#1c0a00',text2:'#78350f'},
];

const SWATCHES = [
  '#7c6fcd','#2563eb','#16a34a','#ea580c','#e11d48',
  '#818cf8','#ec4899','#d4af37','#0891b2','#0d9488',
  '#84cc16','#f59e0b','#6366f1','#8b5cf6','#06b6d4',
  '#dc2626','#059669','#7c3aed','#db2777','#0369a1',
];

const LANG_INFO = {
  lua:        {label:'🌙 Lua',        color:'#00aeff',bg:'#e0f4ff'},
  python:     {label:'🐍 Python',     color:'#3b82f6',bg:'#eff6ff'},
  javascript: {label:'🟨 JavaScript', color:'#ca8a04',bg:'#fefce8'},
  typescript: {label:'🔷 TypeScript', color:'#2563eb',bg:'#eff6ff'},
  java:       {label:'☕ Java',        color:'#ea580c',bg:'#fff7ed'},
  cpp:        {label:'⚙️ C++',        color:'#6b21a8',bg:'#faf5ff'},
  csharp:     {label:'🔵 C#',         color:'#1d4ed8',bg:'#eff6ff'},
  go:         {label:'🐹 Go',         color:'#0e7490',bg:'#ecfeff'},
  rust:       {label:'🦀 Rust',       color:'#c2410c',bg:'#fff7ed'},
  php:        {label:'🐘 PHP',        color:'#7c3aed',bg:'#f5f3ff'},
  ruby:       {label:'💎 Ruby',       color:'#be123c',bg:'#fff1f2'},
  swift:      {label:'🍎 Swift',      color:'#ea580c',bg:'#fff7ed'},
  kotlin:     {label:'🎯 Kotlin',     color:'#7c3aed',bg:'#f5f3ff'},
  shell:      {label:'🖥️ Shell',      color:'#374151',bg:'#f3f4f6'},
  html:       {label:'🌐 HTML',       color:'#dc2626',bg:'#fef2f2'},
  sql:        {label:'🗃️ SQL',        color:'#0369a1',bg:'#f0f9ff'},
  r:          {label:'📊 R',          color:'#2563eb',bg:'#eff6ff'},
  matlab:     {label:'🔢 MATLAB',     color:'#ca8a04',bg:'#fefce8'},
  other:      {label:'📄 Script',     color:'#6b7280',bg:'#f9fafb'},
};

// Demo scripts bawaan
const DEMO_SCRIPTS = [
  {
    id:'demo1', title:'Blox Fruits Auto Farm V3', lang:'lua', game:'Blox Fruits',
    desc:'Auto farm mastery, kill boss otomatis, anti-AFK, dan teleport ke lokasi farming terbaik.',
    code:`-- Kitsune AI Script Hub\n-- Blox Fruits Auto Farm V3\n-- By: Kitsune_Lucky18\n\nlocal Players = game:GetService("Players")\nlocal RunService = game:GetService("RunService")\nlocal player = Players.LocalPlayer\n\nlocal config = {\n  AutoFarm = true,\n  KillBoss = true,\n  AntiAFK  = true,\n  FarmArea = "Second Sea"\n}\n\n-- Anti AFK\nif config.AntiAFK then\n  local vt = player.Character\n  game:GetService("Players").LocalPlayer.Idled:Connect(function()\n    fireclickdetector(game:GetService("VirtualInputManager"))\n    print("[Kitsune] Anti-AFK aktif!")\n  end)\nend\n\nprint("[Kitsune] Script berhasil diload!")\nprint("[Kitsune] Auto Farm: " .. tostring(config.AutoFarm))`,
    tags:['autofarm','boss','anti-afk','op'], author:'Kitsune_Lucky18', downloads:1284, date:Date.now()-86400000*3
  },
  {
    id:'demo2', title:'Universal Aimbot + ESP', lang:'lua', game:'Universal',
    desc:'Aimbot dan ESP universal untuk berbagai game FPS di Roblox. Smooth aim, wallhack, nama pemain.',
    code:`-- Universal Aimbot + ESP\n-- Kitsune Script Hub\n\nlocal Players = game:GetService("Players")\nlocal RunService = game:GetService("RunService")\nlocal Camera = workspace.CurrentCamera\n\nlocal Settings = {\n  AimbotEnabled = true,\n  ESPEnabled    = true,\n  AimKey        = Enum.KeyCode.Q,\n  Smoothness    = 0.3,\n  FOV           = 150,\n}\n\nprint("[Kitsune] Universal Aimbot loaded!")\nprint("[Kitsune] Tekan " .. Settings.AimKey.Name .. " untuk aim")`,
    tags:['aimbot','esp','universal','pvp'], author:'Kitsune_Lucky18', downloads:876, date:Date.now()-86400000*7
  },
  {
    id:'demo3', title:'Python Discord Bot Template', lang:'python', game:'',
    desc:'Template bot Discord lengkap dengan commands, events, dan embed messages. Siap deploy.',
    code:`# Discord Bot Template\n# Kitsune Script Hub\n# pip install discord.py\n\nimport discord\nfrom discord.ext import commands\nimport os\n\nintents = discord.Intents.default()\nintents.message_content = True\n\nbot = commands.Bot(command_prefix='!', intents=intents)\n\n@bot.event\nasync def on_ready():\n    print(f'[Kitsune] Bot {bot.user} siap!')\n\n@bot.command(name='hello')\nasync def hello(ctx):\n    embed = discord.Embed(\n        title='Halo! 🦊',\n        description='Bot Kitsune siap melayani!',\n        color=0x7c6fcd\n    )\n    await ctx.send(embed=embed)\n\n@bot.command(name='ping')\nasync def ping(ctx):\n    await ctx.send(f'🏓 Pong! {round(bot.latency * 1000)}ms')\n\nbot.run('YOUR_TOKEN_HERE')`,
    tags:['discord','bot','python','template'], author:'Kitsune_Lucky18', downloads:432, date:Date.now()-86400000*14
  },
  {
    id:'demo4', title:'Pet Sim X Auto Collect', lang:'lua', game:'Pet Simulator X',
    desc:'Auto collect coins, hatch eggs otomatis, dan equip best pets secara loop tanpa batas.',
    code:`-- Pet Simulator X Auto Collect\n-- Kitsune Script Hub\n\nlocal Players = game:GetService("Players")\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\nlocal player = Players.LocalPlayer\n\nlocal cfg = {\n  AutoCollect = true,\n  AutoHatch   = true,\n  AutoEquip   = true,\n  Delay       = 0.1\n}\n\nwhile cfg.AutoCollect do\n  -- Auto collect logic\n  for _, v in pairs(workspace:GetDescendants()) do\n    if v.Name == "Coin" or v.Name == "Diamond" then\n      local dist = (player.Character.RootPart.Position - v.Position).Magnitude\n      if dist < 50 then\n        -- collect\n      end\n    end\n  end\n  task.wait(cfg.Delay)\nend\n\nprint("[Kitsune] Pet Sim X script loaded!")`,
    tags:['autofarm','collect','hatch','petsim'], author:'Kitsune_Lucky18', downloads:658, date:Date.now()-86400000*5
  },
  {
    id:'demo5', title:'Node.js Express API Boilerplate', lang:'javascript', game:'',
    desc:'Boilerplate REST API dengan Express.js, middleware auth JWT, dan struktur folder siap produksi.',
    code:`// Express.js REST API Boilerplate\n// Kitsune Script Hub\n// npm install express jsonwebtoken cors dotenv\n\nconst express = require('express');\nconst jwt     = require('jsonwebtoken');\nconst cors    = require('cors');\nrequire('dotenv').config();\n\nconst app  = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(cors());\napp.use(express.json());\n\n// Auth middleware\nconst authMiddleware = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(403).json({ error: 'Token invalid' });\n  }\n};\n\n// Routes\napp.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Kitsune API' }));\n\napp.post('/api/login', (req, res) => {\n  const { username, password } = req.body;\n  // TODO: validate user dari database\n  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });\n  res.json({ token, username });\n});\n\napp.get('/api/protected', authMiddleware, (req, res) => {\n  res.json({ message: 'Hello ' + req.user.username });\n});\n\napp.listen(PORT, () => console.log(\`[Kitsune] API running on port \${PORT}\`));`,
    tags:['nodejs','express','api','jwt','backend'], author:'Kitsune_Lucky18', downloads:312, date:Date.now()-86400000*10
  },
];

// ===== THEME =====
function applyTheme(t) {
  const r = document.documentElement;
  r.style.setProperty('--accent',  t.accent);
  r.style.setProperty('--accent2', t.accent2||t.accent);
  r.style.setProperty('--bg',      t.bg);
  r.style.setProperty('--bg2',     t.bg2);
  r.style.setProperty('--bg3',     t.bg3);
  r.style.setProperty('--sidebar', t.sidebar||t.bg3);
  r.style.setProperty('--text',    t.text);
  r.style.setProperty('--text2',   t.text2);
  localStorage.setItem('kit_theme', JSON.stringify(t));
}
function sv(k,v){document.documentElement.style.setProperty(k,v)}

// ===== API KEY =====
function saveApiKey(){
  const v = document.getElementById('apikey-inp').value.trim();
  if(!v.startsWith('sk-')){shakeInput();return}
  API_KEY = v;
  localStorage.setItem('kit_key',v);
  document.getElementById('apimodal').classList.remove('show');
  updateKeyStatus();
  document.getElementById('sendbtn').disabled = false;
  showWelcome();
}
function shakeInput(){
  const inp = document.getElementById('apikey-inp');
  inp.style.borderColor='#ef4444';
  inp.style.animation='shake 0.4s ease';
  setTimeout(()=>{inp.style.borderColor='';inp.style.animation=''},1500);
}
function showApiModal(){
  document.getElementById('apikey-inp').value=API_KEY;
  document.getElementById('apimodal').classList.add('show');
}
function updateKeyStatus(){
  const dot=document.getElementById('key-dot'),lbl=document.getElementById('key-label');
  if(API_KEY){dot.classList.add('ok');lbl.textContent='Key ✓';document.getElementById('sendbtn').disabled=false}
  else{dot.classList.remove('ok');lbl.textContent='Set Key';document.getElementById('sendbtn').disabled=true}
}
function toggleKeyVis(){const i=document.getElementById('apikey-inp');i.type=i.type==='password'?'text':'password'}
function selectModalModel(el){
  document.querySelectorAll('.model-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');selectedModel=el.dataset.model;
}

// ===== MEDIA =====
function handleImage(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const r=ev.target.result;
    pendingImgB64=r.split(',')[1];pendingImgMime=file.type;
    document.getElementById('img-preview').src=r;
    document.getElementById('img-preview-wrap').style.display='block';
  };
  reader.readAsDataURL(file);e.target.value='';
}
function removeImage(){
  pendingImgB64=null;pendingImgMime=null;
  document.getElementById('img-preview-wrap').style.display='none';
  document.getElementById('img-preview').src='';
}
function handleCode(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    pendingCode=ev.target.result;pendingCodeName=file.name;
    document.getElementById('code-filename').textContent='📄 '+file.name;
    document.getElementById('code-preview-wrap').style.display='block';
  };
  reader.readAsText(file);e.target.value='';
}
function removeCode(){
  pendingCode=null;pendingCodeName=null;
  document.getElementById('code-preview-wrap').style.display='none';
}

// ===== MARKDOWN =====
function escHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function formatMd(txt){
  if(!markdownEnabled)return txt.replace(/\n/g,'<br>');
  return txt
    .replace(/```(\w*)\n?([\s\S]*?)```/g,(_,lang,code)=>`<pre><code class="lang-${lang}">${escHtml(code.trim())}</code></pre>`)
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/~~(.+?)~~/g,'<del>$1</del>')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h3>$1</h3>')
    .replace(/^# (.+)$/gm,'<h3>$1</h3>')
    .replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm,'<li>$1</li>')
    .replace(/^[-*] (.+)$/gm,'<li>$1</li>')
    .replace(/^---$/gm,'<hr>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,'<br>')
    .replace(/^(.+)$/,'<p>$1</p>');
}

// ===== CHAT =====
function showWelcome(){
  const wrap=document.getElementById('msg-wrap');
  const sugs=['📷 Upload foto dan analisis','🌙 Debug script Roblox Lua','🐍 Bantu saya kode Python','✨ Apa anime terbaik 2025?','💡 Cara bikin bot Discord','📝 Buka Script Hub'];
  wrap.innerHTML=`<div id="welcome">
    <div class="welcome-logo">🦊</div>
    <h1>Kitsune AI</h1>
    <p>Powered by <strong>GPT-4o</strong> — bisa baca teks, foto, dan semua jenis kode.<br>Ada juga <strong>Script Hub</strong> untuk berbagi script! 📝🦊</p>
    <div class="suggestions">${sugs.map(s=>`<button class="sug-btn" onclick="quickChat('${s.replace(/'/g,"\\'")}')">${s}</button>`).join('')}</div>
  </div>`;
}

function quickChat(text){
  if(text==='📝 Buka Script Hub'){switchTab('scripts');return}
  switchTab('chat');document.getElementById('inp').value=text;sendMsg();
}
function newChat(){
  if(messages.length>0){
    const f=messages.find(m=>m.role==='user');
    if(f){
      const t=Array.isArray(f.content)?(f.content.find(c=>c.type==='text')?.text||'Chat'):f.content;
      chatHistory.unshift({title:t.substring(0,50),time:Date.now()});
      if(chatHistory.length>50)chatHistory.pop();
      localStorage.setItem('kit_history',JSON.stringify(chatHistory));
    }
  }
  messages=[];removeImage();removeCode();showWelcome();switchTab('chat');
}

function appendMsg(parts,who){
  const w=document.getElementById('welcome');if(w)w.remove();
  const wrap=document.getElementById('msg-wrap');
  const d=document.createElement('div');d.className='msg '+who;
  const av=document.createElement('div');av.className='av av-'+who;av.textContent=who==='ai'?'🦊':'U';
  const b=document.createElement('div');b.className='bubble';
  if(who==='user'){
    const arr=Array.isArray(parts)?parts:[{type:'text',text:parts}];
    arr.forEach(c=>{
      if(c.type==='image_url'){const img=document.createElement('img');img.src=c.image_url.url;img.className='msg-img';b.appendChild(img)}
      else if(c.type==='text'&&c.text){const sp=document.createElement('span');sp.textContent=c.text;b.appendChild(sp)}
    });
  }else{b.innerHTML=formatMd(typeof parts==='string'?parts:'')}
  d.appendChild(av);d.appendChild(b);wrap.appendChild(d);
  document.getElementById('messages').scrollTop=99999;
  return b;
}
function appendTyping(){
  const w=document.getElementById('welcome');if(w)w.remove();
  const wrap=document.getElementById('msg-wrap');
  const d=document.createElement('div');d.className='msg ai';d.id='typing-el';
  d.innerHTML=`<div class="av av-ai">🦊</div><div class="bubble"><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;
  wrap.appendChild(d);document.getElementById('messages').scrollTop=99999;
}
function removeTyping(){const t=document.getElementById('typing-el');if(t)t.remove()}

// ===== SEND =====
async function sendMsg(){
  if(!API_KEY){showApiModal();return}
  const inp=document.getElementById('inp');
  const text=inp.value.trim();
  if((!text&&!pendingImgB64&&!pendingCode)||loading)return;
  inp.value='';inp.style.height='';loading=true;
  document.getElementById('sendbtn').disabled=true;
  const contentParts=[];
  let imgUrl=null;
  if(pendingImgB64){imgUrl=`data:${pendingImgMime};base64,${pendingImgB64}`;contentParts.push({type:'image_url',image_url:{url:imgUrl}})}
  let finalText=text;
  if(pendingCode)finalText+=(text?'\n\n':'')+`File \`${pendingCodeName}\`:\n\`\`\`\n${pendingCode}\n\`\`\``;
  contentParts.push({type:'text',text:finalText||'Jelaskan gambar ini.'});
  appendMsg(contentParts,'user');removeImage();removeCode();
  const apiContent=[];
  if(imgUrl)apiContent.push({type:'image_url',image_url:{url:imgUrl}});
  apiContent.push({type:'text',text:finalText||'Jelaskan gambar ini.'});
  messages.push({role:'user',content:apiContent});
  appendTyping();
  const sys=`Kamu adalah Kitsune AI, asisten AI super cerdas milik Kitsune_Lucky18. Ramah, cermat, informatif, dan sedikit playful. Jawab dalam Bahasa Indonesia yang natural. Kalau ada gambar, analisis sangat detail. Kalau ada kode (Lua Roblox, Python, JS, dll), bantu debug/jelaskan dengan baik. Gunakan markdown untuk formatting.`;
  try{
    const res=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${API_KEY}`},
      body:JSON.stringify({model:selectedModel,max_tokens:2048,temperature:0.75,messages:[{role:'system',content:sys},...messages]})
    });
    const data=await res.json();removeTyping();
    if(data.error){
      let m='❌ '+data.error.message;
      if(data.error.code==='invalid_api_key')m='⚠️ API Key salah. Klik **Key ✓** di atas untuk ganti.';
      if(data.error.code==='insufficient_quota')m='⚠️ Kredit habis. Cek di platform.openai.com';
      appendMsg(m,'ai');
    }else{
      const reply=data.choices?.[0]?.message?.content||'Tidak ada respons.';
      messages.push({role:'assistant',content:reply});appendMsg(reply,'ai');
    }
  }catch(e){removeTyping();appendMsg('⚠️ Gagal terhubung. Cek koneksi internet.','ai')}
  loading=false;document.getElementById('sendbtn').disabled=false;
}

// ===== TABS =====
function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.si,.crown-btn').forEach(s=>s.classList.remove('active'));
  (document.getElementById('sb-'+tab)||document.getElementById('sb-crown'))?.classList.add('active');
  const cm=document.getElementById('chat-main'),pv=document.getElementById('panelview');
  if(tab==='chat'){cm.style.display='flex';pv.classList.remove('show');document.getElementById('sb-chat').classList.add('active');return}
  cm.style.display='none';pv.classList.add('show');
  const titles={history:'Riwayat Chat',search:'Cari',settings:'Pengaturan & Tema',credits:'Tentang',projects:'Proyek',scripts:'📝 Script Hub'};
  document.getElementById('panel-title').textContent=titles[tab]||tab;
  // Panel actions
  const pa=document.getElementById('panel-actions');
  pa.innerHTML=tab==='scripts'?`<button class="script-publish-btn" onclick="openPublishModal()" style="font-size:12px;padding:7px 14px;border-radius:8px;background:var(--accent);border:none;color:#fff;cursor:pointer;font-family:'Sora',sans-serif;font-weight:600">+ Publish Script</button>`:'';
  renderPanel(tab);
}

// ===== PANELS =====
function renderPanel(tab){
  const body=document.getElementById('panel-body');
  if(tab==='history'){
    const all=chatHistory.length?chatHistory:[{title:'Apa itu AI?'},{title:'Debug Roblox script'},{title:'Tips produktivitas'}];
    body.innerHTML=`<div class="hist-label">Riwayat</div>${all.slice(0,20).map(h=>{const t=typeof h==='string'?h:h.title;return`<div class="hist-item" onclick="quickChat('${t.replace(/'/g,"\\'")}')"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>${t}</div>`}).join('')}<div style="margin-top:14px"><button onclick="clearHistory()" style="font-size:12px;padding:6px 14px;border-radius:8px;border:1px solid #ef4444;background:transparent;color:#ef4444;cursor:pointer;font-family:'Sora',sans-serif">🗑 Hapus Semua</button></div>`;
  }else if(tab==='search'){
    body.innerHTML=`<input type="text" class="search-input" id="search-inp" placeholder="Cari riwayat..." oninput="doSearch(this.value)"><div id="search-results" style="font-size:13px;color:var(--text2)">Ketik untuk mencari...</div>`;
  }else if(tab==='projects'){
    body.innerHTML=`<div class="empty-state"><span class="emoji">📁</span><h3>Belum ada proyek</h3><p>Simpan percakapan penting sebagai proyek.</p></div>`;
  }else if(tab==='scripts'){
    renderScriptHub(body);
  }else if(tab==='settings'){
    body.innerHTML=`
    <div class="color-card">
      <h3>Tema Warna Preset</h3>
      <div class="preset-row">${THEMES.map((t,i)=>`<div class="theme-pill" id="tp-${i}" onclick="pickTheme(${i})"><div class="theme-dot" style="background:${t.accent}"></div>${t.name}</div>`).join('')}</div>
      <h3 style="margin-bottom:12px">Warna Custom</h3>
      <div class="swatch-row">${SWATCHES.map(c=>`<div class="swatch" style="background:${c}" onclick="pickAccent('${c}')"></div>`).join('')}</div>
      <div class="color-pickers">
        <div class="cp-item"><label>Utama</label><input type="color" onchange="pickAccent(this.value)"></div>
        <div class="cp-item"><label>BG</label><input type="color" onchange="sv('--bg',this.value)"></div>
        <div class="cp-item"><label>Kartu</label><input type="color" onchange="sv('--bg2',this.value)"></div>
        <div class="cp-item"><label>Surface</label><input type="color" onchange="sv('--bg3',this.value)"></div>
        <div class="cp-item"><label>Sidebar</label><input type="color" onchange="sv('--sidebar',this.value)"></div>
        <div class="cp-item"><label>Teks</label><input type="color" onchange="sv('--text',this.value)"></div>
      </div>
    </div>
    <div class="settings-card">
      <div class="settings-card-title">Model AI</div>
      <div class="setting-row">
        <div><div class="setting-label">Pilih Model</div><div class="setting-sub">GPT-4o = paling pintar + bisa lihat foto</div></div>
        <select class="sel" onchange="changeModel(this.value)">
          <option value="gpt-4o" ${selectedModel==='gpt-4o'?'selected':''}>GPT-4o ⭐</option>
          <option value="gpt-4o-mini" ${selectedModel==='gpt-4o-mini'?'selected':''}>GPT-4o Mini</option>
          <option value="gpt-4-turbo" ${selectedModel==='gpt-4-turbo'?'selected':''}>GPT-4 Turbo</option>
        </select>
      </div>
    </div>
    <div class="settings-card">
      <div class="settings-card-title">Preferensi</div>
      <div class="setting-row"><div><div class="setting-label">Format Markdown</div><div class="setting-sub">Bold, list, kode, tabel</div></div><button class="toggle ${markdownEnabled?'on':''}" id="toggle-md" onclick="toggleMarkdown()"></button></div>
      <div class="setting-row"><div><div class="setting-label">API Key</div><div class="setting-sub">${API_KEY?'✓ Tersimpan (sk-...'+API_KEY.slice(-4):'⚠ Belum diset'}</div></div><button onclick="showApiModal()" style="padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text2);font-size:12px;cursor:pointer;font-family:'Sora',sans-serif">Ubah</button></div>
      <div class="setting-row"><div><div class="setting-label">Hapus API Key</div></div><button onclick="clearKey()" style="padding:6px 14px;border-radius:8px;border:1px solid #ef4444;background:transparent;color:#ef4444;font-size:12px;cursor:pointer;font-family:'Sora',sans-serif">Hapus</button></div>
      <div class="setting-row"><div><div class="setting-label">Reset Semua</div></div><button onclick="resetAll()" style="padding:6px 14px;border-radius:8px;border:1px solid #ef4444;background:transparent;color:#ef4444;font-size:12px;cursor:pointer;font-family:'Sora',sans-serif">Reset</button></div>
    </div>`;
  }else if(tab==='credits'){
    body.innerHTML=`
    <div class="credits-card">
      <div class="credits-header">
        <span class="credits-crown">👑</span>
        <h2>Kitsune AI</h2>
        <p>GPT-4o • Upload Foto & Kode • Script Hub 📝<br>${THEMES.length} Tema Warna • Riwayat Chat • Privacy 100%</p>
      </div>
      <div class="credit-item"><div class="cav" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff">KL</div><div style="flex:1"><div class="cname">Kitsune_Lucky18</div><div class="crole">Owner & Kreator Kitsune AI</div></div><span class="cbadge" style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d">👑 Owner</span></div>
      <div class="credit-item"><div class="cav" style="background:linear-gradient(135deg,#10a37f,#1a7f64);color:#fff">AI</div><div style="flex:1"><div class="cname">GPT-4o by OpenAI</div><div class="crole">Model kecerdasan di balik Kitsune AI</div></div><span class="cbadge" style="background:#d1fae5;color:#065f46;border:1px solid #6ee7b7">⚡ Engine</span></div>
      <a href="https://youtube.com/@Kitsune_Lucky18" target="_blank" class="yt-btn">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="white" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="#FF0000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
        Subscribe @Kitsune_Lucky18
      </a>
      <div class="credits-footer">Kitsune AI v3.0 • Script Hub • Dibuat dengan ❤️</div>
    </div>`;
  }
}

// ===== SCRIPT HUB =====
function getAllScripts(){
  return [...DEMO_SCRIPTS,...scripts];
}

function renderScriptHub(body){
  const all = getAllScripts();
  const langs = ['all','lua','python','javascript','typescript','java','cpp','csharp','go','rust','php','ruby','other'];
  const filtered = all.filter(s=>{
    const matchLang = scriptFilter==='all'||s.lang===scriptFilter;
    const matchSearch = !scriptSearch||s.title.toLowerCase().includes(scriptSearch.toLowerCase())||s.desc.toLowerCase().includes(scriptSearch.toLowerCase())||(s.tags||[]).some(t=>t.includes(scriptSearch.toLowerCase()));
    return matchLang&&matchSearch;
  });

  body.innerHTML=`
    <div class="script-hub-header">
      <div>
        <h2>🦊 Kitsune Script Hub</h2>
        <p>${all.length} script tersedia • Upload & download gratis</p>
      </div>
      <button class="script-publish-btn" onclick="openPublishModal()">+ Publish</button>
    </div>
    <input type="text" class="script-search" placeholder="🔍 Cari script..." value="${scriptSearch}" oninput="scriptSearch=this.value;renderScriptHub(document.getElementById('panel-body'))">
    <div class="script-filters">
      ${langs.map(l=>`<div class="filter-chip ${scriptFilter===l?'active':''}" onclick="scriptFilter='${l}';renderScriptHub(document.getElementById('panel-body'))">${l==='all'?'🌐 Semua':(LANG_INFO[l]?.label||l)}</div>`).join('')}
    </div>
    ${filtered.length===0?`<div class="empty-state"><span class="emoji">🔍</span><h3>Tidak ada script</h3><p>Coba filter lain atau publish script pertamamu!</p></div>`:`
    <div class="script-grid">
      ${filtered.map(s=>renderScriptCard(s)).join('')}
    </div>`}`;
}

function renderScriptCard(s){
  const li = LANG_INFO[s.lang]||LANG_INFO.other;
  const timeAgo = getTimeAgo(s.date||Date.now());
  const isOwn = scripts.find(x=>x.id===s.id);
  return `<div class="script-card" onclick="openScriptDetail('${s.id}')">
    <div class="script-card-header">
      <div class="script-card-title">${escHtml(s.title)}</div>
      <span class="script-lang-badge" style="background:${li.bg};color:${li.color}">${li.label}</span>
    </div>
    ${s.game?`<div class="script-card-game">🎮 ${s.game}</div>`:''}
    <div class="script-card-desc">${escHtml(s.desc||'').substring(0,90)}${(s.desc||'').length>90?'...':''}</div>
    ${(s.tags||[]).length?`<div class="script-card-tags">${s.tags.slice(0,4).map(t=>`<span class="script-tag">${t}</span>`).join('')}</div>`:''}
    <div class="script-card-footer">
      <span class="script-card-meta">⬇ ${s.downloads||0} • ${timeAgo}</span>
      <div class="script-card-actions" onclick="event.stopPropagation()">
        <button class="sc-btn" onclick="downloadScript('${s.id}')">⬇ Download</button>
        <button class="sc-btn" onclick="copyScriptCode('${s.id}')">📋 Copy</button>
        ${isOwn?`<button class="sc-btn danger" onclick="deleteScript('${s.id}')">🗑</button>`:''}
      </div>
    </div>
  </div>`;
}

function openScriptDetail(id){
  const s = getAllScripts().find(x=>x.id===id);
  if(!s)return;
  const li = LANG_INFO[s.lang]||LANG_INFO.other;
  const isOwn = scripts.find(x=>x.id===id);
  document.getElementById('script-detail-content').innerHTML=`
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px">
      <div style="flex:1">
        <div class="script-detail-title">${escHtml(s.title)}</div>
        <div class="script-detail-meta">
          <span class="script-lang-badge" style="background:${li.bg};color:${li.color}">${li.label}</span>
          ${s.game?`<span class="script-lang-badge" style="background:var(--bg3);color:var(--text2)">🎮 ${s.game}</span>`:''}
          <span style="font-size:11px;color:var(--text2)">⬇ ${s.downloads||0} download</span>
          <span style="font-size:11px;color:var(--text2)">👤 ${s.author||'Anonim'}</span>
        </div>
      </div>
    </div>
    ${s.desc?`<div class="script-detail-desc">${escHtml(s.desc)}</div>`:''}
    ${(s.tags||[]).length?`<div class="script-card-tags" style="margin-bottom:14px">${s.tags.map(t=>`<span class="script-tag">${t}</span>`).join('')}</div>`:''}
    <div class="script-code-block">
      <div class="script-code-header">
        <span>${s.title}.${getExt(s.lang)}</span>
        <button class="copy-btn" id="copy-btn-${id}" onclick="copyScriptCodeFromDetail('${id}')">📋 Copy</button>
      </div>
      <div class="script-code-body"><code>${escHtml(s.code||'-- Kode tidak tersedia')}</code></div>
    </div>
    <div class="script-detail-actions">
      <button class="btn-primary" onclick="downloadScript('${id}')" style="flex:1">⬇ Download .${getExt(s.lang)}</button>
      ${isOwn?`<button class="btn-secondary" onclick="deleteScript('${id}');document.getElementById('scriptdetailmodal').classList.remove('show')">🗑 Hapus</button>`:''}
    </div>`;
  document.getElementById('scriptdetailmodal').classList.add('show');
}
function closeScriptDetail(){document.getElementById('scriptdetailmodal').classList.remove('show')}

function getExt(lang){const m={lua:'lua',python:'py',javascript:'js',typescript:'ts',java:'java',cpp:'cpp',csharp:'cs',go:'go',rust:'rs',php:'php',ruby:'rb',swift:'swift',kotlin:'kt',shell:'sh',html:'html',sql:'sql',r:'r'};return m[lang]||'txt'}
function getTimeAgo(ts){
  const d=Date.now()-ts,m=60000,h=3600000,day=86400000;
  if(d<m)return 'baru saja';if(d<h)return Math.floor(d/m)+' menit lalu';
  if(d<day)return Math.floor(d/h)+' jam lalu';return Math.floor(d/day)+' hari lalu';
}

function downloadScript(id){
  const s=getAllScripts().find(x=>x.id===id);if(!s)return;
  const blob=new Blob([s.code||'-- Kosong'],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=s.title.replace(/[^a-z0-9]/gi,'_')+'.'+getExt(s.lang);
  a.click();URL.revokeObjectURL(a.href);
  // Increment download count
  const idx=scripts.findIndex(x=>x.id===id);
  if(idx>=0){scripts[idx].downloads=(scripts[idx].downloads||0)+1;localStorage.setItem('kit_scripts',JSON.stringify(scripts))}
}

function copyScriptCode(id){
  const s=getAllScripts().find(x=>x.id===id);if(!s)return;
  navigator.clipboard.writeText(s.code||'').then(()=>{showToast('✅ Kode dicopy!')});
}
function copyScriptCodeFromDetail(id){
  const s=getAllScripts().find(x=>x.id===id);if(!s)return;
  navigator.clipboard.writeText(s.code||'').then(()=>{
    const btn=document.getElementById('copy-btn-'+id);
    if(btn){btn.textContent='✅ Copied!';btn.classList.add('copied');setTimeout(()=>{btn.textContent='📋 Copy';btn.classList.remove('copied')},2000)}
  });
}

function deleteScript(id){
  if(!confirm('Hapus script ini?'))return;
  scripts=scripts.filter(x=>x.id!==id);
  localStorage.setItem('kit_scripts',JSON.stringify(scripts));
  renderScriptHub(document.getElementById('panel-body'));
}

// ===== PUBLISH MODAL =====
function openPublishModal(){document.getElementById('publishmodal').classList.add('show')}
function closePublishModal(){document.getElementById('publishmodal').classList.remove('show')}

function handlePubFile(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    document.getElementById('pub-code').value=ev.target.result;
    document.getElementById('pub-file-name').textContent='✅ '+file.name;
    // Auto detect lang
    const ext=file.name.split('.').pop().toLowerCase();
    const extMap={lua:'lua',py:'python',js:'javascript',ts:'typescript',java:'java',cpp:'cpp',cs:'csharp',go:'go',rs:'rust',php:'php',rb:'ruby',swift:'swift',kt:'kotlin',sh:'shell',html:'html',sql:'sql',r:'r'};
    const sel=document.getElementById('pub-lang');
    if(extMap[ext])sel.value=extMap[ext];
  };
  reader.readAsText(file);
}
function handlePubDrop(e){
  e.preventDefault();
  const file=e.dataTransfer.files[0];if(!file)return;
  document.getElementById('pub-file').files=e.dataTransfer.files;
  handlePubFile({target:{files:e.dataTransfer.files}});
  document.getElementById('pub-drop').classList.remove('drag-over');
}

function publishScript(){
  const title=document.getElementById('pub-title').value.trim();
  const lang=document.getElementById('pub-lang').value;
  const game=document.getElementById('pub-game').value;
  const desc=document.getElementById('pub-desc').value.trim();
  const code=document.getElementById('pub-code').value.trim();
  const tagsRaw=document.getElementById('pub-tags').value.trim();
  if(!title){alert('Nama script wajib diisi!');return}
  if(!code){alert('Kode script wajib diisi!');return}
  const tags=tagsRaw?tagsRaw.split(',').map(t=>t.trim()).filter(Boolean):[];
  const newScript={
    id:'sc_'+Date.now(),title,lang,game,desc,code,tags,
    author:'Kitsune_Lucky18',downloads:0,date:Date.now()
  };
  scripts.unshift(newScript);
  localStorage.setItem('kit_scripts',JSON.stringify(scripts));
  closePublishModal();
  // Reset form
  ['pub-title','pub-desc','pub-code','pub-tags'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('pub-file-name').textContent='';
  showToast('🚀 Script berhasil dipublish!');
  switchTab('scripts');
}

// ===== TOAST =====
function showToast(msg){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--text);color:var(--bg2);padding:10px 20px;border-radius:10px;font-size:13px;font-weight:500;z-index:9999;transition:all 0.3s;font-family:Sora,sans-serif';document.body.appendChild(t)}
  t.textContent=msg;t.style.opacity='1';t.style.bottom='24px';
  clearTimeout(t._timer);t._timer=setTimeout(()=>{t.style.opacity='0';t.style.bottom='16px'},2500);
}

// ===== HELPERS =====
function pickTheme(i){
  applyTheme(THEMES[i]);
  document.querySelectorAll('.theme-pill').forEach((p,j)=>p.classList.toggle('active',i===j));
}
function pickAccent(val){
  sv('--accent',val);
  document.querySelectorAll('.swatch').forEach(s=>s.classList.toggle('active',s.style.background===val));
  try{const t=JSON.parse(localStorage.getItem('kit_theme')||'{}');t.accent=val;localStorage.setItem('kit_theme',JSON.stringify(t))}catch(e){}
}
function changeModel(val){
  selectedModel=val;localStorage.setItem('kit_model',val);
  const n={'gpt-4o':'GPT-4o','gpt-4o-mini':'GPT-4o Mini','gpt-4-turbo':'GPT-4 Turbo'};
  document.getElementById('model-badge').textContent=n[val]||val;
}
function toggleMarkdown(){markdownEnabled=!markdownEnabled;document.getElementById('toggle-md')?.classList.toggle('on',markdownEnabled)}
function clearKey(){if(!confirm('Hapus API key?'))return;API_KEY='';localStorage.removeItem('kit_key');updateKeyStatus();showApiModal()}
function clearHistory(){if(!confirm('Hapus semua riwayat?'))return;chatHistory=[];localStorage.removeItem('kit_history');renderPanel('history')}
function resetAll(){if(!confirm('Reset semua data?'))return;localStorage.clear();location.reload()}
function doSearch(q){
  const res=document.getElementById('search-results');
  if(!q){res.textContent='Ketik untuk mencari...';return}
  const all=chatHistory.map(h=>typeof h==='string'?h:h.title);
  const found=all.filter(h=>h.toLowerCase().includes(q.toLowerCase()));
  res.innerHTML=found.length?found.map(f=>`<div class="hist-item" onclick="quickChat('${f.replace(/'/g,"\\'")}')"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="1.6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>${f}</div>`).join(''):'<p style="font-size:13px;color:var(--text2)">Tidak ditemukan.</p>';
}

// ===== INPUT =====
const inpEl=document.getElementById('inp');
inpEl.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}});
inpEl.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,160)+'px'});
document.getElementById('apikey-inp').addEventListener('keydown',e=>{if(e.key==='Enter')saveApiKey()});
document.getElementById('apimodal').addEventListener('click',function(e){if(e.target===this&&API_KEY)this.classList.remove('show')});
document.getElementById('publishmodal').addEventListener('click',function(e){if(e.target===this)closePublishModal()});
document.getElementById('scriptdetailmodal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('show')});

// Drag over effect
document.getElementById('pub-drop').addEventListener('dragover',e=>{e.preventDefault();e.currentTarget.classList.add('drag-over')});
document.getElementById('pub-drop').addEventListener('dragleave',e=>{e.currentTarget.classList.remove('drag-over')});

// ===== INIT =====
(function init(){
  try{const s=localStorage.getItem('kit_theme');if(s)applyTheme(JSON.parse(s))}catch(e){}
  const names={'gpt-4o':'GPT-4o','gpt-4o-mini':'GPT-4o Mini','gpt-4-turbo':'GPT-4 Turbo'};
  document.getElementById('model-badge').textContent=names[selectedModel]||'GPT-4o';
  updateKeyStatus();
  if(API_KEY)showWelcome();
})();
