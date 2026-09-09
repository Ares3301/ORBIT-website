const $=id=>document.getElementById(id),media=matchMedia('(max-width: 600px)'),dialog=$('mobile-settings');
const selectors=['.view-tools','#sky-tools','#lab-tools','.timeline','#lab-timeline','.footer-actions','#language-toggle','#names-toggle','.scene-note'];
const moved=selectors.map(selector=>{const el=document.querySelector(selector),anchor=document.createComment('mobile-controls');el.before(anchor);return {el,anchor};});
function layout(){dialog.close();for(const {el,anchor} of moved){if(media.matches)$('mobile-settings-content').append(el);else anchor.after(el);}document.body.classList.remove('mobile-info-open');$('mobile-info').setAttribute('aria-expanded','false');}
$('mobile-menu').onclick=()=>dialog.showModal();$('close-mobile-settings').onclick=()=>dialog.close();
$('mobile-info').onclick=()=>{const open=document.body.classList.toggle('mobile-info-open');$('mobile-info').setAttribute('aria-expanded',String(open));};
// Close settings before another modal opens, preserving the original controls and handlers.
dialog.addEventListener('click',e=>{if(e.target.closest('#about,#sound-settings,#open-iss,#sky-deep,#open-lab'))dialog.close();});
media.addEventListener('change',layout);layout();
