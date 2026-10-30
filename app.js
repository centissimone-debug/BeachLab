'use strict';

/* ---------- Costanti ---------- */
const LIB_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const STORE_KEY = 'beachlab.v1';
const BEACH_KW = ['jump', 'lunge', 'split squat', 'pallof', 'wall sit', 'face pull', 'external rotation', 'landmine',
  'swing', 'plank', 'calf', 'pull-up', 'pullups', 'step-up', 'step up', 'burpee', 'farmer', 'reverse fly',
  'reverse flyes', 'russian twist', 'dead bug'];
const MUSCLES = ['quadriceps', 'hamstrings', 'glutes', 'calves', 'abdominals', 'lower back', 'middle back', 'lats',
  'shoulders', 'traps', 'chest', 'biceps', 'triceps', 'forearms'];
const IT_MUSCLE = { abdominals: 'Addominali', abductors: 'Abduttori', adductors: 'Adduttori', biceps: 'Bicipiti',
  calves: 'Polpacci', chest: 'Petto', forearms: 'Avambracci', glutes: 'Glutei', hamstrings: 'Femorali', lats: 'Dorsali',
  'lower back': 'Lombari', 'middle back': 'Schiena', neck: 'Collo', quadriceps: 'Quadricipiti', shoulders: 'Spalle',
  traps: 'Trapezi', triceps: 'Tricipiti' };
const IT_EQUIP = { 'body only': 'Corpo libero', machine: 'Macchina', other: 'Altro', 'foam roll': 'Foam roller',
  kettlebells: 'Kettlebell', dumbbell: 'Manubri', cable: 'Cavo', barbell: 'Bilanciere', bands: 'Elastici',
  'medicine ball': 'Palla medica', 'exercise ball': 'Fitball', 'e-z curl bar': 'Barra EZ' };
const IT_LEVEL = { beginner: 'Principiante', intermediate: 'Intermedio', expert: 'Avanzato' };
const muscleIt = m => IT_MUSCLE[m] || m;
const equipIt = e => (e ? IT_EQUIP[e] || e : '—');
const isBeach = name => BEACH_KW.some(k => name.toLowerCase().includes(k));

/* ---------- Dati iniziali (dal riepilogo della chat) ---------- */
let uid = 0;
const ex = (section, name, term, sets, o = {}) => ({
  id: 'e' + (++uid), section, name, term, sets, note: o.note || '', weight: o.w ?? 0, unit: o.unit || 'kg',
  step: o.step || 1, hasWeight: o.w !== undefined, beach: !!o.beach,
  history: o.w !== undefined ? [{ d: Date.now(), w: o.w }] : []
});

