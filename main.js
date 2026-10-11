/* MINDCRAFT — page orchestration */
import { SKILLS, TRACKS, PROJECTS, COURSES, ZONES, LEVELS, skillById } from './data.js';
import { icon, blueprint, zoneScene } from './art.js';
import { Pegboard } from './board.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad2 = (n) => String(n).padStart(2, '0');
const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const store = {
  get(k, d) { try { const v = sessionStorage.getItem('mindcraft:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { sessionStorage.setItem('mindcraft:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
};

let unlocked = new Set();
let unlockOrder = [];
const liveEl = $('[data-live]');

/* ------------------------------------------------------------------ */
/* Pegboard + build queue                                               */
/* ------------------------------------------------------------------ */
const board = new Pegboard({
  board: $('#pegboard'),
  pegs: $('#pegs'),
  tray: $('#tray'),
  strings: $('.board-strings'),
  slotsLayer: $('.board-slots'),
  reduced,
  initial: store.get('slots', []),
  onChange: (set, info) => onBoardChange(set, info),
});

function onBoardChange(set, info) {
  store.set('slots', board.slots);
  const have = new Set(set);
  const now = new Set(PROJECTS.filter((p) => p.skills.every((s) => have.has(s))).map((p) => p.id));
  const fresh = [...now].filter((id) => !unlocked.has(id));
  unlockOrder = unlockOrder.filter((id) => now.has(id));
  fresh.forEach((id) => unlockOrder.unshift(id));
  if (!unlocked.size && !info.announce) unlockOrder = PROJECTS.filter((p) => now.has(p.id)).map((p) => p.id);
  unlocked = now;
  renderQueue(info.announce ? fresh : []);
  renderHint(have);
  updateSkillMapState();
  if (pFilter === 'unlocked') renderPlates();
  renderJoinBoard();
  if (info.announce) {
    const parts = [];
    if (info.added) parts.push(`${skillById(info.added).name} hung on the board.`);
    if (info.removed) parts.push(`${skillById(info.removed).name} taken down.`);
    if (fresh.length) parts.push(`Unlocked: ${fresh.map((id) => PROJECTS.find((p) => p.id === id).name).join(', ')}.`);
    parts.push(`${now.size} of ${PROJECTS.length} projects unlocked.`);
    liveEl.textContent = parts.join(' ');
  }
}

function renderQueue(fresh) {
  $('[data-count]').textContent = String(unlocked.size);
  const list = $('[data-queue]');
  const show = unlockOrder.slice(0, 4);
  list.innerHTML = show.map((id) => {
    const p = PROJECTS.find((x) => x.id === id);
    const n = PROJECTS.indexOf(p) + 1;
    return `<li class="ticket${fresh.includes(id) && !reduced ? ' is-new' : ''}">
      <span class="tk-n">P${pad2(n)}</span>
      <span class="tk-main"><b>${p.name}</b><small>${LEVELS[p.level]} · ${p.hours} h · ${p.skills.map((s) => skillById(s).name).join(' + ')}</small></span>
      <button type="button" class="tk-open" data-open-project="${p.id}" aria-label="Open the plan for ${p.name}">Plan</button>
      <span class="tk-stamp" aria-hidden="true">Unlocked</span></li>`;
  }).join('') + (unlockOrder.length > 4 ? `<li class="ticket-more"><a href="#projects" data-see-unlocked>+ ${unlockOrder.length - 4} more unlocked projects</a></li>` : '');
}

function renderHint(have) {
  const hint = $('[data-hint]');
  if (unlocked.size === PROJECTS.length) { hint.textContent = 'Every project unlocked. The workshop is yours.'; return; }
  const cands = PROJECTS.filter((p) => !unlocked.has(p.id)).map((p) => ({ p, miss: p.skills.filter((s) => !have.has(s)) }))
    .sort((a, b) => a.miss.length - b.miss.length || a.p.level - b.p.level);
  const c = cands[0];
  const names = c.miss.map((s) => skillById(s).name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  hint.innerHTML = `${have.size ? 'Next:' : 'Start here:'} hang <b>${list}</b> to unlock <b>${c.p.name}</b>.`;
}

$('[data-suggest]').addEventListener('click', () => {
  const locked = PROJECTS.filter((p) => !unlocked.has(p.id));
  if (!locked.length) { liveEl.textContent = 'Everything is already unlocked.'; return; }
  const p = locked[Math.floor(Math.random() * locked.length)];
  const free = board.slots.filter((x) => !x).length;
  const need = p.skills.filter((s) => !board.slots.includes(s));
  if (need.length > free) board.clear();
  board.hangMany(p.skills);
});
$('[data-clear]').addEventListener('click', () => board.clear());
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-see-unlocked]');
  if (a) setPFilter('unlocked');
});

/* ------------------------------------------------------------------ */
/* Skill map                                                            */
/* ------------------------------------------------------------------ */
const smap = $('#smap');
const smSkills = $('[data-smap="skills"]');
const smProjects = $('[data-smap="projects"]');
const smLinks = $('.smap-links');
const smRead = $('[data-smap-read]');
let smSel = null;
smSkills.innerHTML = SKILLS.map((s) => `<li><button type="button" class="sm-node sm-skill plate-${TRACKS[s.track].plate}" data-sm="s:${s.id}" aria-pressed="false">${icon(s.id, 'sm-ico')}<span class="sm-name">${s.name}</span><span class="sm-badge">On board</span></button></li>`).join('');
smProjects.innerHTML = PROJECTS.map((p, i) => `<li><button type="button" class="sm-node sm-project" data-sm="p:${p.id}" aria-pressed="false"><span class="sm-num">P${pad2(i + 1)}</span><span class="sm-name">${p.name}</span><span class="sm-lv">${LEVELS[p.level]}</span><span class="sm-badge">Unlocked</span></button></li>`).join('');

function drawLinks() {
  const r = smap.getBoundingClientRect();
  smLinks.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
  let html = '';
  PROJECTS.forEach((p) => {
    const pb = $(`[data-sm="p:${p.id}"]`).getBoundingClientRect();
    p.skills.forEach((s) => {
      const sb = $(`[data-sm="s:${s}"]`).getBoundingClientRect();
      const x0 = sb.right - r.left + 6; const y0 = sb.top + sb.height / 2 - r.top;
      const x1 = pb.left - r.left - 6; const y1 = pb.top + pb.height / 2 - r.top;
      const mx = (x0 + x1) / 2;
      html += `<path data-l="${s} ${p.id}" d="M${x0.toFixed(1)} ${y0.toFixed(1)}C${mx.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}"/>`;
    });
  });
  smLinks.innerHTML = html;
  applyLinks(smSel);
}
function related(sel) {
  if (!sel) return null;
  const [k, id] = sel.split(':');
  if (k === 's') return { skills: new Set([id]), projects: new Set(PROJECTS.filter((p) => p.skills.includes(id)).map((p) => p.id)) };
  const p = PROJECTS.find((x) => x.id === id);
  return { skills: new Set(p.skills), projects: new Set([id]) };
}
function applyLinks(sel) {
  const rel = related(sel);
  smap.classList.toggle('has-sel', !!rel);
  $$('.sm-node').forEach((b) => {
    const [k, id] = b.dataset.sm.split(':');
    const on = rel && (k === 's' ? rel.skills.has(id) : rel.projects.has(id));
    b.classList.toggle('is-rel', !!on);
  });
  $$('path', smLinks).forEach((p) => {
    const [s, pid] = p.dataset.l.split(' ');
    let on = false;
    if (rel) { const [k, id] = sel.split(':'); on = k === 's' ? s === id : pid === id; }
    p.classList.toggle('is-on', on);
  });
}
$$('.sm-node').forEach((b) => {
  b.addEventListener('mouseenter', () => { if (!smSel) applyLinks(b.dataset.sm); });
  b.addEventListener('mouseleave', () => applyLinks(smSel));
  b.addEventListener('click', () => {
    smSel = smSel === b.dataset.sm ? null : b.dataset.sm;
    $$('.sm-node').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.sm === smSel)));
    applyLinks(smSel);
    if (!smSel) { smRead.textContent = 'Select a skill or a project to trace its connections.'; return; }
    const [k, id] = smSel.split(':');
    if (k === 's') {
      const ps = PROJECTS.filter((p) => p.skills.includes(id)).map((p) => p.name);
      smRead.textContent = `${skillById(id).name} is used in ${ps.length} project${ps.length > 1 ? 's' : ''}: ${ps.join(', ')}.`;
    } else {
      const p = PROJECTS.find((x) => x.id === id);
      smRead.textContent = `${p.name} needs ${p.skills.map((s) => skillById(s).name).join(', ')}.`;
    }
  });
});
function updateSkillMapState() {
  const have = new Set(board.set);
  $$('.sm-skill').forEach((b) => b.classList.toggle('is-have', have.has(b.dataset.sm.slice(2))));
  $$('.sm-project').forEach((b) => b.classList.toggle('is-have', unlocked.has(b.dataset.sm.slice(2))));
}
let smW = 0;
const smRO = () => { if (smap.clientWidth !== smW) { smW = smap.clientWidth; drawLinks(); } };
if ('ResizeObserver' in window) new ResizeObserver(smRO).observe(smap);
addEventListener('load', drawLinks);
drawLinks();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLinks);

