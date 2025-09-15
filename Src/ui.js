export function updateHUD(player){
  document.getElementById('hp').textContent = `HP: ${player.hp}/${player.maxHp}`;
  document.getElementById('energy').textContent = `Energia: ${player.energy}/${player.maxEnergy}`;
  document.getElementById('gold').textContent = `Złoto: ${player.gold}`;
  // statystyki
  document.getElementById('stats').innerHTML = `
    <div>Poziom ${player.level} (EXP ${player.exp}/${player.expToNext()})</div>
    <div>Atak: ${player.totalAtk()}</div>
    <div>Obrona: ${player.totalDef()}</div>
    <div>Siła: ${player.str}</div>
    <div>Zręczność: ${player.dex}</div>
    <div>Inteligencja: ${player.int}</div>
    <div>Punkty umiejętności: ${player.skillPoints}</div>
    <div class="progress"><i style="width:${Math.min(100, Math.floor((player.exp/player.expToNext())*100))}%"></i></div>
  `;
  // player card
  document.getElementById('player-card').innerHTML = `<div><strong>${player.name}</strong></div>
    <div>Poziom ${player.level} • HP ${player.hp}/${player.maxHp}</div>
  `;
  // inventory
  const inv = document.getElementById('inventory');
  inv.innerHTML = '';
  for(const slot of ['weapon','armor','helmet','boots','belt']){
    const it = player.equipment[slot];
    const el = document.createElement('div');
    el.className='item';
    el.innerHTML = `<div class="icon">${it?it.name[0]:'?'}</div><div style="flex:1"><strong>${slot}</strong><div class="muted">${it?it.name:'brak'}</div></div>
      <div style="min-width:80px;text-align:right">${it?('<div class="muted">atk:'+ (it.atk||0) +' def:'+ (it.def||0) +'</div>') : ''}</div>`;
    inv.appendChild(el);
  }
  // skills
  const sk = document.getElementById('skills');
  sk.innerHTML = '';
  sk.innerHTML = `<div class="skill-grid">
    <div class="skill">Siła <button id="sp-str" class="small">+ (1)</button></div>
    <div class="skill">Zręczność <button id="sp-dex" class="small">+ (1)</button></div>
    <div class="skill">Inteligencja <button id="sp-int" class="small">+ (1)</button></div>
    <div class="skill">Regeneracja (?)</div>
  </div>`;
  document.getElementById('sp-str').onclick = ()=>{ if(player.skillPoints>0){ player.str++; player.skillPoints--; updateHUD(player);} };
  document.getElementById('sp-dex').onclick = ()=>{ if(player.skillPoints>0){ player.dex++; player.skillPoints--; updateHUD(player);} };
  document.getElementById('sp-int').onclick = ()=>{ if(player.skillPoints>0){ player.int++; player.skillPoints--; updateHUD(player);} };
}
export function log(msg){
  const l = document.getElementById('scene-log');
  l.innerHTML = `<div>${new Date().toLocaleTimeString()} — ${msg}</div>` + l.innerHTML;
}
