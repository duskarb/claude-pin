(() => {
  const tabs = [...document.querySelectorAll('[data-flow]')];
  if (!tabs.length) return;
  function show(index, focus = false) {
    const flow = window.PIN_FLOW[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    document.getElementById('flow-image').src = `assets/${flow.file}.png`;
    document.getElementById('flow-image').alt = `${flow.title} — Final 디자인 화면`;
    document.getElementById('flow-title').textContent = flow.title;
    document.getElementById('flow-copy').textContent = flow.copy;
    document.getElementById('flow-panel').setAttribute('aria-labelledby', tabs[index].id);
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => show(index));
    tab.addEventListener('keydown', (event) => {
      const keys = { ArrowDown: (index + 1) % tabs.length, ArrowRight: (index + 1) % tabs.length, ArrowUp: (index + tabs.length - 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (event.key in keys) { event.preventDefault(); show(keys[event.key], true); }
    });
  });
})();
