const normalise = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

export const evidenceLabels = {
  verified_primary: 'Verified Record',
  contemporary_newspaper: 'Contemporary Newspaper',
  family_archive: 'Family Archive',
  family_oral_history: 'Family Oral History',
  corroborated_family_history: 'Corroborated',
  secondary_historical: 'Historical Source',
  research_lead: 'Research Lead',
}

const archive = {
  'william metcalfe': {
    aliases: ['Anthony Metcalfe', 'William Anthony Metcalfe'],
    heading: 'Soldier, boxer and family man',
    summary: 'Born at Templeville in 1896, William Metcalfe became a prominent Army and amateur boxer associated with Portobello Boxing Club.',
    chapters: [
      {
        title: 'Early life',
        text: 'William was born on 6 May 1896 at Templeville, Templeogue, the eldest known son of Enoch Medcalf and Mary King.',
        evidence: 'verified_primary',
      },
      {
        title: 'Military service',
        text: 'Family and historical research establishes a military connection, including the Royal Inniskilling Fusiliers. Existing family research also associates William with First World War service, including Gallipoli; the full Army record is awaited before further details are published.',
        evidence: 'corroborated_family_history',
      },
      {
        title: 'Boxing',
        text: 'William became a prominent Army and amateur boxer associated with Portobello Boxing Club. A surviving contemporary newspaper profile describes a ring career beginning around 1914 and discusses his fitness, punch, resistance, experience and ring craft. Because parts of the clipping are damaged, no obscured result or title has been reconstructed.',
        evidence: 'contemporary_newspaper',
      },
      {
        title: 'Marriage and family',
        text: 'William married Mary Kavanagh in 1922. His brother John later married Mary’s sister Catherine Kavanagh, creating an unusual double connection between the Metcalfe and Kavanagh families.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cima-1270171',
        recordLabel: 'View 1922 marriage record — Irish Genealogy',
      },
      {
        title: 'London and death',
        text: 'A surviving two-page report confirms that William was living at 2b Seagrave Road, Fulham, and working as an engineer’s labourer for James Howden & Co. While returning to his job after dinner at a building under construction in Townmead Road, Fulham, he fell through a floor opening to the basement—a distance reported as 60 feet. He suffered a fractured pelvis and spinal injury and died that Monday night at St Stephen’s Hospital, Fulham Road. The coroner recorded a verdict of accidental death. His brother John gave evidence and stated that William’s wife was in Dublin. The copy does not show the calendar date, so the established family year of 1940 is retained without inventing a day or month.',
        evidence: 'verified_primary',
      },
    ],
    documents: [
      {
        title: 'Prominent Amateur Boxers — Private W. Metcalfe',
        date: 'Date not yet established',
        publication: 'Original newspaper clipping',
        image: '/family-archive/william-metcalfe-prominent-amateur-boxers.webp',
        original: '/family-archive/william-metcalfe-prominent-amateur-boxers-original.jpg',
        caption: 'Private W. Metcalfe of Portobello Boxing Club, profiled as a prominent Irish amateur and Army boxer.',
        context: 'The damaged clipping discusses William’s boxing from approximately 1914, his military association, the important 1924 period in Irish amateur boxing, a team visit to Scotland, and Free State Army bantamweight competition in 1926, 1927 and 1928. Missing wording has not been reconstructed.',
        provenance: 'Original newspaper clipping preserved by the Metcalfe family. The handwritten “Daddy R.I.P.” inscription was written by William’s eldest daughter Annie (“An”) Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Workman Fell 60 Feet — Townmead Road Fatality (page 1)',
        date: '1940 — exact date not visible on the surviving copy',
        publication: 'Copy supplied with insurance correspondence',
        image: '/family-archive/william-metcalfe-accident-details-page-1.webp',
        original: '/family-archive/william-metcalfe-accident-details-page-1.jpeg',
        caption: 'First page of the report concerning the fatal workplace accident involving William Metcalfe in Fulham, London.',
        context: 'The report identifies William Metcalfe, aged 44, as an engineer’s labourer living at 2b Seagrave Road, Fulham. It records his employer as James Howden & Co. and states that he fell approximately 60 feet through a floor opening at a building under construction in Townmead Road. He died at St Stephen’s Hospital. His brother John Metcalfe gave evidence and said William’s wife was in Dublin.',
        provenance: 'Two-page copy retained by the Metcalfe family. According to the family, it accompanied correspondence from the insurance company to William’s wife, Mary Metcalfe.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Workman Fell 60 Feet — Townmead Road Fatality (page 2)',
        date: '1940 — exact date not visible on the surviving copy',
        publication: 'Copy supplied with insurance correspondence',
        image: '/family-archive/william-metcalfe-accident-details-page-2.webp',
        original: '/family-archive/william-metcalfe-accident-details-page-2.jpeg',
        caption: 'Continuation of the accident report, including the medical evidence and coroner’s verdict.',
        context: 'Dr M. Latner of St Stephen’s Hospital stated that William had suffered a fractured pelvis and an injury to the spine and died on Monday night. The coroner concluded that the cause of the fall would never be known and recorded a verdict of “Accidental death”. The employers’ representative described William as a good workman and an ideal assistant.',
        provenance: 'Second page of the copy retained by the Metcalfe family and associated with the insurance-company correspondence sent to Mary Metcalfe.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
    ],
    notes: ['The 1922 marriage record uses or records the name Anthony. It is not yet established whether Anthony was a formal middle name, an alternative given name or another usage.'],
  },
  'mary kavanagh': {
    aliases: ['Mary Metcalfe'],
    heading: 'Marriage to William Metcalfe',
    summary: 'The Irish civil registration record confirms that Mary Kavanagh married William Metcalfe in 1922.',
    chapters: [
      {
        title: 'Marriage',
        text: 'Mary Kavanagh married William Metcalfe in 1922. This marriage is part of the family’s direct ancestral line and is supported by the linked Irish Genealogy civil record.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cima-1270171',
        recordLabel: 'View 1922 marriage record — Irish Genealogy',
      },
    ],
    notes: [],
  },
  'enoch medcalf': {
    aliases: ['Enoch Metcalf', 'Enoch Metcalfe', 'Enock Medcalf', 'Enock Metcalf', 'Enock Metcalfe', 'Anthony Medcalf', 'Anthony Metcalf', 'Anthony Metcalfe'],
    heading: 'From Altadore to Stillorgan',
    summary: 'Enoch Medcalf was born at Altadore in 1874 and worked over his lifetime as a groom, railway porter, coachman and gardener.',
    chapters: [
      {
        title: 'Birth and parents',
        text: 'Enoch was born on 8 September 1874 at Altadore, County Wicklow, the known son of Anthony Metcalf or Medcalf and Sara Jane Byrnes.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802',
        recordLabel: 'View 1874 birth record — Irish Genealogy',
      },
      {
        title: 'Marriage',
        text: 'On 23 July 1895 he married Mary King at Christ Church, Carysfort/Blackrock. The marriage transcription records Enoch as a groom and names his father Anthony, a gardener. Mary’s father William King was a carpenter.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cima-2226913',
        recordLabel: 'View 1895 marriage record — Irish Genealogy',
      },
      {
        title: 'Working life',
        text: 'Records trace Enoch through several occupations and places: groom in 1895; later railway porter around Mountmellick and Quality Row; coachman at Galloping Green in 1902; Dublin Road, Stillorgan in 1911; and later gardener around Kilmacud Road and The Grange. These descriptions are kept to the wording supported by the records.',
        evidence: 'corroborated_family_history',
      },
      {
        title: 'The accident at Stillorgan',
        text: 'The circumstances of Enoch’s death remained part of the family’s oral history for generations. His granddaughter Catherine Metcalfe recalled that her grandfather had been knocked from his bicycle in Stillorgan while travelling home from work, and passed that account to her family decades before modern research began. Later research independently located material describing the same event. A contemporary Evening Herald report is known to exist, but its complete contents await examination.',
        evidence: 'family_oral_history',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cide-2102615',
        recordLabel: 'View 1939 death record — Irish Genealogy',
      },
    ],
    notes: ['Evening Herald, circa late 1939: report concerning Enoch Medcalf’s accident or death. Article known to exist; original awaiting examination.', 'The marriage residence has been transcribed as “Straw House, Clontarf”. It has not been silently changed to “Strand House”.'],
  },
  'anthony medcalf': {
    aliases: ['Anthony Metcalf', 'Anthony Metcalfe'],
    heading: 'A gardener from Kilquade',
    summary: 'The parish register establishes Anthony Metcalf’s baptism at Kilquade in 1838 and identifies his parents as John and Elizabeth.',
    chapters: [
      {
        title: 'Baptism',
        text: 'Anthony Metcalf was baptised on 28 October 1838. Christ Church Delgany parish register entry 938 records his parents as John and Elizabeth, their abode as Kilquade, and John’s occupation as labourer. The record proves a baptism date, not an exact birth date.',
        evidence: 'verified_primary',
      },
      {
        title: 'Known family',
        text: 'Hannah Metcalf, baptised at Kilquade on 30 October 1836 to the same parents, locality and paternal occupation, is Anthony’s confirmed sister. Anthony later worked as a gardener, partnered Sara Jane Byrnes, and was the father of Enoch Medcalf, born at Altadore in 1874.',
        evidence: 'corroborated_family_history',
      },
    ],
    notes: ['A possible later John and Mary Metcalf household at Kilquade remains a research lead only. Mary is not shown as Anthony’s stepmother and their children are not shown as his half-siblings.', 'Other Wicklow Metcalf families remain unconnected until evidence establishes a relationship.'],
  },
}

const verifiedRecords = {
  'william-metcalfe': [
    { title: 'Birth', detail: '6 May 1896 · Dublin South registration district', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-3084449' },
    { title: '1901 Census', detail: 'William Medcalf · age 4 · son and scholar · 6 Galloping Green, Stillorgan', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=5536925&c20_year=1901', linkLabel: 'View 1901 census — National Archives' },
    { title: '1911 Census', detail: 'William Medcalf · age 14 · son and apprentice grocer · 33 Stillorgan Road', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454242&c20_year=1911', linkLabel: 'View 1911 census — National Archives' },
  ],
  'mary-kavanagh': [
    { title: 'Birth', detail: '10 June 1897 · Sallynoggin · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-2979498' },
  ],
  'annie-teresa-metcalfe': [
    { title: 'Birth', detail: '15 October 1923 · Rathdown · mother: Kavanagh', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-136016' },
  ],
  'john-metcalfe': [
    { title: 'Birth', detail: '24 September 1925 · Rathdown · mother: Kavanagh', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-14451' },
    { title: 'Death', detail: '2 October 1930 · Rathdown · aged 5', url: 'https://www.irishgenealogy.ie/view/?record_id=cide-1710270' },
  ],
  'anthony-medcalf': [
    { title: 'Birth', detail: 'Enoch Metcalf · 8 September 1874 · Rathdrum', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802' },
    { title: 'Marriage', detail: 'Enoch Medcalf and Mary King · 23 July 1895 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-2226913' },
    { title: 'Death', detail: 'Enoch Medcalf · 5 December 1939 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cide-2102615' },
    { title: '1901 Census', detail: 'Enock Medcalf · age 26 · domestic servant coachman and head of family · 6 Galloping Green, Stillorgan · with Mary and sons William, John and Edward', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=5536924&c20_year=1901', linkLabel: 'View 1901 census — National Archives' },
    { title: '1911 Census', detail: 'Enoch Medcalf · age 36 · domestic gardener and head of family · 33 Stillorgan Road · with Mary and children William, John, Edward, Mary and Hannah', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454237&c20_year=1911', linkLabel: 'View 1911 census — National Archives' },
    { title: '1926 Census', detail: 'Enoch Medcalf · age 51 · married head of household · Kilmacud Road, Stillorgan · with Mary and daughters Mary and Hannah', url: 'https://nationalarchives.ie/collections/search-the-1926-census/census-record/#a_id=467572', linkLabel: 'View 1926 census — National Archives' },
  ],
  'mary-king': [
    { title: 'Birth', detail: '24 March 1871 · George’s Avenue, Blackrock · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-6205937' },
    { title: 'Marriage', detail: 'Mary King and Enoch Medcalf · 23 July 1895 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-2226913' },
    { title: '1901 Census', detail: 'Mary Medcalf · age 30 · wife · 6 Galloping Green, Stillorgan', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=5536928&c20_year=1901', linkLabel: 'View 1901 census — National Archives' },
    { title: '1911 Census', detail: 'Mary Medcalf · age 40 · wife · married 15 years, with five children born and five living · 33 Stillorgan Road', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454241&c20_year=1911', linkLabel: 'View 1911 census — National Archives' },
    { title: '1926 Census', detail: 'Mary Medcalf · age 53 · wife · Kilmacud Road, Stillorgan', url: 'https://nationalarchives.ie/collections/search-the-1926-census/census-record/#a_id=467573', linkLabel: 'View 1926 census — National Archives' },
  ],
  'thomas-kavanagh': [
    { title: 'Marriage', detail: 'Thomas Kavanagh and Anne Carroll · 15 September 1889 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-2508907' },
  ],
  'anne-carroll': [
    { title: 'Marriage', detail: 'Anne Carroll and Thomas Kavanagh · 15 September 1889 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-2508907' },
  ],
  'owen-kavanagh': [
    { title: 'Death', detail: '4 July 1903 · Thomastown · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cide-4645743' },
  ],
  'elizabeth-kavanagh': [
    { title: 'Death', detail: '31 October 1907 · Thomastown · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cide-4938662' },
  ],
  'william-king-jr': [
    { title: 'Death', detail: '29 May 1890 · George’s Place, Blackrock · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cide-6248076' },
  ],
}

export function verifiedRecordsFor(person) {
  return verifiedRecords[person?.id] || []
}

export function familyHistoryFor(person) {
  const key = normalise(person?.name)
  return archive[key] || Object.values(archive).find((item) => item.aliases.some((alias) => normalise(alias) === key)) || null
}
export function searchTermsFor(person) {
  const item = familyHistoryFor(person)
  return [person?.name, person?.given_names, person?.surname, ...(item?.aliases || [])].filter(Boolean).join(' ').toLowerCase()
}
