/**
 * AncientTongue.AI — Multi-Language PRO Report Generator
 * 
 * Generates complete HTML reports from structured tongue analysis data.
 * Supports 7 languages with a unified brand-consistent template.
 * 
 * Design specs:
 * - Inter + Playfair Display fonts
 * - Deep navy blue (#0a0e27) Hero with gold (#c8a86e) accents
 * - 780px max-width, responsive
 * - RTL support for Arabic
 */

import { translations, t, getDirection } from './report_translations.js';

// ============================================================
// HTML TEMPLATE
// ============================================================

function getStylesheet(dir) {
  const isRTL = dir === 'rtl';
  const textAlign = isRTL ? 'right' : 'left';
  const borderLeftDir = isRTL ? 'border-right' : 'border-left';
  
  return `
/* === RESET & BASE === */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { font-size: 15px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans Arabic', 'Noto Sans Thai', sans-serif;
  background: #e8e4df;
  color: #2c2c2c;
  line-height: 1.7;
  padding: 20px 0;
  direction: ${dir};
  text-align: ${textAlign};
}
.page-wrap {
  max-width: 780px;
  margin: 0 auto;
  background: #faf8f5;
  box-shadow: 0 20px 80px rgba(0,0,0,0.15);
}
.hero {
  background: linear-gradient(165deg, #0a0e27 0%, #1a1f3a 45%, #0d1b2a 100%);
  padding: 48px 48px 44px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  ${isRTL ? 'left' : 'right'}: -30%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(200,168,110,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,168,110,0.4), transparent);
}
.pro-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #c8a86e 0%, #e8d5a8 50%, #c8a86e 100%);
  color: #0a0e27;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 6px 14px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(200,168,110,0.3);
}
.pro-badge::before { content: '\\2605'; font-size: 10px; }
.hero-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(200,168,110,0.7);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px;
  font-weight: 700;
  color: #f0e6d3;
  line-height: 1.35;
  margin-bottom: 20px;
}
.hero-title em { color: #c8a86e; font-style: normal; }
.tongue-placeholders {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}
.tongue-placeholder {
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(200,168,110,0.25);
  border-radius: 10px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.tongue-placeholder-icon {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(200,168,110,0.1);
  border: 1px solid rgba(200,168,110,0.2);
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.tongue-placeholder-text { font-size: 11px; color: rgba(200,168,110,0.5); letter-spacing: 1px; text-transform: uppercase; }
.tongue-placeholder-sub { font-size: 10px; color: rgba(255,255,255,0.3); }
.hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.hero-tag {
  font-size: 11px; color: #c8a86e;
  background: rgba(200,168,110,0.1);
  padding: 4px 12px; border-radius: 20px;
  border: 1px solid rgba(200,168,110,0.2);
  letter-spacing: 0.3px;
}
.hero-tag.six-stages { border-color: rgba(200,168,110,0.4); background: rgba(200,168,110,0.15); }
.hero-meta { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 16px; letter-spacing: 0.5px; }
.hero-meta span { color: rgba(200,168,110,0.6); }
.hero-description {
  font-size: 13.5px; color: rgba(255,255,255,0.75); line-height: 1.75; margin-bottom: 20px;
  padding: 16px; background: rgba(255,255,255,0.03); border-radius: 8px;
  ${borderLeftDir}: 2px solid rgba(200,168,110,0.3);
}
.hero-profile {
  display: flex; flex-wrap: wrap; gap: 20px;
  font-size: 12.5px; color: rgba(255,255,255,0.6); margin-bottom: 12px;
}
.hero-profile strong { color: rgba(255,255,255,0.85); font-weight: 600; }
.hero-ai-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; color: rgba(200,168,110,0.6); margin-top: 8px;
}
.hero-ai-badge::before {
  content: ''; width: 6px; height: 6px; background: #c8a86e; border-radius: 50%; opacity: 0.5;
}
.section { padding: 36px 48px; border-bottom: 1px solid rgba(200,168,110,0.12); }
.section:last-of-type { border-bottom: none; }
.section-eyebrow {
  font-size: 10px; letter-spacing: 3px; color: #c8a86e;
  text-transform: uppercase; margin-bottom: 6px; font-weight: 600;
}
.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 21px; font-weight: 700; color: #1a1a2e;
  margin-bottom: 20px; position: relative; padding-bottom: 12px;
}
.section-title::after {
  content: ''; position: absolute; bottom: 0; ${isRTL ? 'right' : 'left'}: 0;
  width: 40px; height: 2px; background: linear-gradient(90deg, #c8a86e, transparent);
}
.card {
  background: #ffffff; border-radius: 10px; padding: 20px 24px; margin-bottom: 14px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02);
}
.card.gold-border { ${borderLeftDir}: 3px solid #c8a86e; }
.card.warm-border { ${borderLeftDir}: 3px solid #e67e22; }
.card.red-bg { background: #fef7f7; border: 1px solid rgba(231,76,60,0.15); }
.card-title {
  font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.card-title .icon {
  width: 22px; height: 22px; background: rgba(200,168,110,0.1);
  border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px;
}
.detail-row { display: flex; margin-bottom: 8px; align-items: flex-start; }
.detail-label {
  font-size: 12px; color: #999; width: 100px; flex-shrink: 0;
  font-weight: 500; padding-top: 1px;
}
.detail-value { font-size: 13px; color: #333; flex: 1; line-height: 1.6; }
.detail-value.highlight { color: #8b7340; font-weight: 600; }
.detail-value.dim { color: #888; font-size: 12px; font-style: italic; }
.detail-value.warn { color: #e67e22; font-weight: 500; }
.zone-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
.zone-item {
  padding: 14px; background: #faf7f3; border-radius: 8px;
  border: 1px solid rgba(200,168,110,0.08);
}
.zone-name {
  font-size: 11px; font-weight: 700; color: #c8a86e;
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
}
.zone-finding { font-size: 12.5px; color: #333; margin-bottom: 4px; line-height: 1.5; }
.zone-meaning { font-size: 11.5px; color: #888; line-height: 1.5; }
.cross-item {
  background: linear-gradient(135deg, #faf7f3 0%, #fff 100%);
  border-radius: 10px; padding: 18px 20px; margin-bottom: 12px;
  border: 1px solid rgba(200,168,110,0.1);
}
.cross-row { display: flex; margin-bottom: 6px; align-items: flex-start; }
.cross-label {
  font-size: 10px; font-weight: 700; color: #c8a86e;
  letter-spacing: 1px; text-transform: uppercase; width: 70px; flex-shrink: 0; padding-top: 2px;
}
.cross-value { font-size: 12.5px; color: #333; flex: 1; line-height: 1.5; }
.cross-conclusion {
  font-size: 12.5px; color: #1a1a2e; font-weight: 600;
  margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(200,168,110,0.2);
}
.prediction-item {
  background: #fff; border-radius: 10px; padding: 16px 20px; margin-bottom: 12px;
  ${borderLeftDir}: 3px solid #e67e22; box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.prediction-num { font-size: 10px; font-weight: 700; color: #e67e22; letter-spacing: 1px; margin-bottom: 4px; }
.prediction-symptom { font-size: 13.5px; font-weight: 600; color: #1a1a2e; margin-bottom: 6px; }
.prediction-mechanism { font-size: 12px; color: #666; margin-bottom: 6px; line-height: 1.6; }
.prediction-screening {
  font-size: 11.5px; color: #999; padding: 6px 10px;
  background: #faf7f3; border-radius: 5px; display: inline-block;
}
.redflag-card {
  background: #fef7f7; border: 1px solid rgba(231,76,60,0.12);
  border-radius: 12px; padding: 24px;
}
.redflag-item {
  display: flex; align-items: center; padding: 10px 0;
  border-bottom: 1px solid rgba(231,76,60,0.08);
}
.redflag-item:last-child { border-bottom: none; }
.redflag-dot {
  width: 8px; height: 8px; background: #e74c3c;
  border-radius: 50%; ${isRTL ? 'margin-left' : 'margin-right'}: 14px; flex-shrink: 0; opacity: 0.7;
}
.redflag-name { font-size: 13px; font-weight: 600; color: #333; flex: 1; }
.redflag-action {
  font-size: 11px; color: #e74c3c; font-weight: 600;
  background: rgba(231,76,60,0.06); padding: 3px 10px; border-radius: 12px;
}
.redflag-note {
  font-size: 12px; color: #888; margin-top: 16px; padding: 12px;
  background: rgba(231,76,60,0.03); border-radius: 6px; line-height: 1.6;
}
.treatment-group { margin-bottom: 20px; }
.treatment-group-title {
  font-size: 12px; font-weight: 700; color: #c8a86e;
  text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.treatment-group-title::after { content: ''; flex: 1; height: 1px; background: rgba(200,168,110,0.2); }
.treatment-item { padding: 10px 0; border-bottom: 1px solid #f5f0eb; }
.treatment-item:last-child { border-bottom: none; }
.treatment-item-name { font-size: 13px; font-weight: 600; color: #333; }
.treatment-item-detail { font-size: 12px; color: #666; margin-top: 3px; line-height: 1.5; }
.recipe-card {
  background: #fff; border-radius: 10px; padding: 18px 22px; margin-bottom: 14px;
  border: 1px solid rgba(200,168,110,0.1); box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.recipe-num { font-size: 10px; font-weight: 700; color: #c8a86e; letter-spacing: 2px; margin-bottom: 4px; }
.recipe-name { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 2px; }
.recipe-chinese { font-size: 12px; color: #c8a86e; margin-bottom: 8px; }
.recipe-detail { font-size: 12px; color: #666; line-height: 1.6; }
.recipe-effect { font-size: 12px; color: #8b7340; font-weight: 500; margin-top: 6px; }
.recipe-source { font-size: 11px; color: #999; font-style: italic; margin-top: 4px; }
.sugar-guide { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.sugar-good {
  background: #f0faf0; border: 1px solid rgba(46,204,113,0.15);
  border-radius: 8px; padding: 14px;
}
.sugar-good-title {
  font-size: 11px; font-weight: 700; color: #2ecc71;
  margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;
}
.sugar-good-text { font-size: 12px; color: #555; line-height: 1.5; }
.sugar-bad {
  background: #fef7f7; border: 1px solid rgba(231,76,60,0.1);
  border-radius: 8px; padding: 14px;
}
.sugar-bad-title {
  font-size: 11px; font-weight: 700; color: #e74c3c;
  margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;
}
.sugar-bad-text { font-size: 12px; color: #555; line-height: 1.5; }
.formula-card {
  background: linear-gradient(135deg, #0d1b2a 0%, #1a1f3a 100%);
  border-radius: 12px; padding: 20px 24px; margin-bottom: 12px; color: #fff;
}
.formula-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 15px; font-weight: 600; color: #e8d5a8; margin-bottom: 2px;
}
.formula-pinyin { font-size: 12px; color: rgba(200,168,110,0.7); margin-bottom: 6px; }
.formula-source { font-size: 11px; color: rgba(255,255,255,0.4); font-style: italic; }
.formula-desc { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 8px; line-height: 1.5; }
.formula-disclaimer {
  font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 16px;
  padding: 12px; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; text-align: center; line-height: 1.5;
}
.rule-item { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f0ebe5; }
.rule-item:last-child { border-bottom: none; }
.rule-num {
  width: 28px; height: 28px; background: rgba(200,168,110,0.1);
  border: 1px solid rgba(200,168,110,0.2); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #c8a86e; flex-shrink: 0;
}
.rule-content { flex: 1; }
.rule-title { font-size: 13px; font-weight: 600; color: #1a1a2e; margin-bottom: 3px; }
.rule-detail { font-size: 12px; color: #666; line-height: 1.5; }
.indicator-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.indicator-item {
  background: #faf7f3; border-radius: 10px; padding: 18px;
  border: 1px solid rgba(200,168,110,0.08);
}
.indicator-num { font-size: 10px; font-weight: 700; color: #c8a86e; letter-spacing: 1px; margin-bottom: 6px; }
.indicator-name { font-size: 13px; font-weight: 600; color: #1a1a2e; margin-bottom: 6px; }
.indicator-question { font-size: 12px; color: #666; line-height: 1.5; margin-bottom: 8px; }
.indicator-target {
  font-size: 11px; color: #8b7340; font-weight: 500;
  padding: 4px 8px; background: rgba(200,168,110,0.08);
  border-radius: 4px; display: inline-block;
}
.followup-note {
  margin-top: 16px; padding: 14px 18px;
  background: rgba(200,168,110,0.06); border-radius: 8px;
  ${borderLeftDir}: 2px solid #c8a86e;
  font-size: 12.5px; color: #555; line-height: 1.6;
}
.crisis-card {
  background: #fffbf5; border: 1px solid rgba(230,126,34,0.12);
  border-radius: 12px; padding: 24px;
}
.crisis-intro { font-size: 13px; color: #555; margin-bottom: 16px; line-height: 1.6; }
.crisis-list { list-style: none; margin-bottom: 16px; }
.crisis-list li {
  font-size: 12.5px; color: #333; padding: 6px 0 6px 20px;
  position: relative; line-height: 1.5;
}
.crisis-list li::before {
  content: ''; position: absolute; ${isRTL ? 'right' : 'left'}: 0; top: 14px;
  width: 6px; height: 6px; background: #e67e22; border-radius: 50%; opacity: 0.6;
}
.crisis-duration {
  font-size: 12px; color: #888; margin-bottom: 16px;
  padding: 8px 12px; background: rgba(200,168,110,0.05); border-radius: 6px;
}
.crisis-redline {
  background: #fef7f7; border: 1px solid rgba(231,76,60,0.12);
  border-radius: 8px; padding: 14px 18px;
}
.crisis-redline-title {
  font-size: 12px; font-weight: 700; color: #e74c3c;
  margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;
}
.crisis-redline-text { font-size: 12px; color: #e74c3c; line-height: 1.6; }
.report-footer {
  background: linear-gradient(165deg, #0a0e27 0%, #1a1f3a 100%);
  padding: 36px 48px; text-align: center;
}
.footer-brand {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px; color: #c8a86e; font-weight: 600; margin-bottom: 4px;
}
.footer-product {
  font-size: 11px; color: rgba(200,168,110,0.5);
  letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;
}
.footer-divider {
  width: 40px; height: 1px; background: rgba(200,168,110,0.3); margin: 0 auto 20px;
}
.footer-disclaimer {
  font-size: 11px; color: rgba(255,255,255,0.35);
  line-height: 1.7; margin-bottom: 16px;
  max-width: 560px; margin-left: auto; margin-right: auto;
}
.footer-company { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
.footer-contact { font-size: 11px; color: rgba(200,168,110,0.5); }
.gold-divider {
  height: 1px; background: linear-gradient(90deg, transparent, rgba(200,168,110,0.3), transparent);
  margin: 0 48px;
}
@media (max-width: 600px) {
  .hero { padding: 32px 24px; }
  .section { padding: 28px 24px; }
  .report-footer { padding: 28px 24px; }
  .hero-title { font-size: 22px; }
  .tongue-placeholders { grid-template-columns: 1fr; }
  .zone-grid { grid-template-columns: 1fr; }
  .indicator-grid { grid-template-columns: 1fr; }
  .sugar-guide { grid-template-columns: 1fr; }
  .gold-divider { margin: 0 24px; }
}
@media print {
  body { padding: 0; background: #fff; }
  .page-wrap { box-shadow: none; max-width: 100%; }
  .section { break-inside: avoid; }
}`;
}

