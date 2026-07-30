/**
 * Spiritual Root Calculator REST API
 * Based on Purple Star Astrology (紫微斗数) via iztro
 * 
 * POST /api/spiritual-root
 *   Body: { birth_date: "YYYY-MM-DD", birth_hour: 0-23, gender: "male"|"female" }
 *   Returns: { primary_root, secondary_root, weakest_element, purity, quality, five_element_scores, emotional_traits, energy_profile, ... }
 * 
 * GET /api/spiritual-root?birth_date=YYYY-MM-DD&birth_hour=0-23&gender=male|female
 *   Same result via query params
 * 
 * GET /api/health  — health check
 * GET /api/docs    — API documentation
 */

import express from 'express';
import { astro as iztroAstro } from 'iztro';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============================================================
// CONSTANTS — Star Five-Element Mapping
// ============================================================

const STAR_ELEMENT_MAP = {
  // 主星 (Major Stars)
  '紫微': { element: 'earth', weight: 1.2 },
  '天机': { element: 'wood', weight: 1.4 },
  '太阳': { element: 'fire', weight: 1.5 },
  '武曲': { element: 'metal', weight: 1.4 },
  '天同': { element: 'water', weight: 1.2 },
  '廉贞': { element: 'fire', weight: 1.3 },
  '天府': { element: 'earth', weight: 1.1 },
  '太阴': { element: 'water', weight: 1.4 },
  '贪狼': { element: 'wood', weight: 1.3 },
  '巨门': { element: 'water', weight: 1.2 },
  '天相': { element: 'earth', weight: 0.8 },
  '天梁': { element: 'earth', weight: 1.0 },
  '七杀': { element: 'metal', weight: 1.5 },
  '破军': { element: 'water', weight: 1.3 },
  // 辅星 (Minor/Adjective Stars)
  '文昌': { element: 'metal', weight: 0.5 },
  '文曲': { element: 'water', weight: 0.5 },
  '左辅': { element: 'earth', weight: 0.3 },
  '右弼': { element: 'water', weight: 0.4 },
  '天魁': { element: 'fire', weight: 0.4 },
  '天钺': { element: 'metal', weight: 0.3 },
  '禄存': { element: 'earth', weight: 0.4 },
  '天马': { element: 'fire', weight: 0.4 },
  // English names (iztro en-US output fallback)
  'Purple': { element: 'earth', weight: 1.2 },
  'Mental': { element: 'wood', weight: 1.4 },
  'Solar': { element: 'fire', weight: 1.5 },
  'Martial': { element: 'metal', weight: 1.4 },
  'Fortune': { element: 'water', weight: 1.2 },
  'Chastity': { element: 'fire', weight: 1.3 },
  'Treasury': { element: 'earth', weight: 1.1 },
  'Lunar': { element: 'water', weight: 1.4 },
  'Appetite': { element: 'wood', weight: 1.3 },
  'Giant': { element: 'water', weight: 1.2 },
  'Minister': { element: 'earth', weight: 0.8 },
  'Canopy': { element: 'earth', weight: 1.0 },
  'Killer': { element: 'metal', weight: 1.5 },
  'Rebel': { element: 'water', weight: 1.3 },
  'Literary': { element: 'metal', weight: 0.5 },
  'Melodic': { element: 'water', weight: 0.5 },
  'LeftAid': { element: 'earth', weight: 0.3 },
  'RightAid': { element: 'water', weight: 0.4 },
  'Quen': { element: 'fire', weight: 0.4 },
  'Yue': { element: 'metal', weight: 0.3 },
  'Stored': { element: 'earth', weight: 0.4 },
  'HeavenlySteed': { element: 'fire', weight: 0.4 },
};

// Palace weights — key palaces get higher weight
const PALACE_WEIGHT_CN = {
  '命宫': 2.0, '疾厄': 1.5, '身宫': 1.3, '福德': 1.0,
};
const PALACE_WEIGHT_EN = {
  'Spirit': 2.0, 'Health': 1.5, 'Body': 1.3, 'Blessing': 1.0,
};
const DEFAULT_PALACE_WEIGHT = 0.5;

// Heavenly Stem → Element
const STEM_ELEMENT = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

// Earthly Branch → Element
const BRANCH_ELEMENT = {
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '亥': 'water', '子': 'water',
};

