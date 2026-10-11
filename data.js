/* MINDCRAFT — skills, projects, courses and workshop zones.
   Fictional studio content written for a portfolio concept. */

export const TRACKS = {
  design: { name: 'Design', plate: 'blue' },
  fab: { name: 'Fabrication', plate: 'safety' },
  electronics: { name: 'Electronics', plate: 'charcoal' },
  code: { name: 'Code', plate: 'blue' },
  craft: { name: 'Hand craft', plate: 'wood' },
};

/* 24×24 stroke icons drawn for the studio */
export const ICONS = {
  sketch: 'M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19zM13.5 7l3.5 3.5M4 20l4.5-1',
  cad: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  print: 'M4 4h16v4H4zM9 8v3h6V8M12 11v2.5M7 20h10M9 17.5h6',
  laser: 'M12 2.5V9M8.5 9h7L12 14zM12 14l-1.5 2.5h3zM4 20h16M6.5 17.5l2-1M17.5 17.5l-2-1',
  wood: 'M3 15l11-9 4 4-9 11zM6.5 13.5l1.5 1.5M9.5 11l1.5 1.5M12.5 8.5l1.5 1.5M17 7l3.5-3.5',
  solder: 'M3 21l5.5-5.5M8.5 15.5l2.8 2.8 8.2-8.2-2.8-2.8zM14.5 7.5l2 2M18 3l3 3',
  circuits: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4M10 10h4v4h-4z',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  textiles: 'M19.5 4.5L7 17M17 3l4 4M7 17c-2.5 2.5-4.8 1.4-3.4-.6S9 14.8 6 19.5',
  finish: 'M14 3l7 7-5.5 2L12 8.5zM12 8.5l-7.2 7.2a2.1 2.1 0 0 0 3 3l7.7-6.7',
};

export const SKILLS = [
  { id: 'sketch',   name: 'Sketching',     track: 'design',      note: 'Get ideas out of your head and onto paper fast: perspective, exploded views, annotation.' },
  { id: 'cad',      name: '3D Modelling',  track: 'design',      note: 'Parametric CAD: sketches, constraints and parts that change when your idea does.' },
  { id: 'print',    name: '3D Printing',   track: 'fab',         note: 'Slicing, supports, tolerances and the patience to print it twice.' },
  { id: 'laser',    name: 'Laser Cutting', track: 'fab',         note: 'Vector files, kerf, living hinges and joints that click together without glue.' },
  { id: 'wood',     name: 'Woodworking',   track: 'craft',       note: 'Saws, chisels and planes. Measure twice, cut once, sand forever.' },
  { id: 'solder',   name: 'Soldering',     track: 'electronics', note: 'Clean joints, through-hole and surface-mount, plus the art of desoldering.' },
  { id: 'circuits', name: 'Circuits',      track: 'electronics', note: 'Breadboards, microcontrollers and sensors. Make things blink, buzz and listen.' },
  { id: 'code',     name: 'Creative Code', track: 'code',        note: 'Programs that move motors, read sensors and draw patterns for the laser.' },
  { id: 'textiles', name: 'E-textiles',    track: 'craft',       note: 'Conductive thread, sewable LEDs and garments that react to the room.' },
  { id: 'finish',   name: 'Finishing',     track: 'craft',       note: 'Sanding, oils, paint and lacquer: the last 10% that people notice first.' },
];

export const LEVELS = ['Starter', 'Intermediate', 'Advanced'];

