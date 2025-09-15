import Player from './player.js';
import { updateHUD, log } from './ui.js';

let ITEMS = [];
let QUESTS = [];
let player = null;

async function loadData(){
  try {
    ITEMS = await (await fetch('data/items.json')).json();
    QUESTS = await (await fetch('data/quests.json')).json();
  } catch(e){
    console.warn('Błąd fetch, używam embedded fallback.', e);
    ITEMS = [
      {"id":"wooden-sword","name":"Drewniany miecz","slot":"weapon","atk":2,"def":0,"price":50,"desc":"Stary, ale działa."}
    ];
    QUESTS = [{"id":"q1","title":"Mini-misja","desc":"Testowa misja","difficulty":1,"exp":10,"gold":5,"energy":3,"chanceItem":0.05}];
  }
}

function saveState(){
  const s = {player:player.toSave()};
  localStorage.setItem('heroish.save', JSON.stringify(s));
  log('Zapisano grę.');
}

function loadState(){
  const s = JSON.parse(localStorage.getItem('heroish.save')||'null');
  if(s && s.player) {
    player = new Player(s.player);
  } else {
    player = new Player();
  }
  updateHUD(player);
}

function initUI(){
  document.getElementById('btn-save').onclick = saveState;
  document.getElementById('btn-reset').onclick = ()=>{
    if(confirm('Na pewno chcesz zresetować zapis?')){ localStorage.removeItem('heroish.save'); location.reload(); }
  };
  document.getElementById('train-skill').onclick = ()=>{
    const res = player.train();
    document.getElementById('train-msg').textContent = res.msg;
    updateHUD(player);
    saveState();
  };
  document.getElementById('btn-missions').onclick = showMissions;
  document.getElementById('btn-shop').onclick = showShop;
  document.getElementById('btn-adventure').onclick = ()=> doAdventure(true);
  document.getElementById('export-save').onclick = ()=>{
    const data = localStorage.getItem('heroish.save')||'{}';
    const blob = new Blob([data],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'heroish-save.json';
    a.click();
  };
  document.getElementById('import-file').onchange = async e=>{
    const f = e.target.files[0];
    if(!f) return;
    const txt = await f.text();
    localStorage.setItem('heroish.save', txt);
    alert('Zaimportowano save — przeładuj stronę.');
  };
}

function showMissions(){
  const area = document.getElementById('dynamic-area');
  area.innerHTML = '<h3>Dostępne misje</h3>';
  QUESTS.sort((a,b)=>a.difficulty-b.difficulty);
  for(const q of QUESTS){
    const el = document.createElement('div');
    el.className='item';
    el.style.justifyContent='space-between';
    el.innerHTML = `<div style="flex:1"><strong>${q.title}</strong><div class="muted">${q.desc}</div><div class="muted">Trudność ${q.difficulty}</div></div>
      <div style="min-width:180px;text-align:right"><div class="muted">EXP ${q.exp}</div><div class="muted">Gold ${q.gold}</div>
      <button data-id="${q.id}" class="btn small">Wykonaj (bezpiecznie)</button>
      <button data-id="${q.id}" class="btn small accent">Wariant ryzykowny</button></div>`;
    area.appendChild(el);
    el.querySelectorAll('button')[0].onclick = ()=>doQuest(q,false);
    el.querySelectorAll('button')[1].onclick = ()=>doQuest(q,true);
  }
}

function doQuest(q, risky){
  if(player.energy < q.energy) { log('Za mało energii na tę misję.'); return; }
  player.energy -= q.energy;
  const difficulty = q.difficulty + (risky?1:0);
  const roll = Math.random()*10 + (player.totalAtk()/5 + player.totalDef()/8);
  if(roll > difficulty*3){
    const exp = Math.floor(q.exp * (risky?1.5:1));
    const gold = Math.floor(q.gold * (risky?1.6:1));
    player.gainExp(exp);
    player.gold += gold;
    // chance item
    if(Math.random() < q.chanceItem * (risky?1.5:1)){
      const it = ITEMS[Math.floor(Math.random()*ITEMS.length)];
      if(!player.equipment[it.slot]){
        player.equip(it.slot,it);
        log(`Zdobyto przedmiot i automatycznie ekwipowano: ${it.name}`);
      } else {
        log(`Zdobyto przedmiot: ${it.name} (trafił do plecaka — brak plecaka w prototypie)`);
      }
    }
    log(`Misja zakończona sukcesem! +${exp} EXP, +${gold} zł.`);
  } else {
    const dmg = Math.floor(Math.random()* (6 + difficulty*4));
    player.hp = Math.max(0, player.hp - dmg);
    // small gold loss on failure sometimes
    if(Math.random()<0.2){ const g = Math.floor(player.gold*0.05); player.gold = Math.max(0, player.gold - g); log(`Przegrałeś i straciłeś ${g} zł.`); }
    log(`Porażka... Straciłeś ${dmg} HP. Czasem i tak się uczysz.`);
  }
  updateHUD(player);
  saveState();
}

function showShop(){
  const area = document.getElementById('dynamic-area');
  area.innerHTML = '<h3>Sklep — oferty dnia</h3>';
  // rotate offers
  const offers = shuffle(ITEMS).slice(0,6);
  for(const it of offers){
    const el = document.createElement('div');
    el.className='item';
    el.style.justifyContent='space-between';
    el.innerHTML = `<div style="flex:1"><strong>${it.name}</strong><div class="muted">${it.desc}</div></div>
      <div style="min-width:140px;text-align:right"><div class="muted">${it.price} zł</div><button class="btn small">Kup</button></div>`;
    area.appendChild(el);
    el.querySelector('button').onclick = ()=>{
      if(player.gold < it.price){ log('Za mało złota.'); return; }
      player.gold -= it.price;
      player.equip(it.slot, it);
      log(`Kupiłeś i ubrałeś: ${it.name}`);
      updateHUD(player);
      saveState();
    };
  }
}

function shuffle(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]); }

function doAdventure(risky=false){
  const q = QUESTS[Math.floor(Math.random()*QUESTS.length)];
  log('Wyruszasz na przygodę: '+q.title);
  doQuest(q, risky);
}

async function start(){
  await loadData();
  initUI();
  loadState();
  updateHUD(player);
  log('Witaj w rozbudowanym prototypie Hero-ish! Misje, trening, sklep, ekwipunek.');
}

start();