// ============================================================
// HTML ESCAPE
// ============================================================

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// MAIN GENERATOR
// ============================================================

/**
 * Generate a PRO Report in HTML format
 * @param {object} data - Structured tongue analysis data
 * @param {string} lang - Language code
 * @returns {string} Complete HTML document
 */
export function generateReportHTML(data, lang = 'en') {
  const dir = getDirection(lang);
  const L = (path) => t(lang, path);
  const css = getStylesheet(dir);
  
  // Extract data with safe defaults
  const d = data || {};
  const meta = d.meta || {};
  const tongueBody = d.tongueBody || {};
  const sublingual = d.sublingual || {};
  const crossValidation = d.crossValidation || [];
  const pathogenesis = d.pathogenesis || {};
  const predictions = d.predictions || [];
  const redFlags = d.redFlags || [];
  const treatments = d.treatments || {};
  const recipes = d.recipes || [];
  const formulas = d.formulas || [];
  const dietaryRules = d.dietaryRules || [];
  const indicators = d.indicators || [];
  const healingCrisis = d.healingCrisis || {};

  // Hero data
  const patternName = d.patternName || {};
  const sixStages = d.sixStages || [];
  const patternTags = d.patternTags || [];
  const heroDescription = d.heroDescription || '';
  const subject = d.subject || {};

  // Build tongue images or placeholders
  const tongueImageHTML = (d.tongueImage || d.sublingualImage) ? `
    <div class="tongue-placeholders">
      ${d.tongueImage ? `<div class="tongue-placeholder"><img src="${esc(d.tongueImage)}" alt="${L('report.tongueImageArea')}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>` : `
      <div class="tongue-placeholder">
        <div class="tongue-placeholder-icon">\u{1F445}</div>
        <div class="tongue-placeholder-text">${L('report.tongueImageArea')}</div>
        <div class="tongue-placeholder-sub">${L('report.tongueDorsal')}</div>
      </div>`}
      ${d.sublingualImage ? `<div class="tongue-placeholder"><img src="${esc(d.sublingualImage)}" alt="${L('report.sublingualImageArea')}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>` : `
      <div class="tongue-placeholder">
        <div class="tongue-placeholder-icon">\u{1F52C}</div>
        <div class="tongue-placeholder-text">${L('report.sublingualImageArea')}</div>
        <div class="tongue-placeholder-sub">${L('report.tongueVentral')}</div>
      </div>`}
    </div>` : `
    <div class="tongue-placeholders">
      <div class="tongue-placeholder">
        <div class="tongue-placeholder-icon">\u{1F445}</div>
        <div class="tongue-placeholder-text">${L('report.tongueImageArea')}</div>
        <div class="tongue-placeholder-sub">${L('report.tongueDorsal')}</div>
      </div>
      <div class="tongue-placeholder">
        <div class="tongue-placeholder-icon">\u{1F52C}</div>
        <div class="tongue-placeholder-text">${L('report.sublingualImageArea')}</div>
        <div class="tongue-placeholder-sub">${L('report.tongueVentral')}</div>
      </div>
    </div>`;

  // Build HTML
  let html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${L('report.badge')} \u2014 ${esc(patternName[lang] || patternName.en || '')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
${lang === 'ar' ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
${lang === 'th' ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
<style>${css}</style>
</head>
<body>
<div class="page-wrap">

  <!-- ====== HERO SECTION ====== -->
  <div class="hero">
    <div class="pro-badge">${esc(L('report.badge'))}</div>
    <div class="hero-eyebrow">${esc(L('report.eyebrow'))}</div>
    <h1 class="hero-title">${esc(tongueBody.title ? tongueBody.title[lang] || tongueBody.title.en || '' : '')} \u2014 <em>${esc(patternName[lang] || patternName.en || '')}</em></h1>
    
    ${tongueImageHTML}

    <div class="hero-tags">
      ${sixStages.map(s => `<span class="hero-tag six-stages">${esc(s[lang] || s.en || '')}</span>`).join('\n      ')}
      ${patternTags.map(tag => `<span class="hero-tag">${esc(tag[lang] || tag.en || '')}</span>`).join('\n      ')}
    </div>

    <div class="hero-meta">
      ${L('report.reportId')}: <span>${esc(meta.reportId || 'N/A')}</span> &nbsp;\u00b7&nbsp; ${esc(meta.date || '')}
    </div>

    <div class="hero-description">
      ${esc(heroDescription[lang] || heroDescription.en || '')}
    </div>

    <div class="hero-profile">
      <span><strong>${esc(subject.gender[lang] || subject.gender.en || '')}</strong></span>
      <span><strong>${esc(subject.age || '')}</strong></span>
      ${subject.birthInfo ? `<span>${esc(subject.birthInfo[lang] || subject.birthInfo.en || '')}</span>` : ''}
    </div>
    <div class="hero-ai-badge">${esc(L('report.generatedByAI'))}</div>
  </div>
`;

  // ====== SECTION 1: TONGUE BODY =====
  html += `
  <!-- ====== SECTION 1: TONGUE BODY ANALYSIS ====== -->
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.tongueBody.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.tongueBody.title'))}</div>
`;

  // Shape card
  if (tongueBody.shape) {
    html += `
    <div class="card gold-border">
      <div class="card-title"><span class="icon">\u{1F4D0}</span> ${esc(tongueBody.shape.label[lang] || tongueBody.shape.label.en || '')}</div>
      <div class="detail-row"><span class="detail-label">${L('common.classification')}</span><span class="detail-value highlight">${esc(tongueBody.shape.classification[lang] || tongueBody.shape.classification.en || '')}</span></div>
      ${tongueBody.shape.presentation ? `<div class="detail-row"><span class="detail-label">${L('common.presentation')}</span><span class="detail-value">${esc(tongueBody.shape.presentation[lang] || tongueBody.shape.presentation.en || '')}</span></div>` : ''}
      ${tongueBody.shape.significance ? `<div class="detail-row"><span class="detail-label">${L('common.significance')}</span><span class="detail-value dim">${esc(tongueBody.shape.significance[lang] || tongueBody.shape.significance.en || '')}</span></div>` : ''}
    </div>
`;
  }

  // Color card
  if (tongueBody.color) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u{1F3A8}</span> ${esc(tongueBody.color.label[lang] || tongueBody.color.label.en || '')}</div>
      <div class="detail-row"><span class="detail-label">${L('common.observation')}</span><span class="detail-value">${esc(tongueBody.color.observation[lang] || tongueBody.color.observation.en || '')}</span></div>
      ${tongueBody.color.interpretation ? `<div class="detail-row"><span class="detail-label">${L('common.interpretation')}</span><span class="detail-value dim">${esc(tongueBody.color.interpretation[lang] || tongueBody.color.interpretation.en || '')}</span></div>` : ''}
    </div>
`;
  }

  // Coat card
  if (tongueBody.coat) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u{1F32B}\u{FE0F}</span> ${esc(tongueBody.coat.label[lang] || tongueBody.coat.label.en || '')}</div>
      ${tongueBody.coat.texture ? `<div class="detail-row"><span class="detail-label">${esc(tongueBody.coat.texture.label[lang] || tongueBody.coat.texture.label.en || '')}</span><span class="detail-value">${esc(tongueBody.coat.texture.value[lang] || tongueBody.coat.texture.value.en || '')}</span></div>` : ''}
      ${tongueBody.coat.classification ? `<div class="detail-row"><span class="detail-label">${L('common.classification')}</span><span class="detail-value highlight">${esc(tongueBody.coat.classification[lang] || tongueBody.coat.classification.en || '')}</span></div>` : ''}
      ${tongueBody.coat.analysis ? `<div class="detail-row"><span class="detail-label">${L('common.analysis')}</span><span class="detail-value dim">${esc(tongueBody.coat.analysis[lang] || tongueBody.coat.analysis.en || '')}</span></div>` : ''}
    </div>
`;
  }

  // Teeth marks
  if (tongueBody.teethMarks) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u{3030}\u{FE0F}</span> ${esc(tongueBody.teethMarks.label[lang] || tongueBody.teethMarks.label.en || '')}</div>
      ${tongueBody.teethMarks.teethMarks ? `<div class="detail-row"><span class="detail-label">${esc(tongueBody.teethMarks.teethMarks.label[lang] || tongueBody.teethMarks.teethMarks.label.en || '')}</span><span class="detail-value">${esc(tongueBody.teethMarks.teethMarks.value[lang] || tongueBody.teethMarks.teethMarks.value.en || '')}</span></div>` : ''}
      ${tongueBody.teethMarks.swelling ? `<div class="detail-row"><span class="detail-label">${esc(tongueBody.teethMarks.swelling.label[lang] || tongueBody.teethMarks.swelling.label.en || '')}</span><span class="detail-value">${esc(tongueBody.teethMarks.swelling.value[lang] || tongueBody.teethMarks.swelling.value.en || '')}</span></div>` : ''}
    </div>
`;
  }

  // Zone observations
  if (tongueBody.zones && tongueBody.zones.length > 0) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u{1F5FA}\u{FE0F}</span> ${esc(tongueBody.zonesLabel ? tongueBody.zonesLabel[lang] || tongueBody.zonesLabel.en : '')}</div>
      <div class="zone-grid">
        ${tongueBody.zones.map(zone => `
        <div class="zone-item">
          <div class="zone-name">${esc(zone.name[lang] || zone.name.en || '')}</div>
          <div class="zone-finding">${esc(zone.finding[lang] || zone.finding.en || '')}</div>
          ${zone.meaning ? `<div class="zone-meaning">\u2192 ${esc(zone.meaning[lang] || zone.meaning.en || '')}</div>` : ''}
        </div>`).join('')}
      </div>
    </div>
`;
  }

  // Tongue tip special
  if (tongueBody.tipSpecial) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u{1F48E}</span> ${esc(tongueBody.tipSpecial.label[lang] || tongueBody.tipSpecial.label.en || '')}</div>
      ${tongueBody.tipSpecial.morphology ? `<div class="detail-row"><span class="detail-label">${esc(tongueBody.tipSpecial.morphology.label[lang] || tongueBody.tipSpecial.morphology.label.en || '')}</span><span class="detail-value">${esc(tongueBody.tipSpecial.morphology.value[lang] || tongueBody.tipSpecial.morphology.value.en || '')}</span></div>` : ''}
      ${tongueBody.tipSpecial.cardiacAssessment ? `<div class="detail-row"><span class="detail-label">${esc(tongueBody.tipSpecial.cardiacAssessment.label[lang] || tongueBody.tipSpecial.cardiacAssessment.label.en || '')}</span><span class="detail-value">${esc(tongueBody.tipSpecial.cardiacAssessment.value[lang] || tongueBody.tipSpecial.cardiacAssessment.value.en || '')}</span></div>` : ''}
      ${tongueBody.tipSpecial.stasisWarning ? `<div class="detail-row"><span class="detail-label">${esc(tongueBody.tipSpecial.stasisWarning.label[lang] || tongueBody.tipSpecial.stasisWarning.label.en || '')}</span><span class="detail-value warn">${esc(tongueBody.tipSpecial.stasisWarning.value[lang] || tongueBody.tipSpecial.stasisWarning.value.en || '')}</span></div>` : ''}
    </div>
`;
  }

  html += `  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 2: SUBLINGUAL =====
  html += `
  <!-- ====== SECTION 2: SUBLINGUAL ANALYSIS ====== -->
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.sublingual.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.sublingual.title'))}</div>
`;

  if (sublingual.collaterals) {
    html += `
    <div class="card gold-border">
      <div class="card-title"><span class="icon">\u{1FA78}</span> ${esc(sublingual.collaterals.label[lang] || sublingual.collaterals.label.en || '')}</div>
      ${(sublingual.collaterals.observations || []).map(obs => `
      <div class="detail-row"><span class="detail-label">${esc(obs.label[lang] || obs.label.en || '')}</span><span class="detail-value">${esc(obs.value[lang] || obs.value.en || '')}</span></div>
      ${obs.note ? `<div class="detail-row"><span class="detail-label"></span><span class="detail-value dim">${esc(obs.note[lang] || obs.note.en || '')}</span></div>` : ''}`).join('')}
    </div>
`;
  }

  if (sublingual.blockageZones && sublingual.blockageZones.length > 0) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u{1F4CD}</span> ${esc(sublingual.blockageLabel ? sublingual.blockageLabel[lang] || sublingual.blockageLabel.en : '')}</div>
      ${sublingual.blockageZones.map(zone => `
      <div class="treatment-item">
        <div class="treatment-item-name">${esc(zone.name[lang] || zone.name.en || '')}</div>
        <div class="treatment-item-detail">${esc(zone.finding[lang] || zone.finding.en || '')}</div>
        ${zone.status ? `<div class="treatment-item-detail" style="color:${zone.status.level === 'warn' ? '#e67e22' : '#27ae60'}">${esc(zone.status.text[lang] || zone.status.text.en || '')}</div>` : ''}
      </div>`).join('')}
    </div>
`;
  }

  html += `  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 3: CROSS VALIDATION =====
  html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.crossValidation.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.crossValidation.title'))}</div>
`;
  crossValidation.forEach(cv => {
    html += `
    <div class="cross-item">
      <div class="cross-row"><span class="cross-label">${L('common.tongueAbove')}</span><span class="cross-value">${esc(cv.tongueAbove[lang] || cv.tongueAbove.en || '')}</span></div>
      <div class="cross-row"><span class="cross-label">${L('common.tongueBelow')}</span><span class="cross-value">${esc(cv.tongueBelow[lang] || cv.tongueBelow.en || '')}</span></div>
      <div class="cross-conclusion">\u2192 ${esc(cv.conclusion[lang] || cv.conclusion.en || '')}</div>
    </div>`;
  });
  html += `
  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 4: PATHOGENESIS =====
  html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.pathogenesis.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.pathogenesis.title'))}</div>
`;
  if (pathogenesis.coreMechanism) {
    html += `
    <div class="card gold-border">
      <p style="font-size:13px;color:#555;line-height:1.8;margin-bottom:12px">${esc(pathogenesis.coreMechanism[lang] || pathogenesis.coreMechanism.en || '')}</p>
      ${pathogenesis.treatmentPrinciple ? `<p style="font-size:13px;color:#333;line-height:1.8">${esc(pathogenesis.treatmentPrinciple[lang] || pathogenesis.treatmentPrinciple.en || '')}</p>` : ''}
    </div>
`;
  }
  (pathogenesis.jiaoCards || []).forEach(card => {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">${esc(card.icon || '\u2195')}</span> ${esc(card.title[lang] || card.title.en || '')}</div>
      <div class="detail-row"><span class="detail-label">${L('common.pattern')}</span><span class="detail-value highlight">${esc(card.pattern[lang] || card.pattern.en || '')}</span></div>
      ${card.analysis ? `<div class="detail-row"><span class="detail-label">${L('common.analysis')}</span><span class="detail-value dim">${esc(card.analysis[lang] || card.analysis.en || '')}</span></div>` : ''}
    </div>`;
  });
  if (pathogenesis.deficiencyExcess) {
    html += `
    <div class="card">
      <div class="card-title"><span class="icon">\u2696\u{FE0F}</span> ${esc(pathogenesis.deficiencyExcessLabel ? pathogenesis.deficiencyExcessLabel[lang] || pathogenesis.deficiencyExcessLabel.en : '')}</div>
      <div class="detail-row"><span class="detail-label">${L('tcm.deficiencyExcess.deficiency')}</span><span class="detail-value">${esc(pathogenesis.deficiencyExcess.deficiency[lang] || pathogenesis.deficiencyExcess.deficiency.en || '')}</span></div>
      <div class="detail-row"><span class="detail-label">${L('tcm.deficiencyExcess.excess')}</span><span class="detail-value">${esc(pathogenesis.deficiencyExcess.excess[lang] || pathogenesis.deficiencyExcess.excess.en || '')}</span></div>
    </div>
`;
  }
  html += `
  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 5: SYMPTOM PREDICTIONS =====
  html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.symptomPredictions.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.symptomPredictions.title'))}</div>
`;
  predictions.forEach((pred, i) => {
    html += `
    <div class="prediction-item">
      <div class="prediction-num">${L('common.predictionLabel')} ${String(i + 1).padStart(2, '0')}</div>
      <div class="prediction-symptom">${esc(pred.symptom[lang] || pred.symptom.en || '')}</div>
      <div class="prediction-mechanism">${esc(pred.mechanism[lang] || pred.mechanism.en || '')}</div>
      ${pred.screening ? `<div class="prediction-screening">\u{1F50E} ${esc(pred.screening[lang] || pred.screening.en || '')}</div>` : ''}
    </div>`;
  });
  html += `
  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 6: RED FLAGS =====
  if (redFlags.length > 0) {
    html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.redFlags.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.redFlags.title'))}</div>
    <div class="redflag-card">
      ${redFlags.map(flag => `
      <div class="redflag-item">
        <div class="redflag-dot"></div>
        <div class="redflag-name">${esc(flag.name[lang] || flag.name.en || '')}</div>
        <div class="redflag-action">${esc(flag.action[lang] || flag.action.en || L('common.screeningRecommended'))}</div>
      </div>`).join('')}
      <div class="redflag-note">${esc(L('common.redFlagNote'))}</div>
    </div>
  </div>
  <div class="gold-divider"></div>
`;
  }

  // ====== SECTION 7: EXTERNAL TREATMENTS =====
  html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.externalTreatment.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.externalTreatment.title'))}</div>
`;

  // Gua Sha
  if (treatments.guaSha && treatments.guaSha.length > 0) {
    html += `
    <div class="treatment-group">
      <div class="treatment-group-title">${esc(L('treatment.guaSha'))}</div>
      <div class="card">
        ${treatments.guaSha.map(item => `
        <div class="treatment-item">
          <div class="treatment-item-name">${esc(item.name[lang] || item.name.en || '')}</div>
          <div class="treatment-item-detail">${esc(item.detail[lang] || item.detail.en || '')}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // Moxibustion
  if (treatments.moxibustion && treatments.moxibustion.length > 0) {
    html += `
    <div class="treatment-group">
      <div class="treatment-group-title">${esc(L('treatment.moxibustion'))}</div>
      <div class="card">
        ${treatments.moxibustion.map(item => `
        <div class="treatment-item">
          <div class="treatment-item-name">${esc(item.name[lang] || item.name.en || '')}</div>
          <div class="treatment-item-detail">${esc(item.detail[lang] || item.detail.en || '')}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // Exercise
  if (treatments.exercise && treatments.exercise.length > 0) {
    html += `
    <div class="treatment-group">
      <div class="treatment-group-title">${esc(L('treatment.exercisePrescription'))}</div>
      <div class="card">
        ${treatments.exercise.map(item => `
        <div class="treatment-item">
          <div class="treatment-item-name">${esc(item.name[lang] || item.name.en || '')}</div>
          <div class="treatment-item-detail">${esc(item.detail[lang] || item.detail.en || '')}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // Daily Acupressure
  if (treatments.acupressure && treatments.acupressure.length > 0) {
    html += `
    <div class="treatment-group">
      <div class="treatment-group-title">${esc(L('treatment.dailyAcupressure'))}</div>
      <div class="card">
        ${treatments.acupressure.map(item => `
        <div class="treatment-item">
          <div class="treatment-item-name">${esc(item.name[lang] || item.name.en || '')}</div>
          <div class="treatment-item-detail">${esc(item.detail[lang] || item.detail.en || '')}</div>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // Contraindications
  if (treatments.contraindications && treatments.contraindications.length > 0) {
    html += `
    <div class="card warm-border">
      <div class="card-title"><span class="icon">\u26A0\u{FE0F}</span> ${esc(L('treatment.contraindications'))}</div>
      ${treatments.contraindications.map(item => `
      <div class="treatment-item">
        <div class="treatment-item-name">${esc(item.name[lang] || item.name.en || '')}</div>
        <div class="treatment-item-detail">${esc(item.detail[lang] || item.detail.en || '')}</div>
      </div>`).join('')}
    </div>`;
  }

  html += `
  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 8: FOOD THERAPY =====
  html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.foodTherapy.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.foodTherapy.title'))}</div>
`;
  recipes.forEach((recipe, i) => {
    html += `
    <div class="recipe-card">
      <div class="recipe-num">${L('common.recipeLabel')} ${String(i + 1).padStart(2, '0')}</div>
      <div class="recipe-name">${esc(recipe.name[lang] || recipe.name.en || '')}</div>
      ${recipe.chineseName ? `<div class="recipe-chinese">${esc(recipe.chineseName)}</div>` : ''}
      <div class="recipe-detail">
        ${recipe.ingredients ? `<strong>${L('common.ingredients')}:</strong> ${esc(recipe.ingredients[lang] || recipe.ingredients.en || '')}<br>` : ''}
        ${recipe.preparation ? `<strong>${L('common.preparation')}:</strong> ${esc(recipe.preparation[lang] || recipe.preparation.en || '')}` : ''}
      </div>
      ${recipe.effect ? `<div class="recipe-effect">\u2192 ${esc(recipe.effect[lang] || recipe.effect.en || '')}</div>` : ''}
      ${recipe.source ? `<div class="recipe-source">${esc(recipe.source[lang] || recipe.source.en || '')}</div>` : ''}
    </div>`;
  });

  // Sugar guide
  if (d.sugarGuide) {
    html += `
    <div class="sugar-guide">
      <div class="sugar-good">
        <div class="sugar-good-title">\u2713 ${esc(L('foodTherapy.sugarRecommended'))}</div>
        <div class="sugar-good-text">${esc(L('foodTherapy.sugarGoodText'))}</div>
      </div>
      <div class="sugar-bad">
        <div class="sugar-bad-title">\u2717 ${esc(L('foodTherapy.sugarAvoid'))}</div>
        <div class="sugar-bad-text">${esc(L('foodTherapy.sugarBadText'))}</div>
      </div>
    </div>`;
  }

  html += `
  </div>
  <div class="gold-divider"></div>
`;

  // ====== SECTION 9: CLASSICAL FORMULAS =====
  if (formulas.length > 0) {
    html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.classicalFormula.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.classicalFormula.title'))}</div>
    <p style="font-size:13px;color:#666;margin-bottom:20px;line-height:1.6">${esc(L('common.formulaSchool'))}</p>
`;
    formulas.forEach(formula => {
      const fKey = formula.key;
      const fData = translations.tcm?.formulas?.[fKey] || {};
      html += `
    <div class="formula-card">
      <div class="formula-name">${esc(fData[lang] || fData.en || formula.name[lang] || formula.name.en || '')}</div>
      <div class="formula-pinyin">${esc(fData.pinyin || '')} \u00b7 ${esc(fData.zh || '')}</div>
      <div class="formula-source">${esc(fData[lang + 'Source'] || fData.enSource || '')}</div>
      <div class="formula-desc">${esc(formula.description[lang] || formula.description.en || '')}</div>
    </div>`;
    });
    html += `
    <div class="formula-disclaimer">\u2695\u{FE0F} ${esc(L('common.formulaDisclaimer'))}</div>
  </div>
  <div class="gold-divider"></div>
`;
  }

  // ====== SECTION 10: DIETARY RULES =====
  if (dietaryRules.length > 0) {
    html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.dietaryRules.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.dietaryRules.title'))}</div>
    <div class="card">
`;
    dietaryRules.forEach((rule, i) => {
      const ruleKey = rule.key;
      const ruleData = translations.dietaryRules?.[ruleKey] || {};
      html += `
      <div class="rule-item">
        <div class="rule-num">${i + 1}</div>
        <div class="rule-content">
          <div class="rule-title">${esc(ruleData.title ? (ruleData.title[lang] || ruleData.title.en || '') : (rule.title ? rule.title[lang] || rule.title.en : ''))}</div>
          <div class="rule-detail">${esc(ruleData.detail ? (ruleData.detail[lang] || ruleData.detail.en || '') : (rule.detail ? rule.detail[lang] || rule.detail.en : ''))}</div>
        </div>
      </div>`;
    });
    html += `
    </div>
  </div>
  <div class="gold-divider"></div>
`;
  }

  // ====== SECTION 11: KEY INDICATORS =====
  if (indicators.length > 0) {
    html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.keyIndicators.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.keyIndicators.title'))}</div>
    <div class="indicator-grid">
`;
    indicators.forEach((ind, i) => {
      html += `
      <div class="indicator-item">
        <div class="indicator-num">${L('common.indicatorLabel')} ${String(i + 1).padStart(2, '0')}</div>
        <div class="indicator-name">${esc(ind.name[lang] || ind.name.en || '')}</div>
        <div class="indicator-question">${esc(ind.question[lang] || ind.question.en || '')}</div>
        <div class="indicator-target">${L('common.targetLabel')}: ${esc(ind.target[lang] || ind.target.en || '')}</div>
      </div>`;
    });
    html += `
    </div>
    <div class="followup-note"><strong>${esc(L('common.followUpNote'))}</strong></div>
  </div>
  <div class="gold-divider"></div>
`;
  }

  // ====== SECTION 12: HEALING CRISIS =====
  html += `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.healingCrisis.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.healingCrisis.title'))}</div>
    <div class="crisis-card">
      <div class="crisis-intro">${esc(L('healingCrisis.intro'))}</div>
`;
  if (healingCrisis.symptoms && healingCrisis.symptoms.length > 0) {
    html += `
      <ul class="crisis-list">
        ${healingCrisis.symptoms.map(s => `<li>${esc(s[lang] || s.en || '')}</li>`).join('')}
      </ul>`;
  }
  html += `
      <div class="crisis-duration">\u23F1 ${esc(L('healingCrisis.duration'))}</div>
      <div class="crisis-redline">
        <div class="crisis-redline-title">${esc(L('healingCrisis.redlineTitle'))}</div>
        <div class="crisis-redline-text">${esc(L('healingCrisis.redlineText'))}</div>
      </div>
    </div>
  </div>
`;

  // ====== FOOTER =====
  html += `
  <!-- ====== FOOTER ====== -->
  <div class="report-footer">
    <div class="footer-brand">${esc(L('footer.brand'))}</div>
    <div class="footer-product">${esc(L('footer.product'))}</div>
    <div class="footer-divider"></div>
    <div class="footer-disclaimer">${esc(L('footer.disclaimer'))}</div>
    <div class="footer-company">${esc(L('footer.company'))}</div>
    <div class="footer-contact">${esc(L('footer.contact'))}: ${esc(L('footer.contactEmail'))}</div>
  </div>

</div>
</body>
</html>`;

  return html;
}

/**
 * Generate a JSON report (structured data with translations resolved)
 * @param {object} data - Structured tongue analysis data
 * @param {string} lang - Language code
 * @returns {object} Localized report data
 */
export function generateReportJSON(data, lang = 'en') {
  // Deep localize all multilingual fields
  function localize(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(localize);
    
    // If this object has language keys, extract the target language
    const langKeys = ['zh', 'en', 'de', 'es', 'ar', 'th', 'ms'];
    const hasLangKeys = langKeys.some(k => k in obj);
    if (hasLangKeys) {
      return obj[lang] || obj.en || '';
    }
    
    // Otherwise recurse
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = localize(value);
    }
    return result;
  }
  
  return {
    lang,
    direction: getDirection(lang),
    report: localize(data),
    translations: {
      sections: localize(translations.sections),
      common: localize(translations.common),
      treatment: localize(translations.treatment),
      footer: localize(translations.footer),
    },
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================
// NORMAL-LEVEL REPORT (Fallback)
// ============================================================

/**
 * Determine if data is sufficient for PRO-level report
 * PRO requires: patternName, tongueBody with at least shape+color, pathogenesis, and predictions
 * @param {object} data 
 * @returns {boolean}
 */
export function isDataSufficientForPRO(data) {
  if (!data || typeof data !== 'object') return false;
  
  // Must have a pattern name
  const pn = data.patternName;
  if (!pn || (!pn.en && !pn.zh)) return false;
  
  // Must have tongue body with at least shape AND color
  const tb = data.tongueBody;
  if (!tb) return false;
  if (!tb.shape && !tb.color) return false;
  
  // Must have some pathogenesis or predictions
  const hasPathogenesis = data.pathogenesis && (data.pathogenesis.coreMechanism || (data.pathogenesis.jiaoCards && data.pathogenesis.jiaoCards.length > 0));
  const hasPredictions = data.predictions && data.predictions.length > 0;
  if (!hasPathogenesis && !hasPredictions) return false;
  
  return true;
}

/**
 * Generate a Normal-level report (fallback when PRO fails)
 * A complete, useful report with simplified structure — NOT an empty shell.
 * Includes: Hero summary, key tongue findings, core pathogenesis, top predictions, dietary rules, disclaimer.
 * @param {object} data - Same structured data (will extract what's available)
 * @param {string} lang - Language code
 * @returns {string} Complete HTML document (Normal level)
 */
export function generateNormalReportHTML(data, lang = 'en') {
  const dir = getDirection(lang);
  const L = (path) => t(lang, path);
  const d = data || {};
  const css = getNormalStylesheet(dir);
  
  const patternName = d.patternName || {};
  const heroDescription = d.heroDescription || {};
  const subject = d.subject || {};
  const meta = d.meta || {};
  const tongueBody = d.tongueBody || {};
  const pathogenesis = d.pathogenesis || {};
  const predictions = d.predictions || [];
  const dietaryRules = d.dietaryRules || [];
  const sixStages = d.sixStages || [];
  const patternTags = d.patternTags || [];
  
  // Collect whatever tongue findings we have
  const tongueFindings = [];
  if (tongueBody.shape) {
    tongueFindings.push({
      icon: '📐',
      label: tongueBody.shape.label?.[lang] || tongueBody.shape.label?.en || 'Shape',
      value: tongueBody.shape.classification?.[lang] || tongueBody.shape.classification?.en || '',
      note: tongueBody.shape.significance?.[lang] || tongueBody.shape.significance?.en || '',
    });
  }
  if (tongueBody.color) {
    tongueFindings.push({
      icon: '🎨',
      label: tongueBody.color.label?.[lang] || tongueBody.color.label?.en || 'Color',
      value: tongueBody.color.observation?.[lang] || tongueBody.color.observation?.en || '',
      note: tongueBody.color.interpretation?.[lang] || tongueBody.color.interpretation?.en || '',
    });
  }
  if (tongueBody.coat) {
    tongueFindings.push({
      icon: '🌫️',
      label: tongueBody.coat.label?.[lang] || tongueBody.coat.label?.en || 'Coat',
      value: tongueBody.coat.classification?.[lang] || tongueBody.coat.classification?.en || (tongueBody.coat.texture?.value?.[lang] || tongueBody.coat.texture?.value?.en || ''),
      note: tongueBody.coat.analysis?.[lang] || tongueBody.coat.analysis?.en || '',
    });
  }

  let html = `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${L('report.badge')} — ${esc(patternName[lang] || patternName.en || '')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
${lang === 'ar' ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
${lang === 'th' ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">' : ''}
<style>${css}</style>
</head>
<body>
<div class="page-wrap">

  <!-- HERO -->
  <div class="hero">
    <div class="normal-badge">TONGUE ANALYSIS REPORT</div>
    <div class="hero-eyebrow">${esc(L('report.eyebrow'))}</div>
    <h1 class="hero-title"><em>${esc(patternName[lang] || patternName.en || 'Tongue Pattern Analysis')}</em></h1>
    
    ${(sixStages.length > 0 || patternTags.length > 0) ? `
    <div class="hero-tags">
      ${sixStages.map(s => `<span class="hero-tag six-stages">${esc(s[lang] || s.en || '')}</span>`).join('')}
      ${patternTags.slice(0, 3).map(tag => `<span class="hero-tag">${esc(tag[lang] || tag.en || '')}</span>`).join('')}
    </div>` : ''}

    <div class="hero-meta">
      ${meta.reportId ? `${L('report.reportId')}: <span>${esc(meta.reportId)}</span> · ` : ''}${esc(meta.date || '')}
    </div>

    ${heroDescription[lang] || heroDescription.en ? `
    <div class="hero-desc">${esc(heroDescription[lang] || heroDescription.en)}</div>` : ''}

    <div class="hero-profile">
      ${subject.gender?.[lang] || subject.gender?.en ? `<span><strong>${esc(subject.gender[lang] || subject.gender.en)}</strong></span>` : ''}
      ${subject.age ? `<span><strong>${esc(subject.age)}</strong></span>` : ''}
      ${subject.birthInfo ? `<span>${esc(subject.birthInfo[lang] || subject.birthInfo.en)}</span>` : ''}
    </div>
    <div class="hero-ai-badge">${esc(L('report.generatedByAI'))}</div>
  </div>

  <!-- TONGUE FINDINGS -->
  ${tongueFindings.length > 0 ? `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.tongueBody.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.tongueBody.title'))}</div>
    ${tongueFindings.map(f => `
    <div class="card">
      <div class="card-title"><span class="icon">${f.icon}</span> ${esc(f.label)}</div>
      <div class="finding-value">${esc(f.value)}</div>
      ${f.note ? `<div class="finding-note">${esc(f.note)}</div>` : ''}
    </div>`).join('')}
  </div>
  <div class="gold-divider"></div>
  ` : ''}

  <!-- PATHOGENESIS SUMMARY -->
  ${(pathogenesis.coreMechanism || (pathogenesis.jiaoCards && pathogenesis.jiaoCards.length > 0)) ? `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.pathogenesis.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.pathogenesis.title'))}</div>
    ${pathogenesis.coreMechanism ? `
    <div class="card gold-border">
      <p class="mechanism-text">${esc(pathogenesis.coreMechanism[lang] || pathogenesis.coreMechanism.en)}</p>
    </div>` : ''}
    ${(pathogenesis.jiaoCards || []).map(card => `
    <div class="card">
      <div class="card-title"><span class="icon">${esc(card.icon || '↕')}</span> ${esc(card.title[lang] || card.title.en)}</div>
      <div class="finding-highlight">${esc(card.pattern[lang] || card.pattern.en)}</div>
      ${card.analysis ? `<div class="finding-note">${esc(card.analysis[lang] || card.analysis.en)}</div>` : ''}
    </div>`).join('')}
  </div>
  <div class="gold-divider"></div>
  ` : ''}

  <!-- SYMPTOM PREDICTIONS -->
  ${predictions.length > 0 ? `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.symptomPredictions.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.symptomPredictions.title'))}</div>
    ${predictions.map((pred, i) => `
    <div class="prediction-simple">
      <div class="prediction-simple-title">${esc(pred.symptom[lang] || pred.symptom.en)}</div>
      ${pred.mechanism ? `<div class="prediction-simple-mech">${esc(pred.mechanism[lang] || pred.mechanism.en)}</div>` : ''}
    </div>`).join('')}
  </div>
  <div class="gold-divider"></div>
  ` : ''}

  <!-- DIETARY RULES -->
  ${dietaryRules.length > 0 ? `
  <div class="section">
    <div class="section-eyebrow">${esc(L('sections.dietaryRules.eyebrow'))}</div>
    <div class="section-title">${esc(L('sections.dietaryRules.title'))}</div>
    <div class="card">
      ${dietaryRules.map((rule, i) => {
        const ruleData = translations.dietaryRules?.[rule.key] || {};
        return `
      <div class="rule-row">
        <span class="rule-row-num">${i + 1}</span>
        <div class="rule-row-content">
          <div class="rule-row-title">${esc(ruleData.title?.[lang] || ruleData.title?.en || (rule.title?.[lang] || rule.title?.en || ''))}</div>
          <div class="rule-row-detail">${esc(ruleData.detail?.[lang] || ruleData.detail?.en || (rule.detail?.[lang] || rule.detail?.en || ''))}</div>
        </div>
      </div>`;
      }).join('')}
    </div>
  </div>
  <div class="gold-divider"></div>
  ` : ''}

  <!-- FOOTER -->
  <div class="report-footer">
    <div class="footer-brand">${esc(L('footer.brand'))}</div>
    <div class="footer-product">${esc(L('footer.product'))}</div>
    <div class="footer-divider"></div>
    <div class="footer-disclaimer">${esc(L('footer.disclaimer'))}</div>
    <div class="footer-company">${esc(L('footer.company'))}</div>
    <div class="footer-contact">${esc(L('footer.contact'))}: ${esc(L('footer.contactEmail'))}</div>
  </div>

</div>
</body>
</html>`;

  return html;
}

/**
 * Generate a Normal-level JSON report (fallback)
 * @param {object} data - Structured tongue analysis data
 * @param {string} lang - Language code
 * @returns {object} Simplified localized report data
 */
export function generateNormalReportJSON(data, lang = 'en') {
  function localize(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(localize);
    const langKeys = ['zh', 'en', 'de', 'es', 'ar', 'th', 'ms'];
    const hasLangKeys = langKeys.some(k => k in obj);
    if (hasLangKeys) return obj[lang] || obj.en || '';
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = localize(value);
    }
    return result;
  }
  
  const d = data || {};
  
  // Build a simplified report with only the sections that have data
  const simplifiedReport = {
    patternName: localize(d.patternName || {}),
    heroDescription: localize(d.heroDescription || {}),
    subject: localize(d.subject || {}),
    meta: d.meta || {},
  };
  
  // Only include tongue findings we have
  const tb = d.tongueBody || {};
  if (tb.shape || tb.color || tb.coat) {
    simplifiedReport.tongueFindings = [];
    if (tb.shape) {
      simplifiedReport.tongueFindings.push({
        category: 'shape',
        classification: localize(tb.shape.classification || {}),
        significance: localize(tb.shape.significance || {}),
      });
    }
    if (tb.color) {
      simplifiedReport.tongueFindings.push({
        category: 'color',
        observation: localize(tb.color.observation || {}),
        interpretation: localize(tb.color.interpretation || {}),
      });
    }
    if (tb.coat) {
      simplifiedReport.tongueFindings.push({
        category: 'coat',
        value: localize(tb.coat.classification || tb.coat.texture?.value || {}),
        analysis: localize(tb.coat.analysis || {}),
      });
    }
  }
  
  // Pathogenesis summary
  if (d.pathogenesis) {
    simplifiedReport.pathogenesis = {
      coreMechanism: localize(d.pathogenesis.coreMechanism || {}),
      jiaoCards: (d.pathogenesis.jiaoCards || []).map(card => ({
        title: localize(card.title || {}),
        pattern: localize(card.pattern || {}),
      })),
    };
  }
  
  // Simplified predictions
  if (d.predictions && d.predictions.length > 0) {
    simplifiedReport.predictions = d.predictions.map(pred => ({
      symptom: localize(pred.symptom || {}),
      mechanism: localize(pred.mechanism || {}),
    }));
  }
  
  // Dietary rules
  if (d.dietaryRules && d.dietaryRules.length > 0) {
    simplifiedReport.dietaryRules = d.dietaryRules.map(rule => {
      const ruleData = translations.dietaryRules?.[rule.key] || {};
      return {
        title: localize(ruleData.title || rule.title || {}),
        detail: localize(ruleData.detail || rule.detail || {}),
      };
    });
  }
  
  return {
    lang,
    direction: getDirection(lang),
    report: simplifiedReport,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Simplified CSS for Normal-level report
 */
function getNormalStylesheet(dir) {
  const isRTL = dir === 'rtl';
  const textAlign = isRTL ? 'right' : 'left';
  const borderLeftDir = isRTL ? 'border-right' : 'border-left';
  
  return `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { font-size: 15px; -webkit-font-smoothing: antialiased; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans Arabic', 'Noto Sans Thai', sans-serif;
  background: #e8e4df; color: #2c2c2c; line-height: 1.7; padding: 20px 0;
  direction: ${dir}; text-align: ${textAlign};
}
.page-wrap { max-width: 780px; margin: 0 auto; background: #faf8f5; box-shadow: 0 20px 80px rgba(0,0,0,0.15); }
.hero {
  background: linear-gradient(165deg, #0a0e27 0%, #1a1f3a 45%, #0d1b2a 100%);
  padding: 44px 48px 40px; color: #fff; position: relative; overflow: hidden;
}
.hero::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,168,110,0.4), transparent);
}
.normal-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%);
  color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  padding: 5px 14px; border-radius: 4px; text-transform: uppercase; margin-bottom: 16px;
}
.hero-eyebrow {
  font-size: 11px; letter-spacing: 3px; color: rgba(200,168,110,0.7);
  text-transform: uppercase; margin-bottom: 8px;
}
.hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px; font-weight: 700; color: #f0e6d3; line-height: 1.35; margin-bottom: 16px;
}
.hero-title em { color: #c8a86e; font-style: normal; }
.hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.hero-tag {
  font-size: 11px; color: #c8a86e; background: rgba(200,168,110,0.1);
  padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(200,168,110,0.2);
}
.hero-tag.six-stages { border-color: rgba(200,168,110,0.4); background: rgba(200,168,110,0.15); }
.hero-meta { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
.hero-meta span { color: rgba(200,168,110,0.6); }
.hero-desc {
  font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.75; margin-bottom: 16px;
  padding: 14px; background: rgba(255,255,255,0.03); border-radius: 8px;
  ${borderLeftDir}: 2px solid rgba(200,168,110,0.3);
}
.hero-profile {
  display: flex; flex-wrap: wrap; gap: 20px;
  font-size: 12.5px; color: rgba(255,255,255,0.6); margin-bottom: 12px;
}
.hero-profile strong { color: rgba(255,255,255,0.85); font-weight: 600; }
.hero-ai-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; color: rgba(200,168,110,0.6); margin-top: 8px;
}
.hero-ai-badge::before {
  content: ''; width: 6px; height: 6px; background: #c8a86e; border-radius: 50%; opacity: 0.5;
}
.section { padding: 32px 48px; border-bottom: 1px solid rgba(200,168,110,0.12); }
.section:last-of-type { border-bottom: none; }
.section-eyebrow {
  font-size: 10px; letter-spacing: 3px; color: #c8a86e;
  text-transform: uppercase; margin-bottom: 6px; font-weight: 600;
}
.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px; font-weight: 700; color: #1a1a2e;
  margin-bottom: 18px; position: relative; padding-bottom: 10px;
}
.section-title::after {
  content: ''; position: absolute; bottom: 0; ${isRTL ? 'right' : 'left'}: 0;
  width: 40px; height: 2px; background: linear-gradient(90deg, #c8a86e, transparent);
}
.card {
  background: #fff; border-radius: 10px; padding: 18px 22px; margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
}
.card.gold-border { ${borderLeftDir}: 3px solid #c8a86e; }
.card-title {
  font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 10px;
  display: flex; align-items: center; gap: 8px;
}
.card-title .icon {
  width: 22px; height: 22px; background: rgba(200,168,110,0.1);
  border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px;
}
.finding-value { font-size: 13px; color: #333; line-height: 1.6; }
.finding-highlight { font-size: 13px; color: #8b7340; font-weight: 600; line-height: 1.6; }
.finding-note { font-size: 12px; color: #888; font-style: italic; margin-top: 6px; line-height: 1.5; }
.mechanism-text { font-size: 13px; color: #555; line-height: 1.8; }
.prediction-simple {
  background: #fff; border-radius: 10px; padding: 14px 20px; margin-bottom: 10px;
  ${borderLeftDir}: 3px solid #e67e22; box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}
.prediction-simple-title { font-size: 13px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
.prediction-simple-mech { font-size: 12px; color: #666; line-height: 1.5; }
.rule-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0ebe5; }
.rule-row:last-child { border-bottom: none; }
.rule-row-num {
  width: 26px; height: 26px; background: rgba(200,168,110,0.1);
  border: 1px solid rgba(200,168,110,0.2); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #c8a86e; flex-shrink: 0;
}
.rule-row-content { flex: 1; }
.rule-row-title { font-size: 13px; font-weight: 600; color: #1a1a2e; margin-bottom: 2px; }
.rule-row-detail { font-size: 12px; color: #666; line-height: 1.5; }
.gold-divider {
  height: 1px; background: linear-gradient(90deg, transparent, rgba(200,168,110,0.3), transparent);
  margin: 0 48px;
}
.report-footer {
  background: linear-gradient(165deg, #0a0e27 0%, #1a1f3a 100%);
  padding: 32px 48px; text-align: center;
}
.footer-brand {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px; color: #c8a86e; font-weight: 600; margin-bottom: 4px;
}
.footer-product {
  font-size: 11px; color: rgba(200,168,110,0.5);
  letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;
}
.footer-divider { width: 40px; height: 1px; background: rgba(200,168,110,0.3); margin: 0 auto 20px; }
.footer-disclaimer {
  font-size: 11px; color: rgba(255,255,255,0.35);
  line-height: 1.7; margin-bottom: 16px; max-width: 560px; margin-left: auto; margin-right: auto;
}
.footer-company { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
.footer-contact { font-size: 11px; color: rgba(200,168,110,0.5); }
@media (max-width: 600px) {
  .hero { padding: 28px 24px; }
  .section { padding: 24px 24px; }
  .report-footer { padding: 24px 24px; }
  .gold-divider { margin: 0 24px; }
}
@media print {
  body { padding: 0; background: #fff; }
  .page-wrap { box-shadow: none; max-width: 100%; }
  .section { break-inside: avoid; }
}`;
}

export default { generateReportHTML, generateReportJSON, generateNormalReportHTML, generateNormalReportJSON, isDataSufficientForPRO };