export const PROJECTS = [
  { id: 'stand',   name: 'Phone Stand',          level: 0, hours: 6,  skills: ['cad', 'print'],                     art: 'stand',   blurb: 'Model a stand around your own phone, print it, and fix the tolerances on version two.', bom: ['PLA filament, about 60 g', 'Four rubber feet'], steps: ['Measure your phone', 'Model a parametric stand', 'Print and test the fit', 'Adjust and reprint'] },
  { id: 'patch',   name: 'Glow Patch',           level: 0, hours: 5,  skills: ['textiles', 'circuits'],             art: 'patch',   blurb: 'A sew-on patch with LEDs stitched in conductive thread that lights when you press it.', bom: ['Felt and conductive thread', 'Four sewable LEDs', 'Coin-cell holder and battery'], steps: ['Sketch the circuit', 'Stitch the traces', 'Add LEDs and battery', 'Test and seal'] },
  { id: 'prints',  name: 'Generative Prints',    level: 0, hours: 6,  skills: ['code', 'laser'],                    art: 'prints',  blurb: 'Write a short program that draws patterns, then etch them into card and plywood.', bom: ['3 mm plywood offcuts', 'Heavy card'], steps: ['Write a pattern sketch', 'Export as vectors', 'Test etch settings', 'Cut a series of three'] },
  { id: 'stool',   name: 'Flat-pack Stool',      level: 1, hours: 14, skills: ['sketch', 'wood', 'finish'],         art: 'stool',   blurb: 'Design a stool that slots together without screws, then cut, fit and oil it.', bom: ['18 mm birch ply, half sheet', 'Hard-wax oil'], steps: ['Sketch and full-size template', 'Cut the parts', 'Fit the joints', 'Sand and oil'] },
  { id: 'synth',   name: 'Pocket Synth',         level: 1, hours: 12, skills: ['circuits', 'solder', 'laser'],      art: 'synth',   blurb: 'A tiny noise-maker with knobs and keys, soldered by hand in a laser-cut case.', bom: ['Synth PCB kit', 'Potentiometers and tactile switches', '3 mm acrylic case'], steps: ['Breadboard the oscillator', 'Solder the board', 'Cut the case', 'Assemble and play'] },
  { id: 'lamp',    name: 'Desk Lamp',            level: 1, hours: 16, skills: ['wood', 'circuits', 'solder'],       art: 'lamp',    blurb: 'A jointed oak lamp with a dimmable LED head you wire and solder yourself.', bom: ['Oak offcuts', 'LED module and dimmer', 'USB-C power board'], steps: ['Cut and joint the arm', 'Wire the dimmer', 'Solder the head', 'Assemble and finish'] },
  { id: 'kinetic', name: 'Kinetic Wall Piece',   level: 1, hours: 12, skills: ['sketch', 'laser', 'finish'],        art: 'kinetic', blurb: 'Interlocking laser-cut gears that turn with a gentle push and throw shadows on the wall.', bom: ['3 mm plywood', 'Brass pins', 'Acrylic paint'], steps: ['Sketch the mechanism', 'Draw the gears', 'Cut and test', 'Paint and mount'] },
  { id: 'plant',   name: 'Plant Monitor',        level: 1, hours: 10, skills: ['circuits', 'code', 'print'],        art: 'plant',   blurb: 'A soil probe that tells you, politely, when your plant is thirsty.', bom: ['Microcontroller board', 'Capacitive moisture sensor', 'Printed enclosure'], steps: ['Read the sensor', 'Write the alert logic', 'Print the enclosure', 'Calibrate on a real plant'] },
  { id: 'weather', name: 'Weather Station',      level: 2, hours: 24, skills: ['cad', 'print', 'circuits', 'code'], art: 'weather', blurb: 'A rooftop-ready station with a printed anemometer, sensors and a live dashboard.', bom: ['Microcontroller with Wi-Fi', 'Temperature and humidity sensor', 'Printed anemometer cups', 'Weatherproof box'], steps: ['Model the anemometer', 'Print and balance it', 'Wire the sensors', 'Code the dashboard'] },
  { id: 'speaker', name: 'Walnut Speaker',       level: 2, hours: 22, skills: ['cad', 'wood', 'solder', 'finish'],  art: 'speaker', blurb: 'A Bluetooth speaker in a solid walnut box, tuned, soldered and oiled to a deep shine.', bom: ['Walnut board', 'Bluetooth amplifier board', 'Two full-range drivers'], steps: ['Model the enclosure volume', 'Cut and glue the box', 'Solder the amplifier', 'Finish and tune'] },
];

