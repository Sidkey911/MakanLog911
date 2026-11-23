/* MakanLog v2 — offline food diary with optional on-device photo classification. */
(() => {
  'use strict';

  const STORE_KEY = 'makanlog-data-v1';
  const MEALS = [
    { id:'Breakfast', emoji:'🌤️', empty:'Start your day with something good' },
    { id:'Lunch', emoji:'🥗', empty:'Nothing logged for lunch yet' },
    { id:'Dinner', emoji:'🍲', empty:'Dinner has not been logged yet' },
    { id:'Snacks', emoji:'🍎', empty:'No snacks or drinks yet' }
  ];
  const CATEGORIES = [
    { id:'All', label:'All foods' },{ id:'Favorites', label:'★ Favorites' },
    { id:'Staples', label:'Rice & noodles' },{ id:'Protein', label:'Protein' },
    { id:'Breakfast', label:'Breakfast' },{ id:'Fruit', label:'Fruit & veg' },
    { id:'Drinks', label:'Drinks' },{ id:'Snacks', label:'Snacks' },
    { id:'Custom', label:'My foods' }
  ];
  // Calorie and macro approximations per 100 grams of prepared food.
  // Drink portion is approximated as 1 ml = 1 g. Real product values vary.
  const FOODS = [
    ['rice-cooked','White rice, cooked','🍚','Staples',130,2.7,28.2,0.3,150],
    ['rice-brown','Brown rice, cooked','🍚','Staples',123,2.7,25.6,1,150],
    ['nasi-lemak','Nasi lemak (with sambal & sides)','🍛','Staples',210,6,26,9.5,300],
    ['nasi-goreng','Nasi goreng kampung','🍳','Staples',180,6,24,6.5,300],
    ['nasi-ayam','Chicken rice, with chicken','🍗','Staples',190,10,24,6,300],
    ['nasi-kerabu','Nasi kerabu with sides','🍛','Staples',170,7,23,5.5,300],
    ['nasi-dagang','Nasi dagang with curry','🍛','Staples',195,8,25,7,300],
    ['nasi-kandar','Nasi kandar with curry sides','🍛','Staples',210,9,25,8.3,350],
    ['mee-goreng','Mee goreng mamak','🍜','Staples',190,6,25,7,250],
    ['mee-soup','Mee soup with chicken','🍜','Staples',95,6,12,2.4,350],
    ['kuey-teow','Char kuey teow','🍜','Staples',220,7,26,10,250],
    ['bihun-goreng','Bihun goreng','🍝','Staples',167,5,26,5,250],
    ['laksa','Curry laksa','🍜','Staples',160,6,17,7.5,350],
    ['spaghetti','Spaghetti, cooked plain','🍝','Staples',158,5.8,31,0.9,180],
    ['oats','Oats, cooked with water','🥣','Breakfast',71,2.5,12,1.5,220],
    ['roti-canai','Roti canai, plain','🫓','Breakfast',300,7,46,10,95],
    ['roti-telur','Roti telur','🫓','Breakfast',285,10,35,11,150],
    ['bread-white','White bread','🍞','Breakfast',265,9,49,3.2,60],
    ['bread-wholemeal','Wholemeal bread','🍞','Breakfast',247,13,41,4.2,60],
    ['kaya-toast','Kaya toast with butter','🍞','Breakfast',320,6,48,11.5,95],
    ['pancakes','Plain pancake','🥞','Breakfast',230,6,29,9.3,100],
    ['egg-boiled','Egg, hard-boiled','🥚','Protein',155,12.6,1.1,10.6,50],
    ['egg-fried','Fried egg with oil','🍳','Protein',196,13.6,1.1,15,55],
    ['chicken-breast','Chicken breast, cooked skinless','🍗','Protein',165,31,0,3.6,150],
    ['chicken-airfried','Chicken breast, air-fried (no oil)','🍗','Protein',165,31,0,3.6,150],
    ['chicken-thigh','Chicken thigh, cooked skinless','🍗','Protein',209,26,0,10.9,150],
    ['ayam-goreng','Fried chicken with coating','🍗','Protein',260,23,9,15,150],
    ['ayam-masak-merah','Ayam masak merah','🍗','Protein',185,16,10,9,180],
    ['beef','Beef, lean cooked','🥩','Protein',217,27,0,11.5,150],
    ['fish-grilled','Fish, grilled','🐟','Protein',130,24,0,3,150],
    ['salmon','Salmon, cooked','🐟','Protein',206,22,0,12,150],
    ['prawns','Prawns, boiled','🍤','Protein',99,24,0.2,0.3,120],
    ['tofu','Firm tofu','◻️','Protein',144,17,3,8.7,120],
    ['tempeh','Tempeh','🫘','Protein',193,20,8,11,100],
    ['dal','Dhal curry','🥘','Protein',116,6,17,2.7,140],
    ['banana','Banana','🍌','Fruit',89,1.1,22.8,0.3,120],
    ['apple','Apple','🍎','Fruit',52,0.3,13.8,0.2,180],
    ['orange','Orange','🍊','Fruit',47,0.9,11.8,0.1,140],
    ['watermelon','Watermelon','🍉','Fruit',30,0.6,7.6,0.2,200],
    ['papaya','Papaya','🍈','Fruit',43,0.5,10.8,0.3,160],
    ['mango','Mango','🥭','Fruit',60,0.8,15,0.4,160],
    ['broccoli','Broccoli, steamed','🥦','Fruit',35,2.4,7.2,0.4,120],
    ['mixed-vegetables','Mixed vegetables, steamed','🥬','Fruit',45,2.5,8,0.5,140],
    ['salad','Green salad, no dressing','🥗','Fruit',20,1.2,3.6,0.2,120],
    ['potato','Potato, boiled','🥔','Fruit',87,1.9,20,0.1,150],
    ['sweet-potato','Sweet potato, steamed','🍠','Fruit',86,1.6,20.1,0.1,150],
    ['milk-full','Milk, full cream','🥛','Drinks',61,3.2,4.8,3.3,250],
    ['milk-low','Milk, low fat','🥛','Drinks',45,3.4,5,1.5,250],
    ['teh-tarik','Teh tarik, sweetened','🫖','Drinks',65,1.5,10,2.1,250],
    ['milo','Milo drink prepared with milk','🍫','Drinks',90,3.5,14,2.5,250],
    ['kopi-o','Kopi O, sweetened','☕','Drinks',35,0,8.5,0,250],
    ['coffee-black','Black coffee, no sugar','☕','Drinks',1,0.1,0.1,0,250],
    ['tea','Unsweetened tea','🫖','Drinks',1,0,0.1,0,250],
    ['water','Plain water','💧','Drinks',0,0,0,0,250],
    ['coke','Regular cola','🥤','Drinks',42,0,10.6,0,330],
    ['coke-zero','Zero-sugar cola','🥤','Drinks',0,0,0,0,330],
    ['orange-juice','Orange juice','🧃','Drinks',45,0.7,10.4,0.2,250],
    ['yogurt','Plain Greek yogurt, nonfat','🥣','Snacks',59,10.3,3.6,0.4,170],
    ['peanut-butter','Peanut butter','🥜','Snacks',588,25,20,50,20],
    ['almonds','Almonds','🌰','Snacks',579,21,22,50,30],
    ['chips','Potato chips','🥔','Snacks',536,7,53,35,40],
    ['biscuits','Plain sweet biscuits','🍪','Snacks',460,6,70,18,35],
    ['chocolate','Milk chocolate','🍫','Snacks',535,8,59,30,30],
    ['keropok-lekor','Keropok lekor, fried','🍢','Snacks',230,11,30,8,130],
    ['curry-puff','Curry puff / karipap','🥟','Snacks',300,6,31,16,75],
    ['satay','Chicken satay (no peanut sauce)','🍢','Snacks',195,22,6,9,100],
    ['ice-cream','Vanilla ice cream','🍨','Snacks',207,3.5,24,11,100],
    ['pizza','Pizza with cheese','🍕','Snacks',270,12,33,10,200],
    ['burger','Cheeseburger','🍔','Snacks',280,15,27,13,180],
    ['hotdog','Hot dog in bun','🌭','Snacks',290,12,25,16,150],
    ['fries','French fries','🍟','Snacks',312,3.4,41,15,120],
    ['donut','Doughnut, glazed','🍩','Snacks',400,5,46,22,75],
    ['bagel','Bagel, plain','🥯','Breakfast',260,10,53,1.5,95],
    ['croissant','Croissant, plain','🥐','Breakfast',406,8,46,21,65],
    ['sushi','Sushi rolls','🍣','Staples',160,6,30,2.5,200],
    ['pasta-sauce','Pasta with tomato sauce','🍝','Staples',150,5,25,3.5,260],
    ['omelette','Omelette, cooked with oil','🍳','Protein',190,12,2,14,120],
    ['grilled-cheese','Cheese sandwich','🥪','Breakfast',300,13,31,14,140],
    ['waffle','Plain waffle','🧇','Breakfast',290,8,40,11,100],
    ['fried-fish','Fish, fried','🐟','Protein',230,19,8,13,150]
  ].map(([id,name,emoji,category,kcal,protein,carbs,fat,defaultGrams]) => ({id,name,emoji,category,kcal,protein,carbs,fat,defaultGrams}));

  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fmt = number => Math.round(Number(number) || 0).toLocaleString('en-MY');
  const fmtMacro = number => (Math.round((Number(number) || 0)*10)/10).toLocaleString('en-MY', { maximumFractionDigits:1 });
  const toLocalISO = date => [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  const fromLocalISO = date => {const [y,m,d]=date.split('-').map(Number);return new Date(y,m-1,d,12,0,0)};
  const addDays = (date,delta) => {const d=fromLocalISO(date);d.setDate(d.getDate()+delta);return toLocalISO(d)};
  const todayISO = () => toLocalISO(new Date());
  const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const finite = (value,min=0,max=100000) => {const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):0};
  const prettyDate = (date,opts) => fromLocalISO(date).toLocaleDateString('en-MY',opts);
  const today = todayISO();
  const defaults = () => ({version:1,settings:{goal:1777,theme:'system'},logs:[],customFoods:[],favorites:[]});

  function load() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (!saved) return defaults();
      const parsed = JSON.parse(saved);
      if (!parsed || !Array.isArray(parsed.logs) || !Array.isArray(parsed.customFoods) || !Array.isArray(parsed.favorites)) throw new Error('Invalid storage');
      return {version:1,
        settings:{goal:finite(parsed.settings?.goal,500,10000)||1777,theme:['light','dark','system'].includes(parsed.settings?.theme)?parsed.settings.theme:'system'},
        logs:parsed.logs.filter(x=>x && typeof x.date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x.date) && MEALS.some(m=>m.id===x.meal)).map(sanitizeLog),
        customFoods:parsed.customFoods.filter(x=>x && x.id && x.name).map(sanitizeFood),
        favorites:parsed.favorites.filter(x=>typeof x==='string')
      };
    } catch (err) { console.warn('Could not load saved state',err);return defaults() }
  }
  function sanitizeLog(x) {return {id:String(x.id||uid()),date:String(x.date),meal:String(x.meal),name:String(x.name||'Unknown food').slice(0,90),emoji:String(x.emoji||'🍽️').slice(0,8),foodId:x.foodId?String(x.foodId):null,grams:finite(x.grams,0,10000),kcal:finite(x.kcal,0,30000),protein:finite(x.protein,0,1000),carbs:finite(x.carbs,0,1000),fat:finite(x.fat,0,1000),addedAt:String(x.addedAt||new Date().toISOString())};}
  function sanitizeFood(x) {return {id:String(x.id).slice(0,120),name:String(x.name).slice(0,90),emoji:'🍽️',category:'Custom',kcal:finite(x.kcal,0,2000),protein:finite(x.protein,0,100),carbs:finite(x.carbs,0,100),fat:finite(x.fat,0,100),defaultGrams:finite(x.defaultGrams,1,10000)||100};}
  let state = load();
  let currentDate = today;
  let currentPage = 'today';
  let currentCategory = 'All';
  let selectedFood = null;
  let editId = null;
  let modalTab = 'search';
  let modalOpener = null;
  let toastTimeout = null;
  let installPrompt = null;

  function save() {
    try { localStorage.setItem(STORE_KEY,JSON.stringify(state));return true }
    catch(err){toast('Storage is full or disabled. Export a backup and check your browser settings.');return false}
  }
  function getFood(id) {return [...FOODS,...state.customFoods].find(food=>food.id===id) || null}
  function dayLogs(date=currentDate) {return state.logs.filter(log=>log.date===date)}
  function totals(logs) {return logs.reduce((sum,log)=>({kcal:sum.kcal+log.kcal,protein:sum.protein+log.protein,carbs:sum.carbs+log.carbs,fat:sum.fat+log.fat}),{kcal:0,protein:0,carbs:0,fat:0})}
  function toast(message) {const el=$('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),3200)}
  function render() {renderToday();renderFoods();renderHistory();renderSettings()}

  function renderToday() {
    const logs=dayLogs(), sum=totals(logs), goal=state.settings.goal, remaining=Math.round(goal-sum.kcal), percent=sum.kcal/goal*100;
    const isCurrent=currentDate===todayISO();
    $('today-label').textContent=isCurrent?'YOUR FOOD DIARY':'FOOD DIARY · SELECTED DATE';
    $('today-title').textContent=isCurrent?'Today, you’re doing great.':'Your diary, your journey.';
    $('diary-date').value=currentDate;
    $('go-today').hidden=isCurrent;
    $('eaten-number').textContent=fmt(sum.kcal);
    $('remaining-number').innerHTML=`${fmt(Math.abs(remaining))} <span>kcal</span>`;
    $('remaining-label').textContent=remaining>=0?'Remaining for this day':'Over your daily goal by';
    $('daily-target').textContent=`${fmt(goal)} kcal`;
    $('calorie-ring').style.background=`conic-gradient(${remaining<0?'#f4a986':'#bfee9a'} ${Math.min(100,Math.max(0,percent))}%, #35544b ${Math.min(100,Math.max(0,percent))}% 100%)`;
    $('calorie-ring').setAttribute('aria-label',`${fmt(sum.kcal)} of ${fmt(goal)} kilocalories logged, ${Math.round(percent)} percent`);
    $('progress-description').textContent=`${Math.round(percent)}% of daily goal`;
    $('food-entry-count').textContent=`${logs.length} item${logs.length===1?'':'s'} logged`;
    $('goal-hint').textContent=logs.length===0?'Ready for your first meal?':remaining<0?'A day is more than one number.':remaining===0?'Goal reached — nicely done!':'One meal at a time. You’ve got this.';
    for(const key of ['protein','carbs','fat']) $(''+key+'-number').textContent=`${fmtMacro(sum[key])}g`;
    const guides={protein:goal*.25/4,carbs:goal*.5/4,fat:goal*.25/9};
    for(const key of ['protein','carbs','fat']) {$(`${key}-fill`).style.width=`${Math.min(100,Math.round(sum[key]/guides[key]*100))}%`;$(`${key}-fill`).title='Visual guide only; no personalised macro target set'}
    $('meal-list').innerHTML=MEALS.map(meal=>{
      const group=logs.filter(log=>log.meal===meal.id), total=totals(group);
      const content=group.length?`<div class="meal-items">${group.map(log=>`
        <div class="meal-entry"><span class="entry-emoji" aria-hidden="true">${escapeHTML(log.emoji)}</span><div class="entry-text"><strong>${escapeHTML(log.name)}</strong><small>${log.grams>0?`${fmt(log.grams)}g · `:''}${fmtMacro(log.protein)}g P · ${fmtMacro(log.carbs)}g C · ${fmtMacro(log.fat)}g F</small></div><span class="entry-energy">${fmt(log.kcal)}</span><div class="entry-actions"><button type="button" data-action="repeat" data-id="${escapeHTML(log.id)}" title="Repeat food" aria-label="Repeat ${escapeHTML(log.name)}">↻</button><button type="button" data-action="edit" data-id="${escapeHTML(log.id)}" title="Edit" aria-label="Edit ${escapeHTML(log.name)}">✎</button><button type="button" data-action="delete" data-id="${escapeHTML(log.id)}" title="Delete" aria-label="Delete ${escapeHTML(log.name)}">×</button></div></div>`).join('')}</div>`:`<p class="meal-empty">${escapeHTML(meal.empty)}</p>`;
      return `<div class="meal-card"><div class="meal-header"><span class="meal-icon" aria-hidden="true">${meal.emoji}</span><div><div class="meal-name">${meal.id}</div><div class="meal-count">${group.length} item${group.length===1?'':'s'}</div></div><span class="meal-total">${fmt(total.kcal)} <small>kcal</small></span><button type="button" class="meal-add" aria-label="Add ${meal.id}" data-action="add" data-meal="${meal.id}">+</button></div>${content}</div>`
    }).join('');
  }
  function renderFoods() {
    const query=$('food-search').value.trim().toLowerCase();
    $('food-categories').innerHTML=CATEGORIES.map(c=>`<button class="chip ${currentCategory===c.id?'active':''}" type="button" data-category="${c.id}" aria-pressed="${currentCategory===c.id}">${c.label}</button>`).join('');
    let list=[...FOODS,...state.customFoods];
    if(currentCategory==='Favorites') list=list.filter(food=>state.favorites.includes(food.id));
    else if(currentCategory==='Custom') list=list.filter(food=>food.category==='Custom');
    else if(currentCategory!=='All') list=list.filter(food=>food.category===currentCategory);
    if(query) list=list.filter(food=>food.name.toLowerCase().includes(query));
    $('foods-section-label').textContent=currentCategory==='All'?'All foods':CATEGORIES.find(c=>c.id===currentCategory)?.label||'Foods';
    $('food-library-list').innerHTML=list.length?list.map(food=>`
      <div class="food-item"><div class="food-emoji">${escapeHTML(food.emoji)}</div><div class="food-info"><strong>${escapeHTML(food.name)}</strong><small>${fmt(food.defaultGrams)}g usual portion · ${escapeHTML(food.category)}</small></div><div class="food-kcal">${fmt(food.kcal)} <span>/100g</span></div><button type="button" class="favorite-btn ${state.favorites.includes(food.id)?'active':''}" data-food-action="favorite" data-id="${escapeHTML(food.id)}" aria-label="${state.favorites.includes(food.id)?'Remove from':'Add to'} favourites" title="Favourite">${state.favorites.includes(food.id)?'★':'☆'}</button>${food.category==='Custom'?`<button type="button" class="favorite-btn" data-food-action="remove-custom" data-id="${escapeHTML(food.id)}" aria-label="Remove saved ${escapeHTML(food.name)}" title="Delete saved food">×</button>`:''}<button type="button" class="food-action" data-food-action="add" data-id="${escapeHTML(food.id)}" aria-label="Add ${escapeHTML(food.name)}">+</button></div>`).join(''):`<div class="empty-state">No foods found. Try a different search or create your own.</div>`;
  }
  function renderHistory() {
    const week=Array.from({length:7},(_,i)=>addDays(todayISO(),i-6));
    const weekData=week.map(date=>({date,logs:dayLogs(date),total:totals(dayLogs(date)).kcal}));
    const active=weekData.filter(row=>row.logs.length>0);
    const average=active.length?active.reduce((sum,row)=>sum+row.total,0)/active.length:0;
    const within=active.filter(row=>row.total<=state.settings.goal).length;
    $('history-stats').innerHTML=`<div class="stat-card"><strong>${fmt(average)}</strong><span>Average kcal / logged day</span></div><div class="stat-card"><strong>${active.length}/7</strong><span>Days logged this week</span></div><div class="stat-card"><strong>${within}</strong><span>Days at / under goal</span></div>`;
    const max=Math.max(state.settings.goal*1.15,...weekData.map(d=>d.total),1);
    $('weekly-graph').innerHTML=weekData.map(row=>{
      const height=row.logs.length?Math.max(3,row.total/max*100):3;
      return `<button class="chart-col" type="button" data-date="${row.date}" title="${prettyDate(row.date,{weekday:'long',month:'short',day:'numeric'})}: ${fmt(row.total)} kcal"><span class="chart-value">${row.logs.length?fmt(row.total):'—'}</span><div class="chart-bar-wrap"><div class="chart-bar ${!row.logs.length?'none':row.total>state.settings.goal?'over':''}" style="height:${height}%"></div></div><span class="chart-day">${prettyDate(row.date,{weekday:'short'})}</span></button>`
    }).join('');
    $('graph-goal').textContent=fmt(state.settings.goal);
    const dates=Array.from({length:14},(_,i)=>addDays(todayISO(),-i));
    $('history-days').innerHTML=dates.map(date=>{const logs=dayLogs(date);const sum=totals(logs);return `<div class="history-day" role="button" tabindex="0" data-date="${date}"><div class="history-day-date">${date===todayISO()?'Today':prettyDate(date,{weekday:'long',day:'numeric',month:'short'})}<small>${logs.length} items logged</small></div><div class="history-day-kcal">${logs.length?fmt(sum.kcal):'—'} <small>kcal</small></div><span class="history-day-arrow" aria-hidden="true">›</span></div>`}).join('');
  }
  function renderSettings() {
    if(document.activeElement!==$('goal-input')) $('goal-input').value=state.settings.goal;
    $('theme-choice').value=state.settings.theme;
    $('data-count').textContent=`${state.logs.length} meal entries · ${state.customFoods.length} custom foods · ${state.favorites.length} favourites`;
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone=window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
    $('install-guide').textContent=standalone?'✓ Already installed! You can log food even when your phone has no internet.':ios?'On iPhone: open this link in Safari → tap Share → Add to Home Screen → enable Open as Web App → Add. Open MakanLog from its Home Screen icon.':'On Android: open this link in Chrome → menu (⋮) → Install app or Add to Home screen. On desktop, use your browser’s Install option.';
    $('install-button').hidden=!installPrompt || standalone;
  }

  function switchPage(page) {
    if(!['today','foods','history','settings'].includes(page)) return;
    currentPage=page;
    document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id===`page-${page}`));
    document.querySelectorAll('.nav-item').forEach(el=>{const active=el.dataset.page===page;el.classList.toggle('active',active);active?el.setAttribute('aria-current','page'):el.removeAttribute('aria-current')});
    $('floating-add').hidden=page==='settings';
    window.scrollTo({top:0,behavior:'instant'});
    if(page==='history') renderHistory();
  }
  function defaultMeal() {const hour=new Date().getHours();return hour<11?'Breakfast':hour<16?'Lunch':hour<21?'Dinner':'Snacks'}
  function initSelects() {for(const sel of document.querySelectorAll('.meal-select')) sel.innerHTML=MEALS.map(m=>`<option value="${m.id}">${m.id}</option>`).join('')}
  function switchModalTab(tab) {
    modalTab=tab;
    document.querySelectorAll('.modal-tab').forEach(el=>{const on=el.dataset.modalTab===tab;el.classList.toggle('active',on);el.setAttribute('aria-selected',String(on))});
    for(const type of ['photo','search','quick','custom']) $(type==='search'?'library-form':`${type}-form`).hidden=type!==tab;
    if(tab==='quick') $('quick-name').focus();else if(tab==='custom') $('custom-name').focus();else if(tab==='search') $('modal-search').focus();
    else { $('photo-food-search').focus(); document.dispatchEvent(new Event('makanlog:photo-tab')); }
  }
  function openModal({tab='search',foodId=null,meal=null,editing=null}={}) {
    modalOpener=document.activeElement;
    document.dispatchEvent(new Event('makanlog:modal-open'));
    editId=editing;
    selectedFood=null;
    $('library-form').reset();$('quick-form').reset();$('custom-form').reset();
    $('modal-search').value='';$('quick-name').value='';$('custom-portion').value='100';
    $('library-meal').value=$('quick-meal').value=$('custom-meal').value=$('photo-meal').value=meal||defaultMeal();
    $('modal-title').textContent=editing?'Edit your meal':'Add something tasty';
    $('submit-quick').textContent=editing?'Save changes':'Add to diary';
    $('add-library').textContent=editing?'Save changes':'Add to diary';
    $('modal-backdrop').hidden=false;
    document.body.style.overflow='hidden';
    if(editing){
      const log=state.logs.find(item=>item.id===editing);
      if(log) {
        $('library-meal').value=$('quick-meal').value=log.meal;
        if(log.foodId && getFood(log.foodId)) {foodId=log.foodId;tab='search';$('food-portion').value=log.grams}
        else {tab='quick';$('quick-name').value=log.name;$('quick-calories').value=Math.round(log.kcal);$('quick-protein').value=log.protein;$('quick-carbs').value=log.carbs;$('quick-fat').value=log.fat;}
      }
    }
    switchModalTab(tab);
    if(foodId) {selectFood(foodId);if(editing){const log=state.logs.find(item=>item.id===editing);if(log)$('food-portion').value=log.grams}updatePreview()}
    else updateSuggestions();
    $('modal-backdrop').scrollTop=0;
  }
  function closeModal() {
    $('modal-backdrop').hidden=true;document.body.style.overflow='';selectedFood=null;editId=null;
    document.dispatchEvent(new Event('makanlog:modal-close'));
    if(modalOpener?.isConnected) modalOpener.focus();
  }
  function selectFood(id) {
    selectedFood=getFood(id);
    if(!selectedFood) return;
    $('modal-search').value=selectedFood.name;
    $('food-portion').value=selectedFood.defaultGrams;
    updateSuggestions();updatePreview();
  }
  function updateSuggestions() {
    const query=$('modal-search').value.trim().toLowerCase();
    const all=[...FOODS,...state.customFoods];
    const results=(query?all.filter(food=>food.name.toLowerCase().includes(query)):all.filter(food=>state.favorites.includes(food.id)).concat(FOODS.slice(0,7))).slice(0,8);
    $('modal-suggestions').innerHTML=results.map(food=>`<button class="suggestion ${selectedFood?.id===food.id?'chosen':''}" type="button" data-suggest="${escapeHTML(food.id)}"><span>${escapeHTML(food.emoji)}</span><span>${escapeHTML(food.name)}</span><small>${fmt(food.kcal)} /100g</small></button>`).join('')||'<div class="empty-state">No match. Try Quick add or My foods.</div>';
  }
  function updatePreview() {
    const valid=!!selectedFood && Number($('food-portion').value)>0 && Number($('food-portion').value)<=10000;
    $('selection-preview').hidden=!selectedFood;
    $('add-library').disabled=!valid;
    if(selectedFood){
      $('selection-preview').innerHTML=`<strong>${escapeHTML(selectedFood.emoji)} ${escapeHTML(selectedFood.name)}</strong><div>For ${fmt(selectedFood.defaultGrams)}g, approximately ${fmt(selectedFood.kcal*selectedFood.defaultGrams/100)} kcal</div>`;
      const grams=finite($('food-portion').value,0,10000);
      $('calorie-preview').textContent=`${fmt(selectedFood.kcal*grams/100)} kcal`;
    }else $('calorie-preview').textContent='0 kcal';
  }
  function createFoodLog(food,grams,meal) {
    const factor=grams/100;
    return sanitizeLog({id:uid(),date:currentDate,meal,name:food.name,emoji:food.emoji,foodId:food.id,grams,
      kcal:Math.round(food.kcal*factor*10)/10,protein:Math.round(food.protein*factor*10)/10,carbs:Math.round(food.carbs*factor*10)/10,fat:Math.round(food.fat*factor*10)/10,addedAt:new Date().toISOString()});
  }
  function appendOrUpdate(log) {
    const wasEditing=!!editId;
    if(editId) {
      const index=state.logs.findIndex(entry=>entry.id===editId);
      if(index>=0) {log.id=editId;log.date=state.logs[index].date;state.logs[index]=log;}
      else state.logs.push(log);
    } else state.logs.push(log);
    save();render();closeModal();switchPage('today');toast(wasEditing?'Updated!':'Added to your diary ✓');
  }
  function deleteLog(id) {
    const entry=state.logs.find(log=>log.id===id);
    if(!entry || !confirm(`Delete "${entry.name}" from ${entry.meal}?`))return;
    state.logs=state.logs.filter(log=>log.id!==id);save();render();toast('Entry deleted');
  }
  function repeatLog(id) {
    const entry=state.logs.find(log=>log.id===id);if(!entry)return;
    state.logs.push({...entry,id:uid(),date:currentDate,addedAt:new Date().toISOString()});
    save();render();toast('Food added again ✓');
  }
  function showDate(date) {currentDate=date;renderToday();switchPage('today')}
  function applyTheme() {
    const desired=state.settings.theme;
    const dark=desired==='dark'||(desired==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme=dark?'dark':'light';
    $('theme-toggle').setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
  }
  function downloadFile(filename,content,mime) {
    const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportJSON() {downloadFile(`MakanLog-backup-${todayISO()}.json`,JSON.stringify({app:'MakanLog',exportedAt:new Date().toISOString(),...state},null,2),'application/json');toast('Backup created. Save it somewhere safe.')}
  function csvCell(value) {let text=String(value??'');if(/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"'}
  function exportCSV(){const head=['Date','Meal','Food','Portion (g)','Calories (kcal)','Protein (g)','Carbs (g)','Fat (g)'];const rows=state.logs.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(x=>[x.date,x.meal,x.name,x.grams,x.kcal,x.protein,x.carbs,x.fat]);downloadFile(`MakanLog-meals-${todayISO()}.csv`,[head,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('CSV exported ✓')}
  async function importJSON(file) {
    try {
      if(file.size>8e6)throw Error('File is too large');
      const json=JSON.parse(await file.text());
      if(!json || !Array.isArray(json.logs) || !Array.isArray(json.customFoods) || !Array.isArray(json.favorites)) throw Error('Not a MakanLog backup');
      if(json.app!=='MakanLog' && json.version!==1) throw Error('Not a MakanLog backup');
      const restored={version:1,settings:{goal:finite(json.settings?.goal,500,10000)||1777,theme:['light','dark','system'].includes(json.settings?.theme)?json.settings.theme:'system'},
        logs:json.logs.filter(x=>x && /^\d{4}-\d{2}-\d{2}$/.test(x.date||'') && MEALS.some(m=>m.id===x.meal)).slice(0,20000).map(sanitizeLog),
        customFoods:json.customFoods.filter(x=>x && x.id && x.name).slice(0,2000).map(sanitizeFood),
        favorites:json.favorites.filter(x=>typeof x==='string').slice(0,3000)};
      if(!confirm(`Restore ${restored.logs.length} entries from this backup? This replaces your current data. Cancel if you haven't exported your current data.`))return;
      state=restored;save();applyTheme();render();toast('Backup restored ✓');
    } catch(err) {toast(`Restore failed: ${err.message||'Invalid file'}`)}
  }
  function registerServiceWorker() {
    if(!('serviceWorker' in navigator)) { $('connection-status').textContent='Online mode';return }
    navigator.serviceWorker.register('./sw.js').then(()=>{
      if(navigator.serviceWorker.controller) $('connection-status').innerHTML='<span class="status-dot"></span> Offline ready';
      else $('connection-status').innerHTML='<span class="status-dot"></span> Caching app';
      navigator.serviceWorker.ready.then(()=>{$('connection-status').innerHTML='<span class="status-dot"></span> Offline ready'});
    }).catch(err=>{console.warn(err);$('connection-status').textContent='Offline unavailable here'});
  }

  window.MakanLogPhotoAPI = Object.freeze({
    foods: () => [...FOODS,...state.customFoods].map(food=>({...food})),
    addItems: (items,meal) => {
      if(!MEALS.some(m=>m.id===meal))return false;
      const valid=items.filter(item=>getFood(item.id) && Number.isFinite(item.grams) && item.grams>0 && item.grams<=10000);
      if(!valid.length || valid.length!==items.length || valid.length>25)return false;
      const logs=valid.map(item=>createFoodLog(getFood(item.id),item.grams,meal));
      state.logs.push(...logs);save();render();closeModal();switchPage('today');
      toast(`${logs.length} food${logs.length===1?'':'s'} added to your diary ✓`);
      return true;
    },
    openPhoto: () => openModal({tab:'photo'}),
    notice: toast
  });

  // Navigation and daily diary
  document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>switchPage(btn.dataset.page)));
  $('prev-day').addEventListener('click',()=>showDate(addDays(currentDate,-1)));
  $('next-day').addEventListener('click',()=>showDate(addDays(currentDate,1)));
  $('diary-date').addEventListener('change',event=>{if(/^\d{4}-\d{2}-\d{2}$/.test(event.target.value))showDate(event.target.value)});
  $('go-today').addEventListener('click',()=>showDate(todayISO()));
  $('floating-add').addEventListener('click',()=>openModal());
  $('meal-list').addEventListener('click',event=>{
    const btn=event.target.closest('button[data-action]');if(!btn)return;
    const {action,id,meal}=btn.dataset;
    if(action==='add')openModal({meal});else if(action==='edit')openModal({editing:id});else if(action==='delete')deleteLog(id);else if(action==='repeat')repeatLog(id);
  });
  // Foods
  $('food-search').addEventListener('input',renderFoods);
  $('food-categories').addEventListener('click',event=>{const btn=event.target.closest('[data-category]');if(btn){currentCategory=btn.dataset.category;renderFoods()}});
  $('food-library-list').addEventListener('click',event=>{const btn=event.target.closest('[data-food-action]');if(!btn)return;
    const {foodAction,id}=btn.dataset;
    if(foodAction==='add')openModal({foodId:id});
    else if(foodAction==='favorite'){state.favorites=state.favorites.includes(id)?state.favorites.filter(v=>v!==id):[...state.favorites,id];save();renderFoods()}
    else if(foodAction==='remove-custom'){const food=getFood(id);if(food&&confirm(`Remove saved food \"${food.name}\"? Past meal entries will stay.`)){state.customFoods=state.customFoods.filter(f=>f.id!==id);state.favorites=state.favorites.filter(f=>f!==id);save();renderFoods();toast('Saved food removed')}}
  });
  $('make-custom').addEventListener('click',()=>openModal({tab:'custom'}));
  // Modal interaction
  $('close-modal').addEventListener('click',closeModal);
  $('modal-backdrop').addEventListener('click',event=>{if(event.target===$('modal-backdrop'))closeModal()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('modal-backdrop').hidden)closeModal()});
  document.querySelectorAll('.modal-tab').forEach(btn=>btn.addEventListener('click',()=>switchModalTab(btn.dataset.modalTab)));
  $('modal-search').addEventListener('input',()=>{selectedFood=null;updateSuggestions();updatePreview()});
  $('modal-suggestions').addEventListener('click',event=>{const btn=event.target.closest('[data-suggest]');if(btn)selectFood(btn.dataset.suggest)});
  $('food-portion').addEventListener('input',updatePreview);
  $('portion-presets').addEventListener('click',event=>{const btn=event.target.closest('button[data-portion]');if(!btn||!selectedFood)return;$('food-portion').value=Math.round(selectedFood.defaultGrams*Number(btn.dataset.portion));updatePreview()});
  $('library-form').addEventListener('submit',event=>{event.preventDefault();const grams=Number($('food-portion').value);if(!selectedFood||!Number.isFinite(grams)||grams<=0||grams>10000)return toast('Choose a food and valid portion first.');appendOrUpdate(createFoodLog(selectedFood,grams,$('library-meal').value))});
  $('quick-form').addEventListener('submit',event=>{event.preventDefault();if(!$('quick-form').reportValidity())return;
    const log=sanitizeLog({id:uid(),date:currentDate,meal:$('quick-meal').value,name:$('quick-name').value.trim(),emoji:'🍽️',grams:0,kcal:Number($('quick-calories').value),protein:Number($('quick-protein').value||0),carbs:Number($('quick-carbs').value||0),fat:Number($('quick-fat').value||0),addedAt:new Date().toISOString()});
    if(!log.name)return toast('Enter a food name');appendOrUpdate(log);
  });
  $('custom-form').addEventListener('submit',event=>{event.preventDefault();if(!$('custom-form').reportValidity())return;
    const food=sanitizeFood({id:'custom-'+uid(),name:$('custom-name').value.trim(),kcal:$('custom-calories').value,protein:$('custom-protein').value,carbs:$('custom-carbs').value,fat:$('custom-fat').value,defaultGrams:$('custom-portion').value});
    if(!food.name)return toast('Enter a food name');state.customFoods.push(food);save();appendOrUpdate(createFoodLog(food,food.defaultGrams,$('custom-meal').value));
  });
  // History
  $('history-days').addEventListener('click',event=>{const row=event.target.closest('[data-date]');if(row)showDate(row.dataset.date)});
  $('history-days').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){const row=event.target.closest('[data-date]');if(row){event.preventDefault();showDate(row.dataset.date)}}});
  $('weekly-graph').addEventListener('click',event=>{const col=event.target.closest('[data-date]');if(col)showDate(col.dataset.date)});
  // Settings
  $('goal-form').addEventListener('submit',event=>{event.preventDefault();const input=$('goal-input');if(!input.reportValidity())return;state.settings.goal=finite(input.value,500,10000);save();render();toast('Calorie goal updated ✓')});
  $('theme-choice').addEventListener('change',event=>{state.settings.theme=event.target.value;save();applyTheme()});
  $('theme-toggle').addEventListener('click',()=>{state.settings.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';save();applyTheme();renderSettings()});
  if(window.matchMedia)window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.settings.theme==='system')applyTheme()});
  $('export-json').addEventListener('click',exportJSON);$('export-csv').addEventListener('click',exportCSV);
  $('import-json').addEventListener('click',()=>$('import-file').click());
  $('import-file').addEventListener('change',async event=>{const file=event.target.files?.[0];if(file)await importJSON(file);event.target.value=''});
  $('clear-data').addEventListener('click',()=>{if(confirm('Permanently delete ALL saved meal entries and custom foods on this device? Export a backup first.')){state={...defaults(),settings:{...state.settings}};save();render();toast('All entries deleted')}});
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;renderSettings()});
  $('install-button').addEventListener('click',async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;renderSettings()}});
  window.addEventListener('appinstalled',()=>{installPrompt=null;renderSettings();toast('App installed ✓')});
  window.addEventListener('online',()=>{$('connection-status').classList.remove('offline');toast('Back online — your logs never left this device')});
  window.addEventListener('offline',()=>{$('connection-status').classList.add('offline');toast('You’re offline. Meal tracking still works!')});

  initSelects();
  applyTheme();
  render();
  if(!navigator.onLine)$('connection-status').classList.add('offline');
  registerServiceWorker();
})();
