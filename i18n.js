import {translations} from './translations.js';
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const phrases=new RegExp(Object.keys(translations).sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
export function english(text){
 if(!/[\u3040-\u9fff]/.test(text))return text;
 return text.replace(phrases,key=>translations[key])
  .replace(/約([\d.]+)日/g,'≈ $1 days').replace(/約([\d.]+)年/g,'≈ $1 years')
  .replace(/約(?=[\d,])/g,'≈ ').replace(/([\d.]+)日/g,'$1 days').replace(/([\d.]+)年/g,'$1 years');
}
// Translate text nodes in place so controls, focus and simulation state survive.
export function initLanguage(){
 const source=new WeakMap(),attrs=new WeakMap(),button=document.getElementById('language-toggle');
 let language='ja';try{language=localStorage.getItem('orbit-language')==='en'?'en':'ja';}catch{}
 function text(node){
  if(node.parentElement?.closest('script,style,[translate="no"]'))return;
  let entry=source.get(node);if(!entry||node.nodeValue!==entry.rendered)entry={original:node.nodeValue};
  entry.rendered=language==='en'?english(entry.original):entry.original;
  source.set(node,entry);if(node.nodeValue!==entry.rendered)node.nodeValue=entry.rendered;
 }
 function attributes(el){
  if(el.closest('script,style,[translate="no"]'))return;
  let saved=attrs.get(el)||{};
  for(const name of ['aria-label','title','placeholder']){if(!el.hasAttribute(name))continue;const current=el.getAttribute(name);let e=saved[name];if(!e||current!==e.rendered)e={original:current};e.rendered=language==='en'?english(e.original):e.original;saved[name]=e;if(current!==e.rendered)el.setAttribute(name,e.rendered);}
  attrs.set(el,saved);
 }
 function walk(root){if(root.nodeType===3){text(root);return;}if(root.nodeType!==1)return;attributes(root);for(const node of root.childNodes)walk(node);}
 function apply(){document.documentElement.lang=language;button.textContent=language==='ja'?'English':'日本語';button.setAttribute('aria-label',language==='ja'?'Switch to English':'日本語に切り替え');walk(document.documentElement);}
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')text(r.target);else if(r.type==='attributes')attributes(r.target);else for(const node of r.addedNodes)walk(node);}});
 observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder']});
 button.addEventListener('click',()=>{language=language==='ja'?'en':'ja';try{localStorage.setItem('orbit-language',language);}catch{}apply();});
 apply();
}
