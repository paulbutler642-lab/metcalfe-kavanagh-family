const normalise = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const dummyPistolSource = 'https://www.newspapers.com/image/1047725845/'
const dummyPistolTranscription = `DUMMY PISTOL
Story of Hold Up in Ballsbridge
TWO MEN FOUND GUILTY

To-day at the City Sessions in Green street Courthouse before the Recorder and a jury two young men named Edward and John Metcalfe, of Kilmacud road, Stillorgan, were tried on a charge of assaulting while armed with revolvers James and Thomas Hickey in the publichouse of the latter at Ballsbridge on February 23, and stealing £2 in money, the property of Thomas Hickey.

Mr. Carrigan, K.C. (instructed by the Chief Crown Solicitor), who prosecuted, said the jury had in this case the workings for the beginning of a conspiracy to rob, carried out by telegraphic communication. The accused men were brothers, and they with another young man named Michael Gunn, who had pleaded guilty to this robbery under arms, deliberately planned to rob Mr. Hickey's house. Edward Metcalfe went to the post office in Dame street and sent a telegram to his brother William to meet him at Blackrock that evening. Wm. Metcalfe was not [unclear] at home or was engaged and his brother John took his place.

DESCRIPTION OF SCENE.

In a description of the scene in the publichouse at closing time on the evening in question, Mr. Carrigan said that John Metcalfe presented a revolver at one, Mr. Hickey, and Gunn presented a revolver at the other. Gunn was captured, and in his possession was found £2 in silver, the amount which had been put in the cash register. The revolver was found to be a dummy. In John Metcalfe's house was found a dummy automatic pistol, but a person at whose head it might be presented would not know that it was a dummy.

The Recorder—What are the dummies made for?

CRIMINAL OFFENCE.

Mr. Carrigan—For the purpose for which they are used. It ought to be made a criminal offence to make a thing like this and call it a toy.

We have too many firearms, and there never will be law and order in the country until they are under the control of those entitled to use them.

Those revolvers could only be used for the one cowardly purpose of robbing people.

Thomas Hickey gave evidence as to how the “hold-up” was carried out. His brother, he said, got a “dummy” whisky bottle to disarm Gunn and said, “Will I strike you again or will you surrender.” Gunn then gave up the revolver.

Further evidence having been given in support of the prosecution,

The accused men said that a statement made by Gunn that he and they had planned the robbery was false.

The two prisoners were found guilty, and put back.`

const enochInquestTranscription = `DANGEROUS CORNER.
GARDENER'S DEATH.

An inquest on Enoch Medcalf (60), gardener, of 5 Kilmacud Rd., Stillorgan, Co. Dublin, who met with a fatal accident when cycling at Stillorgan on Dec. 5, was held by Dr. J. P. Brennan, Coroner for Co. Dublin, at Monkstown Hospital on Tuesday.

Mrs. Mary Medcalf said that her husband had been employed as a gardener with Rev. Dean Crosby, The Grange, Stillorgan. About 2 p.m. on Tuesday he left home to return to his work. He was riding a lady's bicycle. Her husband had good sight, but his hearing was not too good. Shortly after he left the house she learned that he had been knocked down.

Mrs. Mary Doyle, Jolly's Lane, Stillorgan, said that she saw a man riding a bicycle come out of Kilmacud Road into Stillorgan Rd., diagonally to go down the hill. He crashed into a motor car which was coming up Stillorgan hill. The bicycle crumpled up and the man seemed to go up in the air. The motor car appeared to be at a standstill when the cyclist crashed into it.

Dr. John Cathcart, house surgeon, Monkstown Hospital, said that death was due to fracture of the skull and laceration of the brain.

Garda Patk. McCormack, stated he went to the scene of the accident and saw a motor car there, the property of Very Rev. Canon M. F. Hoey, P.P., Wicklow, in charge of his chauffeur, Matthew Duff, The Abbey Lodge, Wicklow. The front of the car's radiator was dented.

Garda B. Carolan, Public Service tested the brakes of the motor car and found them in perfect working order.

Mrs. Annie Cleary, housekeeper, The Abbey, Wicklow, said she was travelling in the motor car in the direction of Dublin. Canon Hoey was also in the car which was driven by Matthew Duff. It was being driven at a moderate rate of speed on its proper side of the road. Her attention was drawn to the sound of brakes being applied when the car was almost at the top of the hill near Kilmacud Road. She felt a bump, and the car was brought to a standstill. When she got out she saw a man being lifted from under the left side of the car and being placed on the pathway. She did not actually see the man being hit. She heard the horn being sounded.

The jury returned a verdict in accordance with the medical evidence, and added a rider that they considered the corner near where the accident took place to be dangerous and suggested that the property authority should improve its condition for the safety of the public.`

export const evidenceLabels = {
  verified_primary: 'Verified Record',
  contemporary_newspaper: 'Contemporary Newspaper',
  family_archive: 'Family Archive',
  family_oral_history: 'Family Oral History',
  corroborated_family_history: 'Corroborated',
  secondary_historical: 'Historical Source',
  research_lead: 'Research Lead',
}

const seagraveRoadPresentDay = {
  title: '2B Seagrave Road — present day location',
  date: 'Google imagery dated July 2025',
  publication: 'Google Maps / Street View',
  image: '/family-archive/2b-seagrave-road-fulham-2025.webp',
  original: '/family-archive/2b-seagrave-road-fulham-2025.jpg',
  caption: 'Present day view of the frontage identified by Google Maps as 2B Seagrave Road, Fulham, London SW6 1RR.',
  context: 'The 1939 Register places John Metcalfe at 2B Seagrave Road. A report of William Metcalfe’s fatal accident gives the same address in 1940. This modern image helps locate the address; it does not establish which parts of the building survive from their time.',
  provenance: 'Google Maps / Street View screenshot dated July 2025, located and supplied by Paul Butler. © Google. Contemporary location reference, not a historical photograph.',
  evidence: 'family_archive',
  provenanceEvidence: 'family_archive',
}