function seed() {
  const P = 'Principale';
  const B = 'Schiena', S = 'Spinta', SP = 'Spalle e cuffia', C = 'Core';
  return {
    programStart: Date.now(),
    days: [
      { id: 'd1', title: 'Gambe & Salto Verticale', weekday: 'Lunedì', icon: '🦵',
        warmup: 'Jumping jack, corsa sul posto, mobilità anca/caviglia.',
        finisher: '5 × 5 salti verticali massimali, 30" di recupero.\n\nBlocco coordinazione (8-10 min, opzionale): ladder drill sulle linee del tappeto, mini band lateral shuffle, single-leg hop stabilizzato, reactive step + squat, box drill 4 punti.',
        exercises: [
          ex(P, 'Trap Bar Deadlift', 'trap bar deadlift', '4 × 5', { w: 27.5, unit: 'kg/lato', step: 2.5 }),
          ex(P, 'Hack Squat', 'hack squat', '4 × 8', { w: 35, unit: 'kg/lato', step: 2.5 }),
          ex(P, 'Box Jump', 'box jump', '4 × 6', { note: 'Altezza massima', beach: true }),
          ex(P, 'Walking Lunge con manubri', 'lunge', '3 × 12/lato', { w: 16, beach: true }),
          ex(P, 'Glute Ham Raise', 'glute ham raise', '3 × max', { note: '3-4 rip, in progressione' }),
          ex(P, 'Calf Raise esplosivo', 'calf raise', '4 × 15', { w: 130, step: 5 }),
          ex(P, 'Hollow Body Hold', 'hollow', '3 × 30-40"')
        ] },
      { id: 'd2', title: 'Busto & Spalle', weekday: 'Mercoledì', icon: '💪',
        warmup: 'Circonduzioni scapolari + cat-camel 1×10, open book 1×8/lato, band pull-apart 2×15, extrarotazioni con elastico 2×15, serratus punch 2×12.',
        finisher: '',
        exercises: [
          ex(B, 'Lat machine presa neutra', 'lat pulldown', '4 × 8', { w: 60, step: 2.5, note: 'Se arrivi a 9-10 rip si torna al range 8-10, altrimenti resta a 8 finché non consolidi.' }),
          ex(B, 'Rematore manubrio unilaterale', 'one-arm dumbbell row', '3 × 10-12/lato', { w: 20 }),
          ex(B, 'Pulley basso', 'seated cable rows', '3 × 12', { w: 50, step: 2.5 }),
          ex(B, 'Reverse fly panca inclinata', 'reverse flyes', '3 × 15', { w: 8, beach: true }),
          ex(S, 'Landmine Press', 'landmine press', '3 × 10/lato', { w: 7.5, unit: 'kg/lato', step: 2.5 }),
          ex(S, 'Single-arm DB Press', 'one-arm dumbbell', '3 × 8-10/lato', { w: 12, note: 'Overhead: sali solo con zero fastidio per 2 sessioni.' }),
          ex(SP, 'Face pull al cavo', 'face pull', '3 × 15', { w: 20, step: 2.5, beach: true }),
          ex(SP, 'Alzate laterali', 'side lateral raise', '3 × 12-15', { w: 10, note: "Fino all'altezza spalla." }),
          ex(SP, 'Extrarotazioni', 'external rotation', '3 × 12', { w: 3.75, step: 1.25, beach: true }),
          ex(SP, 'Y-raise', 'front raise', '2 × 12', { w: 6, note: 'In piedi, busto inclinato, senza panca.' }),
          ex(SP, 'Blackburn prono (T + Y)', 'superman', '2 × 10 ciascuna'),
          ex(C, 'Dead Bug', 'dead bug', '3 × 8/lato'),
          ex(C, 'Plank', 'plank', '3 × 40"'),
          ex(C, 'Pallof Press', 'pallof', '2 × 12/lato', { beach: true })
        ] }
    ]
  };
}

