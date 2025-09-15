// prosty model gracza
export default class Player {
  constructor(state){
    this.name = state?.name ?? "Zerośmieszny";
    this.level = state?.level ?? 1;
    this.exp = state?.exp ?? 0;
    this.gold = state?.gold ?? 150;
    this.hp = state?.hp ?? 100;
    this.maxHp = state?.maxHp ?? 100;
    this.energy = state?.energy ?? 60;
    this.maxEnergy = state?.maxEnergy ?? 60;
    this.str = state?.str ?? 6;
    this.dex = state?.dex ?? 5;
    this.int = state?.int ?? 4;
    this.skillPoints = state?.skillPoints ?? 0;
    this.equipment = state?.equipment ?? {weapon:null,armor:null,helmet:null,boots:null,belt:null};
  }

  totalAtk(){
    let atk = Math.floor(this.str * 1.2);
    for(const k in this.equipment){
      const it = this.equipment[k];
      if(it && it.atk) atk += it.atk;
    }
    return atk;
  }
  totalDef(){
    let def = Math.floor(this.dex * 0.8);
    for(const k in this.equipment){
      const it = this.equipment[k];
      if(it && it.def) def += it.def;
    }
    return def;
  }

  gainExp(amount){
    this.exp += amount;
    while(this.exp >= this.expToNext()){
      this.exp -= this.expToNext();
      this.levelUp();
    }
  }

  expToNext(){ return 80 + this.level*30; }
  levelUp(){
    this.level++;
    this.skillPoints += 3;
    this.maxHp += 12;
    this.hp = this.maxHp;
    this.maxEnergy += 5;
    this.energy = this.maxEnergy;
  }

  train(){
    if(this.energy < 10) return {ok:false, msg:"Za mało energii."};
    this.energy -= 10;
    this.skillPoints += 1;
    return {ok:true, msg:"Trening udany! +1 punkt umiejętności."};
  }

  equip(slot,item){
    this.equipment[slot]=item;
  }

  toSave(){ return JSON.parse(JSON.stringify(this)); }
}
