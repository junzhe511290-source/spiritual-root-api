# AncientTongue.AI — Multi-Language Report API

PRO+ Tongue Diagnosis Report Generator with 7-language support.

## Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `zh` | 中文 | LTR |
| `en` | English | LTR |
| `de` | Deutsch | LTR |
| `es` | Español | LTR |
| `ar` | العربية | **RTL** |
| `th` | ไทย | LTR |
| `ms` | Bahasa Melayu | LTR |

## API Endpoint

### `POST /api/report`

Generate a localized PRO+ tongue diagnosis report.

**Request:**

```json
{
  "data": { /* structured tongue analysis data */ },
  "lang": "de",
  "format": "html"
}
```

**Parameters:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `data` | object | Yes | — | Structured tongue analysis data (see schema below) |
| `lang` | string | No | `"en"` | Output language code |
| `format` | string | No | `"html"` | `"html"` for rendered report, `"json"` for structured data |

**Response (HTML):**
- Content-Type: `text/html; charset=utf-8`
- Complete, self-contained HTML document with inline CSS
- Responsive design (780px max-width)
- RTL support for Arabic
- Report metadata injected as HTML comment at top: `<!-- report_metadata: {...} -->`

**Response (JSON):**
- Content-Type: `application/json`
- Structured report data with all text resolved to target language

### Response Metadata

All responses include these metadata fields (JSON body or HTML comment):

| Field | Type | Description |
|-------|------|-------------|
| `report_level` | string | `"PRO"` / `"NORMAL"` / `"MINIMAL"` — actual level generated |
| `downgraded` | boolean | `true` if report was downgraded from PRO |
| `downgrade_reason` | string | Only present if downgraded; explains why |

**JSON example (downgraded):**
```json
{
  "report_level": "NORMAL",
  "downgraded": true,
  "downgrade_reason": "Insufficient data for PRO-level report",
  "lang": "de",
  "direction": "ltr",
  "report": { ... },
  "generatedAt": "2026-07-15T09:42:00.000Z"
}
```

### Fallback Mechanism

The API guarantees it **never returns an empty report or error**. Three-level fallback:

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST RECEIVED                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │ isDataSufficientForPRO? │
         │ - patternName exists?   │
         │ - tongueBody has        │
         │   shape + color?        │
         │ - pathogenesis or       │
         │   predictions exist?    │
         └────────┬────────┬───────┘
                  │        │
            YES   │        │  NO
                  ▼        ▼
         ┌──────────────┐  ┌──────────────────────┐
         │ Try PRO      │  │ → Generate NORMAL    │
         │ generateReport│  │ generateNormalReport  │
         │ HTML/JSON    │  │ HTML/JSON             │
         └──────┬───────┘  └──────────┬────────────┘
                │                     │
           success?              success?
           ┌──┐ ┌──┐           ┌──┐ ┌──┐
        YES│  │ │  │NO       YES│  │ │  │NO
           ▼  │ │  ▼          ▼  │ │  ▼
    ┌──────┐ │ │ ┌──────────┐ │ │ ┌──────────┐
    │PRO   │ │ │ │→ NORMAL  │ │ │ │→ MINIMAL │
    │level │ │ │ │fallback  │ │ │ │last-resort│
    └──────┘ │ │ └──────────┘ │ │ └──────────┘
             │ │              │ │
             │ └─► try Normal │ └─► Minimal
             │                │