/* ---------- Stato ---------- */
let state;
try { state = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { state = null; }
if (!state || !state.days) { state = seed(); save(); }
uid = 1000 + Math.max(0, ...state.days.flatMap(d => d.exercises.map(e => parseInt(e.id.slice(1)) || 0)));

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
const findEx = id => { for (const d of state.days) { const e = d.exercises.find(x => x.id === id); if (e) return { e, d }; } return {}; };

/* ---------- Utilità ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Number(n).toLocaleString('it-IT', { maximumFractionDigits: 2 });
const weeksElapsed = () => Math.floor((Date.now() - state.programStart) / (7 * 864e5));

/* ---------- Libreria online ---------- */
let LIB = [], libState = 'idle';
async function loadLibrary(force) {
  if (LIB.length && !force) return;
  libState = 'loading';
  try {
    const res = await fetch(LIB_URL, force ? { cache: 'reload' } : undefined);
    if (!res.ok) throw new Error(res.status);
    LIB = await res.json();
    libState = 'loaded';
  } catch (e) { libState = 'failed'; }
}

/* ---------- Router ---------- */
let tab = 'schede', dayId = null;
function go(t, d = null) { tab = t; dayId = d; render(); window.scrollTo(0, 0); }
document.querySelectorAll('#tabbar button').forEach(b => b.onclick = () => go(b.dataset.tab));

function render() {
  document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const app = $('#app');
  if (tab === 'schede') return dayId ? renderDay(app) : renderDays(app);
  if (tab === 'libreria') return renderLibraryTab(app);
  if (tab === 'progressi') return renderProgress(app);
  renderGuide(app);
}

/* ---------- Schede ---------- */
function renderDays(app) {
  const w = weeksElapsed();
  app.innerHTML = `<h1>Beach Lab</h1>
    ${w >= 4 ? `<div class="banner"><b>🔄 Sono passate ${w} settimane</b>
      <div class="sub" style="margin-top:4px">È il momento di cambiare qualche esercizio per evitare lo stallo. Nella scheda tocca ⇄ per vedere le varianti.</div>
      <button class="pill" data-act="restart">Ho cambiato, riparti da oggi</button></div>` : ''}
    <div class="group">${state.days.map(d => `
      <button class="row chev" data-act="open-day" data-id="${d.id}">
        <span style="font-size:28px">${d.icon}</span>
        <span class="grow"><div class="sub" style="font-weight:600;font-size:12px">${d.weekday.toUpperCase()}</div>
        <b>${esc(d.title)}</b><div class="sub">${d.exercises.length} esercizi</div></span></button>`).join('')}</div>
    <p class="sub" style="margin:10px 8px">Settimana ${w + 1} del ciclo · cambio esercizi consigliato ogni 4-6 settimane</p>`;
}

function renderDay(app) {
  const day = state.days.find(d => d.id === dayId);
  const sections = [];
  day.exercises.forEach(e => {
    let s = sections.find(x => x.name === e.section);
    if (!s) sections.push(s = { name: e.section, items: [] });
    s.items.push(e);
  });
  app.innerHTML = `<button class="back" data-act="back">‹ Schede</button>
    <h1>${esc(day.title)}</h1>
    <h2>Riscaldamento</h2><div class="card sub" style="color:var(--text)">${esc(day.warmup)}</div>
    ${sections.map(s => `<h2>${esc(s.name)}</h2>${s.items.map(exCard).join('')}`).join('')}
    ${day.finisher ? `<h2>Finisher</h2><div class="card" style="white-space:pre-line">${esc(day.finisher)}</div>` : ''}
    <button class="pill" style="width:100%;padding:14px" data-act="add-ex" data-id="${day.id}">＋ Aggiungi esercizio dalla libreria</button>`;
}

function exCard(e) {
  return `<div class="card">
    <div class="ex-head"><div class="name">${esc(e.name)} ${e.beach ? '🏐' : ''}</div>
      <button class="icon-btn" data-act="info" data-id="${e.id}" aria-label="Come si esegue">▶</button>
      <button class="icon-btn" data-act="replace" data-id="${e.id}" aria-label="Sostituisci">⇄</button>
      <button class="icon-btn" data-act="delete" data-id="${e.id}" aria-label="Elimina">🗑</button></div>
    <div class="sub" style="font-weight:600">${esc(e.sets)}</div>
    ${e.note ? `<div class="note">${esc(e.note)}</div>` : ''}
    ${e.hasWeight ? `<div class="stepper">
      <button data-act="dec" data-id="${e.id}">−</button>
      <div class="val"><b>${fmt(e.weight)}</b><small>${esc(e.unit)}</small></div>
      <button data-act="inc" data-id="${e.id}">+</button></div>` : ''}
  </div>`;
}

function changeWeight(id, delta) {
  const { e } = findEx(id);
  if (!e) return;
  e.weight = Math.max(0, Math.round((e.weight + delta) * 100) / 100);
  const today = new Date().toDateString();
  const last = e.history[e.history.length - 1];
  if (last && new Date(last.d).toDateString() === today) last.w = e.weight;
  else e.history.push({ d: Date.now(), w: e.weight });
  save();
  render();
}

/* ---------- Libreria (tab + sheet) ---------- */
function renderLibraryTab(app) {
  app.innerHTML = '<h1>Libreria</h1><div id="lib"></div>';
  mountLibrary($('#lib'), {});
}

function mountLibrary(el, { query = '', pickLabel = '', onPick = null, scrollRoot = window }) {
  let q = query, muscle = null, beachOnly = false, limit = 60, timer = null;

  const stop = () => { clearInterval(timer); timer = null; };

  function filtered() {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    return LIB.filter(x => {
      const n = x.name.toLowerCase();
      return tokens.every(t => n.includes(t)) && (!muscle || x.primaryMuscles.includes(muscle)) && (!beachOnly || isBeach(x.name));
    });
  }

  function list() {
    stop();
    el.innerHTML = `<input class="search" type="search" placeholder="Cerca un esercizio (in inglese)" value="${esc(q)}">
      <div class="chips"><button class="chip ${beachOnly ? 'on' : ''}" data-beach>🏐 Beach</button>
      ${MUSCLES.map(m => `<button class="chip ${muscle === m ? 'on' : ''}" data-m="${m}">${muscleIt(m)}</button>`).join('')}</div>
      <div id="lib-results"></div>`;
    const input = el.querySelector('.search');
    input.oninput = () => { q = input.value; limit = 60; results(); };
    el.querySelector('[data-beach]').onclick = () => { beachOnly = !beachOnly; list(); };
    el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { muscle = muscle === b.dataset.m ? null : b.dataset.m; list(); });
    results();
  }

  function results() {
    const box = el.querySelector('#lib-results');
    if (!LIB.length) {
      box.innerHTML = libState === 'failed'
        ? `<div class="empty">Libreria non disponibile.<br>Serve una connessione per il primo download.<br><button class="pill" data-retry>Riprova</button></div>`
        : `<div class="empty">Scarico la libreria…</div>`;
      const r = box.querySelector('[data-retry]');
      if (r) r.onclick = async () => { box.innerHTML = '<div class="empty">Scarico la libreria…</div>'; await loadLibrary(true); results(); };
      return;
    }
    const all = filtered(), shown = all.slice(0, limit);
    if (!all.length) { box.innerHTML = '<div class="empty">Nessun risultato</div>'; return; }
    box.innerHTML = `<div class="group">${shown.map(x => `
      <button class="row chev" data-id="${esc(x.id)}">
        <img class="thumb" loading="lazy" src="${IMG_BASE}${x.images[0] || ''}" alt="">
        <span class="grow"><b>${esc(x.name)} ${isBeach(x.name) ? '🏐' : ''}</b>
        <div class="sub" style="font-size:12px">${x.primaryMuscles.map(muscleIt).join(', ')} · ${equipIt(x.equipment)}</div></span></button>`).join('')}</div>
      ${all.length > limit ? `<button class="pill ghost" style="width:100%" data-more>Mostra altri (${all.length - limit})</button>` : ''}`;
    box.querySelectorAll('[data-id]').forEach(b => b.onclick = () => detail(LIB.find(x => x.id === b.dataset.id)));
    const more = box.querySelector('[data-more]');
    if (more) more.onclick = () => { limit += 60; results(); };
  }

  function detail(x) {
    const imgs = (x.images || []).map(i => IMG_BASE + i);
    el.innerHTML = `<button class="back" data-back>‹ Libreria</button>
      ${imgs.length ? `<img class="hero" src="${imgs[0]}" alt="">` : ''}
      <h1 style="font-size:26px">${esc(x.name)}</h1>
      <div class="sub">${IT_LEVEL[x.level] || x.level} · ${equipIt(x.equipment)}</div>
      <div class="tags">${x.primaryMuscles.map(m => `<span class="tag main">${muscleIt(m)}</span>`).join('')}
        ${x.secondaryMuscles.map(m => `<span class="tag">${muscleIt(m)}</span>`).join('')}</div>
      <h2 style="margin-left:0">Esecuzione</h2>
      <ol class="steps">${x.instructions.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${onPick ? `<div class="sticky-pick"><button class="pill" data-pick>${esc(pickLabel)}</button></div>` : ''}`;
    el.querySelector('[data-back]').onclick = list;
    if (onPick) el.querySelector('[data-pick]').onclick = () => onPick(x);
    if (imgs.length > 1) {
      let i = 0;
      const hero = el.querySelector('.hero');
      timer = setInterval(() => { if (!hero.isConnected) return stop(); i = (i + 1) % imgs.length; hero.src = imgs[i]; }, 1000);
    }
  }

  list();
  if (!LIB.length) loadLibrary().then(() => { if (el.isConnected && el.querySelector('#lib-results')) results(); });
}

