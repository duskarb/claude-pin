/* Claude Pin — first-run explainer: blurred backdrop + centered animated card */
(() => {
'use strict';
const css = `
.intro{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:16px;background:rgba(28,28,26,.34);-webkit-backdrop-filter:blur(9px);backdrop-filter:blur(9px);animation:iFade .35s ease both}
.intro.out{animation:iOut .28s ease both}
@keyframes iFade{from{opacity:0}to{opacity:1}}
@keyframes iOut{to{opacity:0}}
.icard{width:min(500px,100%);background:#fff;border-radius:22px;box-shadow:0 30px 90px rgba(0,0,0,.28);padding:26px 26px 20px;animation:iRise .5s cubic-bezier(.2,.9,.3,1.1) both}
@keyframes iRise{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
.icard .ibadge{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.06em;color:#B85C3D}
.icard h2{margin:12px 0 6px;font-family:'Source Serif 4',Georgia,serif;font-optical-sizing:auto;font-weight:500;font-size:32px;letter-spacing:-.015em;line-height:1.1;color:#191919}
.icard .isub{margin:0;font-size:15px;line-height:1.6;color:#4A4A47}
.sw{position:relative;margin:18px 0 14px;border:1px solid #E3E3E1;border-radius:14px;overflow:hidden;background:#fff}
.stage{position:absolute;left:0;top:0;width:440px;height:226px;transform-origin:0 0;overflow:hidden}
.stage .ln{position:absolute;height:8px;border-radius:4px;background:#ECECE9}
.stage .ub{position:absolute;height:22px;border-radius:11px;background:#F0F0EE}
.stage .sent{position:absolute;height:16px;border-radius:3px;animation:iRet var(--T) infinite}
.stage .sent .sb{position:absolute;left:0;right:0;top:4px;height:8px;border-radius:4px;background:#D9D9D5}
.stage .sent .sel{position:absolute;left:-2px;top:0;height:16px;width:0;border-radius:3px;background:#B6D6FB;animation:iSel var(--T) infinite}
.stage .ipop{position:absolute;display:flex;gap:6px;align-items:center;background:#fff;border:1px solid #E3E3E1;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.12);padding:4px 9px;font-size:11px;font-weight:500;color:#1F1F1E;white-space:nowrap;opacity:0;animation:iPop var(--T) infinite}
.stage .ipop b{color:#B85C3D;font-weight:500}
.stage .ipop .sep{width:1px;height:10px;background:#E3E3E1}
.stage .ighost{position:absolute;width:92px;height:18px;padding:0 10px;border-radius:999px;background:#D97757;box-shadow:0 6px 14px rgba(217,119,87,.35);display:flex;align-items:center;opacity:0;animation:iGhost var(--T) infinite}
.stage .ighost i{display:block;width:100%;height:5px;border-radius:3px;background:rgba(255,255,255,.8)}
.stage .ic i{display:block;height:6px;border-radius:3px;background:#D9D9D5;margin-bottom:5px}
.stage .ic b{display:inline-block;font-size:8.5px;font-weight:500;color:#B85C3D;margin-top:1px}
.stage .iboard{position:absolute;top:0;right:0;bottom:0;width:150px;background:#FAFAF9;border-left:1px solid #E3E3E1;padding:0 8px;transform:translateX(100%);animation:iBoard var(--T) infinite}
.stage .iline{position:absolute;left:6px;right:8px;top:32px;height:2px;border-radius:2px;background:#D97757;opacity:0;animation:iLine var(--T) infinite}
.stage .iline::before{content:'';position:absolute;left:-3px;top:-3px;width:8px;height:8px;border-radius:50%;background:#D97757}
.stage .ibh{height:28px;display:flex;align-items:center;font-size:10.5px;font-weight:600;color:#1F1F1E;border-bottom:1px solid #ECECEA;margin:0 -8px 8px;padding:0 10px}
.stage .ic{background:#fff;border:1px solid #ECECEA;border-radius:8px;padding:7px 8px;margin-bottom:7px;overflow:hidden}
.stage .ic.new{max-height:0;padding-top:0;padding-bottom:0;margin-bottom:0;opacity:0;border-color:transparent;animation:iNew var(--T) infinite}
.stage .ic i.w6{width:60%}.stage .ic i.w7{width:72%}.stage .ic i.w5{width:50%}
.stage .iclick{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;border:2px solid #D97757;opacity:0;animation:iClick var(--T) infinite}
.stage .icur{position:absolute;left:0;top:0;animation:iCur var(--T) infinite;will-change:transform}
.stage .icur svg{display:block;width:15px;height:21px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))}
.stage .icur .arw{animation:iArw var(--T) infinite}
.stage .icur .hand{position:absolute;left:-9px;top:-7px;width:20px;height:20px;opacity:0;animation:iHand var(--T) infinite}
.stage .icur .hand .fist{opacity:0;animation:iFist var(--T) infinite}
.stage .icur .hand .open{animation:iOpen var(--T) infinite}
.stage .icur .fing{display:none;position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:50%;background:rgba(31,31,30,.22);border:2px solid rgba(255,255,255,.9);animation:iPress var(--T) infinite}
.isteps{list-style:none;margin:0;padding:0;word-break:keep-all;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.isteps li{font-size:12.5px;line-height:1.45;color:#1F1F1E;border-top:2px solid #E3E3E1;padding-top:8px;opacity:.38}
.isteps li b{display:block;font-size:11px;color:#D97757;margin-bottom:2px}
.isteps li.s1{animation:iS1 var(--T) infinite}.isteps li.s2{animation:iS2 var(--T) infinite}.isteps li.s3{animation:iS3 var(--T) infinite}
.isteps .m,.stage .ipop .m{display:none}
.istart{display:block;width:100%;margin-top:18px;height:46px;border-radius:12px;background:#1F1F1E;color:#fff;font-size:15px;font-weight:600}
.istart:hover{background:#000}
.inote{margin:10px 0 0;text-align:center;font-size:11.5px;color:#9A9A96}
@media (max-width:760px){
  .stage .icur svg{display:none!important}.stage .icur .fing{display:block}
  .isteps .d,.stage .ipop .d{display:none}.isteps .m,.stage .ipop .m{display:inline}
  .icard{padding:22px 18px 16px}.icard h2{font-size:25px}
}
@keyframes iCur{
  0%{transform:translate(300px,186px)} 10%,14%{transform:translate(64px,62px)} 28%,33%{transform:translate(236px,62px)}
  38%,41%{transform:translate(150px,64px)} 56%,61%{transform:translate(320px,33px)} 69%,76%{transform:translate(334px,64px)}
  88%{transform:translate(210px,168px)} 100%{transform:translate(300px,186px)}}
@keyframes iArw{0%,32%{opacity:1} 33%,60%{opacity:0} 61%,100%{opacity:1}}
@keyframes iHand{0%,32%{opacity:0} 33%,60%{opacity:1} 61%,100%{opacity:0}}
@keyframes iOpen{0%,39%{opacity:1} 40%,57%{opacity:0} 58%,100%{opacity:1}}
@keyframes iFist{0%,39%{opacity:0} 40%,57%{opacity:1} 58%,100%{opacity:0}}
@keyframes iSel{0%,14%{width:0} 28%,54%{width:176px} 57%,100%{width:0}}
@keyframes iPop{0%,29%{opacity:0;transform:translateY(4px)} 31%,37%{opacity:1;transform:none} 39%,100%{opacity:0;transform:none}}
@keyframes iGhost{0%,39%{opacity:0;transform:none} 41%{opacity:1;transform:none} 56%{opacity:1;transform:translate(170px,-31px)} 60%,100%{opacity:0;transform:translate(170px,-31px) scale(.94)}}
@keyframes iBoard{0%,44%{transform:translateX(100%)} 49%,84%{transform:none} 89%,100%{transform:translateX(100%)}}
@keyframes iLine{0%,47%{opacity:0} 49%,57%{opacity:1} 59%,100%{opacity:0}}
@keyframes iNew{0%,57%{max-height:0;opacity:0;padding-top:0;padding-bottom:0;margin-bottom:0;border-color:transparent} 61%,100%{max-height:60px;opacity:1;padding-top:7px;padding-bottom:7px;margin-bottom:7px;border-color:#EFC9B8}}
@keyframes iClick{0%,72%{opacity:0;transform:scale(.4)} 74%{opacity:.8;transform:scale(1)} 80%,100%{opacity:0;transform:scale(1.7)}}
@keyframes iRet{0%,82%{background:transparent} 86%,95%{background:rgba(217,119,87,.32)} 100%{background:transparent}}
@keyframes iPress{0%,9%{transform:scale(1)} 12%{transform:scale(.75)} 14%,100%{transform:scale(1)}}
@keyframes iS1{0%,31%{opacity:1;border-top-color:#D97757} 34%,100%{opacity:.38;border-top-color:#E3E3E1}}
@keyframes iS2{0%,31%{opacity:.38;border-top-color:#E3E3E1} 34%,64%{opacity:1;border-top-color:#D97757} 67%,100%{opacity:.38;border-top-color:#E3E3E1}}
@keyframes iS3{0%,64%{opacity:.38;border-top-color:#E3E3E1} 67%,97%{opacity:1;border-top-color:#D97757} 100%{opacity:.38;border-top-color:#E3E3E1}}
@media (prefers-reduced-motion:reduce){.stage *{animation-duration:0s!important}}
`;
const html = `
<div class="intro" id="intro" role="dialog" aria-modal="true" aria-labelledby="introT" style="--T:8s">
  <div class="icard">
    <span class="ibadge">CONCEPT PROTOTYPE</span>
    <h2 id="introT">Claude <span style="color:#D97757">Pin</span></h2>
    <p class="isub">답변에서 필요한 문장만 꽂아 두고,<br>언제든 그 문장이 나온 대화로 돌아오세요.</p>
    <div class="sw" id="introSw"><div class="stage" id="introStage">
      <div class="ub" style="left:236px;top:14px;width:180px"></div>
      <div class="ln" style="left:24px;top:46px;width:330px"></div>
      <div class="ln" style="left:24px;top:66px;width:36px"></div>
      <div class="sent" style="left:64px;top:62px;width:172px"><i class="sel"></i><i class="sb"></i></div>
      <div class="ln" style="left:240px;top:66px;width:90px"></div>
      <div class="ln" style="left:24px;top:86px;width:300px"></div>
      <div class="ln" style="left:24px;top:106px;width:250px"></div>
      <div class="ln" style="left:24px;top:136px;width:110px;background:#E0E0DC"></div>
      <div class="ln" style="left:24px;top:156px;width:320px"></div>
      <div class="ln" style="left:24px;top:176px;width:280px"></div>
      <div class="ln" style="left:24px;top:196px;width:200px"></div>
      <div class="ipop" style="left:112px;top:30px"><span class="d">답글 ↩</span><span class="sep d"></span><b class="d">핀</b><b class="m">메모 +</b></div>
      <div class="iboard"><div class="ibh">핀 보드</div><i class="iline"></i>
        <div class="ic new"><i></i><i class="w6"></i><b>포트폴리오 정리 ↗</b></div>
        <div class="ic"><i></i><i class="w7"></i></div>
        <div class="ic"><i></i><i class="w5"></i></div>
      </div>
      <div class="ighost" style="left:104px;top:55px"><i></i></div>
      <i class="iclick" style="left:334px;top:64px"></i>
      <div class="icur"><svg class="arw" viewBox="0 0 15 21"><path d="M1 1v16l4.2-3.8 3 6.3 2.6-1.2-3-6.2h5.7z" fill="#1F1F1E" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg><svg class="hand" viewBox="0 0 20 20"><g class="open"><path d="M6.6 10V4.4a1.2 1.2 0 0 1 2.4 0V9M9 9V3.1a1.2 1.2 0 0 1 2.4 0V9M11.4 9V3.8a1.2 1.2 0 0 1 2.4 0V10M13.8 10V6a1.2 1.2 0 0 1 2.4 0v5.8c0 3.6-2.4 6.4-5.8 6.4h-.6c-1.9 0-3.1-.8-4.3-2.4L3.1 12.4a1.250 1.250 0 0 1 1.9-1.6l1.6 1.6V10" fill="#fff" stroke="#1F1F1E" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/></g><g class="fist"><path d="M6.4 9.2c0-1 .8-1.6 1.6-1.4.5-.9 1.9-1 2.4 0 .6-.8 2-.6 2.3.4.7-.6 2.1-.2 2.1 1v3.3c0 3.2-2.2 5.7-5.3 5.7h-.7c-1.7 0-2.8-.7-3.9-2.1L3.4 12.6a1.2 1.2 0 0 1 1.8-1.5l1.2 1.1z" fill="#fff" stroke="#1F1F1E" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M8 7.8v2.4M10.4 7.8v2.4M12.7 8.2v2.2" stroke="#1F1F1E" stroke-width="1" stroke-linecap="round"/></g></svg><span class="fing"></span></div>
    </div></div>
    <ol class="isteps">
      <li class="s1"><b>01</b><span class="d">답변에서 문장을 드래그해 선택</span><span class="m">문장을 길게 누르기</span></li>
      <li class="s2"><b>02</b><span class="d">오른쪽 핀 보드로 끌어 꽂기</span><span class="m">「메모 +」로 바로 꽂기</span></li>
      <li class="s3"><b>03</b><span class="d">핀의 링크를 눌러 원래 대화로</span><span class="m">메모를 탭해 원래 대화로</span></li>
    </ol>
    <button class="istart" id="introGo">직접 해보기</button>
    <p class="inote">Anthropic과 무관한 개인 UX 프로젝트입니다</p>
  </div>
</div>`;
const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
function fit(){
  const sw = document.getElementById('introSw'), st = document.getElementById('introStage');
  if (!sw) return;
  const s = sw.clientWidth / 440;
  st.style.transform = `scale(${s})`; sw.style.height = (226 * s) + 'px';
}
function open(){
  if (document.getElementById('intro')) return;
  document.body.insertAdjacentHTML('beforeend', html);
  fit();
  const el = document.getElementById('intro');
  const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 280); removeEventListener('keydown', esc); };
  const esc = e => { if (e.key === 'Escape' || e.key === 'Enter') close(); };
  document.getElementById('introGo').onclick = close;
  addEventListener('keydown', esc);
  setTimeout(() => document.getElementById('introGo')?.focus(), 400);
}
addEventListener('resize', fit, {passive:true});
window.openIntro = open;
open();
})();
