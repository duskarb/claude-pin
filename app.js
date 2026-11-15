/* Claude Pin: case study page + working prototype. No dependencies. */
(() => {
  'use strict';

  // ───────────── Data ─────────────
  const SESSIONS = [
    {
      id: 'plotter', title: '펜 플로터 시계',
      messages: [
        { role: 'user', paras: ['펜 플로터 시계에 대해 설명해줘'] },
        { role: 'ai', paras: [
          '펜 플로터 시계는 남규님이 현재 진행하고 있는 프로젝트예요. 펜 플로터는 컴퓨터가 제어하는 드로잉 기계예요. 모터로 펜을 움직여 벡터 이미지를 종이에 직접 그립니다.',
          '남규님의 아이디어 중에서는 속도 자체가 하나의 시간 감각이 될 수 있다는 점이 인상적이에요. 펜의 속도를 제어하면 시각적 리듬을 만들 수 있습니다.',
          '이런 물리적 제약이 오히려 독특한 미적 감각을 만들어냅니다. 디지털 방식으로는 구현하기 어려운 우연성과 물성이 펜 플로터의 매력이에요.',
        ] },
        { role: 'user', paras: ['시간을 그리는 방식을 몇 가지 더 제안해줘'] },
        { role: 'ai', paras: [
          '하루에 나선을 한 번 그리는 대신, 매 시간마다 새로운 나선을 시작하는 방법이 있어요. 24개의 나선이 겹쳐지면서 모아레 패턴이 생기고, 종이 위에 시간의 층위가 보입니다.',
          '선을 긋는 속도를 시각에 따라 바꾸는 방법도 있습니다. 느리게 그은 선은 잉크가 번져 굵어지고, 빠르게 그은 선은 가늘게 남아요. 하루의 밀도가 선의 굵기로 기록됩니다.',
        ] },
      ],
    },
    {
      id: 'brutal', title: '브루탈리즘 타이포그래피',
      messages: [
        { role: 'user', paras: ['브루탈리즘 디자인의 핵심 원칙이 뭐야? 특히 타이포그래피 관점에서.'] },
        { role: 'ai', paras: [
          '브루탈리즘 타이포그래피는 기능이 형태를 결정한다는 전제를 극단까지 밀어붙입니다. 장식을 제거하면 남는 건 구조뿐이고, 그 구조가 그대로 미학이 된다는 논리예요.',
          '첫째는 위계의 노출입니다. 어떤 텍스트가 중요한지 숨기지 않고 크기, 굵기, 위치로 그대로 드러냅니다. 독자가 읽기 전에 이미 구조를 파악할 수 있어야 해요.',
          '둘째는 여백의 거부입니다. 기존 타이포그래피가 여백으로 숨을 주었다면, 브루탈리즘은 밀도 자체가 의도입니다. 텍스트가 화면을 채우는 것을 두려워하지 않아요.',
          '셋째이자 가장 중요한 건 폰트의 솔직함입니다. 아무 주장도 하지 않는 서체가 역설적으로 가장 강한 존재감을 가집니다. 폰트가 투명해질수록 콘텐츠의 날것이 드러나요.',
        ] },
      ],
    },
    {
      id: 'role', title: 'AI 시대에서 디자이너의 역할',
      messages: [
        { role: 'user', paras: ['AI가 화면을 만들어 주는 시대에 디자이너는 무엇을 해야 할까?'] },
        { role: 'ai', paras: [
          '만드는 일의 비용이 내려가면, 무엇을 만들지 정하는 일의 값이 올라갑니다. 화면을 그리는 시간보다 문제를 고르는 시간이 더 중요해져요.',
          '그래서 디자이너의 일은 답을 내는 쪽에서 질문을 다듬는 쪽으로 옮겨 갑니다. 문제를 잘 발견하는 사람이 좋은 결과물을 얻습니다.',
          '또 하나는 판단입니다. AI는 그럴듯한 시안을 여러 개 내놓지만, 그중 어느 것이 이 사용자에게 맞는지는 사람이 골라야 합니다.',
        ] },
      ],
    },
  ];

  const SEEDS = [
    { session: 'brutal', m: 1, p: 3, text: '폰트가 투명해질수록 콘텐츠의 날것이 드러나요.', ago: 26 * 3600e3, comments: ['포트폴리오 본문 서체 고를 때 참고'] },
    { session: 'brutal', m: 1, p: 2, text: '브루탈리즘은 밀도 자체가 의도입니다.', ago: 26 * 3600e3 + 9e4, comments: [] },
    { session: 'role', m: 1, p: 1, text: '문제를 잘 발견하는 사람이 좋은 결과물을 얻습니다.', ago: 3 * 3600e3, comments: [] },
  ];

  const REPLIES = [
    [
      '지금은 예시 응답만 보여 주는 프로토타입이라 실제 모델이 답하고 있지는 않아요. 그래도 이 답변의 문장은 위의 답변과 똑같이 핀할 수 있습니다.',
      '문장을 선택해 오른쪽으로 끌어 보세요. 새로 만든 핀에도 이 대화로 돌아오는 링크가 붙습니다.',
    ],
    [
      '이 자리에는 원래 모델의 답변이 이어집니다. 프로토타입에서는 대화가 길어져도 핀이 제자리를 찾아가는지를 확인할 수 있어요.',
      '핀 보드에서 세션 링크를 누르면, 대화가 아무리 길어도 핀한 문장이 화면 가운데에 오도록 이동합니다.',
    ],
  ];

  // ───────────── State + storage ─────────────
  const KEY = 'claude-pin/v1';
  const state = { session: 'plotter', pins: [], extra: {}, panel: 'closed', query: '', sort: 'new', replyIdx: 0 };
  let pending = null;      // selection being dragged
  let autoClose = false;   // panel opened by a drag closes when the cursor returns to the chat
  let closeTimer = 0;

  const $ = (id) => document.getElementById(id);
  const app = $('app'), chatScroll = $('chatScroll'), cards = $('cards'), panel = $('panel');
  const dropzone = $('dropzone'), tray = $('tray'), pop = $('pop'), chip = $('dragChip'), live = $('live');

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && Array.isArray(raw.pins)) { state.pins = raw.pins; state.extra = raw.extra || {}; return; }
    } catch (_) { /* storage unavailable: run in memory */ }
    seed();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ pins: state.pins, extra: state.extra })); } catch (_) {}
  }
  function seed() {
    const now = Date.now();
    state.extra = {};
    state.pins = SEEDS.map((s, i) => {
      const sess = SESSIONS.find((x) => x.id === s.session);
      const start = sess.messages[s.m].paras[s.p].indexOf(s.text);
      return {
        id: 'seed' + i, key: `${s.session}:${s.m}:${s.p}`, start, end: start + s.text.length, text: s.text,
        src: { type: 'chat', session: s.session, label: sess.title }, t: now - s.ago,
        comments: s.comments.map((c) => ({ text: c, t: now - s.ago + 6e4 })),
      };
    });
  }

  const messagesOf = (id) => SESSIONS.find((s) => s.id === id).messages.concat(state.extra[id] || []);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cut = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
  function rel(t) {
    const d = Date.now() - t;
    if (d < 6e4) return '방금';
    if (d < 36e5) return Math.floor(d / 6e4) + '분 전';
    if (d < 864e5) return Math.floor(d / 36e5) + '시간 전';
    return Math.floor(d / 864e5) + '일 전';
  }
  const say = (msg) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = msg; }); };
  const stepDone = (name) => document.querySelector(`.guide [data-step="${name}"]`)?.classList.add('done');

  // ───────────── Pinnable text: render marks ─────────────
  function renderPinnable(el) {
    if (el._text == null) el._text = el.textContent;
    const text = el._text;
    const ranges = state.pins.filter((p) => p.key === el.dataset.key).sort((a, b) => a.start - b.start);
    let html = '', pos = 0;
    for (const p of ranges) {
      const s = Math.max(p.start, pos), e = Math.min(p.end, text.length);
      if (e <= s) continue;
      html += esc(text.slice(pos, s)) + `<mark class="pin-mark" data-pin="${p.id}" tabindex="0" role="button" aria-label="핀한 문장, 보드에서 보기">${esc(text.slice(s, e))}</mark>`;
      pos = e;
    }
    el.innerHTML = html + esc(text.slice(pos));
  }
  const renderAllPinnable = () => document.querySelectorAll('[data-pinnable]').forEach(renderPinnable);

  // ───────────── Chat ─────────────
  function renderChat() {
    const sess = SESSIONS.find((s) => s.id === state.session);
    $('chatTitle').textContent = sess.title;
    const wrap = document.createElement('div');
    wrap.className = 'msgs';
    messagesOf(state.session).forEach((m, mi) => {
      const box = document.createElement('div');
      box.className = 'msg ' + m.role;
      m.paras.forEach((t, pi) => {
        const p = document.createElement('p');
        p.textContent = t;
        if (m.role === 'ai') {
          p.dataset.pinnable = '';
          p.dataset.key = `${state.session}:${mi}:${pi}`;
          p.dataset.session = state.session;
          renderPinnable(p);
        }
        box.appendChild(p);
      });
      wrap.appendChild(box);
    });
    chatScroll.replaceChildren(wrap);
    renderSessions();
  }
  function renderSessions() {
    const list = $('sessionList');
    list.replaceChildren(...SESSIONS.map((s) => {
      const b = document.createElement('button');
      b.textContent = s.title;
      if (s.id === state.session) b.setAttribute('aria-current', 'true');
      b.onclick = () => { setSession(s.id); toggleSessions(false); };
      return b;
    }));
  }
  function setSession(id) {
    if (state.session === id) return;
    state.session = id;
    renderChat();
    chatScroll.scrollTop = 0;
  }
  function toggleSessions(open) {
    const list = $('sessionList');
    const next = open ?? list.hidden;
    list.hidden = !next;
    $('btnSessions').setAttribute('aria-expanded', String(next));
  }

  // Composer: scripted replies, streamed
  const input = $('input');
  let typing = false;
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = input.scrollHeight + 'px'; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('composer').requestSubmit(); }
  });
  $('composer').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || typing) return;
    const id = state.session;
    (state.extra[id] ||= []).push({ role: 'user', paras: [text] });
    input.value = ''; input.style.height = 'auto';
    renderChat();
    streamReply(id, REPLIES[state.replyIdx++ % REPLIES.length]);
  });
  function streamReply(id, paras) {
    typing = true;
    const box = document.createElement('div');
    box.className = 'msg ai typing';
    chatScroll.querySelector('.msgs').appendChild(box);
    let pi = 0, ci = 0, p = null;
    const tick = () => {
      if (state.session !== id) return finish();
      if (!p) { p = document.createElement('p'); box.appendChild(p); }
      ci += 3;
      p.textContent = paras[pi].slice(0, ci);
      chatScroll.scrollTop = chatScroll.scrollHeight;
      if (ci >= paras[pi].length) { pi++; ci = 0; p = null; if (pi >= paras.length) return finish(); }
      setTimeout(tick, 18);
    };
    const finish = () => {
      typing = false;
      state.extra[id].push({ role: 'ai', paras });
      save();
      if (state.session === id) { renderChat(); chatScroll.scrollTop = chatScroll.scrollHeight; }
    };
    setTimeout(tick, 350);
  }

  // ───────────── Selection → pin ─────────────
  const pinnableOf = (node) => (node?.nodeType === 1 ? node : node?.parentElement)?.closest('[data-pinnable]') || null;

  function readSelection() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0);
    const a = pinnableOf(r.startContainer), b = pinnableOf(r.endContainer);
    const el = a || b;
    if (!el) return null;
    const rr = r.cloneRange();
    if (a !== el) rr.setStart(el, 0);
    if (b !== el) rr.setEnd(el, el.childNodes.length);
    const pre = document.createRange();
    pre.selectNodeContents(el);
    pre.setEnd(rr.startContainer, rr.startOffset);
    let text = rr.toString();
    const start = pre.toString().length + (text.length - text.trimStart().length);
    text = text.trim();
    if (text.length < 2) return null;
    const inChat = !!el.dataset.session;
    const src = inChat
      ? { type: 'chat', session: el.dataset.session, label: SESSIONS.find((s) => s.id === el.dataset.session).title }
      : { type: 'page', section: el.closest('section, header')?.id || 'top', label: '케이스 스터디, ' + (el.dataset.label || '본문') };
    return { el, key: el.dataset.key, start, end: start + text.length, text, src, rect: rr.getBoundingClientRect() };
  }

  function commit(s) {
    if (!s) return null;
    const dup = state.pins.find((p) => p.key === s.key && p.start < s.end && s.start < p.end);
    if (dup) { focusCard(dup.id); say('이미 핀한 문장입니다'); return dup; }
    const pin = { id: 'p' + Date.now().toString(36), key: s.key, start: s.start, end: s.end, text: s.text, src: s.src, t: Date.now(), comments: [] };
    state.pins.unshift(pin);
    save();
    window.getSelection()?.removeAllRanges();
    hidePop();
    renderPinnable(s.el);
    renderCards(pin.id);
    tray.classList.remove('bump'); void tray.offsetWidth; tray.classList.add('bump');
    stepDone('capture');
    say('핀했습니다: ' + cut(pin.text, 30));
    return pin;
  }

  // Popover button (click path: touch, keyboard, or anyone who would rather not drag)
  let popTimer = 0;
  function hidePop() { pop.hidden = true; }
  const schedulePop = () => {
    clearTimeout(popTimer);
    popTimer = setTimeout(() => {
      const s = pending ? null : readSelection();
      if (!s) return hidePop();
      pop.style.left = Math.min(window.innerWidth - 50, Math.max(50, s.rect.left + s.rect.width / 2)) + 'px';
      pop.style.top = Math.max(44, s.rect.top - 8) + 'px';
      pop.hidden = false;
    }, 140);
  };
  document.addEventListener('selectionchange', schedulePop);
  window.addEventListener('scroll', () => { hidePop(); schedulePop(); }, { passive: true, capture: true });
  pop.addEventListener('mousedown', (e) => e.preventDefault());
  pop.addEventListener('click', () => {
    const s = readSelection();
    const pin = commit(s);
    if (pin && s.src.type === 'chat' && state.panel === 'closed') { setPanel('side'); autoClose = true; }
  });

  // Native drag of the selected text
  document.addEventListener('dragstart', (e) => {
    const s = readSelection();
    if (!s) return;
    pending = s;
    hidePop();
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', s.text);
    chip.textContent = cut(s.text, 22);
    try { e.dataTransfer.setDragImage(chip, 18, 20); } catch (_) {}
    if (s.src.type === 'chat') {
      if (state.panel === 'closed') { setPanel('side'); autoClose = true; }
      dropzone.classList.add('show');
    } else {
      tray.classList.add('armed');
      $('trayText').textContent = '여기에 놓아 핀하기';
    }
  });
  document.addEventListener('dragend', () => {
    pending = null;
    dropzone.classList.remove('show', 'over');
    tray.classList.remove('armed', 'over');
    updateCounts();
  });
  function dropTarget(el, overEl) {
    el.addEventListener('dragover', (e) => { if (!pending) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; overEl.classList.add('over'); });
    el.addEventListener('dragleave', (e) => { if (!el.contains(e.relatedTarget)) overEl.classList.remove('over'); });
    el.addEventListener('drop', (e) => { if (!pending) return; e.preventDefault(); commit(pending); });
  }
  dropTarget(panel, dropzone);
  dropTarget(tray, tray);

  // The board steps back when the cursor returns to the conversation
  $('chat').addEventListener('mouseenter', () => {
    if (!autoClose || pending || state.panel !== 'side') return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { if (autoClose && state.panel === 'side') setPanel('closed'); }, 420);
  });
  panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));

  // ───────────── Board ─────────────
  function setPanel(mode) {
    state.panel = mode;
    app.dataset.panel = mode;
    autoClose = false;
    $('btnPanel').setAttribute('aria-expanded', String(mode !== 'closed'));
    const full = mode === 'full';
    $('btnExpand').title = full ? '보드 줄이기' : '보드 넓히기';
    $('btnExpand').setAttribute('aria-label', $('btnExpand').title);
    if (!full && state.query) { state.query = ''; $('search').value = ''; }
    renderCards();
  }

  function renderCards(freshId) {
    const q = state.query.trim().toLowerCase();
    let list = state.pins.filter((p) => !q || [p.text, p.src.label, ...p.comments.map((c) => c.text)].join(' ').toLowerCase().includes(q));
    list = list.slice().sort((a, b) => b.t - a.t);
    const frag = document.createDocumentFragment();
    if (!list.length) {
      const e = document.createElement('p');
      e.className = 'empty';
      e.textContent = q ? `"${state.query}"에 맞는 핀이 없습니다. 다른 낱말로 찾아보세요.` : '아직 핀이 없습니다. 답변에서 문장을 선택해 여기로 끌어 오세요.';
      frag.appendChild(e);
    } else if (state.sort === 'session' && state.panel === 'full') {
      const groups = new Map();
      list.forEach((p) => { if (!groups.has(p.src.label)) groups.set(p.src.label, []); groups.get(p.src.label).push(p); });
      groups.forEach((items, label) => {
        const h = document.createElement('p'); h.className = 'group'; h.textContent = `${label} (${items.length})`;
        frag.appendChild(h);
        items.forEach((p) => frag.appendChild(card(p, freshId)));
      });
    } else {
      list.forEach((p) => frag.appendChild(card(p, freshId)));
    }
    cards.replaceChildren(frag);
    updateCounts();
  }

  function card(p, freshId) {
    const el = document.createElement('article');
    el.className = 'card' + (p.id === freshId ? ' fresh' : '');
    el.dataset.id = p.id;
    el.innerHTML = `
      <p class="card-text">${esc(p.text)}</p>
      <div class="card-src"><button class="src-link" title="원래 문장으로 돌아가기">${esc(p.src.label)}</button><time>${rel(p.t)}</time></div>
      <ul class="cmts">${p.comments.map((c) => `<li class="cmt"><span>${esc(c.text)}</span><time>${rel(c.t)}</time></li>`).join('')}</ul>
      <input class="card-add" placeholder="댓글 추가" aria-label="댓글 추가" maxlength="120">
      <button class="card-del" aria-label="핀 삭제" title="핀 삭제"><svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg></button>`;
    el.querySelector('.src-link').onclick = () => goBack(p);
    el.querySelector('.card-del').onclick = () => removePin(p.id);
    const add = el.querySelector('.card-add');
    add.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      const v = add.value.trim();
      if (!v) return;
      p.comments.push({ text: v, t: Date.now() });
      save(); stepDone('organize'); renderCards();
      cards.querySelector(`[data-id="${p.id}"] .card-add`)?.focus();
    });
    return el;
  }

  function removePin(id) {
    const i = state.pins.findIndex((p) => p.id === id);
    if (i < 0) return;
    const [p] = state.pins.splice(i, 1);
    save();
    document.querySelectorAll('[data-pinnable]').forEach((el) => { if (el.dataset.key === p.key) renderPinnable(el); });
    renderCards();
    say('핀을 삭제했습니다');
  }

  function focusCard(id) {
    const el = cards.querySelector(`[data-id="${id}"]`);
    if (!el) return;
    cards.querySelectorAll('.focus').forEach((c) => c.classList.remove('focus'));
    el.classList.add('focus');
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function updateCounts() {
    const n = state.pins.length;
    $('railCount').textContent = n; $('railCount').dataset.n = n;
    if (!tray.classList.contains('armed')) $('trayText').textContent = `핀 ${n}개`;
  }

  // Return: pin → the exact sentence it came from
  function goBack(p) {
    setPanel('closed');
    if (p.src.type === 'chat') setSession(p.src.session);
    stepDone('return');
    requestAnimationFrame(() => {
      const marks = document.querySelectorAll(`mark[data-pin="${p.id}"]`);
      if (!marks.length) return;
      marks[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
      marks.forEach((m) => { m.classList.remove('pulse'); void m.offsetWidth; m.classList.add('pulse'); });
      say(`${p.src.label}의 원래 문장으로 돌아왔습니다`);
    });
  }

  // Clicking a highlighted sentence shows its card
  function openFromMark(mark) {
    const id = mark.dataset.pin;
    const inChat = !!mark.closest('#app');
    if (!inChat) $('app').scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (state.panel === 'closed' || !inChat) setPanel(inChat ? 'side' : 'full');
    focusCard(id);
  }
  document.addEventListener('click', (e) => {
    const mark = e.target.closest?.('mark[data-pin]');
    if (mark && window.getSelection().isCollapsed) openFromMark(mark);
    if (!e.target.closest?.('#sessionList, #btnSessions')) toggleSessions(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches?.('mark[data-pin]')) openFromMark(e.target);
    if (e.key === 'Escape') { toggleSessions(false); if (state.panel !== 'closed' && e.target.closest?.('#app')) setPanel('closed'); }
  });

  // Controls
  $('btnSessions').onclick = () => toggleSessions();
  $('btnPanel').onclick = () => setPanel(state.panel === 'closed' ? 'side' : 'closed');
  $('btnBoard').onclick = () => setPanel(state.panel === 'full' ? 'closed' : 'full');
  $('btnExpand').onclick = () => setPanel(state.panel === 'full' ? 'side' : 'full');
  $('btnClose').onclick = () => setPanel('closed');
  $('btnSort').onclick = () => {
    state.sort = state.sort === 'new' ? 'session' : 'new';
    $('btnSort').textContent = state.sort === 'new' ? '최신순' : '세션별';
    renderCards();
  };
  $('search').addEventListener('input', (e) => { state.query = e.target.value; if (state.query.trim()) stepDone('organize'); renderCards(); });
  $('btnReset').onclick = () => {
    seed(); save();
    state.session = 'plotter'; state.query = ''; $('search').value = '';
    document.querySelectorAll('.guide .done').forEach((el) => el.classList.remove('done'));
    setPanel('closed'); renderChat(); renderAllPinnable();
    say('프로토타입을 처음 상태로 되돌렸습니다');
  };
  tray.onclick = () => { $('app').scrollIntoView({ block: 'center', behavior: 'smooth' }); setPanel('full'); };

  // ───────────── Section index ─────────────
  const links = [...document.querySelectorAll('.index ol a')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  links.forEach((a) => { const t = document.querySelector(a.getAttribute('href')); if (t) spy.observe(t); });

  // ───────────── Boot ─────────────
  load();
  renderChat();
  renderAllPinnable();
  renderCards();
  setInterval(() => { if (state.panel !== 'closed' && !cards.contains(document.activeElement)) renderCards(); }, 60000);
})();
