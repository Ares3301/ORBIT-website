import {deepObjects} from './deep-data.js';
export function createDeepView({camera,host,vector,look,setMode,getMode}){
 const $=id=>document.getElementById(id),dialog=$('deep-dialog'),layer=$('deep-labels');
 let selected=null;const markers=[];
 function open(id){dialog.showModal();if(id){const card=$('deep-'+id);card.scrollIntoView({block:'start'});card.querySelector('button').focus({preventScroll:true});}}
 for(const o of deepObjects){
  const v=vector(o).multiplyScalar(497),card=document.createElement('article');card.className='deep-card';card.id='deep-'+o.id;
  if(o.image){const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');img.src=o.image;img.alt=o.name;img.loading='lazy';img.width=1200;img.height=800;img.onerror=()=>{img.hidden=true;caption.textContent='画像を読み込めませんでした。資料のリンクから確認できます。';};caption.textContent=o.imageKind+' · '+o.credit;const imageSource=document.createElement('a');imageSource.href=o.imageSource||o.source;imageSource.target='_blank';imageSource.rel='noopener';imageSource.textContent='資料を見る';caption.append(' · ',imageSource);figure.append(img,caption);card.append(figure);}
  const title=document.createElement('h3');title.textContent=o.name;const meta=document.createElement('p');meta.className='deep-meta';meta.textContent=o.con+(o.designation?' · '+o.designation:'')+' · 地球からの距離 約'+o.distance.toLocaleString()+'光年';
  const description=document.createElement('p');description.textContent=o.description;
  const actions=document.createElement('div');actions.className='deep-actions';const go=document.createElement('button');go.textContent='方向を見る';go.onclick=()=>{dialog.close();if(getMode()!=='sky')setMode('sky');selected=o.id;look(v,25);$('deep-markers').checked=true;$('extra-summary').hidden=false;$('extra-summary').textContent=o.name+' ｜ '+o.con+' · 約'+o.distance.toLocaleString()+'光年\n天体の方向を示す目印です。大きさや距離の比率は実物と異なります。';};
  const source=document.createElement('a');source.href=o.source;source.target='_blank';source.rel='noopener';source.textContent='資料を見る';actions.append(go,source);
  card.append(title,meta,description,actions);$(o.kind==='nebula'?'nebula-grid':'exoplanet-grid').append(card);
  const mark=document.createElement('button');mark.className='deep-marker '+o.kind;mark.textContent=o.name;mark.onclick=()=>open(o.id);mark.hidden=true;layer.append(mark);markers.push({o,v,mark});
 }
 $('open-deep').onclick=()=>{if($('catalog-dialog').open)$('catalog-dialog').close();open();};$('sky-deep').onclick=()=>open();$('close-deep').onclick=()=>dialog.close();
 function render(){const w=host.clientWidth,h=host.clientHeight,clean=document.body.classList.contains('ui-hidden'),occupied=[];
  markers.sort((a,b)=>(b.o.id===selected?1:0)-(a.o.id===selected?1:0));
  for(const m of markers){m.mark.hidden=true;if(getMode()!=='sky'||!$('deep-markers').checked)continue;const q=m.v.clone().project(camera),x=(q.x+1)*w/2,y=(1-q.y)*h/2;
   if(q.z< -1||q.z>1||x<10||x>w-25||y<(clean?60:285)||y>h-(clean?30:145))continue;
   const left=Math.max(8,Math.min(w-205,x-8));if(occupied.some(p=>Math.abs(p[0]-left)<190&&Math.abs(p[1]-y)<42))continue;
   m.mark.style.transform=`translate(${left}px,${y}px)`;m.mark.hidden=false;m.mark.classList.toggle('selected',m.o.id===selected);occupied.push([left,y]);
  }
 }
 return {render};
}
