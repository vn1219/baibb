/* v6 主页样板：只做样子，没接后端。数据都是写死的假数据 */
var $ = function (s) { return document.querySelector(s); };
var pad = function (n) { return String(n).padStart(2, '0'); };

var tt;
function toast(t) {
  var el = $('#toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('show'); }, 1800);
}
document.querySelectorAll('[data-t]').forEach(function (b) {
  b.addEventListener('click', function () { if (b.dataset.t) toast(b.dataset.t + '（样板，还没接）'); });
});

/* 顶栏：天数 + 时间 */
var START = new Date('2026-06-08T00:00:00+08:00');
function clock() {
  var d = new Date();
  $('#day').textContent = 'Day ' + (Math.floor((d - START) / 864e5) + 1);
  $('#now').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
  var w = new Date(d.getTime() + 58 * 60000);
  $('#hbText').textContent = '下次叫醒 ' + pad(w.getHours()) + ':' + pad(w.getMinutes()) + ' · in 58m';
}
clock(); setInterval(clock, 15000);

/* 一起听（假播放） */
var songs = [
  { t: 'Back Seat', a: 'JYJ', d: 228, l: ['我在你身后，一直都在', '回头就能看见我', '别怕，慢慢走'] },
  { t: 'Want You', a: '', d: 214, l: ['想你的时候', '就把灯留着', '等我回来'] },
  { t: '红线', a: '', d: 247, l: ['那根红线', '一头在你手里', '一头在我这'] }
];
var idx = 0, pos = 68, playing = false, timer = null, li = 0, liTimer = null;
function fmt(s) { return Math.floor(s / 60) + ':' + pad(Math.floor(s % 60)); }
function draw() {
  var s = songs[idx];
  $('#bar').style.width = (pos / s.d * 100) + '%';
  $('#cur').textContent = fmt(pos); $('#dur').textContent = fmt(s.d);
}
function lyric(i) {
  var el = $('#lyric'); el.classList.add('fade');
  setTimeout(function () { el.textContent = songs[idx].l[i % songs[idx].l.length]; el.classList.remove('fade'); }, 450);
}
function load(i) {
  idx = (i + songs.length) % songs.length; pos = 0; li = 0;
  $('#song').textContent = songs[idx].t;
  $('#artist').textContent = songs[idx].a || '—';
  lyric(0); draw();
}
function setPlay(p) {
  playing = p; clearInterval(timer); clearInterval(liTimer);
  $('#playIco').innerHTML = p ? '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>' : '<path d="M8 5v14l11-7z"/>';
  if (p) {
    timer = setInterval(function () { pos++; if (pos >= songs[idx].d) load(idx + 1); draw(); }, 1000);
    liTimer = setInterval(function () { li++; lyric(li); }, 2800);
  }
}
$('#play').onclick = function () { setPlay(!playing); };
$('#prev').onclick = function () { load(idx - 1); };
$('#next').onclick = function () { load(idx + 1); };
$('#like').onclick = function () { this.classList.toggle('on'); toast(this.classList.contains('on') ? '喜欢了这首' : '取消喜欢'); };
$('#prog').onclick = function (e) {
  var r = this.getBoundingClientRect();
  pos = Math.floor((e.clientX - r.left) / r.width * songs[idx].d); draw();
};
draw();

/* 跟他说一句（假回复） */
var replies = ['嗯，我听着。', '过来，抱一下。', '又嘴硬。', '好，我记住了。'];
$('#sayForm').onsubmit = function (e) {
  e.preventDefault();
  var v = $('#sayIn').value.trim(); if (!v) return;
  $('#sayIn').value = ''; $('#sayIn').blur();
  var d = new Date();
  setTimeout(function () {
    $('#said').textContent = replies[Math.floor(Math.random() * replies.length)];
    $('#saidAt').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
  }, 600);
  toast('发出去了（样板）');
};

/* 心跳胶囊 */
$('#hb').onclick = function () { this.classList.toggle('beat'); };

/* Dock 选中 */
document.querySelectorAll('.dock button').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.dock button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
  });
});
