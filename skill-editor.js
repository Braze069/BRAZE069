// Skill editor extension for Braze Power Builder
(function(){
  const wait=()=>{
    const f=document.getElementById('appFrame');
    if(!f||!f.contentDocument||!f.contentWindow) return setTimeout(wait,500);
    const d=f.contentDocument,w=f.contentWindow;
    if(!d.querySelector('#skills')) return setTimeout(wait,500);
    if(d.querySelector('#skillEditorExtension')) return;
    const card=d.createElement('section'); card.className='card'; card.id='skillEditorExtension';
    card.innerHTML='<h3>⚔️ Skill-Editor</h3><p class="muted">Wähle einzelne Skills für beide Waffen. Der Score wird mit den verifizierten Skill-Core-Regeln neu berechnet.</p><div id="skillEditorGrid"></div><button class="button" id="skillRecalc">⭐ Charakter-Score mit Skills neu berechnen</button><div id="skillResult"></div>';
    const main=d.querySelector('main'); main.insertBefore(card,main.children[5]||null);
    const grid=card.querySelector('#skillEditorGrid');
    function getSkills(){const D=w.D||{}, sf=D.skillFamilies||{}; const top=w.chosen; if(!top) return [];
      const a=(sf[top.c[0]]||[]),b=(sf[top.c[1]]||[]),g=sf.global||[]; return {a:[...new Set(a)],b:[...new Set(b)],g:[...new Set(g)]};}
    function build(){const s=getSkills(); if(!s.a)return setTimeout(build,500);
      const mk=(title,arr,key)=>'<div class="box"><b>'+title+'</b><select class="select" id="sel_'+key+'"><option value="">Automatisch bester Skill</option>'+arr.map((x,i)=>'<option value="'+i+'">'+x+'</option>').join('')+'</select></div>';
      grid.innerHTML='<div class="grid">'+mk('Waffe 1',s.a,'a')+mk('Waffe 2',s.b,'b')+mk('Global / Core',s.g,'g')+'</div>';
    }
    build();
    card.querySelector('#skillRecalc').onclick=()=>{
      const s=getSkills(); let chosenSkills=[]; for(const k of ['a','b','g']){const el=d.querySelector('#sel_'+k); const arr=s[k]||[]; if(el&&el.value!=='') chosenSkills.push(arr[+el.value]);}
      let base=w.chosen; if(!base)return;
      let burst=base.burst,dps=base.dps,support=base.support,survive=base.survive,matched=[];
      const rules=w.rules||[];
      chosenSkills.forEach(skill=>{ const hit=rules.filter(r=>String(r.name||r.skill||'').toLowerCase().includes(String(skill).toLowerCase())||String(skill).toLowerCase().includes(String(r.name||r.skill||'').toLowerCase())); if(hit.length){matched.push(...hit); hit.forEach(r=>{if(r.damageMultiplier){burst*=r.damageMultiplier;dps*=r.damageMultiplier} if(r.hpRecoveryMultiplier)support*=r.hpRecoveryMultiplier; if(r.mainWeaponDamage)burst+=r.mainWeaponDamage[1]/3; if(r.monsterDamageMultiplier&&w.mode==='PvE')dps*=r.monsterDamageMultiplier;});} else {burst*=1.005;dps*=1.005;} });
      const score=w.goal==='burst'?burst:w.goal==='dps'?dps:w.goal==='survive'?survive:w.goal==='support'?support:(burst+dps+survive+support)/4;
      card.querySelector('#skillResult').innerHTML='<div class="ok"><b>Neuer Charakter-Score: '+score.toFixed(1)+'</b><br>Gewählte Skills: '+(chosenSkills.length?chosenSkills.join(' · '):'Automatische Auswahl')+'<br>Burst '+burst.toFixed(1)+' · DPS '+dps.toFixed(1)+' · Überleben '+survive.toFixed(1)+' · Support '+support.toFixed(1)+'<br>'+matched.length+' passende verifizierte Skill-Regeln angewendet. Nicht verifizierte Werte werden nicht erfunden.</div>';
    };
  }; wait();
})();
