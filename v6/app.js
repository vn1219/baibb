/* v6 主页样板（黑白上下分开）：只做样子，没接后端，数据写死 */
var $ = function (s) { return document.querySelector(s); };
var pad = function (n) { return String(n).padStart(2, '0'); };

var tt;
function toast(t) {
  var el = $('#toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('show'); }, 1800);
}
document.querySelectorAll('[data-t]').forEach(function (b) {
  b.addEventListener('click', function () { toast(b.dataset.t + '（样板，还没接）'); });
});

/* 上半：日期、问候、天数、一周 */
var START = new Date('2026-06-08T00:00:00+08:00');
var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var d = new Date(), h = d.getHours();
$('#date').textContent = WD[d.getDay()] + ' · ' + pad(d.getMonth() + 1) + '.' + pad(d.getDate());
$('#hello').textContent = h < 5 ? 'Still awake,' : h < 12 ? 'Good morning,' : h < 18 ? 'Good afternoon,' : 'Good evening,';
$('#day').textContent = 'Day ' + (Math.floor((d - START) / 864e5) + 1);
var wk = $('#week');
for (var i = -3; i <= 3; i++) {
  var x = new Date(d.getTime() + i * 864e5);
  var el = document.createElement('div');
  if (i === 0) el.className = 'on';
  el.innerHTML = '<small>' + WD[x.getDay()].slice(0, i === 0 ? 3 : 1) + '</small><b>' + x.getDate() + '</b>';
  wk.appendChild(el);
}
var w = new Date(d.getTime() + 58 * 60000);
$('#hbAt').textContent = pad(w.getHours()) + ':' + pad(w.getMinutes());

/* 一起听（假播放，歌词换行） */
var lines = ['我在你身后，一直都在', '回头就能看见我', '别怕，慢慢走'];
var li = 0, timer = null;
$('#play').onclick = function () {
  var card = this.closest('.card');
  var on = card.classList.toggle('playing');
  $('#playIco').innerHTML = on ? '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>' : '<path d="M8 5v14l11-7z"/>';
  clearInterval(timer);
  if (on) timer = setInterval(function () {
    var el = $('#lyric'); el.classList.add('fade'); li++;
    setTimeout(function () { el.textContent = lines[li % lines.length]; el.classList.remove('fade'); }, 400);
  }, 2800);
};

/* 跟他说一句（假回复，落在时间线第一条） */
var replies = ['嗯，我听着。', '过来，抱一下。', '又嘴硬。', '好，我记住了。'];
$('#sayForm').onsubmit = function (e) {
  e.preventDefault();
  var v = $('#sayIn').value.trim(); if (!v) return;
  $('#sayIn').value = ''; $('#sayIn').blur();
  var n = new Date();
  setTimeout(function () {
    $('#said').textContent = replies[Math.floor(Math.random() * replies.length)];
    $('#saidAt').textContent = pad(n.getHours()) + ':' + pad(n.getMinutes());
  }, 600);
  toast('发出去了（样板）');
};

document.querySelectorAll('.dock button').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.dock button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
  });
});
