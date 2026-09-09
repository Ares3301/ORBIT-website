import * as THREE from 'three';
import {kindNames,distanceText} from './deep-view.js';
import {showInfo} from './object-info.js';
export function createDeepStage(ctx,enter,getMode){
 const $=id=>document.getElementById(id),group=new THREE.Group(),origin=new THREE.Vector3();ctx.scene.add(group);group.visible=false;
 const light=new THREE.DirectionalLight(0xffeed9,2.8);light.position.set(-8,5,8);group.add(light,new THREE.AmbientLight(0x8eadd0,.65));
 let body=null,current=null;const label=document.createElement('span');label.className='extra-label';label.hidden=true;ctx.labelRoot.append(label);
 function clear(){if(!body)return;group.remove(body);body.geometry?.dispose();body.material.map?.dispose();body.material.dispose();body=null;}
 function cutout(o){return 'https://alasky.cds.unistra.fr/hips-image-services/hips2fits?'+new URLSearchParams({hips:'CDS/P/DSS2/color',width:1000,height:1000,fov:Math.min(10,Math.max(.1,(o.size||12)/60*1.5)),projection:'TAN',coordsys:'icrs',ra:o.ra*15,dec:o.dec,format:'jpg'});}
 function home(){if(!current)return;ctx.focusExternal(()=>origin,current.kind!=='exoplanet'?4/Math.min(1,ctx.camera.aspect):2/Math.min(1,ctx.camera.aspect));}
 function info(){if(!current)return;showInfo({name:current.name,type:kindNames[current.kind],description:current.description,rows:[['地球からの距離',distanceText(current)],['星座',current.con],['RA / Dec (J2000)',(current.ra*15).toFixed(4)+'° / '+current.dec.toFixed(4)+'°'],['分類',current.subtype||kindNames[current.kind]],...(current.period?[['公転周期',current.period+'日']]:[]),['表示方法',current.kind!=='exoplanet'?'観測画像を平面表示':'色と表面は模式表現']],source:current.source,go:home});}
 function observe(o){
  for(const d of document.querySelectorAll('dialog[open]'))d.close();enter();clear();current=o;group.visible=true;
  if(o.kind!=='exoplanet'){
   const texture=new THREE.TextureLoader().load(o.image||cutout(o),t=>{if(current===o&&body){$('stage-note').textContent='観測画像を平面表示。ズームして細部を観察できます。';const im=t.image;body.scale.set(12,12*im.height/im.width,1);}},undefined,()=>{if(current!==o)return;$('stage-note').textContent='画像を読み込めませんでした。資料のリンクから確認できます。';});texture.colorSpace=THREE.SRGBColorSpace;
   body=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:0xffffff,toneMapped:false}));body.scale.set(12,8,1);
  }else{
   const colors={proxima:0x9b7c66,trappist:0x778e98,pegasi:0xc59d71,kepler:0x8f9980};
   body=new THREE.Mesh(new THREE.SphereGeometry(2,80,48),new THREE.MeshStandardMaterial({color:colors[o.id]||0xa4a4a4,roughness:.92}));
  }
  group.add(body);label.textContent=o.name;$('status').textContent='OBJECT VIEW';$('clock').textContent=o.name;
  $('stage-name').textContent=o.name;$('stage-description').textContent=o.description;$('stage-distance').textContent=distanceText(o);
  $('stage-note').textContent=o.kind!=='exoplanet'?'観測画像を読み込み中…':'色と表面は模式表現。実際の表面の観測画像ではありません。';
  $('stage-credit').textContent=o.kind!=='exoplanet'?(o.credit||'DSS2 / CDS · STScI / ESO'):'';$('stage-credit').hidden=o.kind==='exoplanet';$('stage-source').href=o.imageSource||o.source;
  $('stage-info').onclick=info;$('stage-other').onclick=()=>$('deep-dialog').showModal();home();
 }
 function render(){group.visible=getMode()==='deep';$('deep-stage-detail').hidden=!group.visible;label.hidden=true;if(!group.visible||!body)return;const q=origin.clone().project(ctx.camera),w=ctx.host.clientWidth,h=ctx.host.clientHeight;label.hidden=q.z< -1||q.z>1;label.style.transform=`translate(${(q.x+1)*w/2+16}px,${(1-q.y)*h/2+40}px)`;}
 return {observe,render,home,targets:()=>body?[{object:body,activate:info}]:[]};
}