const archive = {
  'john medcalf enoch son': {
    aliases: ['John Medcalf', 'John Metcalfe'],
    heading: 'From Stillorgan to Fulham',
    summary: 'The 1939 Register places John Metcalfe at 2B Seagrave Road, Fulham, working on the railway.',
    chapters: [
      {
        title: 'The 1922 Ballsbridge trial',
        text: 'The Evening Herald reported that John and Edward Metcalfe, brothers of Kilmacud Road, Stillorgan, were found guilty in a case concerning a hold-up at Thomas Hickey’s public house on 23 February 1922. The report says Edward had first telegraphed William to meet him in Blackrock, but John went in his place. It does not establish that William knew of or took part in the robbery. The report says the men were “put back” and gives no sentence.',
        evidence: 'contemporary_newspaper',
        transcription: dummyPistolTranscription,
        recordUrl: dummyPistolSource,
        recordLabel: 'View Evening Herald page at Newspapers.com',
      },
      {
        title: 'In London in 1939',
        text: 'On 29 September 1939, the England and Wales Register recorded John Metcalfe at 2B Seagrave Road, Fulham. His date of birth is written as 11 February 1898, matching his established Irish birth record. He is marked as married and his occupation is recorded as “Railway Labourer H.W.” A crossed-out entry on the adjoining register page, referring the reader onward, appears to describe him as a railway relayer and heavy worker. The accompanying closed entries cannot be identified from these scans. A later report of his brother William’s fatal accident also placed William at 2B Seagrave Road in 1940; the shared address connects their London records but does not by itself establish who else lived there in September 1939.',
        evidence: 'verified_primary',
      },
    ],
    documents: [
      seagraveRoadPresentDay,
      {
        title: '1939 Register — John Metcalfe at 2B Seagrave Road',
        date: '29 September 1939',
        publication: 'England and Wales Register, Fulham, enumeration district AGBU',
        image: '/family-archive/john-metcalfe-1939-register-entry.webp',
        original: '/family-archive/john-metcalfe-1939-register-entry.jpg',
        caption: 'John Metcalfe, born 11 February 1898, appears at 2B Seagrave Road, Fulham; schedule 45, sub-entry 5.',
        context: 'The register marks him as married and gives his occupation as “Railway Labourer H.W.” Other entries are officially closed in the supplied image.',
        provenance: 'Image of the 1939 England and Wales Register supplied by Paul Butler. The original archive reference and image provider were not included with the scan.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
      {
        title: '1939 Register — crossed-out John Metcalfe entry',
        date: '29 September 1939',
        publication: 'England and Wales Register, Fulham, enumeration district AGBU',
        image: '/family-archive/john-metcalfe-1939-register-cross-reference.webp',
        original: '/family-archive/john-metcalfe-1939-register-cross-reference.jpg',
        caption: 'The adjoining page contains a crossed-out entry for John, born 11 February 1898, with a direction to another page.',
        context: 'This appears to be an administrative cross-reference for the same John rather than a second independent household. Its occupation wording appears to read “Railway Relayer Heavy Worker”. The clear entry on the other scan is used for his address and schedule.',
        provenance: 'Companion image of the 1939 England and Wales Register supplied by Paul Butler; original archive reference and image provider not supplied.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
    ],
  },
  'william metcalfe': {
    aliases: ['Anthony Metcalfe', 'William Anthony Metcalfe'],
    heading: 'Soldier, volunteer, boxer and family man',
    summary: 'Born at Templeville in 1896, William Metcalfe served with the 5th Royal Inniskilling Fusiliers at Gallipoli. His signed and accepted July 1922 Volunteer Reserve papers and National Army Census place him with the pro-Treaty forces during the Irish Civil War; later papers trace his National Forces service and Army boxing career.',
    signature: {
      image: '/family-archive/william-metcalfe-signature.jpg',
      alt: 'William Metcalfe’s handwritten signature on his Army service record.',
      caption: 'William Metcalfe’s signature, cropped from his signed Army service record.',
    },
    chapters: [
      {
        title: 'Birth and childhood — 1896 onward',
        text: 'William was born on 6 May 1896 at Templeville, Templeogue, the eldest known son of Enoch Medcalf and Mary King. His Army file repeats the birth date in an administrative correction and records his family address at Brookfield Buildings, Blackrock. Some later attestation forms give a conflicting age or birth year; the civil birth record and 1896 date are retained, with the discrepancy noted in the record guide.',
        evidence: 'verified_primary',
      },
      {
        title: 'British Army service and Gallipoli — before and during 1915',
        text: 'A contemporary Irish Independent report published on 18 September 1915 identifies Private W. Medcalf of the 5th Inniskillings and summarises his letter to his mother in Stillorgan from Gallipoli. William described severe battalion losses and narrow escapes from shrapnel and rifle fire. His later Irish service papers record about four and a half years of previous British Army service, consistent with the wartime period, though the surviving forms are not fully legible in every field. The 5th (Service) Battalion, Royal Inniskilling Fusiliers, landed at Suvla Bay on 7 August 1915 and suffered severe losses in the fighting around Kidney Hill. The newspaper confirms William was with the battalion at Gallipoli; it does not establish that he took part in a particular attack.',
        evidence: 'contemporary_newspaper',
      },
      {
        title: 'The 5th Battalion on campaign — Gallipoli and Macedonia, 1915–1917',
        text: 'William’s contemporary Gallipoli evidence identifies him as Private W. Medcalf of the 5th Battalion, Royal Inniskilling Fusiliers. The battalion had been raised in 1914 and served in 31st Brigade, 10th (Irish) Division. It landed at Suvla Bay in August 1915; the Division’s August operations included the advance on Chocolate Hill and the fighting around Kiretch Tepe. The battalion’s own experience was severe: the existing Irish Independent report describes William writing home from Gallipoli about heavy losses and his narrow escapes. After the evacuation of Gallipoli, the 10th Division moved to Salonika in October 1915. In December, during the Battle of Kosturino and the retreat from Serbia, the Inniskilling battalions were held in reserve; the Inniskillings Museum records 11 of their men killed. The battalion then served on the Macedonian front, including the Struma Valley sector, through 1916–17. The official regimental heritage account describes the strain of disease and malaria in this area and the Division’s later withdrawal from the valley before it left Salonika. These are movements and actions of William’s battalion and its formations; they do not establish that William personally fought in each named engagement.',
        sources: [
          { label: 'Inniskillings Museum — A Forgotten Campaign', url: 'https://inniskillingsmuseum.com/a-forgotten-campaign/' },
          { label: 'Royal Irish Virtual Military Gallery — 10th Division at Chocolate Hill', url: 'https://royal-irish.org/events/10th-irish-division-chocolate-hill-gallipoli' },
          { label: 'Royal Irish Virtual Military Gallery — Macedonia, 1915–17', url: 'https://royal-irish.co.uk/events/battle-honour-macedonia-1915-17' },
          { label: 'Combined Irish Regiments Association — 5th Battalion movements', url: 'https://www.ciroca.org.uk/first-world-war-links/infantry-regiments-1914-18/royal-inniskilling-fusiliers/' },
        ],
        evidence: 'secondary_historical',
      },
      {
        title: 'Egypt and Palestine — 1917 to May 1918',
        text: 'In August 1917 the 10th (Irish) Division assembled at Salonika and moved through Egypt toward Palestine. The 5th Inniskillings remained in the Division’s 31st Brigade until 28 May 1918. During this period the Division took part in the Third Battle of Gaza and the advance that captured Jerusalem in December 1917. In March 1918, while the battalion was still listed with the Division, the 10th Division fought in the Tell ’Asur operation in the Judean Hills. Regimental and divisional accounts record these as campaign actions; William’s individual service evidence currently confirms his 5th Battalion service at Gallipoli, not his presence at any particular Palestinian assault.',
        sources: [
          { label: 'Royal Irish Virtual Military Gallery — Battle Honour Gaza', url: 'https://www.royal-irish.org/events/skins-faughs-clear-turkish-strongpoint-gaza' },
          { label: 'Royal Irish Virtual Military Gallery — Jerusalem', url: 'https://royal-irish.org/events/battle-honour-jerusalem' },
          { label: 'Royal Irish Virtual Military Gallery — 10th Division at Tell ’Asur', url: 'https://mail.royal-irish.org/explore/timeline' },
          { label: 'Combined Irish Regiments Association — 10th (Irish) Division order of battle', url: 'https://www.ciroca.org.uk/first-world-war-links/infantry-divisions-1914-18/10th-irish-division/' },
        ],
        evidence: 'secondary_historical',
      },
      {
        title: 'France and the Hindenburg Line — 1918',
        text: 'On 28 May 1918 the 5th Battalion left the 10th (Irish) Division and moved to France. It joined 198th Brigade, 66th (2nd East Lancashire) Division. The Royal Irish Virtual Military Gallery identifies the 5th Inniskillings as one of the battalions whose actions earned the regiment’s Hindenburg Line battle honour. The 66th Division’s later fighting included the Second Battle of Cambrai and the Pursuit to the Selle. This confirms the battalion’s Western Front service in 1918; it does not by itself place William in a particular trench, attack or casualty list. The 5th Battalion’s 198th Brigade war diary is catalogued as WO 95/3140/1 and covers 1 June 1918 to 9 May 1919.',
        sources: [
          { label: 'Royal Irish Virtual Military Gallery — Hindenburg Line', url: 'https://royal-irish.net/stories/battle-honour-hindenburg-line' },
          { label: 'Combined Irish Regiments Association — 5th Battalion transfer to 198th Brigade', url: 'https://www.ciroca.org.uk/first-world-war-links/infantry-regiments-1914-18/royal-inniskilling-fusiliers/' },
          { label: 'National Archives — British Army war diaries, 1914–1922', url: 'https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/british-army-war-diaries-1914-1922/' },
        ],
        evidence: 'secondary_historical',
      },
      {
        title: 'The Ballsbridge robbery report — February 1922',
        text: 'An Evening Herald report about the 23 February 1922 hold-up says Edward sent William a telegram asking him to meet at Blackrock. William was unavailable or otherwise engaged, and John went instead. The report does not say William knew of or participated in the robbery. Family recollection places William as a volunteer at the time. The surviving signed IRA Volunteer Reserve papers in this file are dated July 1922, after the robbery, so they establish his later enrolment but do not independently date his volunteer status in February.',
        evidence: 'contemporary_newspaper',
        recordUrl: dummyPistolSource,
        recordLabel: 'View Evening Herald report at Newspapers.com',
      },
      {
        title: 'Marriage and family — 1922 onward',
        text: 'William married Mary Kavanagh in 1922. His Army service record includes an entry for Mary as his wife and an administrative marriage-allowance paper. The couple’s marriage record is linked below. His brother John later married Mary’s sister Catherine Kavanagh, creating a double connection between the Metcalfe and Kavanagh families.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cima-1270171',
        recordLabel: 'View 1922 marriage record — Irish Genealogy',
      },
      {
        title: 'National Army attestation — 12 July 1922',
        text: 'The National Army Census, taken on 12–13 November 1922, records William as a Corporal in the Infantry and gives his attestation date as 12 July 1922 at Dundalk, with paybook number 19818. The July date is his recorded attestation date, not the date the census was taken. This census entry is separate from the surviving 50-page personnel file.',
        evidence: 'verified_primary',
        recordUrl: '/family-archive/william-metcalfe-army-records/#national-army-census',
        recordLabel: 'Read the census entry and service-file guide',
      },
      {
        title: 'Signed enrolment in Óglaigh na hÉireann — 14 and 16 July 1922',
        text: 'Two signed papers record William’s entry into the Irish Republican Army Volunteer Reserve. On 14 July 1922 he signed an Óglaigh na hÉireann voluntary-levy form, giving his name as William Metcalfe, age 26, birthplace Templeogue, and an address that reads 59 Brookfield Buildings, Blackrock, Dublin. On 16 July he signed the Volunteer Reserve Agreement, which offers six months’ service or a shorter period set by the Army Council. The address on this second form is faint and appears to read 57 Brookfield Buildings, Blackrock. His name is legible in the faint signature, and the form is marked “Accepted. Curragh Camp.” The printed pay schedule lists 2 shillings and 6 pence per day plus maintenance, but a handwritten insertion above “Two” appears to read “Three”, so the amount actually offered is uncertain. The dependant schedule lists 4 shillings per day for a wife, with higher rates for children; William’s handwritten note appears to direct payment of the allowance to his wife. This records the terms and his request, not proof that payments were made. Together, these papers directly document his signed and accepted enrolment by 16 July. They record an offer of service; they do not alone show that he completed six months or when he first became a volunteer.',
        evidence: 'verified_primary',
        recordUrl: '/family-archive/william-metcalfe-army-records/',
        recordLabel: 'Open the complete Army records folder and page guide',
      },
      {
        title: 'Medical records and physical description — 1922–1933',
        text: 'William’s Army file records two different heights. The “Description of Soldier on Entry to Army” on page 2 gives 5 feet 4 inches, a 33-inch chest, brown hair and blue eyes; the complexion entry is hard to read and the marks-and-scars field appears blank. A Medical History form on page 12, examined at Portobello on 24 April 1926, gives 5 feet 8 inches, 130 lb, fair hair, blue eyes, a 35-inch chest, 2½-inch chest expansion and “Good” physical development. Its complexion entry is unclear. The two recorded heights conflict, so both are reported without trying to reconcile them. On page 14, before discharge, William signed that as far as he knew he was not suffering from a disability associated with military service. The guide links directly to all three pages.',
        evidence: 'verified_primary',
        recordUrl: '/family-archive/william-metcalfe-army-records/#medical-records',
        recordLabel: 'Read the medical-record page guide',
      },
      {
        title: 'Historical significance — William served in Collins’s pro-Treaty Army',
        text: 'This is a documented connection to one of the decisive conflicts in Irish history and to Michael Collins’s National Army. The Civil War began on 28 June 1922. The Defence Forces’ official history identifies the National Army as the pro-Treaty IRA. RTÉ’s account of the Army’s formation records that Collins became Commander-in-Chief on 12 July 1922. William signed his levy paper on 14 July, and his Volunteer Reserve Agreement was accepted at Curragh Camp on 16 July—four days after Collins took command. The British handover of Curragh to Free State forces had taken place on 16 May. The November National Army Census then records William as a Corporal in the Infantry, with his attestation date given as 12 July. Taken together, the contemporary documents verify that William served with the pro-Treaty National Army during the Civil War, under Collins’s overall command. They do not show that he met or corresponded personally with Collins. The agreement offered six months’ service or a shorter period set by the Army Council; later service papers show William’s Army career continued to 1933. The “I.R.A. Record” table on his levy form is blank, so it does not establish that he was a pre-Treaty IRA veteran. The same form records about four and a half years’ previous British Army service.',
        sources: [
          { label: 'Houses of the Oireachtas — Treaty in Context', url: 'https://www.oireachtas.ie/en/visit-and-learn/centenaries/treaty-debates/the-treaty-in-context/' },
          { label: 'Defence Forces — History of the Army', url: 'https://www.military.ie/en/public-information/defence-forces-museums/defence-forces-history/history-of-the-army/' },
          { label: 'RTÉ — Call to arms: creating the Irish National Army', url: 'https://www.rte.ie/history/2022/0125/1275830-call-to-arms-creating-the-irish-national-army/' },
          { label: 'Military Archives — Michael Collins, Commander in Chief', url: 'https://www.militaryarchives.ie/en/online-collections/military-service-pensions-collection/civil-war/fatalities/collins-michael' },
          { label: 'Military Archives — Curragh takeover, 16 May 1922', url: 'https://www.militaryarchives.ie/en/online-collections/military-archives-image-gallery-20th-century/ie-ma-acps-gpn-027' },
          { label: 'Military Archives — National Army Census history', url: 'https://www.militaryarchives.ie/en/online-collections/irish-army-census-collection-12-november-1922-13-november-1922/history' },
        ],
        evidence: 'secondary_historical',
      },

      {
        title: 'The two sides in 1922 — and why the name “IRA” can mislead',
        text: 'After the Dáil approved the Anglo-Irish Treaty in January 1922, the Irish Republican Army split over whether to accept it. Pro-Treaty leaders supported the Treaty and Provisional Government, arguing that the settlement offered a step towards self-government and avoided renewed war with Britain. Anti-Treaty opponents argued that it fell short of the Republic they had fought for, including because of the oath to the British monarch. The Pro-Treaty forces became known as the National Army; the Anti-Treaty forces continued as the IRA. The Provisional Government and pro-government press often called them “Irregulars,” a partisan label. Because both sides came from the pre-split IRA, “IRA” on a 1922 form does not, on its own, identify the side. William’s forms use the title “Irish Republican Army Volunteer Reserve”; read with the National Army Census listing him as a Corporal in the Infantry, with a 12 July 1922 attestation date, they establish that his service was on the pro-Treaty side.',
        sources: [
          { label: 'Defence Forces — History of the Army', url: 'https://www.military.ie/en/public-information/defence-forces-museums/defence-forces-history/history-of-the-army/' },
          { label: 'Military Archives — Irish Army Census history', url: 'https://www.militaryarchives.ie/en/online-collections/irish-army-census-collection-12-november-1922-13-november-1922/history' },
          { label: 'RTÉ — War of words: censorship and propaganda during the Civil War', url: 'https://www.rte.ie/history/michael-collins/2022/0803/1313771-censorship-and-propaganda-during-the-civil-war/' },
        ],
        evidence: 'secondary_historical',
      },
      {
        title: 'National Forces attestations — 1924 and 1926',
        text: 'The personnel file includes a signed National Forces attestation dated 26 April 1924 identifying William Metcalfe with the 27th Battalion. Its accompanying oath records service from 1 April 1924 and appears to give an end date of 30 September 1928. A later attestation form, signed in November 1926, again names him and the 27th Battalion. The papers use both Irish-language and English names for the Forces; the file documents his Army service through the state’s transition to Óglaigh na hÉireann.',
        evidence: 'verified_primary',
        recordUrl: '/family-archive/william-metcalfe-army-records/#page=22',
        recordLabel: 'Open 1924 attestation in the Army records',
      },
      {
        title: 'Army boxing — 1924 to the late 1920s',
        text: 'William became a prominent Army and amateur boxer associated with the 27th Battalion, the Army Athletic Association and Portobello. Contemporary reports place him in bantamweight and flyweight competition. They record a points victory over Volunteer J. Ryan at the Irish Amateur Championships and Olympic Trials in Portobello Barracks, a first-round knockout of Private Shelley of Waterford at the Curragh, and other Army tournament appearances. One 27th Battalion column called Metcalfe the battalion’s boxing “idol”, while another looked forward to seeing its boxers compete after his injured hand recovered. On 26 April 1924 he was named in a photograph of Army boxers training at Portobello before their team left for Glasgow. Later clippings refer to Army bantamweight competition in 1926, 1927 and 1928. Where a clipping lacks a date, no missing date or result has been reconstructed.',
        evidence: 'contemporary_newspaper',
      },
      {
        title: 'Service extensions, medical papers and discharge — 1929–1933',
        text: 'The personnel file continues with service, medical and dental papers from the late 1920s and early 1930s. A dental certificate from the 5th Infantry Battalion at Collins Barracks, dated 19 October 1929, records William’s agreement to have dentures fitted at his own expense. Extension and descriptive-return forms document repeated service administration in 1931–1933. A 6 October 1933 letter says he would not be permitted to extend his original enlistment. His signed application gives the reason for discharge as expiry of his term on 18 November 1933; a Personnel Records Section letter dated 16 October 1933 lists his term ending on that date. The papers therefore document his discharge at the end of the 1933 engagement, not 1935.',
        evidence: 'verified_primary',
        recordUrl: '/family-archive/william-metcalfe-army-records/#page=20',
        recordLabel: 'Open the 1933 discharge correspondence',
      },
      {
        title: 'London and death — 1940',
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
        context: 'The Irish Independent identifies him as Private W. Medcalf of the 5th Inniskillings. Writing from Gallipoli, he described severe battalion losses and narrow escapes from shrapnel and rifle fire. The full page places his report beside other Irish soldiers’ accounts of the Suvla fighting. Sergeant Matthew Broderick separately recalled arriving at Suvla Bay at about 5:30 a.m. on 7 August 1915, wading ashore when the landing lighter could go no closer, and men in the first landing party being blown up by concealed land mines. This is Broderick’s account, not evidence that William experienced that specific incident.',
        provenance: 'Newspaper image kindly supplied directly to Paul Butler by YouWho.ie following a family-history enquiry. This is a newspaper account of William’s letter, rather than an image of the original handwritten letter.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Army and Volunteer Reserve service file — 50 pages',
        date: '1922–1933',
        publication: 'William Metcalfe, service number VR172',
        image: '/family-archive/william-metcalfe-army-records/cover.jpg',
        original: '/family-archive/william-metcalfe-army-records/William-Metcalfe-Service-Record-VR172.pdf',
        folderUrl: '/family-archive/william-metcalfe-army-records/',
        caption: 'The complete personnel file, including the signed July 1922 Volunteer Reserve forms, National Forces attestations, service sheets, medical papers, extension correspondence and 1933 discharge documents.',
        context: 'The signed 14 and 16 July 1922 forms record William’s application to the voluntary levy and his accepted agreement to serve in the Irish Republican Army Volunteer Reserve. Later papers document National Army service, attestations and the expiry of his engagement in November 1933. A page-by-page guide explains the legible entries and flags uncertain readings.',
        provenance: 'Complete 50-page PDF supplied by the family as “VR172 William Metcalfe”. Page numbers in the guide refer to the numbered scanned pages in this PDF. Faint handwriting is identified as uncertain where appropriate.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Army Boxers in Training — Portobello team photograph',
        date: '26 April 1924',
        publication: 'An t-Óglach, page 11',
        image: '/family-archive/william-metcalfe-army-boxing-07-30635.webp',
        original: '/family-archive/william-metcalfe-army-boxing-07-30635.jpg',
        caption: 'The Army boxing team at Portobello before departing for Glasgow; Private Metcalfe is named in the sitting row.',
        context: 'Published under the heading “Army Boxers in Training”, the photograph shows the team shortly before it left to meet Scottish opponents in Glasgow.',
        provenance: 'Full newspaper page supplied by the family. The contemporary printed caption identifies Private Metcalfe.',
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
        context: 'The photograph was taken at Portobello immediately before the Army boxing team departed for Glasgow.',
        provenance: 'Newspaper image supplied by the family and identified as William Metcalfe’s Army team photograph.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Prominent Amateur Boxers — Private W. Metcalfe',
        date: 'Undated clipping; covers the 1920s',
        publication: 'Original newspaper clipping',
        image: '/family-archive/william-metcalfe-prominent-amateur-boxers.webp',
        original: '/family-archive/william-metcalfe-prominent-amateur-boxers-original.jpg',
        caption: 'Private W. Metcalfe of Portobello Boxing Club, profiled as a prominent Irish amateur and Army boxer.',
        context: 'The damaged clipping discusses William’s boxing from approximately 1914, the 1924 period in Irish amateur boxing, a team visit to Scotland and Free State Army bantamweight competition in 1926, 1927 and 1928. Missing wording has not been reconstructed.',
        provenance: 'Original newspaper clipping preserved by the Metcalfe family. The handwritten “Daddy R.I.P.” inscription was written by William’s eldest daughter Annie (“An”) Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Irish Amateur Championships and Olympic Trials at Portobello',
        date: 'Undated clipping; likely 1924',
        publication: 'An t-Óglach',
        image: '/family-archive/william-metcalfe-army-boxing-05-30633.webp',
        original: '/family-archive/william-metcalfe-army-boxing-05-30633.jpg',
        caption: 'Volunteer W. Metcalfe’s bantamweight points victory at Portobello Barracks.',
        context: 'The report says Volunteer W. Metcalfe of the Army Athletic Association defeated Volunteer J. Ryan on points in the bantamweight competition.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Army boxing tournament — Curragh bantamweight bouts',
        date: 'Undated clipping; date not visible',
        publication: 'Contemporary newspaper clipping',
        image: '/family-archive/william-metcalfe-army-boxing-01-30629.webp',
        original: '/family-archive/william-metcalfe-army-boxing-01-30629.jpg',
        caption: 'Results recording Private Metcalfe of the Curragh in Army bantamweight competition.',
        context: 'The preliminary-round report records Private Metcalfe (Curragh) knocking out Private Shelley (Waterford) in the first round. The final records Corporal Traynor (Kerry) knocking out Volunteer Metcalf (Curragh) in the first round. The printed spelling “Metcalf” is retained.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: '27th Battalion flyweight result',
        date: 'Undated clipping; date not visible',
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
        date: 'Undated clipping; date not visible',
        publication: 'An t-Óglach — 27th Battalion, Phoenix Park column',
        image: '/family-archive/william-metcalfe-army-boxing-03-30631.webp',
        original: '/family-archive/william-metcalfe-army-boxing-03-30631.jpg',
        caption: 'A 27th Battalion column describing Metcalfe as the battalion’s boxing “idol”.',
        context: 'The Phoenix Park report says B Company was “nearly gone mad on boxing” and calls Metcalfe its idol.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: '27th Battalion boxers and Metcalfe’s injured hand',
        date: 'Undated clipping; date not visible',
        publication: 'Contemporary Army newspaper column',
        image: '/family-archive/william-metcalfe-army-boxing-04-30630.webp',
        original: '/family-archive/william-metcalfe-army-boxing-04-30630.jpg',
        caption: 'A battalion report looking forward to Metcalfe’s return after a hand injury.',
        context: 'The writer reports good boxers in the battalion and says Metcalfe’s company hoped to see them compete once his hand had recovered.',
        provenance: 'Newspaper image supplied by the family and identified as relating to William Metcalfe.',
        evidence: 'contemporary_newspaper',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Workman Fell 60 Feet — Townmead Road Fatality (page 1)',
        date: '1940 — exact date not visible on the surviving copy',
        publication: 'Copy supplied with insurance correspondence',
        image: '/family-archive/william-metcalfe-accident-details-page-1.webp',
        original: '/family-archive/william-metcalfe-accident-details-page-1.jpeg',
        caption: 'First page of the report concerning William Metcalfe’s fatal workplace accident in Fulham, London.',
        context: 'The report identifies William as an engineer’s labourer living at 2b Seagrave Road, Fulham, employed by James Howden & Co. It says he fell approximately 60 feet through a floor opening at a building under construction in Townmead Road.',
        provenance: 'Two-page copy retained by the Metcalfe family; according to the family it accompanied insurance correspondence to William’s wife Mary.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
      {
        title: 'Workman Fell 60 Feet — Townmead Road Fatality (page 2)',
        date: '1940 — exact date not visible on the surviving copy',
        publication: 'Copy supplied with insurance correspondence',
        image: '/family-archive/william-metcalfe-accident-details-page-2.webp',
        original: '/family-archive/william-metcalfe-accident-details-page-2.jpeg',
        caption: 'Continuation of the accident report, including medical evidence and the coroner’s verdict.',
        context: 'The report describes a fractured pelvis and spinal injury and records a verdict of accidental death.',
        provenance: 'Second page of the copy retained by the Metcalfe family and associated with the insurance-company correspondence sent to Mary Metcalfe.',
        evidence: 'verified_primary',
        provenanceEvidence: 'family_archive',
      },
      {
        title: '2b Seagrave Road, Fulham — present-day photograph',
        date: 'Present day',
        publication: 'Family archive photograph',
        image: '/family-archive/2b-seagrave-road-fulham-2025.webp',
        original: '/family-archive/2b-seagrave-road-fulham-2025.jpg',
        caption: 'The Fulham address where William was recorded as living in 1940.',
        context: 'A present-day image of the address connects the family account with the London location documented in the accident report.',
        provenance: 'Photograph supplied by the family.',
        evidence: 'family_memory',
        provenanceEvidence: 'family_archive',
      },
    ],
    notes: [
      'The 1922 marriage record uses or records the name Anthony. It is not yet established whether Anthony was a formal middle name, an alternative given name or another usage.',
      'The signed IRA Volunteer Reserve papers dated 14 and 16 July 1922 prove his enrolment by those dates. Read with his National Army Census entry, they place William with the pro-Treaty forces during the Civil War. They do not, on their own, prove when he first became a volunteer or his status on 23 February 1922.',
      'The 14 July 1922 voluntary-levy form reads 59 Brookfield Buildings; the faint address on the 16 July Agreement appears to read 57 Brookfield Buildings. Both readings are retained as shown rather than silently reconciled. The 1924/1926 attestation papers also contain age or birth-year discrepancies; the civil birth record establishes 6 May 1896.',
      'The 1933 correspondence and discharge application give 18 November 1933 as the end of his engagement. The six-month term on the July 1922 Agreement is an offer of service, not proof that he served only six months; later service and extension papers document his continued Army career.',
    ],
  },
  'edward medcalf': {
    aliases: ['Edward Metcalf', 'Edward Metcalfe'],
    heading: 'Born at Galloping Green',
    summary: 'Edward Medcalf was born at Galloping Green, Stillorgan, in 1900, the son of Enoch Medcalf and Mary King.',
    chapters: [
      {
        title: 'Charged after the Ballsbridge hold-up — 1 March 1922',
        text: 'An Evening Herald report of a Southern Police Court hearing says Edward Metcalf had been arrested after Michael Gunn was remanded and was now charged in connection with the 23 February hold-up at a public house at 10 Ballsbridge Terrace. The report recounts evidence from the Hickey brothers about Gunn and two other men, and ends with the prisoners being remanded. This was an earlier hearing, not a verdict. The report calls the publican Michael Hickey, whereas the later trial report calls him Thomas; the difference remains unresolved from the supplied crops. The headline says three men were charged, but this crop does not clearly identify the third man.',
        evidence: 'contemporary_newspaper',
        transcription: 'Three Men Charged in Police Courts To-day\n\nEdward Metcalf, arrested since Gunn was remanded, was now charged with being concerned in the same affair.\n\nPrisoners were remanded.',
        transcriptionSource: 'Evening Herald, Dublin, Wednesday 1 March 1922, page 1. Selected legible lines from the supplied screenshot; the full article and its court-name line need a complete page scan before a full transcription.',
      },
      {
        title: 'The 1922 Ballsbridge trial',
        text: 'The Evening Herald reported that Edward and his brother John Metcalfe, of Kilmacud Road, Stillorgan, were found guilty in a case concerning a hold-up at Thomas Hickey’s public house on 23 February 1922. Edward had first sent a telegram asking their brother William to meet him in Blackrock; John went in William’s place. The report does not establish William’s knowledge or involvement. It records no sentence.',
        evidence: 'contemporary_newspaper',
        transcription: dummyPistolTranscription,
        recordUrl: dummyPistolSource,
        recordLabel: 'View Evening Herald page at Newspapers.com',
      },
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
    heading: 'From Altidore to Stillorgan',
    summary: 'Enoch Medcalf was born at Altidore in 1874 and worked over his lifetime as a groom, railway porter, coachman and gardener.',
    chapters: [
      {
        title: 'Birth and parents',
        text: 'Enoch was born on 8 September 1874 at Altidore, County Wicklow. His civil birth registration names his father as Anthony Metcalf of Altidore, occupation herd, and his mother as Sarah Jane Metcalf, formerly Burns. Catherine Hughes of Altidore, who was present at the birth, acted as informant. The birth was registered on 25 September 1874.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802',
        recordLabel: 'View 1874 birth record — Irish Genealogy',
      },
      {
        title: 'Marriage',
        text: 'On 23 July 1895 he married Mary King at Christ Church, Carysfort/Blackrock. The marriage transcription records Enoch as a groom and names his father Anthony, a gardener. Mary’s father William King was a carpenter. Enoch later witnessed his son John’s marriage to Catherine Kavanagh in 1925.',
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
        text: 'An inquest report describes Enoch, a gardener at The Grange, cycling from Kilmacud Road into Stillorgan Road on 5 December 1939 and colliding with a car on Stillorgan hill. Dr John Cathcart attributed his death to a fractured skull and laceration of the brain. The jury returned a verdict in line with the medical evidence and called the corner dangerous. The report dates the accident, but does not give an explicit calendar date of death. His granddaughter Catherine had also preserved an account of his cycling accident within the family.',
        evidence: 'contemporary_newspaper',
        transcription: enochInquestTranscription,
        transcriptionSource: 'Irish Independent, 7 December 1939, page 9, “Dangerous Corner. Gardener’s Death.” Transcribed from a clipping supplied by Paul Butler. The scan begins and ends within this article; the newspaper masthead is not visible in the crop.',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cide-2102615',
        recordLabel: 'View 1939 death record — Irish Genealogy',
      },
    ],
    notes: ['The newspaper report gives the accident date as 5 December 1939; that date is not automatically treated as his date of death.', 'The marriage residence has been transcribed as “Straw House, Clontarf”. It has not been silently changed to “Strand House”.'],
  },
  'anthony medcalf': {
    aliases: ['Anthony Metcalf', 'Anthony Metcalfe'],
    heading: 'A gardener from Kilquade',
    summary: 'The parish register establishes Anthony Metcalf’s baptism at Kilquade in 1838. His 1862 civil marriage record connects him to Sarah Jane Burns and confirms his father as John Metcalf.',
    chapters: [
      {
        title: 'Baptism',
        text: 'Anthony Metcalf was baptised on 28 October 1838. Christ Church Delgany parish register entry 938 records his parents as John and Elizabeth, their abode as Kilquade, and John’s occupation as labourer. The record proves a baptism date, not an exact birth date.',
        evidence: 'verified_primary',
      },
      {
        title: 'Marriage to Sarah Jane Burns',
        text: 'Anthony Metcalf married Sarah Jane Burns on 7 September 1862 at the Registrar’s Office in the City of Cork. Both were recorded as of full age and previously unmarried. Anthony was a servant and named his father as John Metcalf, a farmer. Sarah Jane named her father as Patrick Burns, a soldier in the Royal Artillery. The record’s identification is independently supported by their son Enoch’s 1874 birth registration, which names his mother as Sarah Jane Metcalf, formerly Burns.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cima-3312224',
        recordLabel: 'View 1862 marriage record — Irish Genealogy',
      },
      {
        title: 'Known family',
        text: 'Hannah Metcalf, baptised at Kilquade on 30 October 1836 to the same parents, locality and paternal occupation, is Anthony’s confirmed sister. Anthony was the father of Enoch Medcalf, born at Altidore in 1874. Enoch’s civil birth registration records Anthony at Altidore working as a herd and names Enoch’s mother as Sarah Jane Metcalf, formerly Burns. Enoch’s 1895 marriage record later describes Anthony as a gardener.',
        evidence: 'corroborated_family_history',
      },
    ],
    notes: ['The marriage register records both Anthony and Sarah Jane as “full age”, meaning at least 21; it does not provide either person’s exact age or date of birth.', 'The couple’s residence wording is difficult to read in the surviving image and has not been presented as a certain transcription.', 'A possible later John and Mary Metcalf household at Kilquade remains a research lead only. Mary is not shown as Anthony’s stepmother and their children are not shown as his half-siblings.', 'Other Wicklow Metcalf families remain unconnected until evidence establishes a relationship.'],
  },
  'sarah jane metcalf': {
    aliases: ['Sarah Jane Burns', 'Sarah Jane Byrne', 'Sarah Jane Byrnes'],
    heading: 'Sarah Jane Burns of the Metcalf family',
    summary: 'Sarah Jane Burns married Anthony Metcalf in Cork in 1862. Their marriage record identifies her father as Patrick Burns, a soldier in the Royal Artillery.',
    chapters: [
      {
        title: 'Marriage to Anthony Metcalf',
        text: 'Sarah Jane Burns married Anthony Metcalf on 7 September 1862 at the Registrar’s Office in the City of Cork. She was recorded as a spinster of full age. Her father was Patrick Burns, a soldier in the Royal Artillery. Anthony was a bachelor and servant whose father was John Metcalf, a farmer.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=cima-3312224',
        recordLabel: 'View 1862 marriage record — Irish Genealogy',
      },
      {
        title: 'Mother of Enoch',
        text: 'The couple’s son Enoch was born at Altidore, County Wicklow, on 8 September 1874. His civil birth registration names his mother as Sarah Jane Metcalf, formerly Burns, independently confirming the maiden surname recorded at her marriage.',
        evidence: 'verified_primary',
        recordUrl: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802',
        recordLabel: 'View Enoch’s 1874 birth record — Irish Genealogy',
      },
    ],
    notes: ['“Full age” establishes only that Sarah Jane was at least 21 when she married on 7 September 1862. It places her birth on or before 7 September 1841 but does not establish an exact birth date.', 'Burns is the surname independently supported by both the 1862 marriage and Enoch’s 1874 birth registration. Byrne and Byrnes remain research variants only.'],
  },
}

const archiveKeyByPersonId = {
  'john-medcalf-enoch-son': 'john medcalf enoch son',
  'william-metcalfe': 'william metcalfe',
  'edward-medcalf': 'edward medcalf',
  'mary-kavanagh': 'mary kavanagh',
  'anthony-medcalf': 'enoch medcalf',
  'anthony-metcalf-enoch-father': 'anthony medcalf',
  'sarah-jane-byrne': 'sarah jane metcalf',
}

const verifiedRecords = {
  'john-medcalf-enoch-son': [
    { title: '1939 Register', detail: 'John Metcalfe · born 11 February 1898 · married · railway labourer · 2B Seagrave Road, Fulham, London', url: '/family-archive/john-metcalfe-1939-register-entry.jpg', linkLabel: 'View 1939 Register image' },
  ],
  'william-metcalfe': [
    { title: 'Birth', detail: '6 May 1896 · Dublin South registration district', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-3084449' },
    { title: '1901 Census', detail: 'William Medcalf · age 4 · son and scholar · 6 Galloping Green, Stillorgan', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=5536925&c20_year=1901', linkLabel: 'View 1901 census — National Archives' },
    { title: '1911 Census', detail: 'William Medcalf · age 14 · son and apprentice grocer · 33 Stillorgan Road', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454242&c20_year=1911', linkLabel: 'View 1911 census — National Archives' },
    { title: 'National Army Census', detail: '1922 · Corporal, Infantry · attested 12 July 1922 at Dundalk · paybook no. 19818', url: '/family-archive/william-metcalfe-army-records/#national-army-census', linkLabel: 'Read the census entry and service-file guide' },
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
    { title: 'Birth', detail: 'Enoch Metcalf · 8 September 1874 · Altidore · father Anthony Metcalf, herd · mother Sarah Jane Metcalf, formerly Burns', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802' },
    { title: 'Marriage', detail: 'Enoch Medcalf and Mary King · 23 July 1895 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-2226913' },
    { title: 'Death', detail: 'Enoch Medcalf · 5 December 1939 · Rathdown', url: 'https://www.irishgenealogy.ie/view/?record_id=cide-2102615' },
    { title: '1901 Census', detail: 'Enock Medcalf · age 26 · domestic servant coachman and head of family · 6 Galloping Green, Stillorgan · with Mary and sons William, John and Edward', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=5536924&c20_year=1901', linkLabel: 'View 1901 census — National Archives' },
    { title: '1911 Census', detail: 'Enoch Medcalf · age 36 · domestic gardener and head of family · 33 Stillorgan Road · with Mary and children William, John, Edward, Mary and Hannah', url: 'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454237&c20_year=1911', linkLabel: 'View 1911 census — National Archives' },
    { title: '1926 Census', detail: 'Enoch Medcalf · age 51 · married head of household · Kilmacud Road, Stillorgan · with Mary and daughters Mary and Hannah', url: 'https://nationalarchives.ie/collections/search-the-1926-census/census-record/#a_id=467572', linkLabel: 'View 1926 census — National Archives' },
  ],
  'anthony-metcalf-enoch-father': [
    { title: 'Marriage', detail: 'Anthony Metcalf and Sarah Jane Burns · 7 September 1862 · Registrar’s Office, City of Cork · father John Metcalf, farmer', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-3312224' },
    { title: 'Son’s birth', detail: 'Enoch Metcalf · 8 September 1874 · Altidore · father Anthony Metcalf, herd', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802' },
  ],
  'sarah-jane-byrne': [
    { title: 'Marriage', detail: 'Sarah Jane Burns and Anthony Metcalf · 7 September 1862 · Registrar’s Office, City of Cork · father Patrick Burns, soldier, Royal Artillery', url: 'https://www.irishgenealogy.ie/view/?record_id=cima-3312224' },
    { title: 'Son’s birth', detail: 'Enoch Metcalf · 8 September 1874 · Altidore · mother Sarah Jane Metcalf, formerly Burns', url: 'https://www.irishgenealogy.ie/view/?record_id=f66be225e5-5809802' },
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
  const personId = String(person?.id || '')
  if (personId) return archive[archiveKeyByPersonId[personId]] || null
  const key = normalise(person?.name)
  return archive[key] || Object.values(archive).find((item) => item.aliases.some((alias) => normalise(alias) === key)) || null
}
export function searchTermsFor(person) {
  const item = familyHistoryFor(person)
  return [person?.name, person?.given_names, person?.surname, ...(item?.aliases || [])].filter(Boolean).join(' ').toLowerCase()
}
