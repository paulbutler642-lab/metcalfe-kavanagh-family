// Shared evidence rules for automatic family-history research.
// These rules strengthen a match; they never replace the requirement for corroborating evidence.
export const FAMILY_RESEARCH_RULES = {
  metcalfeStillorgan: {
    surnames: ['metcalfe','metcalf','medcalfe','medcalf'],
    anchorGivenNames: ['enoch','enock'],
    anchorCouple: ['enoch','mary'],
    places: ['stillorgan','blackrock','kilmacud','galloping green','rathdown'],
    denomination: 'Church of Ireland',
    churches: ["St Brigid's Stillorgan",'Christ Church Blackrock','All Saints Blackrock'],
    guidance: 'For Metcalfe/Medcalf records in the Stillorgan–Blackrock area, an Enoch/Enock reference is a powerful family anchor. Enoch together with Mary, a matching Metcalfe surname variant and a known locality is exceptionally strong corroborating evidence. Church of Ireland registers should be prioritised for baptism, marriage and burial research. A rare-name anchor must still agree with the record context and must never be used to force an otherwise contradictory match.'
  }
};

const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function metcalfeAnchorEvidence(recordText='') {
  const text=norm(recordText), rule=FAMILY_RESEARCH_RULES.metcalfeStillorgan;
  const surname=rule.surnames.some(x=>text.includes(x));
  const enoch=rule.anchorGivenNames.some(x=>text.includes(x));
  const mary=text.includes('mary');
  const places=rule.places.filter(x=>text.includes(norm(x)));
  const score=(surname?1:0)+(enoch?2:0)+(mary&&enoch?2:0)+(places.length?1:0);
  return {surname,enoch,mary,places,score,strong: surname&&enoch&&places.length>0,exceptional:surname&&enoch&&mary&&places.length>0};
}

if(typeof window!=='undefined') window.__FAMILY_RESEARCH_RULES__=FAMILY_RESEARCH_RULES;