/* ---------- Sheet ---------- */
function openSheet(setup) {
  $('#sheet').hidden = false;
  const body = $('#sheet-body');
  body.innerHTML = '';
  body.scrollTop = 0;
  setup(body);
}
function closeSheet() { $('#sheet').hidden = true; $('#sheet-body').innerHTML = ''; }
$('#sheet-close').onclick = closeSheet;
$('#sheet').onclick = e => { if (e.target.id === 'sheet') closeSheet(); };

/* ---------- Progressi ---------- */
let progId = null;
function renderProgress(app) {
  const list = state.days.flatMap(d => d.exercises).filter(e => e.hasWeight);
  if (!list.length) { app.innerHTML = '<h1>Progressi</h1><div class="empty">Nessun dato. Cambia un peso in una scheda per iniziare.</div>'; return; }
  const e = list.find(x => x.id === progId) || list[0];
  const h = e.history, first = h[0].w, delta = e.weight - first;
  const col = delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--sub)';
  app.innerHTML = `<h1>Progressi</h1>
    <select id="prog-sel">${list.map(x => `<option value="${x.id}" ${x.id === e.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
    <div class="card stats" style="margin-top:12px">
      <div><small>Attuale</small><b>${fmt(e.weight)} ${esc(e.unit)}</b></div>
      <div><small>Partenza</small><b>${fmt(first)} ${esc(e.unit)}</b></div>
      <div><small>Variazione</small><b style="color:${col}">${delta >= 0 ? '+' : ''}${fmt(delta)} ${esc(e.unit)}</b></div></div>
    <h2>Andamento</h2><div class="card">${chart(h)}</div>
    <h2>Storico</h2><div class="group">${[...h].reverse().map(p => `
      <div class="row"><span class="grow">${new Date(p.d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      <b style="font-variant-numeric:tabular-nums">${fmt(p.w)} ${esc(e.unit)}</b></div>`).join('')}</div>`;
  $('#prog-sel').onchange = ev => { progId = ev.target.value; render(); };
}

function chart(h) {
  if (h.length < 2) return '<div class="sub">Servono almeno due registrazioni per mostrare il grafico.</div>';
  const W = 320, H = 170, pad = 28;
  const ws = h.map(p => p.w), min = Math.min(...ws), max = Math.max(...ws), span = max - min || 1;
  const t0 = h[0].d, t1 = h[h.length - 1].d, ts = t1 - t0 || 1;
  const pts = h.map(p => [pad + ((p.d - t0) / ts) * (W - pad * 2), H - pad - ((p.w - min) / span) * (H - pad * 2)]);
  const dateLbl = t => new Date(t).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">
    <polyline fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" points="${pts.map(p => p.join(',')).join(' ')}"/>
    ${pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--accent)"/>`).join('')}
    <text x="4" y="${pad + 4}" font-size="11" fill="var(--sub)">${fmt(max)}</text>
    <text x="4" y="${H - pad + 4}" font-size="11" fill="var(--sub)">${fmt(min)}</text>
    <text x="${pad}" y="${H - 6}" font-size="11" fill="var(--sub)">${dateLbl(t0)}</text>
    <text x="${W - pad}" y="${H - 6}" font-size="11" fill="var(--sub)" text-anchor="end">${dateLbl(t1)}</text></svg>`;
}

/* ---------- Guida ---------- */
function renderGuide(app) {
  const li = t => `<div class="row"><span style="color:var(--accent)">●</span><span class="grow" style="font-size:15px">${t}</span></div>`;
  app.innerHTML = `<h1>Guida</h1>
    <h2>Spalla — regola pratica</h2><div class="group">
      ${li('Fastidio sordo «da livido»: accettabile.')}
      ${li('Dolore acuto/puntorio che aumenta, o che dura oltre 30 minuti dopo: stop o scala il carico.')}
      ${li('Ghiaccio dopo palestra e beach, non di routine. La spalla sale di carico solo con zero fastidio per 2 sessioni consecutive.')}</div>
    <h2>Riscaldamento spalla per il beach</h2><div class="group">
      ${li('<b>5 min</b> · Corsa leggera, jumping jack, skip')}
      ${li('<b>5 min</b> · Pendulum, cerchi con le braccia, scapular wall slide, palleggi leggeri')}
      ${li('Passaggi, bagher morbidi, schiacciate progressive (non a piena potenza nei primi 5-10 minuti)')}</div>
    <h2>Regole di progressione</h2><div class="group">
      ${li('Doppia progressione: resta sullo stesso peso finché completi il range alto per 2 sessioni consecutive, poi aumenta e riparti dal range basso.')}
      ${li('Forza pesante (Trap Bar, Hack Squat): +2,5-5 kg a settimana se tecnica e ripetizioni sono complete.')}
      ${li('Manubri: +1-2 kg per manubrio ogni 1-2 settimane.')}
      ${li('Salti: non si aumenta il peso, ma altezza del box o qualità/velocità.')}
      ${li('Un solo movimento overhead pesante per sessione.')}
      ${li('Cambio esercizi ogni 4-6 settimane. Depth Jump e Chest to Bar solo con spalla e gambe pienamente recuperate.')}</div>
    <h2>Ricezione e bagher</h2><div class="group">
      ${li('La palestra dà la base fisica (stabilità, reattività, posizione bassa), ma la tecnica si allena sul campo.')}
      ${li('Utili: Bulgarian Split Squat, Walking Lunge, Pallof Press, Monster Walk, Wall Sit.')}
      ${li('Reattività: mini band lateral shuffle, reactive squat jump, single-leg balance instabile, ladder drill, box drill.')}</div>
    <h2>Alimentazione (indicativa)</h2><div class="group">
      ${li('Proteine target 155-170 g, 1.800-1.900 kcal; evita giorni sotto ~1.400-1.600 kcal.')}
      ${li('Senza carne: tonno, salmone, yogurt greco, ricotta, fiocchi di latte, tofu, edamame, legumi, whey.')}
      ${li('La creatina trattiene acqua: guarda anche girovita e foto, non solo la bilancia.')}</div>
    <h2>Impostazioni</h2><div class="group">
      <button class="row" data-act="restart"><span class="grow">Riavvia il ciclo di 4 settimane</span></button>
      <button class="row" data-act="refresh-lib"><span class="grow">Aggiorna libreria esercizi</span><span class="sub">${LIB.length || '—'}</span></button></div>
    <p class="sub" style="margin:14px 8px">Libreria esercizi: free-exercise-db (pubblico dominio), scaricata da internet. Le indicazioni su alimentazione e spalla sono informative e non sostituiscono il parere di medico, fisiatra o nutrizionista.</p>`;
}

/* ---------- Azioni (event delegation) ---------- */
document.addEventListener('click', async ev => {
  const t = ev.target.closest('[data-act]');
  if (!t) return;
  const id = t.dataset.id, act = t.dataset.act;
  if (act === 'open-day') go('schede', id);
  else if (act === 'back') go('schede');
  else if (act === 'inc') changeWeight(id, findEx(id).e.step);
  else if (act === 'dec') changeWeight(id, -findEx(id).e.step);
  else if (act === 'restart') { state.programStart = Date.now(); save(); render(); }
  else if (act === 'refresh-lib') { await loadLibrary(true); render(); }
  else if (act === 'delete') {
    const { e, d } = findEx(id);
    if (e && confirm(`Eliminare «${e.name}» dalla scheda?`)) { d.exercises = d.exercises.filter(x => x.id !== id); save(); render(); }
  } else if (act === 'info') {
    const { e } = findEx(id);
    openSheet(body => mountLibrary(body, { query: e.term }));
  } else if (act === 'replace') {
    const { e } = findEx(id);
    openSheet(body => mountLibrary(body, {
      query: e.term, pickLabel: `Usa al posto di ${e.name}`,
      onPick: x => { e.name = x.name; e.term = x.name; e.beach = isBeach(x.name); save(); closeSheet(); render(); }
    }));
  } else if (act === 'add-ex') {
    const d = state.days.find(x => x.id === id);
    openSheet(body => mountLibrary(body, {
      pickLabel: 'Aggiungi alla scheda',
      onPick: x => {
        const hasW = x.equipment !== 'body only';
        d.exercises.push({ id: 'e' + (++uid), section: 'Aggiunti', name: x.name, term: x.name, sets: '3 × 10', note: '',
          weight: 0, unit: 'kg', step: 1, hasWeight: hasW, beach: isBeach(x.name), history: hasW ? [{ d: Date.now(), w: 0 }] : [] });
        save(); closeSheet(); render();
      }
    }));
  }
});

/* ---------- Avvio ---------- */
render();
loadLibrary();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
