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
        evidence: 'family_archive',
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
    records: [
      {
        title: 'Marriage of William Metcalfe and Mary Kavanagh',
        date: '1922',
        repository: 'Irish Genealogy',
        url: 'https://www.irishgenealogy.ie/view/?record_id=cima-1270171',
        note: 'Civil marriage record confirming the 1922 marriage of William Metcalfe and Mary Kavanagh.',
        evidence: 'verified_primary',
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
      },
    ],
    records: [
      {
        title: 'Marriage of William Metcalfe and Mary Kavanagh',
        date: '1922',
        repository: 'Irish Genealogy',
        url: 'https://www.irishgenealogy.ie/view/?record_id=cima-1270171',
        note: 'Civil marriage record confirming the 1922 marriage of William Metcalfe and Mary Kavanagh.',
        evidence: 'verified_primary',
      },
    ],
    notes: [],
  },
  'enoch medcalf': {
    aliases: ['Enoch Metcalf', 'Enoch Metcalfe'],
    heading: 'From Altadore to Stillorgan',
    summary: 'Enoch Medcalf was born at Altadore in 1874 and worked over his lifetime as a groom, railway porter, coachman and gardener.',
    chapters: [
      {
        title: 'Birth and parents',
        text: 'Enoch was born on 8 September 1874 at Altadore, County Wicklow, the known son of Anthony Metcalf or Medcalf and Sara Jane Byrnes.',
        evidence: 'verified_primary',
      },
      {
        title: 'Marriage',
        text: 'On 23 July 1895 he married Mary King at Christ Church, Carysfort/Blackrock. The marriage transcription records Enoch as a groom and names his father Anthony, a gardener. Mary’s father William King was a carpenter.',
        evidence: 'verified_primary',
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

export function familyHistoryFor(person) {
  const key = normalise(person?.name)
  return archive[key] || Object.values(archive).find((item) => item.aliases.some((alias) => normalise(alias) === key)) || null
}
export function searchTermsFor(person) {
  const item = familyHistoryFor(person)
  return [person?.name, person?.given_names, person?.surname, ...(item?.aliases || [])].filter(Boolean).join(' ').toLowerCase()
}