// Mutagen (四化) Modifier
const MUTAGEN_MODIFIER = {
  '禄': +0.5,   // 化禄 — energy amplified
  '权': +0.3,   // 化权 — strong control
  '科': +0.2,   // 化科 — balanced
  '忌': -1.0,   // 化忌 — congenital weakness
};

// Normalization factors (balance distribution across elements)
const NORMALIZATION_FACTOR = {
  earth: 4.8,   // 紫微1.2 + 天府1.1 + 天相0.8 + 天梁1.0 + 左辅0.3 + 禄存0.4
  fire: 3.6,    // 太阳1.5 + 廉贞1.3 + 天魁0.4 + 天马0.4
  wood: 2.7,    // 天机1.4 + 贪狼1.3
  metal: 3.7,   // 武曲1.4 + 七杀1.5 + 文昌0.5 + 天钺0.3
  water: 6.0,   // 天同1.2 + 太阴1.4 + 巨门1.2 + 破军1.3 + 文曲0.5 + 右弼0.4
};

// Spiritual Root descriptive data
const ROOT_DATA = {
  wood: {
    name: 'Wood', emoji: '🌿', color: '#6abf69',
    emotion: 'Creative vision, strong purpose, forward drive',
    energy: 'Growth-type energy — like a seed breaking through soil in spring',
    imbalance: 'Easily anxious, emotionally blocked, unexplained irritability, hesitation in decisions',
    shadow: 'Your Wood energy governs how smoothly your emotions flow — when blocked, frustration builds up like pressure in a sealed bottle',
    cultivation: 'Clear your emotional blockages. Release stuck energy. Let your creativity flow. Learn flexibility over rigidity — the willow bends, the oak breaks.',
    crystal: 'Green Phantom · Prehnite',
    oil: 'Cedar · Peppermint',
  },
  fire: {
    name: 'Fire', emoji: '🔥', color: '#e74c3c',
    emotion: 'Passionate, magnetic presence, sharp intuition',
    energy: 'Radiant-type energy — like a flame that warms and illuminates everything around it',
    imbalance: 'Anxiety insomnia, emotional overload, restless mind, easily overexcited or crashing',
    shadow: 'Your Fire element is the throne of your consciousness — when overheated, anxiety takes the throne',
    cultivation: 'Cool your inner fire. Find calm within the blaze. Anchor your excitement. Learn to sustain warmth without burning out.',
    crystal: 'Red Agate · Garnet',
    oil: 'Frankincense · Cinnamon',
  },
  earth: {
    name: 'Earth', emoji: '⛰️', color: '#d4a76a',
    emotion: 'Nurturing, grounded, trustworthy presence',
    energy: 'Foundational-type energy — like the earth that carries all things without judgment',
    imbalance: 'Over-worrying, rumination loops, digestive issues, lack of security',
    shadow: 'Your Earth element is your foundation — when unstable, everything you build feels shaky',
    cultivation: 'Ground yourself. Release what isn\'t yours to carry. Build stable energy. Find stillness in a world of motion.',
    crystal: 'Tiger Eye · Amber',
    oil: 'Sandalwood · Patchouli',
  },
  metal: {
    name: 'Metal', emoji: '⚔️', color: '#c0c0d0',
    emotion: 'Decisive, disciplined, pursuit of excellence',
    energy: 'Contractive-type energy — like autumn\'s clarity cutting away what no longer serves',
    imbalance: 'Grief suppression, holding onto the past, shallow breathing, perfectionist inner drain',
    shadow: 'Your Metal element is your boundary with the world — when weakened, you absorb too much from your environment',
    cultivation: 'Learn to let go. Release emotional toxins. Move from perfection to wholeness. Grief is not weakness — it is the season before renewal.',
    crystal: 'Clear Quartz · Silver',
    oil: 'Myrrh · Eucalyptus',
  },
  water: {
    name: 'Water', emoji: '🌊', color: '#5b9bd5',
    emotion: 'Deep wisdom, powerful intuition, high adaptability',
    energy: 'Latent-type energy — like deep waters holding immense potential power beneath the surface',
    imbalance: 'Fear and insecurity, weakened willpower, energy depletion, lack of inner drive',
    shadow: 'Your Water element holds your deepest reserves — when depleted, you feel empty no matter how much you rest',
    cultivation: 'Activate your core energy. Move from fear to wisdom. Fill your deepest reserves. Still water runs deep — but stagnant water breeds fear.',
    crystal: 'Obsidian · Labradorite',
    oil: 'Lavender · Rosemary',
  }
};

