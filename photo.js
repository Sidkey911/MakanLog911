/* MakanLog photo helper. Image stays entirely in the browser; optional model runs on-device. */
(() => {
  'use strict';
  const api=window.MakanLogPhotoAPI;
  if(!api) {console.error('MakanLog core did not load');return;}
  const $=id=>document.getElementById(id);
  const safe=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const fmt=n=>Math.round(Number(n)||0).toLocaleString('en-MY');
  const modelScripts=[
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js'
  ];
  let selected=[], previewUrl=null, model=null, loading=null, analysing=false;
  let lastPredictions=[];
  const COMMON_IDS=['rice-cooked','chicken-airfried','egg-fried','mixed-vegetables','nasi-lemak','nasi-goreng'];
  const NAME_MAPPINGS=[
    [/cheeseburger|hamburger|burger/, 'burger'], [/hotdog|hot dog/, 'hotdog'],
    [/pizza/, 'pizza'], [/ice cream|ice lolly|ice lolly/, 'ice-cream'],
    [/french fries|french fry|chips,? french/, 'fries'], [/bagel/, 'bagel'],
    [/croissant/, 'croissant'], [/pretzel/, 'bagel'], [/loaf|bread|toast/, 'bread-white'],
    [/waffle/, 'waffle'], [/pancake/, 'pancakes'], [/carbonara|spaghetti|pasta/, 'pasta-sauce'],
    [/granny smith|apple/, 'apple'], [/banana/, 'banana'], [/orange/, 'orange'],
    [/pineapple|mango/, 'mango'], [/broccoli|cauliflower/, 'broccoli'],
    [/lemon|lime/, 'orange'], [/strawberry|berry/, 'watermelon'],
    [/egg/, 'egg-boiled'], [/chicken|hen/, 'chicken-breast'],
    [/fish|salmon/, 'fish-grilled'], [/sushi/, 'sushi'],
    [/potato/, 'potato'], [/rice/, 'rice-cooked'], [/milk/, 'milk-full'],
    [/guacamole|avocado/, 'salad'], [/meatloaf|steak/, 'beef'],
    [/donut|doughnut/, 'donut']
  ];
  const foodById=id=>api.foods().find(f=>f.id===id);
  function setStatus(message){$('photo-ai-status').textContent=message;}
  function setReady(){ $('photo-analyse').disabled=analysing || !$('photo-preview').complete || !$('photo-preview').naturalWidth; }
  function cleanupPhoto(){if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null;} $('photo-preview').removeAttribute('src');$('photo-preview-shell').hidden=true;$('photo-analyse').disabled=true;}
  function reset(){selected=[];lastPredictions=[];cleanupPhoto();$('photo-gallery').value='';$('photo-camera').value='';$('photo-food-search').value='';$('photo-predictions').hidden=true;$('photo-predictions').innerHTML='';setStatus(model?'AI is ready on this device. Take a photo to analyse.':'Select a photo. The first AI scan needs internet to download the recognition model.');render();}
  function addFood(id){const food=foodById(id);if(!food)return;selected.push({id:food.id,grams:food.defaultGrams});render();api.notice(`${food.name} added to estimate`);}
  function mealTotals(){return selected.reduce((s,item)=>{const food=foodById(item.id);return food?{kcal:s.kcal+food.kcal*item.grams/100,protein:s.protein+food.protein*item.grams/100,carbs:s.carbs+food.carbs*item.grams/100,fat:s.fat+food.fat*item.grams/100}:s;},{kcal:0,protein:0,carbs:0,fat:0});}
  function render(){
    const t=mealTotals();
    $('photo-calorie-total').textContent=`${fmt(t.kcal)} kcal`;
    $('photo-save').disabled=selected.length===0 || selected.some(x=>!x.grams || x.grams>10000);
    $('photo-save').textContent=selected.length===0?'Add foods to estimate your meal':`Save ${selected.length} food${selected.length===1?'':'s'} · ${fmt(t.kcal)} kcal`;
    $('photo-items').innerHTML=selected.length?selected.map((item,i)=>{const f=foodById(item.id);return `<div class="photo-item"><div class="photo-item-info"><strong>${safe(f?.emoji||'🍽️')} ${safe(f?.name||'Food')}</strong><small>${fmt((f?.kcal||0)*item.grams/100)} kcal · ${fmt(f?.kcal||0)} per 100g</small></div><div class="photo-item-grams"><label for="photo-grams-${i}">grams</label><input id="photo-grams-${i}" type="number" inputmode="decimal" min="1" max="10000" step="1" data-photo-grams="${i}" value="${item.grams}"></div><button class="photo-remove" type="button" data-photo-remove="${i}" aria-label="Remove ${safe(f?.name||'food')}">×</button></div>`;}).join(''):`<div class="photo-empty">No foods selected yet. Select an AI suggestion, or search for what you see (for example: rice + chicken + egg). Your estimate will appear here.</div>`;
  }
  function renderSearch(){
    const q=$('photo-food-search').value.trim().toLowerCase();
    const foods=api.foods();
    const list=(q?foods.filter(f=>f.name.toLowerCase().includes(q)):COMMON_IDS.map(foodById).filter(Boolean)).slice(0,7);
    $('photo-food-suggestions').innerHTML=list.length?list.map(f=>`<button type="button" class="photo-food-option" data-photo-food="${safe(f.id)}"><span>${safe(f.emoji)} ${safe(f.name)}</span><small>+ ${fmt(f.kcal*f.defaultGrams/100)} kcal / serving</small></button>`).join(''):'<p class="form-hint">No food found. Add it under “My foods” and search again here.</p>';
  }
  function changePhoto(file){
    if(!file)return;
    if(!file.type.startsWith('image/')) {api.notice('Choose a photo image file');return;}
    if(file.size>28*1024*1024) {api.notice('Choose a photo under 28 MB');return;}
    cleanupPhoto();
    previewUrl=URL.createObjectURL(file);
    const img=$('photo-preview');
    img.onload=()=>{ $('photo-preview-shell').hidden=false; setReady();setStatus(model?'Photo ready. Tap Analyse to recognise food.':'Photo ready. AI needs a one-time model download while online. You can also add foods manually.'); };
    img.onerror=()=>{cleanupPhoto();api.notice('This image could not be displayed. Try a JPG or PNG.');};
    img.src=previewUrl;
    $('photo-predictions').hidden=true;$('photo-predictions').innerHTML='';
  }
  function loadScript(url,globalName){
    if(window[globalName]) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=url;script.async=true;
      script.onload=()=>window[globalName]?resolve():reject(new Error(`${globalName} unavailable after download`));
      script.onerror=()=>reject(new Error('Could not download the on-device AI files'));
      document.head.appendChild(script);
    });
  }
  async function ensureModel(){
    if(model)return model;
    if(loading)return loading;
    loading=(async()=>{
      // The service worker controls the page before AI requests, so external model assets get cached.
      if('serviceWorker' in navigator && navigator.serviceWorker.controller===null && navigator.onLine){
        try{await navigator.serviceWorker.ready;}catch(_){/* fall back to online-only */}
      }
      setStatus('Preparing AI on this phone. The first scan downloads the model; nothing is uploaded.');
      await loadScript(modelScripts[0],'tf');
      await loadScript(modelScripts[1],'mobilenet');
      if(window.tf?.ready) await window.tf.ready();
      const result=await window.mobilenet.load({version:1,alpha:0.25});
      model=result;
      return result;
    })();
    try{return await loading;}finally{loading=null;}
  }
  function matchPrediction(label){
    const name=String(label||'').toLowerCase();
    for(const [re,id] of NAME_MAPPINGS)if(re.test(name))return foodById(id);
    return null;
  }
  function renderPredictions(predictions){
    const el=$('photo-predictions');
    const matches=[];
    for(const p of predictions){const f=matchPrediction(p.className);if(f && !matches.some(x=>x.food.id===f.id))matches.push({food:f,p});}
    const labels=predictions.slice(0,4).map(p=>`${p.className} (${Math.round(p.probability*100)}%)`).join(' · ');
    if(matches.length){
      el.innerHTML=`<p class="form-hint"><strong>AI suggested:</strong> ${safe(labels)}. Tap a matching food to add it. Portion is a starting guess only.</p>` +matches.slice(0,4).map(({food,p})=>`<button type="button" class="photo-prediction" data-pred-food="${safe(food.id)}"><span><strong>${safe(food.emoji)} ${safe(food.name)}</strong><small>AI label: ${safe(p.className)} · ${Math.round(p.probability*100)}% model score</small></span><strong>+ ${fmt(food.kcal*food.defaultGrams/100)} kcal</strong></button>`).join('');
      // Only prefill a dish for strong enough recognition; user can remove/adjust before saving.
      if(matches[0].p.probability>=0.25 && selected.length===0){
        const f=matches[0].food; selected.push({id:f.id,grams:f.defaultGrams});render();
        setStatus(`Suggested ${f.name}; review its name and estimated grams before saving. This is not a measured portion.`);
      }else{setStatus('Recognition finished. Tap a suggestion or add foods manually. Check the portion sizes.');}
    } else {
      el.innerHTML=`<p class="form-hint">This general image model could not reliably identify food in your photo. Its top labels were: ${safe(labels||'no clear result')}. Search for the visible foods below instead.</p>`;
      setStatus('No reliable food match. You can still estimate the meal manually from this photo, entirely offline.');
    }
    el.hidden=false;
  }
  async function analyse(){
    const img=$('photo-preview');if(!img.complete || !img.naturalWidth)return api.notice('Choose a photo first');
    if(analysing)return;
    analysing=true;$('photo-analyse').disabled=true;$('photo-analyse').textContent='Analysing on your phone…';
    try{
      const recognizer=await ensureModel();
      setStatus('Looking for known food categories on your phone…');
      const predictions=await recognizer.classify(img,12);
      lastPredictions=predictions;
      renderPredictions(predictions);
    }catch(err){
      console.warn('Photo recognition not available',err);
      $('photo-predictions').hidden=true;
      setStatus('AI could not load. If this is the first scan, reconnect to Wi-Fi and try again. Food search and manual photo estimates still work offline.');
      api.notice('AI unavailable. Add foods manually below.');
    }finally{analysing=false;$('photo-analyse').textContent='Analyse photo with AI';setReady();}
  }
  for(const id of ['photo-camera','photo-gallery'])$(id).addEventListener('change',e=>{changePhoto(e.target.files?.[0]);e.target.value='';});
  $('photo-analyse').addEventListener('click',analyse);
  $('photo-food-search').addEventListener('input',renderSearch);
  $('photo-food-suggestions').addEventListener('click',e=>{const b=e.target.closest('[data-photo-food]');if(b){addFood(b.dataset.photoFood);$('photo-food-search').value='';renderSearch();}});
  $('photo-predictions').addEventListener('click',e=>{const b=e.target.closest('[data-pred-food]');if(b)addFood(b.dataset.predFood);});
  $('photo-items').addEventListener('input',e=>{const input=e.target.closest('[data-photo-grams]');if(!input)return;const n=Number(input.dataset.photoGrams),v=Number(input.value);if(!Number.isInteger(n)||!selected[n])return;selected[n].grams=Number.isFinite(v)?Math.max(0,Math.min(10000,v)):0;
    const f=foodById(selected[n].id), item=input.closest('.photo-item');if(f)item.querySelector('.photo-item-info small').textContent=`${fmt(f.kcal*selected[n].grams/100)} kcal · ${fmt(f.kcal)} per 100g`;
    const t=mealTotals();$('photo-calorie-total').textContent=`${fmt(t.kcal)} kcal`; $('photo-save').disabled=selected.some(x=>!x.grams||x.grams>10000); $('photo-save').textContent=`Save ${selected.length} food${selected.length===1?'':'s'} · ${fmt(t.kcal)} kcal`;
  });
  $('photo-items').addEventListener('click',e=>{const btn=e.target.closest('[data-photo-remove]');if(btn){selected.splice(Number(btn.dataset.photoRemove),1);render();}});
  $('photo-save').addEventListener('click',()=>{
    if(!selected.length || selected.some(x=>!Number.isFinite(x.grams)||x.grams<=0))return api.notice('Choose at least one food and portion');
    api.addItems(selected.map(x=>({...x})),$('photo-meal').value);
  });
  $('photo-hero-button').addEventListener('click',()=>api.openPhoto());
  $('settings-photo-open').addEventListener('click',()=>api.openPhoto());
  document.addEventListener('makanlog:modal-open',reset);
  document.addEventListener('makanlog:modal-close',cleanupPhoto);
  renderSearch();render();
})();
