// Fixtures: expected values copied by hand from the College Board sources (percentile page rows and the
// 2026 SAT Suite Annual Report PDFs as printed by pdftotext -layout), fetched 2026-11-03.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSatPercentile, getScoreForPercentile, getSatScoresByState, rankStatesBySat, resolveSection, pctNumber, InputError, UTM } from '../dist/core.js';
import { STATES_2026, NATIONAL_2026, TOTAL_PERCENTILES, SECTION_PERCENTILES } from '../dist/sat.data.js';

test('percentile tables are complete: 121 total rows 400-1600, 61 section rows 200-800', () => {
  assert.equal(Object.keys(TOTAL_PERCENTILES).length, 121); assert.equal(Object.keys(SECTION_PERCENTILES).length, 61);
});
test('total 1350: nationally representative 94, user group 89 (page row "1350 94 89")', () => {
  const r = getSatPercentile(1350); assert.deepEqual(r.percentiles, { nationally_representative: '94', user_group: '89' });
  assert.ok(r.more.includes(UTM) && r.more.startsWith('https://examscorecalc.com/'));
});
test('total 1000: 48 and 47; 1600: 99+ and 99+; 400: 1- and 1-', () => {
  assert.deepEqual(getSatPercentile(1000).percentiles, { nationally_representative: '48', user_group: '47' });
  assert.deepEqual(getSatPercentile(1600).percentiles, { nationally_representative: '99+', user_group: '99+' });
  assert.deepEqual(getSatPercentile(400).percentiles, { nationally_representative: '1-', user_group: '1-' });
});
test('section 700: RW 97/92, Math 95/91 (page row "700 97 92 95 91"); Math 790 user 99', () => {
  assert.deepEqual(getSatPercentile(700, 'rw').percentiles, { nationally_representative: '97', user_group: '92' });
  assert.deepEqual(getSatPercentile(700, 'math').percentiles, { nationally_representative: '95', user_group: '91' });
  assert.equal(getSatPercentile(790, 'math').percentiles.user_group, '99');
});
test('bad scores rejected', () => {
  assert.throws(() => getSatPercentile(1355), InputError); assert.throws(() => getSatPercentile(900, 'math'), InputError); assert.throws(() => resolveSection('science'), InputError);
});
test('score for user-group 90th percentile total is 1360 (1350 is 89, 1360 is 90)', () => {
  assert.equal(getScoreForPercentile(90).score, 1360); assert.equal(pctNumber('99+'), 99.5); assert.equal(pctNumber('1-'), 0.5);
});
test('national class of 2026: 1,954,833 takers, mean 1045 (528 RW, 517 Math), 42% met both, IQR 870/1030/1220, 691 scored 1600', () => {
  const n = NATIONAL_2026;
  assert.equal(n.test_takers, 1954833); assert.deepEqual([n.mean_total, n.mean_rw, n.mean_math], [1045, 528, 517]);
  assert.deepEqual([n.met_both_pct, n.met_rw_pct, n.met_math_pct, n.met_none_pct], [42, 67, 45, 31]);
  assert.deepEqual([n.p25_total, n.p50_total, n.p75_total], [870, 1030, 1220]); assert.equal(n.scored_1600, 691);
  assert.equal(n.total_score_bands.reduce((s, b) => s + b.test_takers, 0), n.test_takers);
});
test('coverage: 50 states + DC + Puerto Rico + US Virgin Islands = 53 reports', () => {
  assert.equal(STATES_2026.length, 53); assert.equal(STATES_2026.filter((r) => r.participation_rate_pct !== null).length, 51);
  assert.ok(STATES_2026.every((r) => r.p50 && r.mean_total >= 400 && r.mean_total <= 1600));
});
test('Missouri: 2,919 takers, 4%, mean 1187/604/584, 67/88/68/10, IQR 1040-1200-1340', () => {
  const r = getSatScoresByState('MO');
  assert.equal(r.test_takers, 2919); assert.equal(r.participation_rate_pct, 4); assert.deepEqual(r.mean, { total: 1187, rw: 604, math: 584 });
  assert.deepEqual(r.met_benchmarks_pct, { both: 67, rw: 88, math: 68, none: 10 });
  assert.deepEqual(r.score_percentiles.p25, { total: 1040, rw: 530, math: 500 }); assert.deepEqual(r.score_percentiles.p75, { total: 1340, rw: 680, math: 670 });
  assert.equal(r.vs_national_mean_total, 142);
});
test('Texas: 308,166 takers, 75%, mean 972 (494 RW, 478 Math), 30% met both', () => {
  const r = getSatScoresByState('texas');
  assert.equal(r.test_takers, 308166); assert.equal(r.participation_rate_pct, 75); assert.deepEqual(r.mean, { total: 972, rw: 494, math: 478 }); assert.equal(r.met_benchmarks_pct.both, 30);
});
test('California: 138,763, 30%, 1108/560/548, p75 1300/660/650; Ohio 31,008, 22%, 1034', () => {
  const c = getSatScoresByState('CA'); assert.equal(c.test_takers, 138763); assert.equal(c.participation_rate_pct, 30); assert.deepEqual(c.mean, { total: 1108, rw: 560, math: 548 });
  assert.deepEqual(c.score_percentiles.p75, { total: 1300, rw: 660, math: 650 });
  const o = getSatScoresByState('OH'); assert.equal(o.test_takers, 31008); assert.equal(o.participation_rate_pct, 22); assert.equal(o.mean.total, 1034);
});
test('school-day states flagged; DC, PR and VI resolve; unknown state rejected', () => {
  assert.equal(getSatScoresByState('Michigan').sat_school_day_state, true); assert.equal(getSatScoresByState('DC').state, 'District of Columbia');
  assert.equal(getSatScoresByState('PR').participation_rate_pct, null); assert.equal(getSatScoresByState('VI').state, 'US Virgin Islands');
  assert.throws(() => getSatScoresByState('Ontario'), InputError);
});
test('rank_states_by_sat: sorted, min participation respected, 51 rankable', () => {
  const r = rankStatesBySat('mean_total', 'desc', 51, 50);
  assert.ok(r.states.every((s) => s.participation_rate_pct >= 50));
  for (let i = 1; i < r.states.length; i++) assert.ok(r.states[i - 1].value >= r.states[i].value);
  assert.equal(rankStatesBySat('mean_total', 'desc', 51).count, 51);
  assert.equal(rankStatesBySat('participation_rate', 'asc', 1).states[0].value, 1);
});