const QUALITY_DATA = {
  heavenly: {
    name: 'Heavenly Root', cn: '天灵根',
    desc: 'Single-element dominance — extremely rare. Your energy signature is remarkably pure.',
  },
  mutant: {
    name: 'Mutant Root', cn: '异灵根',
    desc: 'Dual-element harmony — excellent aptitude. You carry two powerful energy channels.',
  },
  hybrid: {
    name: 'Hybrid Root', cn: '杂灵根',
    desc: 'Multi-element balance — requires comprehensive cultivation. Your path is integration.',
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/** Convert 24-hour clock (0-23) to iztro hourIndex (0-11) */
function hourToIztroIndex(hour) {
  return Math.floor(((hour + 1) % 24) / 2);
}

/** Get palace weight */
function getPalaceWeight(palace) {
  let baseWeight = PALACE_WEIGHT_CN[palace.name] || PALACE_WEIGHT_EN[palace.name] || DEFAULT_PALACE_WEIGHT;
  if (palace.isBodyPalace) {
    baseWeight = Math.max(baseWeight, 1.3);
  }
  return baseWeight;
}

/** Get element from star name */
function getStarElement(starName) {
  const info = STAR_ELEMENT_MAP[starName];
  return info ? info.element : null;
}

/** Get weight from star name */
function getStarWeight(starName) {
  const info = STAR_ELEMENT_MAP[starName];
  return info ? info.weight : 0;
}

// ============================================================
// CORE ALGORITHM
// ============================================================

/**
 * Calculate Five Elements scores from an iztro astrolabe
 * @param {object} astrolabe - iztro astrolabe object
 * @returns {object} scores - { wood, fire, earth, metal, water }
 */
function calculateFiveElements(astrolabe) {
  const scores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const huaJiElements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const palaces = astrolabe.palaces;

  // 1. Star contribution per palace
  for (const palace of palaces) {
    const pWeight = getPalaceWeight(palace);
    const allStars = [
      ...(palace.majorStars || []),
      ...(palace.minorStars || []),
      ...(palace.adjectiveStars || [])
    ];

    for (const star of allStars) {
      const el = getStarElement(star.name);
      const sWeight = getStarWeight(star.name);
      if (el && sWeight > 0) {
        scores[el] += sWeight * pWeight;

        // 四化修正
        if (star.mutagen && MUTAGEN_MODIFIER[star.mutagen] !== undefined) {
          const mod = MUTAGEN_MODIFIER[star.mutagen];
          scores[el] += mod * pWeight;

          // Track 化忌 for special processing
          if (star.mutagen === '忌') {
            huaJiElements[el] += sWeight;
          }
        }
      }
    }
  }

  // 2. Heavenly Stem & Earthly Branch base scores
  const chineseDate = astrolabe.chineseDate || '';
  const parts = chineseDate.split(/\s+/);
  if (parts.length >= 1) {
    const yearStem = parts[0].charAt(0);
    const yearBranch = parts[0].charAt(1);
    if (STEM_ELEMENT[yearStem]) scores[STEM_ELEMENT[yearStem]] += 0.5;
    if (BRANCH_ELEMENT[yearBranch]) scores[BRANCH_ELEMENT[yearBranch]] += 0.3;
  }

  // 3. 化忌 special weakening: if an element has 化忌 stars, reduce its score
  for (const el of Object.keys(huaJiElements)) {
    if (huaJiElements[el] > 0) {
      scores[el] *= 0.6;  // Major weakening per Master Ni's theory
    }
  }

  // 4. Ensure no negative scores
  for (const el of Object.keys(scores)) {
    if (scores[el] < 0) scores[el] = 0;
  }

  // 5. Normalize by element's total star weight to balance distribution
  for (const el of Object.keys(scores)) {
    scores[el] = scores[el] / NORMALIZATION_FACTOR[el];
  }

  return scores;
}

/**
 * Determine Spiritual Root from five element scores
 * @param {object} scores - { wood, fire, earth, metal, water }
 * @returns {object} result
 */
function determineSpiritualRoot(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];

  const total = Object.values(scores).reduce((s, v) => s + v, 0);
  const purity = total > 0 ? scores[primary] / total : 0;

  let qualityKey, quality;
  if (purity > 0.35) {
    qualityKey = 'heavenly'; quality = QUALITY_DATA.heavenly;
  } else if (purity > 0.28) {
    qualityKey = 'mutant'; quality = QUALITY_DATA.mutant;
  } else {
    qualityKey = 'hybrid'; quality = QUALITY_DATA.hybrid;
  }

  const weakest = sorted[sorted.length - 1][0];

  return { primary, secondary, weakest, purity, qualityKey, quality, scores, sorted };
}

// ============================================================
// INPUT VALIDATION
// ============================================================

function validateInput({ birth_date, birth_hour, gender }) {
  const errors = [];

  // birth_date validation
  if (!birth_date) {
    errors.push('birth_date is required (YYYY-MM-DD)');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birth_date)) {
      errors.push('birth_date must be in YYYY-MM-DD format');
    } else {
      const d = new Date(birth_date);
      if (isNaN(d.getTime())) {
        errors.push('birth_date is not a valid date');
      } else {
        const year = d.getFullYear();
        if (year < 1900 || year > new Date().getFullYear()) {
          errors.push(`birth_date year must be between 1900 and ${new Date().getFullYear()}`);
        }
      }
    }
  }

  // birth_hour validation
  if (birth_hour === undefined || birth_hour === null) {
    errors.push('birth_hour is required (0-23 integer)');
  } else {
    const h = Number(birth_hour);
    if (!Number.isInteger(h) || h < 0 || h > 23) {
      errors.push('birth_hour must be an integer from 0 to 23');
    }
  }

  // gender validation
  if (!gender) {
    errors.push('gender is required ("male" or "female")');
  } else if (gender !== 'male' && gender !== 'female') {
    errors.push('gender must be "male" or "female"');
  }

  return errors;
}

