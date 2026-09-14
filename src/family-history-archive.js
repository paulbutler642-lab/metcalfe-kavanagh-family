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
    summary: 'Born at Templeville in 1896, William Metcalfe served with the 5th Royal Inniskilling Fusiliers at Gallipoli and later became a prominent Army and amateur boxer.',
    chapters: [
      {
        title: 'Early life',
        text: 'William was born on 6 May 1896 at Templeville, Templeogue, the eldest known son of Enoch Medcalf and Mary King.',
        evidence: 'verified_primary',
      },
      {
        title: 'Military service',
        text: 'A contemporary Irish Independent report published on 18 September 1915 identifies Private W. Medcalf of the 5th Inniskillings and says that he had written to his mother in Stillorgan from the Gallipoli campaign. William reported that the battalion had lost half its men and nearly all its officers since reaching the peninsula. He described several narrow escapes: shrapnel passed through his haversack, and a bullet went through the heel of his boot while he was fetching water. He wrote that the Turkish troops were good fighters and their snipers accurate, adding with grim humour that large shells sometimes added flavour to the food. This independently confirms William’s Gallipoli service and his connection to the Stillorgan Medcalf household. His complete Army service record is still awaited before further military details are published.',
        evidence: 'contemporary_newspaper',
      },
      {
        title: 'Gallipoli and the 5th Inniskillings',
        text: 'William served at Gallipoli with the 5th (Service) Battalion, Royal Inniskilling Fusiliers, part of the Ulster-based 31st Brigade of the 10th (Irish) Division. The division was an all-Ireland volunteer formation composed of battalions drawn from Irish regiments across all four provinces. The 5th Inniskillings landed at Suvla Bay on 7 August 1915 and initially occupied trenches on the Kiretch Tepe Sirt ridge overlooking the Gulf of Saros. On 15 August the battalion was ordered to attack the strongly defended Kidney Hill position. Advancing across exposed ground under concentrated Turkish rifle, machine-gun and artillery fire, it suffered catastrophic casualties. Its commanding officer and five other named officers were killed, both majors and numerous junior officers were wounded, and the battalion’s organisation was temporarily shattered. William’s report that the battalion had lost approximately half its men and nearly all its officers is closely supported by the surviving divisional history. Although William’s company has not yet been identified and it cannot presently be proven that he took part in the Kidney Hill charge itself, the contemporary newspaper report confirms his presence with the battalion at Gallipoli and provides a rare personal account of the conditions he experienced.',
        evidence: 'secondary_historical',
        recordUrl: 'https://readingroo.ms/7/4/1/6/74163/74163-h/74163-h.htm',
        recordLabel: 'Read The Tenth (Irish) Division in Gallipoli',
      },
      {
        title: 'Boxing',
        text: 'William became a prominent Army and amateur boxer associated with the 27th Battalion, the Army Athletic Association and Portobello. Contemporary reports place him in bantamweight and flyweight competition. They record a points victory over Volunteer J. Ryan at the Irish Amateur Championships and Olympic Trials in Portobello Barracks, a first-round knockout of Private Shelley of Waterford at the Curragh, and other Army tournament appearances. One 27th Battalion column called Metcalfe the battalion’s boxing “idol”, while another looked forward to seeing its boxers compete once his injured hand had recovered. On 26 April 1924 he was named in a photograph of Army boxers training at Portobello before their team departed for Glasgow. These reports add firm contemporary detail to the surviving profile of his boxing career, which began around 1914. Where a clipping is cropped or its date is not visible, no missing result or date has been reconstructed.',
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
        title: 'Private W. Medcalf’s letter from Gallipoli',
        date: '18 September 1915',
        publication: 'Irish Independent',
        image: '/family-archive/william-medcalf-gallipoli-letter-irish-independent-1915.webp',
        original: '/family-archive/william-medcalf-gallipoli-letter-irish-independent-1915.jpg',
        caption: 'A contemporary newspaper report summarising William Medcalf’s wartime letter to his mother in Stillorgan.',
        context: 'The Irish Independent identifies him as Private W. Medcalf of the 5th Inniskillings. Writing from the Gallipoli campaign, he described severe battalion losses and several narrow escapes, including shrapnel passing through his haversack and a bullet piercing the heel of his boot while he fetched water. He also commented on the fighting ability of the Turkish troops and the accuracy of their snipers.',
        provenance: 'Newspaper image kindly supplied directly to Paul Butler by YouWho.ie following a family-history enquiry. This is a newspaper account of William’s letter, rather than an image of the original handwritten letter.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
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
        title: 'Army boxing tournament — Curragh bantamweight bouts',
        date: 'Date not visible on the surviving image',
        publication: 'Contemporary newspaper clipping',
        image: '/family-archive/william-metcalfe-army-boxing-01-30629.webp',
        original: '/family-archive/william-metcalfe-army-boxing-01-30629.jpg',
        caption: 'Results recording Private Metcalfe of the Curragh in Army bantamweight competition.',
        context: 'The preliminary-round report records Private Metcalfe (Curragh) knocking out Private Shelley (Waterford) in the first round. The final records Corporal Traynor (Kerry) knocking out Volunteer Metcalf (Curragh) in the first round. The spelling variation “Metcalf” is retained from the printed result.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: '27th Battalion flyweight result',
        date: 'Date not visible on the surviving image',
        publication: 'Contemporary newspaper clipping',
        image: '/family-archive/william-metcalfe-army-boxing-02-30632.webp',
        original: '/family-archive/william-metcalfe-army-boxing-02-30632.jpg',
        caption: 'A flyweight result naming Private Metcalfe of the 27th Battalion.',
        context: 'The report records J. Kelly of North City Boxing Club defeating Private Metcalfe of the 27th Battalion on points.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'The 27th Battalion’s boxing “idol”',
        date: 'Date not visible on the surviving image',
        publication: 'An t-Óglach — 27th Battalion, Phoenix Park column',
        image: '/family-archive/william-metcalfe-army-boxing-03-30631.webp',
        original: '/family-archive/william-metcalfe-army-boxing-03-30631.jpg',
        caption: 'A 27th Battalion column describing Metcalfe as the battalion’s boxing “idol”.',
        context: 'The Phoenix Park report says B Company was “nearly gone mad on boxing” and calls Metcalfe its idol. It adds that the company had several promising young boxers in training whom Metcalfe would soon be able to assess when they made their debuts.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: '27th Battalion boxers and Metcalfe’s injured hand',
        date: 'Date not visible on the surviving image',
        publication: 'Contemporary Army newspaper column',
        image: '/family-archive/william-metcalfe-army-boxing-04-30630.webp',
        original: '/family-archive/william-metcalfe-army-boxing-04-30630.jpg',
        caption: 'A battalion report looking forward to Metcalfe’s return after a hand injury.',
        context: 'The writer reports rumours that the 27th Battalion contained some very good boxers and asks why they were being kept “under cover”, adding that when their old friend Metcalfe’s hand was better the battalion hoped to see them in action.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Irish Amateur Championships and Olympic Trials at Portobello',
        date: 'Date not visible on the surviving image',
        publication: 'An t-Óglach',
        image: '/family-archive/william-metcalfe-army-boxing-05-30633.webp',
        original: '/family-archive/william-metcalfe-army-boxing-05-30633.jpg',
        caption: 'Volunteer W. Metcalfe’s bantamweight points victory at Portobello Barracks.',
        context: 'At the Irish Amateur Boxing Championships, Tailteann Games and Olympic Trials in Portobello Barracks, Volunteer W. Metcalfe of the Army Athletic Association defeated Volunteer J. Ryan, also of the A.A.A., on points in the bantamweight competition.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Private Metcalfe with the Army boxing team — detail',
        date: '26 April 1924',
        publication: 'An t-Óglach',
        image: '/family-archive/william-metcalfe-army-boxing-06-30634.webp',
        original: '/family-archive/william-metcalfe-army-boxing-06-30634.jpg',
        caption: 'Detail from the Portobello team photograph; the printed caption names Private Metcalfe among the seated boxers.',
        context: 'The photograph was taken at Portobello immediately before the Army boxing team departed for Glasgow. This close view preserves both the boxers and the portion of the caption identifying Private Metcalfe.',
        provenance: 'Newspaper image supplied by the family and identified as William Metcalfe’s Army team photograph.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Army Boxers in Training — Portobello team photograph',
        date: '26 April 1924',
        publication: 'An t-Óglach, page 11',
        image: '/family-archive/william-metcalfe-army-boxing-07-30635.webp',
        original: '/family-archive/william-metcalfe-army-boxing-07-30635.jpg',
        caption: 'The Army boxing team at Portobello before departing for Glasgow; Private Metcalfe is named in the sitting row.',
        context: 'Published under the heading “Army Boxers in Training”, the photograph shows the team shortly before it left to meet Scottish opponents in Glasgow. The caption identifies Private Metcalfe in the sitting row and names the other team members and officials.',
        provenance: 'Full newspaper page supplied by the family. The contemporary printed caption identifies Private Metcalfe.',
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
  'edward medcalf': {
    aliases: ['Edward Metcalf', 'Edward Metcalfe'],
    heading: 'Born at Galloping Green',
    summary: 'Edward Medcalf was born at Galloping Green, Stillorgan, in 1900, the son of Enoch Medcalf and Mary King.',
    chapters: [
      {
        title: 'Birth and baptism',
        text: 'Edward was born on 24 October 1900 at Galloping Green, Stillorgan. He was the son of Enoch Medcalf and Mary King. A surviving image of his baptismal-register entry was supplied directly to the family by YouWho.ie, the Stillorgan local-history website.',
        evidence: 'verified_primary',
      },
      {
        title: 'Childhood household',
        text: 'Edward appears with his parents and siblings in the family’s verified 1901 and 1911 Census evidence, connecting the baptism entry with the established Medcalf household in Stillorgan.',
        evidence: 'corroborated_family_history',
      },
    ],
    documents: [
      {
        title: 'Baptismal register entry — Edward Medcalf',
        date: '1900',
        publication: 'Historical baptismal register image',
        image: '/family-archive/edward-medcalf-baptism-register-youwho.webp',
        original: '/family-archive/edward-medcalf-baptism-register-youwho.jpg',
        caption: 'The baptismal-register entry for Edward Medcalf, son of Enoch Medcalf and Mary King of Galloping Green, Stillorgan.',
        context: 'The register image supports Edward’s existing family record and his connection to the Medcalf household documented at Galloping Green. Faint or cropped wording has not been reconstructed.',
        provenance: 'Image kindly supplied directly to Paul Butler by YouWho.ie, the Stillorgan local-history website, following a family-history enquiry.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
    ],
    notes: ['Credit: YouWho.ie supplied the surviving baptismal-register image used on this profile.'],
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
  'edward-medcalf': [
    { title: 'Baptism', detail: 'Edward Medcalf · 1900 · Galloping Green, Stillorgan', url: '/family-archive/edward-medcalf-baptism-register-youwho.jpg', linkLabel: 'View baptismal register image' },
    { title: '1901 Census', detail: 'Edward Medcalf · infant son · 6 Galloping Green, Stillorgan', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=5536924&c20_year=1901', linkLabel: 'View family household — National Archives' },
    { title: '1911 Census', detail: 'Edward Medcalf · son · 33 Stillorgan Road', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454237&c20_year=1911', linkLabel: 'View family household — National Archives' },
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
