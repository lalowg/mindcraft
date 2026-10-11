/* MINDCRAFT — hand-built SVG drawings: blueprint project plates,
   tool icons, hanging tags and workshop zone vignettes. */
import { ICONS } from './data.js';

export const icon = (id, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICONS[id]}"/></svg>`;

function gear(cx, cy, r, teeth) {
  const pts = [];
  const ri = r * 0.8;
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? ri : r;
    pts.push([cx + rr * Math.cos(a0), cy + rr * Math.sin(a0)], [cx + rr * Math.cos(a1), cy + rr * Math.sin(a1)]);
  }
  return `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}"/>`;
}
const dim = (x1, x2, y, label) => `<g class="bp-dim"><path d="M${x1} ${y}H${x2}M${x1} ${y - 4}v8M${x2} ${y - 4}v8"/><text x="${(x1 + x2) / 2}" y="${y - 5}">${label}</text></g>`;

const DRAW = {
  stand: () => `<path d="M40 112H160V120H40Z"/><path d="M66 112L116 36L128 40L80 112Z"/><path class="bp-ghost" d="M104 28L152 98L140 106L92 36Z"/><path d="M128 40L146 66"/>${dim(40, 160, 138, '120')}<text class="bp-note" x="150" y="30">phone · ghost</text>`,
  patch: () => `<circle cx="100" cy="72" r="44"/><circle class="bp-ghost" cx="100" cy="72" r="36"/><circle cx="100" cy="40" r="5"/><circle cx="132" cy="72" r="5"/><circle cx="100" cy="104" r="5"/><circle cx="68" cy="72" r="5"/><circle cx="100" cy="72" r="11"/><path d="M100 45V61M127 72H111M100 99V83M73 72H89"/>${dim(56, 144, 136, 'ø 88')}`,
  prints: () => `<rect x="24" y="30" width="46" height="70"/><rect x="77" y="30" width="46" height="70"/><rect x="130" y="30" width="46" height="70"/><circle cx="47" cy="65" r="18"/><circle cx="47" cy="65" r="11"/><circle cx="47" cy="65" r="4"/><path d="M80 44l40 40M80 58l26 26M80 72l12 12M94 33l26 26M108 33l12 12"/><circle cx="141" cy="42" r="2.5"/><circle cx="153" cy="42" r="2.5"/><circle cx="165" cy="42" r="2.5"/><circle cx="141" cy="56" r="4"/><circle cx="153" cy="56" r="4"/><circle cx="165" cy="56" r="4"/><circle cx="141" cy="72" r="5.5"/><circle cx="153" cy="72" r="5.5"/><circle cx="165" cy="72" r="5.5"/><circle cx="147" cy="88" r="3"/><circle cx="159" cy="88" r="3"/>${dim(24, 176, 124, 'series of 3 · A5')}`,
  stool: () => `<path d="M48 48H152L142 60H58Z"/><path d="M62 60L52 126H64L72 60M138 60L148 126H136L128 60"/><path d="M58 96H142"/><path class="bp-ghost" d="M92 48V60M108 48V60"/>${dim(48, 152, 140, '450')}<text class="bp-note" x="154" y="98">slot joint</text>`,
  synth: () => `<rect x="30" y="38" width="140" height="82" rx="8"/><circle cx="56" cy="60" r="9"/><circle cx="84" cy="60" r="9"/><circle cx="112" cy="60" r="9"/><path d="M56 60V52M84 60l6-6M112 60l-7 4"/><circle cx="148" cy="56" r="2"/><circle cx="156" cy="56" r="2"/><circle cx="148" cy="64" r="2"/><circle cx="156" cy="64" r="2"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${40 + i * 15}" y="84" width="11" height="26" rx="2"/>`).join('')}${dim(30, 170, 140, '140 × 82')}`,
  lamp: () => `<ellipse cx="96" cy="126" rx="34" ry="6"/><path d="M96 126L78 76L132 40"/><circle cx="78" cy="76" r="4"/><circle cx="132" cy="40" r="4"/><path d="M132 40L166 58L152 72Z"/><path class="bp-ghost" d="M159 65L176 120M159 65L132 122"/><text class="bp-note" x="20" y="70">oak arm</text>${dim(62, 130, 142, '68')}`,
  kinetic: () => `<g>${gear(76, 70, 34, 12)}${gear(130, 52, 22, 9)}${gear(138, 104, 18, 8)}</g><path class="bp-ghost" d="M20 20H180V130H20Z"/>`,
  plant: () => `<path d="M68 92H132L124 132H76Z"/><path d="M100 92C96 70 80 60 66 58C70 74 82 86 100 92ZM100 92C104 66 122 54 140 54C134 72 120 86 100 92ZM100 92V48"/><rect x="114" y="74" width="7" height="40"/><path d="M117.5 74V30H160"/><rect x="160" y="22" width="24" height="18" rx="3"/>${dim(68, 132, 146, 'pot ø 64')}`,
  weather: () => `<path d="M100 132V58"/><rect x="82" y="88" width="36" height="28" rx="3"/><path d="M90 96h20M90 104h12"/><circle cx="100" cy="52" r="4"/><path d="M100 52L64 40M100 52L136 40M100 52V18"/><circle cx="60" cy="40" r="8"/><circle cx="140" cy="40" r="8"/><circle cx="100" cy="14" r="8"/><path d="M84 132h32"/><text class="bp-note" x="124" y="104">sensors</text>`,
  speaker: () => `<rect x="44" y="30" width="112" height="100" rx="4"/><circle cx="100" cy="96" r="24"/><circle cx="100" cy="96" r="13"/><circle cx="100" cy="96" r="3"/><circle cx="100" cy="56" r="10"/><circle cx="100" cy="56" r="4"/><path class="bp-ghost" d="M50 36H150V124H50Z"/>${dim(44, 156, 144, '112 · walnut')}`,
};

export function blueprint(artId, label) {
  return `<svg class="bp" viewBox="0 0 200 150" aria-hidden="true" focusable="false"><g class="bp-draw">${DRAW[artId]()}</g><text class="bp-tag" x="8" y="146">${label}</text></svg>`;
}

/* a workshop zone vignette: pegboard wall, hung tools, bench, pendant lamp */
const ACCENT = { wood: '#F26B1D', bench: '#2F5DA8', fab: '#F26B1D', textile: '#2F5DA8', finish: '#26221E' };
export function zoneScene(zone) {
  const id = `z-${zone.id}`;
  const acc = ACCENT[zone.id];
  const tools = zone.tools.map((t, i) => {
    const x = 70 + i * 66; const y = 46 + (i % 2) * 10;
    const fill = i === 1 ? acc : (i === 0 ? '#26221E' : '#E8DCC4');
    const ink = fill === '#E8DCC4' ? '#26221E' : '#E8DCC4';
    return `<g transform="translate(${x} ${y}) rotate(${(i - 1) * 4})"><circle cx="20" cy="-6" r="2.4" fill="#26221E"/><path d="M20 -6L10 6H30Z" fill="none" stroke="#26221E" stroke-width="1.5"/><rect x="0" y="4" width="40" height="40" rx="5" fill="${fill}" stroke="#26221E" stroke-width="2"/><g transform="translate(8 12) scale(1)"><path d="${ICONS[t]}" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  }).join('');
  return `<svg class="zone-art" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
<defs>
<pattern id="${id}-peg" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2.2" fill="#8E7A58"/></pattern>
<linearGradient id="${id}-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D9" stop-opacity=".75"/><stop offset="1" stop-color="#FFF4D9" stop-opacity="0"/></linearGradient>
</defs>
<rect width="320" height="220" fill="#D8C7A4"/>
<rect width="320" height="150" fill="url(#${id}-peg)"/>
<path d="M0 150H320V220H0Z" fill="#B9A47E"/>
<path d="M250 0V36" stroke="#26221E" stroke-width="2"/>
<path d="M232 36H268L276 52H224Z" fill="${acc}" stroke="#26221E" stroke-width="2"/>
<path d="M226 52H274L300 150H200Z" fill="url(#${id}-cone)"/>
${tools}
<rect x="20" y="140" width="280" height="14" fill="#26221E"/>
<path d="M36 154V214M284 154V214" stroke="#26221E" stroke-width="6"/>
<rect x="56" y="118" width="46" height="22" fill="#E8DCC4" stroke="#26221E" stroke-width="2"/>
<rect x="66" y="108" width="24" height="10" fill="${acc}" stroke="#26221E" stroke-width="2"/>
<rect x="210" y="124" width="60" height="16" rx="3" fill="#2F5DA8" stroke="#26221E" stroke-width="2"/>
<circle cx="150" cy="132" r="8" fill="#F26B1D" stroke="#26221E" stroke-width="2"/>
<text x="18" y="30" font-family="Anybody, sans-serif" font-weight="800" font-size="30" fill="#26221E" opacity=".9">${zone.code}</text>
</svg>`;
}