// ============================================================
// MAIN CALCULATION
// ============================================================

function computeSpiritualRoot(birth_date, birth_hour, gender) {
  // Map gender to Chinese
  const genderCN = gender === 'male' ? '男' : '女';

  // Convert 24-hour to iztro hour index (0-11)
  const hourIndex = hourToIztroIndex(birth_hour);

  // Generate astrolabe via iztro
  const astrolabe = iztroAstro.bySolar(birth_date, hourIndex, genderCN, true, 'zh-CN');

  // Calculate five elements scores
  const scores = calculateFiveElements(astrolabe);

  // Determine spiritual root
  const result = determineSpiritualRoot(scores);

  // Build response
  const rootData = ROOT_DATA[result.primary];
  const secRootData = ROOT_DATA[result.secondary];
  const weakRootData = ROOT_DATA[result.weakest];

  const response = {
    // Core results
    primary_root: {
      element: result.primary,
      name: rootData.name,
      emoji: rootData.emoji,
      color: rootData.color,
    },
    secondary_root: {
      element: result.secondary,
      name: secRootData.name,
      emoji: secRootData.emoji,
      color: secRootData.color,
    },
    weakest_element: {
      element: result.weakest,
      name: weakRootData.name,
      emoji: weakRootData.emoji,
      shadow: weakRootData.shadow,
    },
    purity: Math.round(result.purity * 1000) / 1000,
    quality: {
      key: result.qualityKey,
      name: result.quality.name,
      cn: result.quality.cn,
      desc: result.quality.desc,
    },

    // Five element scores
    five_element_scores: {
      wood: Math.round(scores.wood * 1000) / 1000,
      fire: Math.round(scores.fire * 1000) / 1000,
      earth: Math.round(scores.earth * 1000) / 1000,
      metal: Math.round(scores.metal * 1000) / 1000,
      water: Math.round(scores.water * 1000) / 1000,
    },

    // Emotional traits
    emotional_traits: {
      pattern: rootData.emotion,
      imbalance_signals: rootData.imbalance,
      energy_shadow: weakRootData.shadow,
    },

    // Energy profile
    energy_profile: {
      type: rootData.energy,
      cultivation_path: rootData.cultivation,
      crystal: rootData.crystal,
      essential_oil: rootData.oil,
    },

    // Chart metadata
    chart: {
      chinese_date: astrolabe.chineseDate,
      five_elements_class: astrolabe.fiveElementsClass,
      solar_date: astrolabe.solarDate,
      zodiac: astrolabe.zodiac,
      sign: astrolabe.sign,
    },

    // Sorted element ranking
    element_ranking: result.sorted.map(([el, score]) => ({
      element: el,
      name: ROOT_DATA[el].name,
      score: Math.round(score * 1000) / 1000,
    })),

    // Input echo
    input: {
      birth_date,
      birth_hour,
      gender,
      hour_index_used: hourIndex,
    }
  };

  return response;
}

