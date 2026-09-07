import * as THREE from 'three';
// Distinguish a tap from orbit dragging and multi-touch zooming.
export function installPicking(canvas,camera,getTargets){
 const pointers=new Set(),ray=new THREE.Raycaster();let press=null;
 canvas.addEventListener('pointerdown',e=>{pointers.add(e.pointerId);if(pointers.size!==1||e.button!==0){press=null;return;}press={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()};});
 canvas.addEventListener('pointermove',e=>{if(press&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>8)press=null;});
 const cancel=e=>{pointers.delete(e.pointerId);press=null;};
 canvas.addEventListener('pointercancel',cancel);
 canvas.addEventListener('pointerup',e=>{
  const tap=press;pointers.delete(e.pointerId);press=null;
  if(!tap||tap.id!==e.pointerId||pointers.size||performance.now()-tap.time>700||Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>8)return;
  const rect=canvas.getBoundingClientRect(),targets=getTargets();camera.updateMatrixWorld();
  targets.forEach(t=>t.object?.updateWorldMatrix(true,true));
  ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);
  const hits=targets.flatMap(t=>(t.object?ray.intersectObject(t.object,true):[]).map(hit=>({t,d:hit.distance}))).sort((a,b)=>a.d-b.d);
  if(hits.length){hits[0].t.activate();return;}
  // A small screen-space target keeps distant planets easy to tap.
  let best=null;const radius=e.pointerType==='touch'?22:12;
  for(const t of targets){const p=(t.position?t.position.clone():t.object.getWorldPosition(new THREE.Vector3())).project(camera);if(p.z< -1||p.z>1)continue;const d=Math.hypot((p.x+1)*rect.width/2+rect.left-e.clientX,(1-p.y)*rect.height/2+rect.top-e.clientY);if(d<radius&&(!best||d<best.d))best={t,d};}
  best?.t.activate();
 });
}
