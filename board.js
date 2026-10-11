/* MINDCRAFT — the pegboard.
   Skill tags live in a tool tray (a shadow board) and snap onto peg slots.
   Pointer drag with snapping, or a press to hang / take down. Tags fly
   between places with a FLIP spring and swing on their peg when they land. */
import { SKILLS, TRACKS, PROJECTS } from './data.js';
import { icon } from './art.js';

const PITCH = 24;
const NS = 'http://www.w3.org/2000/svg';

export class Pegboard {
  constructor({ board, pegs, tray, strings, slotsLayer, reduced = false, onChange = () => {}, initial = [] }) {
    Object.assign(this, { board, pegs, tray, strings, slotsLayer, reduced, onChange });
    this.slots = new Array(12).fill(null);
    this.tags = {};
    this.trayLis = {};
    this.geo = null;
    this.drag = null;
    this.suppress = false;
    SKILLS.forEach((s) => this._makeTag(s));
    for (let i = 0; i < 12; i++) { const d = document.createElement('div'); d.className = 'slot'; slotsLayer.append(d); }
    this.layout();
    initial.forEach((id, i) => { if (id && this.tags[id] && i < 12) { this.slots[i] = id; this._place(id, i, false); } });
    this._refresh(false);
    if ('ResizeObserver' in window) { new ResizeObserver(() => this.layout()).observe(board); }
    window.addEventListener('pointermove', (e) => this._move(e));
    window.addEventListener('pointerup', (e) => this._up(e));
    window.addEventListener('pointercancel', (e) => this._cancel(e));
    this.ready = true;
  }

  _makeTag(s) {
    const track = TRACKS[s.track];
    const li = document.createElement('li');
    li.className = 'tray-slot';
    li.dataset.skill = s.id;
    li.innerHTML = `<span class="tray-shadow" aria-hidden="true">${icon(s.id, 'shadow-ico')}<span>${s.name}</span></span>`;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `tag plate-${track.plate}`;
    b.dataset.skill = s.id;
    b.innerHTML = `<span class="tag-body"><span class="tag-hole" aria-hidden="true"></span>${icon(s.id, 'tag-ico')}<span class="tag-name">${s.name}</span><span class="tag-track">${track.name}</span><span class="tag-grommet" aria-hidden="true"></span></span>`;
    b.addEventListener('click', () => { if (this.suppress) { this.suppress = false; return; } this.toggle(s.id, true); });
    b.addEventListener('pointerdown', (e) => this._down(e, s.id));
    li.append(b);
    this.tray.append(li);
    this.tags[s.id] = b;
    this.trayLis[s.id] = li;
    this._label(s.id);
  }

  _label(id) {
    const s = SKILLS.find((x) => x.id === id);
    const hung = this.slots.includes(id);
    this.tags[id].setAttribute('aria-label', hung ? `Take ${s.name} off the board` : `Hang ${s.name} on the board (${TRACKS[s.track].name})`);
  }

  /* ---------------------------------------------------------- geometry */
  layout() {
    const W = this.board.clientWidth; const H = this.board.clientHeight;
    if (!W || !H) return;
    const cols = W >= 520 ? 4 : 3; const rows = 12 / cols;
    const pad = W >= 520 ? 22 : 12;
    const bottom = W >= 520 ? 40 : 30;
    const sw = (W - pad * 2) / cols; const sh = (H - pad - bottom) / rows;
    const tw = Math.round(Math.min(136, sw - 14)); const th = Math.round(Math.min(tw * 0.84, sh - 14));
    this.board.style.setProperty('--tw', `${tw}px`);
    this.board.style.setProperty('--th', `${th}px`);
    const snap = (v) => PITCH / 2 + PITCH * Math.round((v - PITCH / 2) / PITCH);
    const pos = [];
    for (let i = 0; i < 12; i++) {
      const c = i % cols; const r = Math.floor(i / cols);
      const cx = pad + sw * c + sw / 2; const top = pad + sh * r + (sh - th) / 2;
      const hx = snap(cx); const hy = snap(top + 9);
      pos.push({ x: hx - tw / 2, y: hy - 9, cx: hx, cy: hy - 9 + th / 2, hx, hy, sx: pad + sw * c, sy: pad + sh * r, sw, sh });
    }
    this.geo = { W, H, cols, tw, th, pos };
    Array.from(this.slotsLayer.children).forEach((d, i) => {
      const p = pos[i];
      d.style.left = `${p.x - 6}px`; d.style.top = `${p.y - 6}px`; d.style.width = `${tw + 12}px`; d.style.height = `${th + 12}px`;
    });
    this.slots.forEach((id, i) => { if (id) this._place(id, i, false); });
    this._strings(false);
  }