// ============================================================
// API ROUTES
// ============================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'spiritual-root-api', version: '1.0.0' });
});

// API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    service: 'Spiritual Root Calculator API',
    version: '1.0.0',
    description: 'Calculate spiritual root (灵根) based on Purple Star Astrology (紫微斗数)',
    endpoints: {
      'POST /api/spiritual-root': {
        description: 'Calculate spiritual root from birth data',
        content_type: 'application/json',
        body: {
          birth_date: { type: 'string', format: 'YYYY-MM-DD', required: true, example: '1990-08-16' },
          birth_hour: { type: 'integer', range: '0-23', required: true, description: 'Hour of birth in 24-hour format', example: 14 },
          gender: { type: 'string', enum: ['male', 'female'], required: true, example: 'female' },
        },
        response: {
          primary_root: { element: 'string', name: 'string', emoji: 'string', color: 'string' },
          secondary_root: { element: 'string', name: 'string', emoji: 'string', color: 'string' },
          weakest_element: { element: 'string', name: 'string', emoji: 'string', shadow: 'string' },
          purity: { type: 'number', range: '0-1', description: 'Dominance of primary element' },
          quality: { key: 'heavenly|mutant|hybrid', name: 'string', cn: 'string', desc: 'string' },
          five_element_scores: { wood: 'number', fire: 'number', earth: 'number', metal: 'number', water: 'number' },
          emotional_traits: { pattern: 'string', imbalance_signals: 'string', energy_shadow: 'string' },
          energy_profile: { type: 'string', cultivation_path: 'string', crystal: 'string', essential_oil: 'string' },
          chart: { chinese_date: 'string', five_elements_class: 'string', solar_date: 'string', zodiac: 'string', sign: 'string' },
          element_ranking: 'array of {element, name, score} sorted descending',
          input: { birth_date: 'string', birth_hour: 'integer', gender: 'string', hour_index_used: 'integer' },
        },
      },
      'GET /api/spiritual-root': {
        description: 'Same as POST but via query parameters',
        params: { birth_date: 'YYYY-MM-DD', birth_hour: '0-23', gender: 'male|female' },
      },
      'GET /api/health': 'Health check',
      'GET /api/docs': 'This documentation',
    },
    quality_thresholds: {
      heavenly: { cn: '天灵根', purity: '> 0.35', desc: 'Single-element dominance, extremely rare' },
      mutant: { cn: '异灵根', purity: '> 0.28', desc: 'Dual-element harmony, excellent aptitude' },
      hybrid: { cn: '杂灵根', purity: '≤ 0.28', desc: 'Multi-element balance, comprehensive cultivation needed' },
    },
  });
});

// Spiritual Root calculation — POST
app.post('/api/spiritual-root', (req, res) => {
  try {
    const { birth_date, birth_hour, gender } = req.body;

    const errors = validateInput({ birth_date, birth_hour, gender });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const result = computeSpiritualRoot(birth_date, Number(birth_hour), gender);
    res.json(result);
  } catch (err) {
    console.error('Spiritual Root calculation error:', err);
    res.status(500).json({ error: 'Calculation failed', message: err.message });
  }
});

// Spiritual Root calculation — GET
app.get('/api/spiritual-root', (req, res) => {
  try {
    const { birth_date, birth_hour, gender } = req.query;

    const errors = validateInput({ birth_date, birth_hour: birth_hour !== undefined ? Number(birth_hour) : undefined, gender });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const result = computeSpiritualRoot(birth_date, Number(birth_hour), gender);
    res.json(result);
  } catch (err) {
    console.error('Spiritual Root calculation error:', err);
    res.status(500).json({ error: 'Calculation failed', message: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    service: 'Spiritual Root Calculator API',
    version: '1.0.0',
    endpoints: ['/api/spiritual-root', '/api/health', '/api/docs'],
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`🔮 Spiritual Root API running on http://localhost:${PORT}`);
  console.log(`   POST /api/spiritual-root  — Calculate spiritual root`);
  console.log(`   GET  /api/health          — Health check`);
  console.log(`   GET  /api/docs            — API documentation`);
});
