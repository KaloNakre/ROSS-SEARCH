import { RESEARCH_DOMAINS } from '../data/mockData.js';

/**
 * Legacy string code to canonical integer ID map.
 * Hand-curated to safely resolve legacy shortcodes (e.g., 'cyber', 'ml', 'nlp')
 * and legacy name variants without relying on Number(str) which yields NaN.
 */
export const LEGACY_DOMAIN_MAP = {
  // Short codes
  'cyber': 3,
  'cybersecurity': 3,
  'cyber security': 3,
  'net_sec': 3,
  'network security': 3,
  'info_sec': 3,
  'information security': 3,
  'ml': 1,
  'machine learning': 1,
  'dl': 1,
  'deep learning': 1,
  'ds': 2,
  'data science': 2,
  'data science & big data': 2,
  'ai': 4,
  'ai & robotics': 4,
  'artificial intelligence': 4,
  'robotics': 4,
  'robotics & embedded systems': 4,
  'edge_ai': 4,
  'nlp': 5,
  'natural language processing': 5,
  'cv': 6,
  'computer vision': 6,
  'iot': 7,
  'internet of things': 7,
  'cloud': 8,
  'cloud computing': 8,
  'cloud computing & devops': 8,
  'bioinformatics': 9,
  'bioinformatics & healthcare ai': 9,
  'blockchain': 10,
  'blockchain & distributed systems': 10,
  'hci': 11,
  'human-computer interaction': 11,
  'human-computer interaction (hci)': 11,
  'se': 11,
  'software engineering': 11,
  'software engineering & testing': 11,
  'others': 12,
  'other': 12
};

/**
 * Safely parse any input (number, numeric string, legacy shortcode, or domain name)
 * into a valid integer ID matching the canonical DB seed.
 *
 * @param {any} input - Value to normalize (e.g., 3, "3", "cyber", "Machine Learning", { id: 3 })
 * @param {Array} [catalog=RESEARCH_DOMAINS] - List of available interest objects
 * @returns {number|null} - Canonical integer ID or null if unresolvable
 */
export const normalizeDomainId = (input, catalog = RESEARCH_DOMAINS) => {
  if (input === null || input === undefined) return null;

  // If input is an object with an id (e.g., from DB relation { id: 3, name: "Cyber Security" })
  if (typeof input === 'object' && input.id !== undefined) {
    return normalizeDomainId(input.id, catalog);
  }

  // If input is already a number
  if (typeof input === 'number' && !isNaN(input)) {
    return Number.isInteger(input) ? input : Math.floor(input);
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // 1. Direct numeric string check (e.g., "3")
    const num = Number(trimmed);
    if (!isNaN(num) && Number.isInteger(num)) {
      return num;
    }

    // 2. Check legacy shortcode map (e.g., "cyber" -> 3)
    const lower = trimmed.toLowerCase();
    if (LEGACY_DOMAIN_MAP[lower] !== undefined) {
      return LEGACY_DOMAIN_MAP[lower];
    }

    // 3. Fallback name match against catalog
    const normText = lower.replace(/[^a-z0-9]/g, '');
    const matched = catalog.find(item => {
      const itemNorm = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return itemNorm === normText || (normText.length >= 3 && (itemNorm.includes(normText) || normText.includes(itemNorm)));
    });

    if (matched) {
      return typeof matched.id === 'number' ? matched.id : Number(matched.id);
    }
  }

  return null;
};

/**
 * Resolves a student profile's saved interests into an array of strictly valid integer IDs.
 * Correctly handles:
 *  - Junction table relation array: [{ id: 3, name: "Cyber Security" }]
 *  - ID array: [3, 5]
 *  - Legacy string codes: ["cyber", "nlp"]
 *  - Free-text preferred_domain fallback: "cyber, machine learning" or "Cyber Security"
 *
 * Guaranteed to return only integer IDs that exist in availableInterests.
 *
 * @param {object} profile - Student profile data from API or state
 * @param {Array} availableInterests - Catalog of available domains
 * @returns {number[]} Array of canonical integer IDs
 */
export const resolveSelectedDomainIds = (profile, availableInterests = RESEARCH_DOMAINS) => {
  if (!profile) return [];

  const catalog = availableInterests && availableInterests.length > 0 ? availableInterests : RESEARCH_DOMAINS;
  const validCatalogIds = new Set(catalog.map(d => Number(d.id)).filter(id => !isNaN(id)));

  const resolvedIds = new Set();

  // 1. First prioritize explicit interests array (from Student.interests junction table)
  if (Array.isArray(profile.interests) && profile.interests.length > 0) {
    for (const item of profile.interests) {
      const id = normalizeDomainId(item, catalog);
      if (id !== null && validCatalogIds.has(id)) {
        resolvedIds.add(id);
      }
    }
  }

  // 2. If no IDs were resolved from interests, check preferred_domain text
  if (resolvedIds.size === 0 && profile.preferred_domain && typeof profile.preferred_domain === 'string') {
    const rawTokens = profile.preferred_domain
      .split(/[,;|]/)
      .map(s => s.trim())
      .filter(Boolean);

    for (const token of rawTokens) {
      const id = normalizeDomainId(token, catalog);
      if (id !== null && validCatalogIds.has(id)) {
        resolvedIds.add(id);
      }
    }
  }

  return Array.from(resolvedIds);
};

/**
 * Toggles an interest ID in an array of integer IDs.
 *
 * @param {number[]} currentIds - Currently selected integer IDs
 * @param {any} target - ID or object to toggle
 * @param {Array} [catalog=RESEARCH_DOMAINS] - Catalog
 * @returns {number[]} New array of integer IDs
 */
export const toggleDomainId = (currentIds, target, catalog = RESEARCH_DOMAINS) => {
  const targetId = normalizeDomainId(target, catalog);
  if (targetId === null) return currentIds;

  const exists = currentIds.includes(targetId);
  return exists
    ? currentIds.filter(id => id !== targetId)
    : [...currentIds, targetId];
};

/**
 * Builds a clean comma-separated human-readable preferred_domain string from selected IDs.
 *
 * @param {number[]} selectedIds - Array of integer IDs
 * @param {Array} [catalog=RESEARCH_DOMAINS] - Catalog
 * @returns {string} e.g. "Machine Learning, Cyber Security"
 */
export const buildPreferredDomainString = (selectedIds, catalog = RESEARCH_DOMAINS) => {
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) return '';
  const idSet = new Set(selectedIds);
  return catalog
    .filter(item => idSet.has(Number(item.id)))
    .map(item => item.name)
    .join(', ');
};
