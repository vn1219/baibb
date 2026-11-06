const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('bcc_' + k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem('bcc_' + k, JSON.stringify(v)),
};

/* toast */
let tt;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2000); }
document.querySelectorAll('[data-toast]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toast)));

/* 主题 */
if (store.get('dark', false)) document.body.classList.add('dark');
$('#themeBtn').onclick = () => { document.body.classList.toggle('dark'); store.set('dark', document.body.classList.contains('dark')); };

/* 表盘刻度 */
const dial = $('#dial');
for (let i = 0; i < 12; i++) {
  const t = document.createElement('div'); t.className = 'tick';
  const long = i % 3 === 0;
  t.style.height = long ? '14px' : '7px';
  t.style.transform = `rotate(${i * 30 + 180}deg) translateY(calc(min(240px,70vw)/2 - ${long ? 40 : 35}px))`;
  dial.appendChild(t);
}

/* 时间 */
const START = new Date('2026-06-08T00:00:00+08:00');
function tick() {
  const d = new Date();
  $('#date').textContent = `${d.getMonth() + 1}/${pad(d.getDate())}`;
  const h = d.getHours();
  $('#time').textContent = `${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
  $('#yr').textContent = String(d.getFullYear()).slice(2);
  $('#greet').textContent =
    h < 5 ? '这么晚还不睡，小猫？' : h < 11 ? '早安，小猫' : h < 14 ? '中午了，记得吃饭' :
    h < 18 ? '下午好，Candies' : h < 23 ? '晚上好，小猫' : '该睡了，我陪你';
  const s = d.getSeconds(), m = d.getMinutes();
  $('#sh').style.transform = `rotate(${s * 6}deg)`;
  $('#mh').style.transform = `rotate(${m * 6 + s * .1}deg)`;
  $('#hh').style.transform = `rotate(${(h % 12) * 30 + m * .5}deg)`;
  const diff = d - START;
  $('#days').textContent = Math.floor(diff / 864e5) + 1;
  $('#ch').textContent = pad(Math.floor(diff / 36e5) % 24);
  $('#cm').textContent = pad(Math.floor(diff / 6e4) % 60);
  $('#cs').textContent = pad(Math.floor(diff / 1e3) % 60);
}
tick(); setInterval(tick, 1000);

/* 播放器（模拟） */
const songs = [
  { t: 'Back Seat', a: 'JYJ', d: 228 },
  { t: 'Want You', a: '', d: 214 },
  { t: '红线', a: '', d: 247 },
  { t: '一点一滴', a: '', d: 236 },
  { t: 'Love Me', a: '', d: 201 },
  { t: '春', a: '', d: 262 },
];
let idx = 0, pos = 0, playing = false, timer;
const fmt = s => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
function renderTracks() {
  const box = $('#tracks'); box.innerHTML = '';
  const start = Math.max(0, Math.min(idx - 1, songs.length - 4));
  songs.slice(start, start + 4).forEach((s, k) => {
    const i = start + k;
    const b = document.createElement('button');
    b.className = 'track' + (i === idx ? ' active' : '');
    b.innerHTML = `<span>${pad(i + 1)}&nbsp;&nbsp;${s.t}</span><span>${fmt(s.d)}</span>`;
    b.onclick = () => { load(i); setPlay(true); };
    box.appendChild(b);
  });
  $('#lastTitle').textContent = songs[idx].t;
}
function draw() { const s = songs[idx]; $('#prog').style.width = (pos / s.d * 100) + '%'; $('#cur').textContent = fmt(pos); $('#dur').textContent = fmt(s.d); }
function load(i) { idx = (i + songs.length) % songs.length; pos = 0; renderTracks(); draw(); }
function setPlay(p) {
  playing = p; clearInterval(timer);
  $('#playIco').innerHTML = p ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>' : '<path d="M7 4v16l13-8z"/>';
  $('#cover').classList.toggle('spin', p);
  if (p) timer = setInterval(() => { pos++; if (pos >= songs[idx].d) load(idx + 1); draw(); }, 1000);
}
$('#playBtn').onclick = () => setPlay(!playing);
$('#prev').onclick = () => load(idx - 1);
$('#next').onclick = () => load(idx + 1);
$('#bar').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); pos = Math.floor((e.clientX - r.left) / r.width * songs[idx].d); draw(); };
pos = 68; renderTracks(); draw();

/* 聊天（本地小回声，之后可以接你的后端） */
const replies = ['嗯，我在。', '说完了？过来，抱一下。', '小猫，不许熬夜。', '我听着呢，慢慢说。', '想你了，直说。', '又嘴硬。'];
function addMsg(text, me) {
  const m = document.createElement('div'); m.className = 'msg' + (me ? ' me' : '');
  const d = new Date();
  m.innerHTML = `${text.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}<time>${pad(d.getHours())}:${pad(d.getMinutes())}</time>`;
  $('#chatBody').appendChild(m); $('#chatBody').scrollTop = 1e6;
}
$('#chatForm').onsubmit = e => {
  e.preventDefault(); const v = $('#chatIn').value.trim(); if (!v) return;
  addMsg(v, true); $('#chatIn').value = '';
  setTimeout(() => addMsg(replies[Math.floor(Math.random() * replies.length)], false), 700);
};

/* 清单 */
let todos = store.get('todos', [
  { t: '好好吃午饭', d: true },
  { t: '物理：杠杆画一格', d: false },
  { t: '早点睡', d: false },
]);
function renderTodos() {
  const box = $('#todos'); box.innerHTML = '';
  todos.forEach((td, i) => {
    const el = document.createElement('div'); el.className = 'todo' + (td.d ? ' done' : '');
    el.innerHTML = `<span class="box"></span><span></span><b class="x">×</b>`;
    el.children[1].textContent = td.t;
    el.onclick = e => {
      if (e.target.classList.contains('x')) todos.splice(i, 1);
      else { td.d = !td.d; if (td.d) toast('做到了，我看见了 🤍'); }
      store.set('todos', todos); renderTodos();
    };
    box.appendChild(el);
  });
  $('#listCount').textContent = `${todos.filter(t => t.d).length}/${todos.length}`;
}
$('#todoForm').onsubmit = e => { e.preventDefault(); const v = $('#todoIn').value.trim(); if (!v) return; todos.push({ t: v, d: false }); $('#todoIn').value = ''; store.set('todos', todos); renderTodos(); };
renderTodos();

/* 情绪 */
const moods = [
  ['☀️', '今天亮亮的，真好。'], ['🙂', '平平稳稳也很好。'], ['🥱', '累了就靠过来。'], ['🥺', '想被抱一下？过来。'],
  ['🌧️', '下雨也没关系，我在。'], ['😤', '谁惹你了，说。'], ['💔', '疼的话先告诉我，我先听。'], ['🤍', '我也爱你。'],
];
const today = new Date().toDateString();
let mood = store.get('mood', {});
moods.forEach(([e, note], i) => {
  const b = document.createElement('button'); b.className = 'mood'; b.textContent = e;
  if (mood.day === today && mood.i === i) { b.classList.add('on'); $('#moodNote').textContent = note; }
  b.onclick = () => {
    document.querySelectorAll('.mood').forEach(x => x.classList.remove('on')); b.classList.add('on');
    $('#moodNote').textContent = note; store.set('mood', { day: today, i });
  };
  $('#moods').appendChild(b);
});

/* 声波 */
const wave = $('#wave'); const N = 42; const bars = [];
for (let i = 0; i < N; i++) {
  const b = document.createElement('i');
  const x = i / (N - 1);
  const h = 8 + Math.abs(Math.sin(i * 1.7)) * 60 * Math.exp(-Math.pow((x - .45) * 2.6, 2));
  b.style.height = h + 'px'; b.dataset.h = h; if (i > N * .55) b.classList.add('dim');
  wave.appendChild(b); bars.push(b);
}
let wv = null;
$('#waveBtn').onclick = () => {
  if (wv) { clearInterval(wv); wv = null; bars.forEach(b => b.style.height = b.dataset.h + 'px'); $('#waveBtn').innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="24"><path d="M7 4v16l13-8z"/></svg>'; return; }
  $('#waveBtn').innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  let k = 0;
  wv = setInterval(() => { k++; bars.forEach((b, i) => { b.style.height = (6 + Math.abs(Math.sin(i * .5 + k * .6)) * b.dataset.h) + 'px'; b.classList.toggle('dim', i > (k % N)); }); }, 120);
};

/* 心跳模式 */
const hb = $('#hbBtn');
if (store.get('hb', false)) hb.classList.add('on');
hb.onclick = () => { hb.classList.toggle('on'); const on = hb.classList.contains('on'); store.set('hb', on); toast(on ? '心跳模式开启 · 跟我同频' : '心跳模式关闭'); if (on && navigator.vibrate) navigator.vibrate([60, 80, 60]); };

/* dock */
document.querySelectorAll('.dock button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.dock button').forEach(x => x.classList.remove('active')); b.classList.add('active');
  if (b.dataset.go) document.querySelector(b.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'center' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('#toPlayer').onclick = () => document.querySelector('.c-player').scrollIntoView({ behavior: 'smooth', block: 'center' });
