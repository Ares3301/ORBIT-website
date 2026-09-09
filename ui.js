import {initLanguage} from './i18n.js';
initLanguage();
const toggle=document.getElementById('ui-toggle');
const panels=document.querySelectorAll('#universe > header, .mode-nav, .view-tools, #detail, #deep-stage-detail, #sky-tools, #lab-tools, .scene-note, .bottom, #language-toggle, #mobile-menu, #mobile-info');
let hidden=false;
function setHidden(value){
  hidden=value;
  document.body.classList.toggle('ui-hidden',hidden);
  panels.forEach(panel=>{panel.inert=hidden;});
  toggle.textContent=hidden?'UIを表示':'UIを隠す';
  toggle.setAttribute('aria-pressed',String(hidden));
  toggle.setAttribute('aria-label',hidden?'操作パネルを表示（Hキー）':'操作パネルを隠す（Hキー）');
  if(hidden)toggle.focus({preventScroll:true});
}
toggle.addEventListener('click',()=>setHidden(!hidden));
document.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target.closest?.('input,select,textarea,[contenteditable="true"]')||document.querySelector('dialog[open]'))return;
  if(event.key.toLowerCase()==='h'){event.preventDefault();setHidden(!hidden);}
  else if(event.key==='Escape'&&hidden)setHidden(false);
});

const namesToggle=document.getElementById('names-toggle');
let namesVisible=true;
try{namesVisible=localStorage.getItem('orbit-names')!=='hidden';}catch{}
function updateNames(){document.body.classList.toggle('names-hidden',!namesVisible);namesToggle.textContent=namesVisible?'天体名：表示':'天体名：非表示';namesToggle.setAttribute('aria-pressed',String(namesVisible));try{localStorage.setItem('orbit-names',namesVisible?'visible':'hidden');}catch{}}
namesToggle.addEventListener('click',()=>{namesVisible=!namesVisible;updateNames();});
document.addEventListener('keydown',event=>{if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target.closest?.('input,select,textarea,[contenteditable="true"]')||document.querySelector('dialog[open]'))return;if(event.key.toLowerCase()==='n'){event.preventDefault();namesVisible=!namesVisible;updateNames();}});
updateNames();