```

| Level | Sections | Badge Color | When |
|-------|----------|-------------|------|
| **PRO** | All 12 sections (tongue, sublingual, cross-validation, pathogenesis, predictions, red flags, treatments, food therapy, formulas, dietary rules, indicators, healing crisis) | Gold | Data is complete |
| **NORMAL** | Hero + tongue findings + pathogenesis + predictions + dietary rules + disclaimer | Grey | Data incomplete or PRO generation error |
| **MINIMAL** | Basic hero + disclaimer only | Grey | Both PRO and Normal failed (extreme edge case) |

### `GET /api/report/languages`

Returns list of supported languages with metadata.

**Response:**
```json
{
  "supported": ["zh", "en", "de", "es", "ar", "th", "ms"],
  "languages": [
    { "code": "de", "name": "Deutsch", "flag": "🇩🇪", "direction": "ltr" }
  ]
}
```

## Data Schema

The `data` object follows this structure:

```javascript
{
  // Meta information
  "meta": {
    "reportId": "PR-20260715-001",
    "date": "July 15, 2026"
  },

  // Subject info
  "subject": {
    "gender": { "zh": "女", "en": "Female", "de": "Weiblich", ... },
    "age": "41 years old",
    "birthInfo": { "zh": "生于1985年...", "en": "Born 1985...", ... }
  },

  // Pattern identification
  "patternName": { "zh": "阳郁血瘀", "en": "Stagnated Yang with Blood Stasis", "de": "Yang-Stagnation mit Blut-Stase", ... },
  "sixStages": [
    { "zh": "厥阴", "en": "Jueyin", "de": "Jueyin", ... }
  ],
  "patternTags": [
    { "zh": "肝郁阳遏", "en": "Liver Constraint with Yang Suppression", ... }
  ],

  // Hero description
  "heroDescription": { "zh": "...", "en": "...", "de": "...", ... },

  // Optional images
  "tongueImage": "https://...",
  "sublingualImage": "https://...",

  // Section 1: Tongue Body Analysis
  "tongueBody": {
    "title": { "en": "Dark Tongue Body..." },
    "shape": {
      "label": { "zh": "舌形", "en": "Shape", ... },
      "classification": { "zh": "偏窄而紧束", "en": "Narrow and constricted", ... },
      "presentation": { "zh": "...", "en": "...", ... },
      "significance": { "zh": "...", "en": "...", ... }
    },
    "color": { ... },
    "coat": { ... },
    "teethMarks": { ... },
    "zonesLabel": { "zh": "分区观察", "en": "Zone Observations", ... },
    "zones": [
      {
        "name": { "zh": "舌尖（心/肺）", "en": "Tip (Heart/Lung)", ... },
        "finding": { "zh": "...", "en": "...", ... },
        "meaning": { "zh": "...", "en": "...", ... }
      }
    ],
    "tipSpecial": { ... }
  },

  // Section 2: Sublingual Analysis
  "sublingual": {
    "collaterals": {
      "label": { "zh": "络脉三观察", "en": "Collateral Vessel Assessment", ... },
      "observations": [
        {
          "label": { "zh": "长度", "en": "Length", ... },
          "value": { "zh": "...", "en": "...", ... },
          "note": { "zh": "...", "en": "...", ... }
        }
      ]
    },
    "blockageLabel": { ... },
    "blockageZones": [ ... ]
  },

  // Section 3: Cross Validation
  "crossValidation": [
    {
      "tongueAbove": { "zh": "...", "en": "...", ... },
      "tongueBelow": { "zh": "...", "en": "...", ... },
      "conclusion": { "zh": "...", "en": "...", ... }
    }
  ],

  // Section 4: Pathogenesis
  "pathogenesis": {
    "coreMechanism": { "zh": "...", "en": "...", ... },
    "treatmentPrinciple": { "zh": "...", "en": "...", ... },
    "jiaoCards": [
      {
        "icon": "↑",
        "title": { "zh": "上焦", "en": "Upper Jiao", ... },
        "pattern": { "zh": "...", "en": "...", ... },
        "analysis": { "zh": "...", "en": "...", ... }
      }
    ],
    "deficiencyExcessLabel": { ... },
    "deficiencyExcess": {
      "deficiency": { "zh": "...", "en": "...", ... },
      "excess": { "zh": "...", "en": "...", ... }
    }
  },

  // Section 5: Symptom Predictions
  "predictions": [
    {
      "symptom": { "zh": "...", "en": "...", ... },
      "mechanism": { "zh": "...", "en": "...", ... },
      "screening": { "zh": "...", "en": "...", ... }
    }
  ],

  // Section 6: Red Flags
  "redFlags": [
    {
      "name": { "zh": "甲状腺结节", "en": "Thyroid Nodules", ... },
      "action": { "zh": "建议排查", "en": "Screening Recommended", ... }
    }
  ],

  // Section 7: External Treatments
  "treatments": {
    "guaSha": [
      { "name": { "zh": "...", "en": "...", ... }, "detail": { ... } }
    ],
    "moxibustion": [ ... ],
    "exercise": [ ... ],
    "acupressure": [ ... ],
    "contraindications": [ ... ]
  },

  // Section 8: Food Therapy
  "recipes": [
    {
      "name": { "zh": "玫瑰疏肝茶", "en": "Rose Liver-Soothing Tea", ... },
      "chineseName": "玫瑰疏肝茶",
      "ingredients": { "zh": "...", "en": "...", ... },
      "preparation": { "zh": "...", "en": "...", ... },
      "effect": { "zh": "...", "en": "...", ... }
    }
  ],
  "sugarGuide": true,

  // Section 9: Classical Formulas
  "formulas": [
    {
      "key": "siNiSan",
      "description": { "zh": "...", "en": "...", ... }
    }
  ],

  // Section 10: Dietary Rules
  "dietaryRules": [
    { "key": "avoidColdRaw" },
    { "key": "avoidAlcohol" },
    { "key": "avoidSpicy" },
    { "key": "dinnerEarly" },
    { "key": "limitCoffee" }
  ],

  // Section 11: Key Indicators
  "indicators": [
    {
      "name": { "zh": "四肢温度", "en": "Extremity Temperature", ... },
      "question": { "zh": "...", "en": "...", ... },
      "target": { "zh": "...", "en": "...", ... }
    }
  ],

  // Section 12: Healing Crisis
  "healingCrisis": {
    "symptoms": [
      { "zh": "...", "en": "...", ... }
    ]
  }
}
```

## Translation Strategy

### TCM Terminology
- **WHO standard nomenclature** used for core concepts (e.g., "Liver Qi Stagnation", "Blood Stasis")
- **Pinyin + local translation** for classical formulas (e.g., "Sì Nì Sǎn — Four Counterflow Powder")
- **International code + pinyin** for acupoints (e.g., "LV3 Taichong")

### Dietary Rules
Uses pre-translated rule keys (`avoidColdRaw`, `avoidAlcohol`, etc.) mapped to the translation dictionary for consistent terminology across reports.

### Classical Formulas
References formulas by key (`siNiSan`, `guiZhiFuLingWan`, `dangGuiSiNiTang`) with translations from the dictionary.

## Translation Files

- `report_translations.js` — Complete 7-language translation dictionary
- `report_generator.js` — HTML report template engine

## Usage Example

```bash
curl -X POST https://your-api.railway.app/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "meta": { "reportId": "PR-001", "date": "2026-07-15" },
      "patternName": { "de": "Yang-Stagnation mit Blut-Stase", "en": "Stagnated Yang with Blood Stasis" },
      ...
    },
    "lang": "de",
    "format": "html"
  }'
```

## Design Specs

- **Fonts:** Inter (body) + Playfair Display (headings)
- **Colors:** Deep navy (#0a0e27) hero, gold (#c8a86e) accents, warm background (#faf8f5)
- **Layout:** 780px max-width, responsive, print-friendly
- **RTL:** Full support for Arabic (dir="rtl", mirrored layouts)
- **Language-specific fonts:** Noto Sans Arabic / Noto Sans Thai loaded conditionally

## Company

AncientTongue AI Technology (Hainan) Co., Ltd.  
Contact: zhangyunfei@shejianai.com.cn
