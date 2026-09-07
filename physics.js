// AU, days, solar masses. Newtonian softened gravity; no relativistic model.
export const G=0.0002959122082855911;
export const EARTH_MASS=3.00349e-6;
export const planetMass=[1.66012e-7,2.44784e-6,EARTH_MASS,3.22715e-7,.000954588,.000285886,.0000436624,.0000515139];
export function acceleration(items){const a=items.map(()=>[0,0,0]);for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){let d=items[j].p.map((v,k)=>v-items[i].p[k]),r2=d.reduce((s,v)=>s+v*v,0)+.0004,f=G/Math.pow(r2,1.5);for(let k=0;k<3;k++){a[i][k]+=d[k]*items[j].mass*f;a[j][k]-=d[k]*items[i].mass*f}}return a}
export function integrate(items,days){let done=0;for(let n=0;n<200&&done<days;n++){let h=Math.min(.2,days-done);for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){let r2=.0004;for(let k=0;k<3;k++)r2+=(items[i].p[k]-items[j].p[k])**2;h=Math.min(h,.05*Math.sqrt(Math.pow(r2,1.5)/(G*(items[i].mass+items[j].mass))))}let a=acceleration(items);items.forEach((b,i)=>b.p.forEach((_,k)=>{b.v[k]+=a[i][k]*h/2;b.p[k]+=b.v[k]*h}));a=acceleration(items);items.forEach((b,i)=>b.v.forEach((_,k)=>b.v[k]+=a[i][k]*h/2));done+=h;}return done}
export function cloneState(items){return items.map(b=>({...b,p:[...b.p],v:[...b.v]}))}