export const COURSES = [
  { id: 'c1',  title: 'Sketching for Makers',          track: 'design',      format: 'Evening',   length: '4 Tuesdays',        level: 0, skill: 'sketch',   blurb: 'Fast, confident drawing for people who build: perspective, exploded views and annotated ideas.' },
  { id: 'c2',  title: 'Parametric CAD from Zero',      track: 'design',      format: 'Evening',   length: '6 Wednesdays',      level: 0, skill: 'cad',      blurb: 'Model parts that adapt when measurements change, and export them for printing or cutting.' },
  { id: 'c3',  title: '3D Printing in Practice',       track: 'fab',         format: 'Weekend',   length: '2 days',            level: 0, skill: 'print',    blurb: 'From slicer settings to print failures and fixes, leaving with three printed parts.' },
  { id: 'c4',  title: 'Laser Cutting & Joints',        track: 'fab',         format: 'Weekend',   length: '2 days',            level: 0, skill: 'laser',    blurb: 'Kerf, finger joints and living hinges. Make a box that closes with a satisfying click.' },
  { id: 'c5',  title: 'First Circuits',                track: 'electronics', format: 'Evening',   length: '6 Thursdays',       level: 0, skill: 'circuits', blurb: 'Voltage, current and breadboards, then a microcontroller that reads a sensor.' },
  { id: 'c6',  title: 'Soldering & Repair Clinic',     track: 'electronics', format: 'Weekend',   length: '1 day',             level: 0, skill: 'solder',   blurb: 'Learn clean joints on practice boards, then fix something you brought from home.' },
  { id: 'c7',  title: 'Microcontrollers & Sensors',    track: 'electronics', format: 'Intensive', length: '5 days',            level: 1, skill: 'circuits', blurb: 'Inputs, outputs and power: build a sensing device from breadboard to soldered prototype.' },
  { id: 'c8',  title: 'Creative Coding for Objects',   track: 'code',        format: 'Evening',   length: '8 Mondays',         level: 1, skill: 'code',     blurb: 'Programs that draw for the laser, drive motors and turn sensor data into behaviour.' },
  { id: 'c9',  title: 'Hand-tool Woodworking',         track: 'craft',       format: 'Weekend',   length: '3 days',            level: 0, skill: 'wood',     blurb: 'Saws, chisels and planes. Cut your first dovetail and take home a small box.' },
  { id: 'c10', title: 'E-textiles: Sew a Circuit',     track: 'craft',       format: 'Evening',   length: '4 Thursdays',       level: 0, skill: 'textiles', blurb: 'Conductive thread, sewable LEDs and a wearable piece that lights up on touch.' },
  { id: 'c11', title: 'Finishing: Oil, Paint, Lacquer', track: 'craft',      format: 'Weekend',   length: '1 day',             level: 0, skill: 'finish',   blurb: 'Surface prep and finishes for wood, prints and metal: the difference between made and made well.' },
  { id: 'c12', title: 'Product Build Intensive',       track: 'design',      format: 'Intensive', length: '10 days',           level: 2, skill: 'sketch',   blurb: 'Take one object from sketch to finished prototype with mentors from every bench.' },
];

export const ZONES = [
  { id: 'wood', code: 'A', name: 'Wood shop', tools: ['wood', 'finish', 'sketch'], text: 'Benches, hand tools and a quiet corner for sharpening. Dust extraction runs whenever the saws do.' },
  { id: 'bench', code: 'B', name: 'Electronics bench', tools: ['solder', 'circuits', 'code'], text: 'Eight stations with fume extraction, bench supplies and drawers of parts you are encouraged to raid.' },
  { id: 'fab', code: 'C', name: 'Fab lab', tools: ['laser', 'print', 'cad'], text: 'Laser cutter, a row of printers and a big screen for checking files before anything moves.' },
  { id: 'textile', code: 'D', name: 'Textile corner', tools: ['textiles', 'circuits', 'sketch'], text: 'Machines, cutting tables and a wall of conductive thread in more colours than you would expect.' },
  { id: 'finish', code: 'E', name: 'Finishing booth', tools: ['finish', 'wood', 'print'], text: 'Ventilated, well lit and slightly too tidy. Where projects get their last coat and first photograph.' },
];

export const skillById = (id) => SKILLS.find((s) => s.id === id);
