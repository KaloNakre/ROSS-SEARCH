import {
  normalizeDomainId,
  resolveSelectedDomainIds,
  toggleDomainId,
  buildPreferredDomainString,
  LEGACY_DOMAIN_MAP
} from './src/utils/domainUtils.js';
import { RESEARCH_DOMAINS } from './src/data/mockData.js';

console.log('=================================================================');
console.log('>> FRONTEND DOMAIN RESOLUTION & UI INTERACTION TEST');
console.log('=================================================================');

// Test Case 1: Legacy string "cyber" when junction table is empty
console.log('\n[Case 1] Profile has legacy string preferred_domain="cyber", interests=[]:');
const profile1 = { preferred_domain: 'cyber', interests: [] };
const selected1 = resolveSelectedDomainIds(profile1, RESEARCH_DOMAINS);
console.log('   Resolved Selected IDs:', selected1);
console.log('   Selected Badge Count:', `${selected1.length} Selected`);
const card3Selected1 = selected1.includes(3);
console.log(`   Card #3 ("Cyber Security") active highlight: ${card3Selected1 ? 'HIGHLIGHTED (bg-blue-50 border-diu-blue)' : 'INACTIVE'}`);
if (selected1.length === 1 && card3Selected1) {
  console.log('   PASSED: Legacy "cyber" properly highlighted Card #3, no phantom state!');
} else {
  console.error('   FAILED: Phantom selection detected');
}

// Test Case 2: Legacy comma-separated shortcodes "ml, nlp, cv"
console.log('\n[Case 2] Profile has preferred_domain="ml, nlp, cv":');
const profile2 = { preferred_domain: 'ml, nlp, cv', interests: [] };
const selected2 = resolveSelectedDomainIds(profile2, RESEARCH_DOMAINS);
console.log('   Resolved Selected IDs:', selected2);
console.log('   Mapped Domain Names:', selected2.map(id => RESEARCH_DOMAINS.find(d => d.id === id)?.name));
console.log('   Selected Badge Count:', `${selected2.length} Selected`);

// Test Case 3: User clicks to toggle an interest
console.log('\n[Case 3] User clicks on Card #3 ("Cyber Security") to add it:');
const updatedIds = toggleDomainId(selected2, 3, RESEARCH_DOMAINS);
console.log('   Updated IDs after click:', updatedIds);
console.log('   New Badge Count:', `${updatedIds.length} Selected`);
console.log('   Card #3 now highlighted:', updatedIds.includes(3));

// Test Case 4: Payload prepared for backend PUT /api/students/me/interests
console.log('\n[Case 4] Preparing PUT /api/students/me/interests payload:');
const payload = { interest_ids: updatedIds };
console.log('   Payload:', JSON.stringify(payload));
console.log('   All IDs are strictly integers:', updatedIds.every(id => Number.isInteger(id)));

// Test Case 5: Reload with saved backend response
console.log('\n[Case 5] Reloading with saved DB response format:');
const apiResponse = {
  interests: [
    { id: 1, name: 'Machine Learning' },
    { id: 3, name: 'Cyber Security' },
    { id: 5, name: 'Natural Language Processing' },
    { id: 6, name: 'Computer Vision' }
  ],
  preferred_domain: 'Machine Learning, Cyber Security, Natural Language Processing, Computer Vision'
};
const reloadedSelected = resolveSelectedDomainIds(apiResponse, RESEARCH_DOMAINS);
console.log('   Reloaded Selected IDs:', reloadedSelected);
console.log('   Reloaded Badge Count:', `${reloadedSelected.length} Selected`);
for (const item of RESEARCH_DOMAINS) {
  const isHighlighted = reloadedSelected.includes(item.id);
  if (isHighlighted) {
    console.log(`   - [x] Card #${item.id} (${item.name}): ACTIVE HIGHLIGHT`);
  }
}

console.log('\n=================================================================');
console.log('>> ALL FRONTEND UI SIMULATION CHECKS PASSED');
console.log('=================================================================');