  _place(id, i, animate) {
    const b = this.tags[id];
    if (!this.geo) { this.pegs.append(b); b.classList.add('is-hung'); return; }
    const p = this.geo.pos[i];
    const had = document.activeElement === b;
    const first = b.getBoundingClientRect();
    if (b.parentElement !== this.pegs) this.pegs.append(b);
    b.classList.add('is-hung');
    b.style.left = `${p.x}px`; b.style.top = `${p.y}px`;
    this._settle(b, first, animate, true);
    if (had) b.focus({ preventScroll: true });
  }

  _unplace(id, animate) {
    const b = this.tags[id];
    const had = document.activeElement === b;
    const first = b.getBoundingClientRect();
    this.trayLis[id].append(b);
    b.classList.remove('is-hung');
    b.style.left = ''; b.style.top = '';
    this._settle(b, first, animate, false);
    if (had) b.focus({ preventScroll: true });
  }

  _settle(b, first, animate, swing) {
    b.style.transition = 'none';
    b.style.transform = '';
    b.classList.remove('is-dragging');
    if (!animate || this.reduced || !first.width) return;
    const last = b.getBoundingClientRect();
    const dx = first.left - last.left; const dy = first.top - last.top;
    const sx = first.width / last.width; const sy = first.height / last.height;
    b.style.transformOrigin = '0 0';
    b.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    b.classList.add('is-flying');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      b.style.transition = 'transform .62s cubic-bezier(.34, 1.45, .64, 1)';
      b.style.transform = '';
      setTimeout(() => {
        b.classList.remove('is-flying');
        b.style.transition = ''; b.style.transformOrigin = '';
        if (swing) { b.classList.remove('swing'); void b.offsetWidth; b.classList.add('swing'); }
      }, 620);
    }));
  }

  /* ---------------------------------------------------------- state */
  get set() { return this.slots.filter(Boolean); }
  toggle(id, animate = true) { if (this.slots.includes(id)) this.unhang(id, animate); else this.hang(id, undefined, animate); }
  hang(id, slot, animate = true) {
    if (this.slots.includes(id)) return;
    const i = slot !== undefined && !this.slots[slot] ? slot : this.slots.indexOf(null);
    if (i < 0) return;
    this.slots[i] = id;
    this._place(id, i, animate);
    this._refresh(true, id, null);
  }
  unhang(id, animate = true) {
    const i = this.slots.indexOf(id);
    if (i < 0) return;
    this.slots[i] = null;
    this._unplace(id, animate);
    this._refresh(true, null, id);
  }
  clear() { this.set.forEach((id) => { const i = this.slots.indexOf(id); this.slots[i] = null; this._unplace(id, true); }); this._refresh(true, null, null); }
  hangMany(ids) {
    let k = 0;
    ids.forEach((id) => {
      if (this.slots.includes(id)) return;
      const i = this.slots.indexOf(null); if (i < 0) return;
      this.slots[i] = id;
      setTimeout(() => this._place(id, i, true), this.reduced ? 0 : k * 120);
      k++;
    });
    setTimeout(() => this._refresh(true, ids[ids.length - 1], null), this.reduced ? 0 : k * 120 + 40);
  }
  _refresh(announce, added, removed) {
    this.board.classList.toggle('has-tags', this.set.length > 0);
    SKILLS.forEach((s) => this._label(s.id));
    this._strings(announce);
    if (this.ready) this.onChange(this.set, { added, removed, announce });
  }

  /* ---------------------------------------------------------- strings */
  _strings(animate) {
    const svg = this.strings; const g = this.geo;
    if (!g) return;
    svg.setAttribute('viewBox', `0 0 ${g.W} ${g.H}`);
    const have = new Set(this.set);
    const unlocked = PROJECTS.filter((p) => p.skills.every((s) => have.has(s)));
    const prev = this._drawn || new Set();
    const now = new Set(unlocked.map((p) => p.id));
    svg.innerHTML = '';
    unlocked.forEach((p, k) => {
      const pts = p.skills.map((s) => this.slots.indexOf(s)).sort((a, b) => a - b).map((i) => {
        const q = g.pos[i]; return [q.hx, q.y + g.th - 9];
      });
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i];
        const sag = 22 + Math.hypot(x1 - x0, y1 - y0) * 0.1 + (k % 4) * 7;
        d += `Q${(x0 + x1) / 2} ${Math.max(y0, y1) + sag} ${x1} ${y1}`;
      }
      const grp = document.createElementNS(NS, 'g');
      grp.setAttribute('class', 'str');
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('pathLength', '100');
      if (animate && !prev.has(p.id) && !this.reduced) path.classList.add('draw');
      grp.append(path);
      pts.forEach(([x, y]) => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 3.2); grp.append(c); });
      const n = PROJECTS.indexOf(p) + 1;
      const [ax, ay] = pts[0]; const [bx, by] = pts[1];
      const mx = (ax + bx) / 2; const my = Math.max(ay, by) + 12 + (k % 4) * 4;
      const badge = document.createElementNS(NS, 'g');
      badge.setAttribute('class', 'str-badge');
      badge.innerHTML = `<rect x="${mx - 15}" y="${my - 9}" width="30" height="18" rx="9"/><text x="${mx}" y="${my + 4}">P${String(n).padStart(2, '0')}</text>`;
      grp.append(badge);
      svg.append(grp);
    });
    this._drawn = now;
  }

  /* ---------------------------------------------------------- dragging */
  _down(e, id) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.drag = { id, b: this.tags[id], x0: e.clientX, y0: e.clientY, active: false, pid: e.pointerId, target: -1 };
  }
  _move(e) {
    const d = this.drag;
    if (!d || d.pid !== e.pointerId) return;
    const dx = e.clientX - d.x0; const dy = e.clientY - d.y0;
    if (!d.active) {
      if (Math.hypot(dx, dy) < 7) return;
      d.active = true;
      d.b.classList.add('is-dragging');
      this.board.classList.add('is-dragging');
    }
    e.preventDefault();
    const rot = Math.max(-9, Math.min(9, dx * 0.04));
    d.b.style.transition = 'none';
    d.b.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.06)`;
    d.target = this._nearest(e.clientX, e.clientY, d.id);
    Array.from(this.slotsLayer.children).forEach((s, i) => s.classList.toggle('is-target', i === d.target));
  }
  _nearest(cx, cy, id) {
    if (!this.geo) return -1;
    const r = this.board.getBoundingClientRect();
    if (cx < r.left - 30 || cx > r.right + 30 || cy < r.top - 30 || cy > r.bottom + 10) return -1;
    const x = cx - r.left; const y = cy - r.top;
    let best = -1; let bd = Infinity;
    this.geo.pos.forEach((p, i) => {
      if (this.slots[i] && this.slots[i] !== id) return;
      const dd = Math.hypot(p.cx - x, p.cy - y);
      if (dd < bd) { bd = dd; best = i; }
    });
    return best;
  }
  _up(e) {
    const d = this.drag;
    if (!d || d.pid !== e.pointerId) return;
    this.drag = null;
    this.board.classList.remove('is-dragging');
    Array.from(this.slotsLayer.children).forEach((s) => s.classList.remove('is-target'));
    if (!d.active) return;
    this.suppress = true;
    setTimeout(() => { this.suppress = false; }, 80);
    const cur = this.slots.indexOf(d.id);
    if (d.target >= 0) {
      if (cur >= 0) { this.slots[cur] = null; this.slots[d.target] = d.id; this._place(d.id, d.target, true); this._refresh(false, null, null); }
      else { this.slots[d.target] = d.id; this._place(d.id, d.target, true); this._refresh(true, d.id, null); }
    } else if (cur >= 0) {
      this.slots[cur] = null; this._unplace(d.id, true); this._refresh(true, null, d.id);
    } else {
      this._springBack(d.b);
    }
  }
  _cancel(e) {
    const d = this.drag;
    if (!d || d.pid !== e.pointerId) return;
    this.drag = null;
    this.board.classList.remove('is-dragging');
    Array.from(this.slotsLayer.children).forEach((s) => s.classList.remove('is-target'));
    if (d.active) this._springBack(d.b);
  }
  _springBack(b) {
    b.classList.remove('is-dragging');
    if (this.reduced) { b.style.transform = ''; return; }
    b.style.transition = 'transform .5s cubic-bezier(.34, 1.45, .64, 1)';
    b.style.transform = '';
    setTimeout(() => { b.style.transition = ''; }, 520);
  }
}
