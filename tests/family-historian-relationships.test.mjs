import assert from 'node:assert/strict';

function relationshipPath(startId,endId,parentChild,couples,maxDepth=8){
 if(!startId||!endId)return null;
 if(startId===endId)return[{id:startId,via:'same person'}];
 const adj=new Map(),add=(a,b,via)=>{if(!adj.has(a))adj.set(a,[]);adj.get(a).push({id:b,via})};
 for(const r of parentChild){add(r.parent_id,r.child_id,'parent of');add(r.child_id,r.parent_id,'child of')}
 for(const r of couples){add(r.person1_id,r.person2_id,'spouse of');add(r.person2_id,r.person1_id,'spouse of')}
 const queue=[{id:startId,path:[{id:startId,via:''}]}],seen=new Set([startId]);
 while(queue.length){const cur=queue.shift();if(cur.path.length>maxDepth+1)continue;for(const next of adj.get(cur.id)||[]){if(seen.has(next.id))continue;const path=[...cur.path,{id:next.id,via:next.via}];if(next.id===endId)return path;seen.add(next.id);queue.push({id:next.id,path})}}
 return null;
}

const parentChild=[
 {parent_id:'enoch',child_id:'william'},
 {parent_id:'william',child_id:'catherine'},
 {parent_id:'enoch',child_id:'john'}
];
const couples=[{person1_id:'enoch',person2_id:'mary'}];

assert.deepEqual(relationshipPath('enoch','catherine',parentChild,couples),[
 {id:'enoch',via:''},{id:'william',via:'parent of'},{id:'catherine',via:'parent of'}
]);
assert.deepEqual(relationshipPath('catherine','enoch',parentChild,couples),[
 {id:'catherine',via:''},{id:'william',via:'child of'},{id:'enoch',via:'child of'}
]);
assert.equal(relationshipPath('john','missing',parentChild,couples),null);
assert.equal(relationshipPath('enoch','catherine',parentChild,couples,1),null);
assert.equal(relationshipPath('enoch','enoch',parentChild,couples)[0].via,'same person');
console.log('Family Historian relationship traversal tests passed');
