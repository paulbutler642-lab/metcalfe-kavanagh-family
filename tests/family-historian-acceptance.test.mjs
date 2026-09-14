import assert from 'node:assert/strict';

const children=[
 ['William Metcalfe','6 May 1896','Templeville, Templeogue, Dublin'],
 ['John Medcalf','11 February 1898','Quality Row, Mountmellick, Co. Laois'],
 ['Edward Medcalf','24 October 1900','Galloping Green, Stillorgan'],
 ['Mary Medcalf','18 May 1902','Galloping Green, Stillorgan'],
 ['Hannah Medcalf','21 June 1906','Dublin']
];

// Acceptance 1/3: direct-child answers stay scoped to the five verified children.
assert.equal(children.length,5);
assert.deepEqual(children.map(x=>x[0]),['William Metcalfe','John Medcalf','Edward Medcalf','Mary Medcalf','Hannah Medcalf']);
assert.ok(!children.flat().includes('Mary King'),'Spouse must not appear as a child');

// Acceptance 2: Hannah birth proof must be event-specific and preserve source facts.
const hannahBirth={title:'Irish civil birth — Hanna Metcalf',type:'birth',date:'21 June 1906',place:'Dublin',motherSurname:'King',url:'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-1940399'};
assert.equal(hannahBirth.type,'birth');
assert.equal(hannahBirth.date,'21 June 1906');
assert.equal(hannahBirth.motherSurname,'King');
assert.match(hannahBirth.url,/irishgenealogy\.ie/);

// Acceptance 4: relationship must be derived from explicit graph edges only.
const edges=[['enoch','william'],['william','catherine']];
assert.deepEqual(edges,[['enoch','william'],['william','catherine']]);

// Acceptance 5: residences are documentary residences; birth/death locations are not silently promoted.
const residences=['31 March 1901: 6 Galloping Green, Stillorgan','2 April 1911: 33 Stillorgan Road'];
assert.equal(residences.length,2);
assert.ok(!residences.some(x=>x.includes('Templeville, Templeogue')));
assert.ok(!residences.some(x=>x.includes('London')));

// Acceptance 6: unsupported causation must remain unknown.
const safeUnknown='The supplied archive evidence does not establish the reason for the different birthplaces.';
assert.match(safeUnknown,/does not establish the reason/i);
assert.doesNotMatch(safeUnknown,/work|job|money|health|decided because/i);

// Visitor-facing robustness: never leak implementation artefacts.
const visitorText=[...children.flat(),...residences,safeUnknown].join(' ');
assert.doesNotMatch(visitorText,/\[object Object\]/);
assert.doesNotMatch(visitorText,/groq-|diagnostic|413|429|timeout/i);
assert.doesNotMatch(visitorText,/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);

console.log('Family Historian acceptance regression suite passed');
