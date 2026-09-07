const $=id=>document.getElementById(id);
export function showInfo({name,type,description,rows=[],source,go}){
 for(const d of document.querySelectorAll('dialog[open]'))d.close();
 $('object-title').textContent=name;$('object-type').textContent=type;$('object-description').textContent=description;
 $('object-facts').replaceChildren();for(const [key,value] of rows){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=String(value);row.append(dt,dd);$('object-facts').append(row);}
 $('object-source').hidden=!source;if(source)$('object-source').href=source;
 $('object-go').hidden=!go;$('object-go').onclick=()=>{$('object-dialog').close();go?.();};
 $('close-object').onclick=()=>$('object-dialog').close();$('object-dialog').showModal();
}
export function starInfo(s,go){
 const distance=Number.isFinite(s.dist)&&s.dist>0&&s.dist<326000?'約'+s.dist.toLocaleString()+'光年':'不明';
 showInfo({name:s.name,type:'恒星',description:s.con+'の方向に見える恒星です。見かけの等級は地球から見た明るさを表し、数値が小さいほど明るく見えます。距離と明るさはHYG星表の値です。',rows:[['星座',s.con],['見かけの等級',s.mag],['地球からの距離',distance],['スペクトル型',s.spect||'不明'],['赤経（J2000）',s.ra.toFixed(4)+' h'],['赤緯（J2000）',s.dec.toFixed(4)+'°'],['星表番号','HIP '+s.id]],source:'https://github.com/astronexus/HYG-Database',go});
}
export function dwarfInfo(d,go){showInfo({name:d.name,type:'準惑星',description:d.description+' 太陽を回る天体です。このマップの表面は模式表示で、位置は固定軌道要素による二体近似です。',rows:[['公転周期','約'+(360/d.n/365.25).toFixed(1)+'年'],['軌道長半径',d.a.toFixed(3)+' AU'],['離心率',d.e.toFixed(4)],['軌道傾斜角',d.i.toFixed(2)+'°']],source:'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr='+d.id,go});}
export function cometInfo(c,go){const a=c.q/(1-c.e);const intro=c.id.startsWith('1P')?'周期的に太陽の近くへ戻ってくることが確かめられた、歴史的に重要な彗星です。':c.id.startsWith('67P')?'探査機ロゼッタと着陸機フィラエが調べた彗星です。':'太陽のまわりを短い周期で回る彗星です。';showInfo({name:c.name,type:'彗星',description:intro+' 彗星は氷・岩石・塵を含み、太陽に近づくとガスや塵を放出します。表示位置は二体近似、尾の長さは強調表示です。',rows:[['天体番号',c.id],['公転周期','約'+Math.sqrt(a**3).toFixed(2)+'年'],['近日点距離',c.q.toFixed(3)+' AU'],['離心率',c.e.toFixed(4)],['軌道傾斜角',c.i.toFixed(2)+'°']],source:'https://science.nasa.gov/solar-system/comets/',go});}
export function labInfo(b,go){showInfo({name:b.name,type:b.type==='blackhole'?'ブラックホール':'自由実験',description:b.type==='blackhole'?'実験用に配置した巨大な質量を持つ点です。ニュートン重力で周囲の天体を動かします。光の屈曲・衝突・吸収は計算しません。':'実験室で重力の影響を計算している天体です。表示値は選択した瞬間の実験状態で、実際の観測値ではありません。',rows:[['質量',b.mass.toPrecision(5)+' 太陽質量'],['原点からの距離（AU）',Math.hypot(...b.p).toFixed(4)],['速さ',Math.hypot(...b.v).toFixed(6)+' AU/day']],go});}
export function sunInfo(go){showInfo({name:'太陽',type:'恒星',description:'太陽系の中心にある恒星です。約46億年前に誕生し、その重力が惑星などの天体を軌道に保っています。中心の核融合でエネルギーを生み、地球へ光と熱を届けます。',rows:[['スペクトル型','G2V'],['地球からの距離','約1 AU'],['年齢','約46億年']],source:'https://science.nasa.gov/sun/facts/',go});}