/* ------------------------------------------------------------------ */
/* Courses — sign-up sheet                                              */
/* ------------------------------------------------------------------ */
const sheet = $('[data-sheet]');
const filt = { track: 'all', formats: new Set(['Evening', 'Weekend', 'Intensive']), level: -1 };
sheet.innerHTML = COURSES.map((c, i) => {
  const s = skillById(c.skill);
  return `<li class="row" data-id="${c.id}">
    <span class="row-n" aria-hidden="true">${pad2(i + 1)}</span>
    <div class="row-main"><h3 class="row-title">${c.title}</h3><p class="row-blurb">${c.blurb}</p></div>
    <p class="row-track"><span class="pill plate-${TRACKS[c.track].plate}">${TRACKS[c.track].name}</span></p>
    <p class="row-fmt"><b>${c.format}</b><span>${c.length}</span></p>
    <p class="row-lv">${COURSE_LEVELS[c.level]}</p>
    <button type="button" class="row-hang" data-hang="${c.skill}">${icon(c.skill, 'row-ico')}<span>Hang ${s.name}</span></button>
  </li>`;
}).join('');
function renderSheet() {
  let n = 0;
  $$('.row', sheet).forEach((row) => {
    const c = COURSES.find((x) => x.id === row.dataset.id);
    const show = (filt.track === 'all' || c.track === filt.track) && filt.formats.has(c.format) && (filt.level < 0 || c.level === filt.level);
    row.hidden = !show;
    if (show) n++;
  });
  $('[data-sheet-count]').textContent = `${n} of ${COURSES.length} courses`;
  $('[data-sheet-empty]').hidden = n > 0;
  syncHangButtons();
}
function syncHangButtons() {
  const have = new Set(board.set);
  $$('[data-hang]').forEach((b) => {
    const on = have.has(b.dataset.hang);
    b.classList.toggle('is-on', on);
    b.querySelector('span').textContent = `${on ? 'On board: ' : 'Hang '}${skillById(b.dataset.hang).name}`;
  });
}
$$('[data-ftrack]').forEach((b) => b.addEventListener('click', () => {
  filt.track = b.dataset.ftrack;
  $$('[data-ftrack]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderSheet();
}));
$$('[data-fformat]').forEach((b) => b.addEventListener('click', () => {
  const f = b.dataset.fformat;
  if (filt.formats.has(f)) filt.formats.delete(f); else filt.formats.add(f);
  b.setAttribute('aria-pressed', String(filt.formats.has(f)));
  renderSheet();
}));
$$('[data-flevel]').forEach((b) => b.addEventListener('click', () => {
  filt.level = +b.dataset.flevel;
  $$('[data-flevel]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderSheet();
}));
sheet.addEventListener('click', (e) => {
  const b = e.target.closest('[data-hang]');
  if (!b) return;
  const id = b.dataset.hang;
  if (board.set.includes(id)) board.unhang(id, false); else board.hang(id, undefined, false);
  syncHangButtons();
});
renderSheet();

/* ------------------------------------------------------------------ */
/* Projects — plates + dialog                                           */
/* ------------------------------------------------------------------ */
const plates = $('[data-plates]');
let pFilter = 'all';
const SPAN = ['w6', 'w3', 'w3', 'w4', 'w4', 'w4', 'w3', 'w3', 'w6', 'w6'];
function renderPlates() {
  let n = 0;
  plates.innerHTML = PROJECTS.map((p, i) => {
    const show = pFilter === 'all' || (pFilter === 'unlocked' ? unlocked.has(p.id) : p.level === +pFilter);
    if (!show) return '';
    n++;
    return `<li class="plate ${SPAN[i]}${unlocked.has(p.id) ? ' is-unlocked' : ''}" style="--tilt:${((i * 37) % 5) - 2}deg">
      <button type="button" class="plate-btn" data-open-project="${p.id}" aria-haspopup="dialog">
        <span class="plate-art">${blueprint(p.art, `P${pad2(i + 1)} · ${p.name.toUpperCase()}`)}</span>
        <span class="plate-label"><span class="plate-name">${p.name}</span><span class="plate-meta">${LEVELS[p.level]} · ${p.hours} h</span>
        <span class="plate-skills">${p.skills.map((s) => `<span class="ps" title="${skillById(s).name}">${icon(s, 'ps-ico')}<span class="sr-only">${skillById(s).name}</span></span>`).join('')}</span></span>
        <span class="plate-tape" aria-hidden="true"></span>
        ${unlocked.has(p.id) ? '<span class="plate-stamp" aria-hidden="true">Unlocked</span>' : ''}
      </button></li>`;
  }).join('');
  $('[data-pr-count]').textContent = pFilter === 'unlocked' && n === 0 ? 'Nothing unlocked yet — hang a few skills on the pegboard first.' : `Showing ${n} of ${PROJECTS.length} projects.`;
}
function setPFilter(f) {
  pFilter = f;
  $$('[data-pfilter]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.pfilter === f)));
  renderPlates();
}
$$('[data-pfilter]').forEach((b) => b.addEventListener('click', () => setPFilter(b.dataset.pfilter)));
renderPlates();

const dlg = $('#project-dialog');
let dlgProject = null; let dlgTrigger = null;
function openProject(id, trigger) {
  const p = PROJECTS.find((x) => x.id === id); const i = PROJECTS.indexOf(p);
  dlgProject = p; dlgTrigger = trigger;
  const set = (k, v) => { $(`[data-pd="${k}"]`, dlg).textContent = v; };
  $('[data-pd="art"]', dlg).innerHTML = blueprint(p.art, `P${pad2(i + 1)} · ${p.name.toUpperCase()}`);
  set('kicker', `P${pad2(i + 1)} · ${LEVELS[p.level]} · about ${p.hours} hours`);
  set('name', p.name); set('blurb', p.blurb);
  const have = new Set(board.set);
  $('[data-pd="skills"]', dlg).innerHTML = p.skills.map((s) => `<li class="${have.has(s) ? 'is-have' : ''}">${icon(s, 'pd-ico')}<span>${skillById(s).name}</span><small>${have.has(s) ? 'on your board' : 'not yet'}</small></li>`).join('');
  $('[data-pd="bom"]', dlg).innerHTML = p.bom.map((b) => `<li>${b}</li>`).join('');
  $('[data-pd="steps"]', dlg).innerHTML = p.steps.map((s) => `<li>${s}</li>`).join('');
  const all = p.skills.every((s) => have.has(s));
  const hb = $('[data-hang-project]', dlg);
  hb.textContent = all ? 'All skills are on your board' : 'Hang these skills on my board';
  hb.disabled = all;
  if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  $('[data-close]', dlg).focus();
}
function closeProject() { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
dlg.addEventListener('close', () => { if (dlgTrigger && document.contains(dlgTrigger)) dlgTrigger.focus(); });
$('[data-close]', dlg).addEventListener('click', closeProject);
dlg.addEventListener('click', (e) => { if (e.target === dlg) closeProject(); });
$('[data-hang-project]', dlg).addEventListener('click', () => {
  const p = dlgProject;
  dlgTrigger = null;
  closeProject();
  const need = p.skills.filter((s) => !board.slots.includes(s));
  if (need.length > board.slots.filter((x) => !x).length) board.clear();
  $('#board').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  setTimeout(() => board.hangMany(p.skills), reduced ? 0 : 600);
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-open-project]');
  if (b) openProject(b.dataset.openProject, b);
});

/* ------------------------------------------------------------------ */
/* Workshop zones                                                       */
/* ------------------------------------------------------------------ */
const zones = $('[data-zones]');
zones.innerHTML = ZONES.map((z) => `<li class="zone">
  <div class="zone-frame">${zoneScene(z)}</div>
  <div class="zone-cap"><p class="zone-code">Zone ${z.code}</p><h3 class="zone-name">${z.name}</h3><p class="zone-text">${z.text}</p>
  <ul class="zone-tools" aria-label="Skills practised here">${z.tools.map((t) => `<li>${icon(t, 'zt-ico')}<span>${skillById(t).name}</span></li>`).join('')}</ul></div></li>`).join('');
$$('[data-ws]').forEach((b) => b.addEventListener('click', () => {
  const w = zones.querySelector('.zone').getBoundingClientRect().width + 24;
  zones.scrollBy({ left: b.dataset.ws === 'next' ? w : -w, behavior: reduced ? 'auto' : 'smooth' });
}));

/* ------------------------------------------------------------------ */
/* Join form                                                            */
/* ------------------------------------------------------------------ */
function renderJoinBoard() {
  const el = $('[data-jn-board]');
  const set = board.set;
  syncHangButtons();
  if (!set.length) { el.innerHTML = '<p class="jb-empty">Your pegboard is empty. Hang a few skills and we will suggest where to start.</p>'; return; }
  const first = PROJECTS.filter((p) => unlocked.has(p.id)).sort((a, b) => a.level - b.level)[0];
  el.innerHTML = `<p class="jb-k">From your pegboard</p><ul class="jb-tags">${set.map((s) => `<li>${icon(s, 'jb-ico')}${skillById(s).name}</li>`).join('')}</ul>
    <p class="jb-sug">${first ? `A good first build: <b>${first.name}</b>.` : 'Add one or two more skills to unlock a first build.'}</p>`;
}
const form = $('#join-form');
function fieldError(id, msg) {
  const input = $(`#${id}`); const err = $(`#${id}-err`);
  if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  err.textContent = msg || ''; err.hidden = !msg;
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').trim();
  const tracks = fd.getAll('tracks');
  const session = fd.get('session');
  const bad = [];
  if (name.length < 2) { fieldError('jn-name', 'Please tell us your name.'); bad.push('#jn-name'); } else fieldError('jn-name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { fieldError('jn-email', 'Please enter a valid email, like name@example.com.'); bad.push('#jn-email'); } else fieldError('jn-email');
  const tErr = $('#jn-tracks-err');
  if (!tracks.length) { tErr.textContent = 'Pick at least one thing you are curious about.'; tErr.hidden = false; bad.push('input[name="tracks"]'); } else tErr.hidden = true;
  if (!session) { fieldError('jn-session', 'Choose a taster session.'); bad.push('#jn-session'); } else fieldError('jn-session');
  const done = $('#jn-done');
  if (bad.length) { done.hidden = true; $(bad[0]).focus(); return; }
  done.innerHTML = '';
  const st = document.createElement('strong'); st.textContent = 'Spot requested — nothing was sent.';
  const p = document.createElement('p');
  const skills = board.set.map((s) => skillById(s).name);
  p.textContent = `Thanks, ${name}. This is a portfolio demo, so no booking was made and no email will arrive at ${email}. A real studio would hold you a place at the ${session.split(',')[0]} and lay out ${tracks.join(', ')} tools${skills.length ? `, starting from the ${skills.length} skill${skills.length > 1 ? 's' : ''} on your pegboard` : ''}.`;
  done.append(st, p); done.hidden = false; done.focus();
});
$$('#join-form input, #join-form select').forEach((el) => el.addEventListener('input', () => {
  if (el.getAttribute('aria-invalid') === 'true') fieldError(el.id);
  if (el.name === 'tracks') $('#jn-tracks-err').hidden = true;
}));

/* ------------------------------------------------------------------ */
/* Header, nav, reveals                                                 */
/* ------------------------------------------------------------------ */
const menuBtn = $('.menu-btn'); const nav = $('#nav');
function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  $('.menu-label').textContent = open ? 'Close' : 'Menu';
  if (open) $('a', nav).focus();
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
$$('a', nav).forEach((a) => a.addEventListener('click', () => { if (nav.classList.contains('is-open')) setMenu(false); }));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
if ('IntersectionObserver' in window) {
  const links = $$('a', nav);
  const nio = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => { if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach((s) => nio.observe(s));
  if (!reduced) {
    const rio = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); } }), { threshold: 0.15 });
    $$('.sec-head, .smap, .filters, .zone, .jn-form').forEach((el) => { el.classList.add('pin'); rio.observe(el); });
  }
}

onBoardChange(board.set, { announce: false });
