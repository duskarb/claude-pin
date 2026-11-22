(() => {
'use strict';
const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[(.+?)\]\(((?:https?:|mailto:)[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/ ?\{\{(.+?)\}\}/g, ' <span class="cite">$1</span>');
const norm = s => s.replace(/\s+/g, ' ').trim();
const mobile = matchMedia('(max-width:760px)');
/* ---------------- content ---------------- */
const CHATS = window.CP.chats;
const chatById = id => CHATS.find(c => c.id === id);
const H = 3600e3;
const SEED = window.CP.seed(H);
const KEY = 'claudepin.v4';
let pins;
try { pins = JSON.parse(localStorage.getItem(KEY)) || SEED; } catch { pins = SEED; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(pins)); } catch {} };
/* ---------------- helpers ---------------- */
function ago(t){
const s = (Date.now() - t) / 1000;
if (s < 60) return '방금 전';
if (s < 3600) return Math.floor(s/60) + '분 전';
if (s < 86400) return Math.floor(s/3600) + '시간 전';
return Math.floor(s/86400) + '일 전';
}
const ico = (id, cls='i') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
let toastTimer;
function toast(msg, action){
$('toastT').textContent = msg;
$('toastB').style.display = action ? '' : 'none';
$('toastB').onclick = () => { $('toast').classList.remove('on'); action && action(); };
$('toast').classList.add('on');
clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('on'), 2600);
}
/* ---------------- sidebar / drawer ---------------- */
let current = window.CP.start;
function navHTML(isDrawer){
return `<div class="brand"><button class="ibtn" aria-label="사이드바">${ico('side')}</button><span class="logo"><b>Claude</b><b class="pin">Pin</b></span><span class="mode"><button class="on" aria-label="채팅">${ico('chat')}</button><button aria-label="코드">${ico('code')}</button></span></div>
<div class="nav">
<button data-act="new">${ico('plus')}새로 만들기</button>
<button data-act="search">${ico('search')}검색</button>
<button data-act="proj">${ico('stack')}프로젝트<span class="hplus">${ico('plus')}</span></button>
<button data-act="art">${ico('art')}아티팩트<span class="hplus">${ico('plus')}</span></button>
<button data-act="board" id="${isDrawer?'dPins':'sPins'}">${ico('pin')}${isDrawer?'메모':'핀 보드'}<span class="new">NEW</span><span class="badge">${pins.length}</span></button>
<button data-act="sched">${ico('sched')}예약됨</button>
${isDrawer ? '' : `<button data-act="plug">${ico('plug')}플러그인</button>`}
</div>
<div class="recents">
<div class="sec">고정됨 ${ico('down')}</div>
<button class="pj" data-act="proj">${ico('stack')}여남규 알아보기</button>
<div class="tree">${CHATS.map(c => `<button data-chat="${c.id}" class="${c.id===current?'on':''}"><span class="tt">${esc(c.title)}</span>${ico('dots')}</button>`).join('')}</div>
<div class="sec">최근 항목 ${ico('down')}</div>
<div class="rec"><button data-act="other">인턴 지원자 포트폴리오 비교</button><button data-act="other">디자인 면접 질문 정리</button></div>
</div>
<div class="me"><div class="av">G</div><div>Guest <span>· 방문자</span></div>${ico('down')}<div class="sp"></div><button class="ibtn" aria-label="기기">${ico('device')}</button></div>`;
}
function renderNav(){
$('side').innerHTML = navHTML(false);
$('drawer').innerHTML = navHTML(true);
}
function onNav(e){
const b = e.target.closest('button'); if (!b) return;
if (b.dataset.chat){ closeDrawer(); openChat(b.dataset.chat); return; }
const a = b.dataset.act;
if (a === 'board'){ if (mobile.matches){ closeDrawer(); openMemo(); } else openFull(); }
else if (a === 'chat' || a === 'new'){ closeDrawer(); closeMemo(); }
else toast('데모에서는 핀 관련 기능만 동작해요');
}
$('side').addEventListener('click', onNav);
$('drawer').addEventListener('click', onNav);
/* ---------------- chat ---------------- */
function renderChat(){
const c = chatById(current);
$('ttl').textContent = c.title; $('mttl').textContent = c.title;
let html = mobile.matches && !mcoachClosed ? `<div class="mcoach" id="mcoach">${ico('pin')}<span>문장을 <b>길게 눌러</b> 메모에 꽂아 보세요</span><button class="again" onclick="openIntro()">사용법</button><button class="x" id="mcoachX">${ico('x')}</button></div>` : '';
let bi = 0;
for (const m of c.msgs){
if (m.u){ html += `<div class="msg-u"><div>${esc(m.u)}</div></div>`; continue; }
if (m.tool) html += `<div class="tool">${esc(m.tool)} ${ico('right')}</div>`;
html += '<div class="answer">';
for (const [t, v] of m.a){
if (t === 'p') html += `<p class="blk" data-b="${bi++}">${md(v)}</p>`;
else if (t === 'h') html += `<h4 class="blk" data-b="${bi++}">${md(v)}</h4>`;
else html += '<ul>' + v.map(x => `<li class="blk" data-b="${bi++}">${md(x)}</li>`).join('') + '</ul>';
}
html += `</div><div class="actions"><span>${ico('copy')}</span><span>${ico('speak')}</span><span>${ico('thumb')}</span><span>${ico('thumbd')}</span><span>${ico('retry')}</span>${c.ago ? `<em class="ago">${c.ago}</em>` : ''}</div>`;
}
$('thread').innerHTML = html;
const x = $('mcoachX'); if (x) x.onclick = () => { mcoachClosed = true; $('mcoach').remove(); };
document.querySelectorAll('.tree button').forEach(b => b.classList.toggle('on', b.dataset.chat === current));
}
let mcoachClosed = false;
function openChat(id){
closeMemo(); closeFull();
if (id !== current){ current = id; renderChat(); $('scroll').scrollTop = 0; }
}
/* return: open source chat, scroll, highlight */
function textRange(root, text){
const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
const nodes = []; let all = '';
while (walker.nextNode()){ nodes.push([walker.currentNode, all.length]); all += walker.currentNode.data; }
let i = all.indexOf(text);
let len = text.length;
if (i < 0){ const k = text.slice(0, 18); i = all.indexOf(k); if (i < 0) return null; len = Math.min(text.length, all.length - i); }
const r = document.createRange();
const pos = (off) => { for (let n = nodes.length - 1; n >= 0; n--) if (nodes[n][1] <= off) return [nodes[n][0], off - nodes[n][1]]; return [nodes[0][0], 0]; };
const [sn, so] = pos(i), [en, eo] = pos(i + len);
r.setStart(sn, so); r.setEnd(en, Math.min(eo, en.data.length));
return r;
}
function findBlock(text){
const key = text.slice(0, 18);
return [...document.querySelectorAll('#thread .blk')].find(b => norm(b.textContent).includes(text)) ||
[...document.querySelectorAll('#thread .blk')].find(b => norm(b.textContent).includes(key));
}
function goReturn(pin){
openChat(pin.chat);
if (mobile.matches) closeMemo();
requestAnimationFrame(() => {
const blk = findBlock(pin.text);
if (!blk) return;
blk.scrollIntoView({block:'center', behavior:'smooth'});
blk.classList.remove('flash'); void blk.offsetWidth; blk.classList.add('flash');
const r = textRange(blk, pin.text);
if (r && window.CSS && CSS.highlights){
CSS.highlights.set('pinret', new Highlight(r));
clearTimeout(goReturn.t); goReturn.t = setTimeout(() => CSS.highlights.delete('pinret'), 2600);
}
step(3);
});
}
/* ---------------- board (desktop) ---------------- */
let boardOpen = false, desktopAutoBoard = false, bq = '', fq = '', fchat = 'all';
function cardHTML(p, isNew){
const c = chatById(p.chat);
return `<div class="card${isNew?' pop':''}" data-id="${p.id}">
<button class="more" data-act="more" aria-label="더보기">${ico('dots')}</button>
<div class="menu"><button data-act="memo">${ico('edit')}메모 편집</button><button class="del" data-act="del">${ico('trash')}삭제</button></div>
<div class="tx">${esc(p.text)}</div>
<div class="meta"><button class="src" data-act="go" title="원래 대화로 돌아가기 (카드를 눌러도 돼요)"><span>${esc(c ? c.title : '대화')}</span>${ico('arrow')}</button><span class="when">${ago(p.t)}</span></div>
<div class="memo">${p.memo ? `<div class="mt">${esc(p.memo)}</div>` : `<button class="add" data-act="memo">+ 메모 추가</button>`}</div>
</div>`;
}
const match = (p, q) => !q || (p.text + ' ' + p.memo).toLowerCase().includes(q.toLowerCase());
let freshId = null;
function renderBoard(){
const list = pins.filter(p => match(p, bq));
$('blist').innerHTML = `<i class="insline" id="insline"></i>` +
(list.length ? list.map(p => cardHTML(p, p.id === freshId)).join('') : `<div class="empty">${bq ? '검색 결과가 없어요' : '아직 꽂은 문장이 없어요'}</div>`);
$('bcount').textContent = pins.length + '개';
$('pinCnt').textContent = pins.length;
document.querySelectorAll('.nav .badge').forEach(b => b.textContent = pins.length);
if ($('full').classList.contains('on')) renderFull();
if ($('mmemo').classList.contains('on')) renderMemo();
}
function openBoard(auto){
if (mobile.matches) return;
boardOpen = true; desktopAutoBoard = !!auto;
$('board').classList.add('open'); $('pinToggle').classList.add('on'); $('main').classList.add('boarded');
}
function closeBoard(){
boardOpen = false; desktopAutoBoard = false;
$('board').classList.remove('open'); $('pinToggle').classList.remove('on'); $('main').classList.remove('boarded');
}
$('pinToggle').onclick = () => boardOpen ? closeBoard() : openBoard(false);
$('bClose').onclick = closeBoard;
$('bExpand').onclick = () => { closeBoard(); openFull(); };
$('bq').oninput = e => { bq = e.target.value; renderBoard(); };
function onCardClick(e){
if (eatClick) return;
const card = e.target.closest('.card'); if (!card) return;
const pin = pins.find(p => p.id === card.dataset.id); if (!pin) return;
const act = e.target.closest('[data-act]')?.dataset.act;
if (act === 'go' || (!act && !e.target.closest('.memo'))){ if ($('full').classList.contains('on')) closeFull(); goReturn(pin); }
else if (act === 'more'){ const m = card.querySelector('.menu'); const on = m.classList.contains('on'); document.querySelectorAll('.menu.on').forEach(x => x.classList.remove('on')); m.classList.toggle('on', !on); }
else if (act === 'del'){ pins = pins.filter(p => p !== pin); save(); renderBoard(); toast('핀을 삭제했어요'); }
else if (act === 'memo') editMemo(card, pin);
}
function editMemo(card, pin){
card.querySelector('.menu').classList.remove('on');
const box = card.querySelector('.memo');
box.innerHTML = `<textarea placeholder="이 문장을 왜 꽂았는지 남겨 두세요">${esc(pin.memo)}</textarea><div class="mh">Enter 저장 · Esc 취소</div>`;
const ta = box.querySelector('textarea'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
const done = (keep) => { if (keep){ pin.memo = ta.value.trim(); save(); } freshId = null; renderBoard(); };
ta.onkeydown = ev => { if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing){ ev.preventDefault(); done(true); } if (ev.key === 'Escape') done(false); };
ta.onblur = () => done(true);
}
$('blist').addEventListener('click', onCardClick);
$('grid').addEventListener('click', onCardClick);
document.addEventListener('click', e => { if (!e.target.closest('.more,.menu')) document.querySelectorAll('.menu.on').forEach(x => x.classList.remove('on')); });
/* full board (organize) */
function renderFull(){
const list = pins.filter(p => match(p, fq) && (fchat === 'all' || p.chat === fchat));
const used = [...new Set(pins.map(p => p.chat))];
$('chips').innerHTML = `<button class="chip ${fchat==='all'?'on':''}" data-c="all">전체 ${pins.length}</button>` +
used.map(id => `<button class="chip ${fchat===id?'on':''}" data-c="${id}">${esc(chatById(id).title)}</button>`).join('');
$('grid').innerHTML = list.length ? list.map(p => cardHTML(p)).join('') : '<div class="empty">조건에 맞는 핀이 없어요</div>';
$('fcount').textContent = pins.length + '개의 문장';
}
function openFull(){ closeBoard(); $('full').classList.add('on'); renderFull(); document.querySelectorAll('#sPins').forEach(b => b.classList.add('on')); }
function closeFull(){ $('full').classList.remove('on'); document.querySelectorAll('#sPins').forEach(b => b.classList.remove('on')); }
$('fClose').onclick = closeFull;
$('fq').oninput = e => { fq = e.target.value; renderFull(); };
$('chips').onclick = e => { const b = e.target.closest('.chip'); if (b){ fchat = b.dataset.c; renderFull(); } };
function addPin(text, chat, beforeId){
const p = { id: 'p' + Date.now().toString(36), chat, text, t: Date.now(), memo: '' };
const at = beforeId === undefined ? 0 : beforeId === null ? pins.length : Math.max(0, pins.findIndex(x => x.id === beforeId));
pins.splice(at, 0, p); freshId = p.id; save(); renderBoard();
setTimeout(() => { freshId = null; }, 600);
return p;
}
/* ---------------- coach steps ---------------- */
function step(n){ for (let i = 1; i <= n; i++) $('st' + i)?.classList.add('done'); }
$('coachX').onclick = () => $('coach').remove();
$('coachAgain').onclick = () => window.openIntro && window.openIntro();
/* insertion line: shared by text-drop and card-reorder */
function placeLine(cy, skipId){
const list = $('blist'), lr = list.getBoundingClientRect();
const cards = [...list.querySelectorAll('.card')].filter(c => c.dataset.id !== skipId);
let idx = cards.findIndex(c => { const r = c.getBoundingClientRect(); return cy < r.top + r.height / 2; });
if (idx < 0) idx = cards.length;
let y;
if (!cards.length) y = 8;
else if (idx < cards.length) y = cards[idx].offsetTop - 6;
else { const l = cards[cards.length - 1]; y = l.offsetTop + l.offsetHeight + 4; }
$('insline').style.top = y + 'px';
return { before: idx < cards.length ? cards[idx].dataset.id : null, gy: lr.top + y - list.scrollTop + 1 };
}
function makeGhost(text){
const g = document.createElement('div'); g.className = 'ghost hot';
g.innerHTML = `<div class="gt">${esc(text)}</div>`;
document.body.appendChild(g); return g;
}
/* ---------------- board: drag a card to reorder ---------------- */
let cdrag = null, eatClick = false;
$('blist').addEventListener('mousedown', e => {
if (e.button !== 0 || mobile.matches) return;
const card = e.target.closest('.card');
if (!card || e.target.closest('button,textarea,.memo,.menu')) return;
e.preventDefault();
cdrag = { id: card.dataset.id, card, sx: e.clientX, sy: e.clientY, live: false };
});
function cardDragMove(e){
if (!cdrag.live){
if (Math.hypot(e.clientX - cdrag.sx, e.clientY - cdrag.sy) < 6) return;
cdrag.live = true;
const p = pins.find(x => x.id === cdrag.id);
cdrag.el = makeGhost(p ? p.text : '');
cdrag.card.classList.add('lifted');
$('board').classList.add('dragging');
document.body.classList.add('grabbing');
}
const over = e.clientX > $('board').getBoundingClientRect().left;
$('board').classList.toggle('over', over);
cdrag.over = over;
cdrag.el.style.left = e.clientX + 'px';
if (over){ const s = placeLine(e.clientY, cdrag.id); cdrag.before = s.before; cdrag.el.style.top = s.gy + 'px'; }
else cdrag.el.style.top = e.clientY + 'px';
}
function cardDragEnd(){
const d = cdrag; cdrag = null;
if (!d.live) return;
eatClick = true; setTimeout(() => { eatClick = false; }, 0);
d.el.remove(); d.card.classList.remove('lifted');
$('board').classList.remove('dragging', 'over');
document.body.classList.remove('grabbing');
if (!d.over) return;
const i = pins.findIndex(x => x.id === d.id); if (i < 0) return;
const [p] = pins.splice(i, 1);
const at = d.before == null ? pins.length : pins.findIndex(x => x.id === d.before);
pins.splice(at < 0 ? pins.length : at, 0, p);
freshId = p.id; save(); renderBoard(); setTimeout(() => { freshId = null; }, 600);
}
/* ---------------- desktop: select → drag → drop ---------------- */
let pending = null, drag = null;
function clearPending(){ pending = null; $('hint').classList.remove('on'); document.body.classList.remove('grab'); }
function checkSelection(){
if (mobile.matches || drag) return;
const sel = getSelection();
if (!sel.rangeCount || sel.isCollapsed){ clearPending(); return; }
const r = sel.getRangeAt(0);
const node = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement;
if (!node.closest('.answer')){ clearPending(); return; }
const text = norm(sel.toString());
if (text.length < 4){ clearPending(); return; }
pending = { text, chat: current, range: r.cloneRange() };
const rects = r.getClientRects(); const last = rects[rects.length - 1] || r.getBoundingClientRect();
const first = rects[0] || last;
const h = $('hint'); h.style.left = Math.min(innerWidth - 160, Math.max(160, (first.left + last.right) / 2)) + 'px'; h.style.top = first.top + 'px';
h.classList.add('on');
step(1);
}
$('scroll').addEventListener('mouseup', () => setTimeout(checkSelection, 0));
document.addEventListener('keyup', e => { if (e.shiftKey) checkSelection(); });
$('scroll').addEventListener('scroll', () => { if (pending && !drag) clearPending(); }, {passive:true});
function inPending(x, y){
if (!pending) return false;
return [...pending.range.getClientRects()].some(r => x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2);
}
$('scroll').addEventListener('mousedown', e => {
if (mobile.matches || e.button !== 0 || !inPending(e.clientX, e.clientY)) return;
e.preventDefault();
drag = { sx: e.clientX, sy: e.clientY, live: false, el: null };
});
document.addEventListener('mousemove', e => {
if (cdrag){ cardDragMove(e); return; }
if (drag){
if (!drag.live && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6){
drag.live = true;
const g = document.createElement('div'); g.className = 'ghost';
g.innerHTML = `<div class="gt">${esc(pending.text)}</div><div class="gs">${ico('pin')}${esc(chatById(current).title)}</div>`;
document.body.appendChild(g); drag.el = g;
$('hint').classList.remove('on');
$('board').classList.add('dragging');
document.body.classList.add('grabbing');
}
if (drag.live){
drag.el.style.left = e.clientX + 'px'; drag.el.style.top = e.clientY + 'px';
const mainR = $('main').getBoundingClientRect();
if (!boardOpen && e.clientX > mainR.right - 240) openBoard(true);
const over = boardOpen && e.clientX > $('board').getBoundingClientRect().left;
$('board').classList.toggle('over', over); drag.el.classList.toggle('hot', over);
drag.over = over;
if (over){ const s = placeLine(e.clientY); drag.before = s.before; drag.el.style.top = s.gy + 'px'; }
}
return;
}
document.body.classList.toggle('grab', !!pending && inPending(e.clientX, e.clientY));
// auto-close: cursor back into chat area
if (boardOpen && desktopAutoBoard){
const left = $('board').getBoundingClientRect().left;
if (e.clientX < left - 30){
if (!autoT) autoT = setTimeout(() => { if (!$('board').contains(document.activeElement)) closeBoard(); autoT = null; }, 450);
} else { clearTimeout(autoT); autoT = null; }
}
});
let autoT = null;
document.addEventListener('mouseup', e => {
if (cdrag){ cardDragEnd(); return; }
if (!drag) return;
const d = drag; drag = null;
$('board').classList.remove('dragging', 'over');
document.body.classList.remove('grabbing');
if (!d.live){ getSelection().removeAllRanges(); clearPending(); return; }
if (d.over){
d.el.remove();
addPin(pending.text, pending.chat, d.before);
getSelection().removeAllRanges(); clearPending();
step(2);
} else {
d.el.classList.add('back'); setTimeout(() => d.el.remove(), 300);
if (desktopAutoBoard) closeBoard();
}
});
$('hintPin').addEventListener('mousedown', e => e.stopPropagation());
$('hintReply').addEventListener('mousedown', e => e.stopPropagation());
$('hintReply').onclick = () => {
if (!pending) return;
$('inp').value = '"' + pending.text + '" — '; $('inp').focus(); $('send').classList.add('ok');
getSelection().removeAllRanges(); clearPending();
};
$('hintPin').onclick = () => {
if (!pending) return;
openBoard(true); addPin(pending.text, pending.chat);
getSelection().removeAllRanges(); clearPending(); step(2);
};
/* ---------------- mobile: long press → 메모 + ---------------- */
let lp = null, msel = null;
function caretAt(x, y){
if (document.caretPositionFromPoint){ const p = document.caretPositionFromPoint(x, y); return p && [p.offsetNode, p.offset]; }
if (document.caretRangeFromPoint){ const r = document.caretRangeFromPoint(x, y); return r && [r.startContainer, r.startOffset]; }
return null;
}
function sentenceAt(x, y){
const c = caretAt(x, y); if (!c) return null;
const blk = (c[0].nodeType === 1 ? c[0] : c[0].parentElement).closest('.blk');
if (!blk || blk.tagName === 'H4') return null;
const walker = document.createTreeWalker(blk, NodeFilter.SHOW_TEXT); let off = 0, abs = -1;
while (walker.nextNode()){ if (walker.currentNode === c[0]){ abs = off + c[1]; break; } off += walker.currentNode.data.length; }
const all = blk.textContent; if (abs < 0) abs = 0;
let s = 0;
for (let i = Math.min(abs, all.length - 1) - 1; i > 0; i--){ if (/[.!?:]/.test(all[i]) && /\s/.test(all[i+1] || '')){ s = i + 1; break; } }
let e = all.length;
for (let i = Math.max(abs, s); i < all.length; i++){ if (/[.!?]/.test(all[i]) && (i === all.length - 1 || /\s/.test(all[i+1]))){ e = i + 1; break; } }
const text = norm(all.slice(s, e)); if (text.length < 4) return null;
return { blk, text, range: textRange(blk, text) };
}
function showMSel(sel){
msel = sel;
if (window.CSS && CSS.highlights && sel.range) CSS.highlights.set('pinsel', new Highlight(sel.range));
const rs = sel.range.getClientRects(); const a = rs[0], b = rs[rs.length - 1];
$('h1').style.left = a.left + 'px'; $('h1').style.top = (a.top + 2) + 'px';
$('h2').style.left = b.right + 'px'; $('h2').style.top = (b.bottom - 2) + 'px';
$('h1').classList.add('on'); $('h2').classList.add('on');
const sc = $('selchip'); sc.style.left = Math.min(innerWidth - 90, Math.max(90, (a.left + b.right) / 2)) + 'px'; sc.style.top = Math.max(70, a.top) + 'px';
sc.classList.add('on');
}
function hideMSel(){
msel = null; ['h1','h2','selchip'].forEach(id => $(id).classList.remove('on'));
if (window.CSS && CSS.highlights) CSS.highlights.delete('pinsel');
}
$('thread').addEventListener('pointerdown', e => {
if (!mobile.matches || e.pointerType === 'mouse' && !e.isPrimary) return;
if (msel){ hideMSel(); }
const x = e.clientX, y = e.clientY;
clearTimeout(lp?.t);
lp = { x, y, t: setTimeout(() => {
const s = sentenceAt(x, y);
if (s){ if (navigator.vibrate) navigator.vibrate(8); showMSel(s); }
lp = null;
}, 460) };
});
$('thread').addEventListener('pointermove', e => { if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10){ clearTimeout(lp.t); lp = null; } });
['pointerup','pointercancel'].forEach(ev => $('thread').addEventListener(ev, () => { if (lp){ clearTimeout(lp.t); lp = null; } }));
$('thread').addEventListener('contextmenu', e => { if (mobile.matches) e.preventDefault(); });
$('scroll').addEventListener('scroll', () => { if (msel) hideMSel(); }, {passive:true});
$('selCancel').onclick = hideMSel;
$('selGo').onclick = () => {
if (!msel) return;
addPin(msel.text, current); hideMSel();
toast('메모에 꽂았어요', openMemo);
};
/* mobile drawer + memo list */
function openDrawer(){ $('drawer').classList.add('on'); $('scrim').classList.add('on'); }
function closeDrawer(){ $('drawer').classList.remove('on'); $('scrim').classList.remove('on'); }
$('mMenu').onclick = openDrawer; $('mmBack').onclick = openDrawer; $('scrim').onclick = closeDrawer;
let mq = '';
function renderMemo(){
const list = pins.filter(p => match(p, mq));
$('mlist').innerHTML = list.map(p => `<div class="mrow" data-id="${p.id}"><button class="del">삭제</button><div class="fg">
<div class="t1">${esc(p.text)}</div>
${p.memo ? `<div class="t3">${esc(p.memo)}</div>` : ''}
<div class="t2"><b>${esc(chatById(p.chat).title)}</b>· ${ago(p.t)}</div>
<svg class="i chev"><use href="#i-right"/></svg></div></div>`).join('') +
(list.length ? '<div class="mswipehint">← 왼쪽으로 밀어서 삭제 · 탭하면 원래 대화로</div>' : '<div class="empty">아직 꽂은 문장이 없어요</div>');
}
function openMemo(){ closeDrawer(); renderMemo(); $('mmemo').classList.add('on'); }
function closeMemo(){ $('mmemo').classList.remove('on'); }
$('mq').oninput = e => { mq = e.target.value; renderMemo(); };
$('mmNew').onclick = closeMemo;
let sw = null;
$('mlist').addEventListener('pointerdown', e => {
const fg = e.target.closest('.fg'); if (!fg) return;
document.querySelectorAll('.mrow .fg').forEach(f => { if (f !== fg) f.style.transform = ''; });
const base = fg.style.transform ? -84 : 0;
sw = { fg, x: e.clientX, y: e.clientY, base, dx: 0, moved: false, axis: null };
});
$('mlist').addEventListener('pointermove', e => {
if (!sw) return;
const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
if (!sw.axis && Math.hypot(dx, dy) > 8) sw.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
if (sw.axis !== 'x') return;
sw.moved = true; sw.dx = dx;
sw.fg.classList.add('drag');
sw.fg.style.transform = `translateX(${Math.min(0, Math.max(-110, sw.base + dx))}px)`;
});
function endSwipe(e){
if (!sw) return;
const s = sw; sw = null; s.fg.classList.remove('drag');
if (s.moved){ s.fg.style.transform = (s.base + s.dx < -42) ? 'translateX(-84px)' : ''; return; }
if (s.axis === 'y') return;
if (s.base){ s.fg.style.transform = ''; return; }
if (e.type === 'pointerup'){ const p = pins.find(x => x.id === s.fg.parentElement.dataset.id); if (p) goReturn(p); }
}
$('mlist').addEventListener('pointerup', endSwipe);
$('mlist').addEventListener('pointercancel', endSwipe);
$('mlist').addEventListener('click', e => {
const d = e.target.closest('.del'); if (!d) return;
const row = d.parentElement; const id = row.dataset.id;
row.style.height = row.offsetHeight + 'px'; requestAnimationFrame(() => { row.style.height = '0px'; row.style.opacity = '0'; });
setTimeout(() => { pins = pins.filter(p => p.id !== id); save(); renderBoard(); renderNav(); }, 260);
});
/* composer */
$('inp').addEventListener('input', e => $('send').classList.toggle('ok', !!e.target.value.trim()));
const fitInp = () => { const t = $('inp'); t.style.height = '26px'; t.style.height = Math.min(t.scrollHeight, 180) + 'px'; t.style.overflowY = t.scrollHeight > 180 ? 'auto' : 'hidden'; };
$('inp').addEventListener('input', fitInp);
function send(){
const v = $('inp').value.trim(); if (!v) return;
const c = chatById(current);
c.msgs.push({u: v}, {a: [['p','이 데모에서는 답변 생성 대신 **Claude Pin 인터랙션**만 체험할 수 있어요. 위 답변에서 마음에 드는 문장을 드래그하거나 길게 눌러 꽂아 보세요.']]});
$('inp').value = ''; $('send').classList.remove('ok'); fitInp();
renderChat(); $('scroll').scrollTop = $('scroll').scrollHeight;
}
$('send').onclick = send;
$('inp').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); send(); } });
/* init */
$('scroll').addEventListener('scroll', () => $('main').classList.toggle('scrolled', $('scroll').scrollTop > 2), {passive:true});
$('panelBtn').onclick = () => $('pinToggle').click();
renderNav(); renderChat(); renderBoard();
mobile.addEventListener('change', () => { closeBoard(); closeFull(); closeMemo(); hideMSel(); renderChat(); });
setInterval(() => { if (boardOpen) renderBoard(); }, 60000);
})();
