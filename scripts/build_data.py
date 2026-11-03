"""Build src/sat.data.ts from College Board sources saved locally.

Usage: python3 -I scripts/build_data.py <dir with percentiles.html, total.txt and pdf/*.pdf> > src/sat.data.ts
pdf text is extracted with `pdftotext -layout` (poppler). Every number in the output is copied from these files.
"""
import html, json, os, re, subprocess, sys, hashlib

src = sys.argv[1]

def cells(row):
    return [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', c))).strip() for c in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', row, re.S)]

page = open(os.path.join(src, 'percentiles.html'), encoding='utf8').read()
tabs = re.findall(r'<table.*?</table>', page, re.S)
assert len(tabs) == 2, 'expected 2 percentile tables'
total = {}
for r in re.findall(r'<tr.*?</tr>', tabs[0], re.S):
    c = cells(r)
    if c and re.fullmatch(r'\d{3,4}', c[0]):
        total[int(c[0])] = {'nat': c[1], 'user': c[2]}
section = {}
for r in re.findall(r'<tr.*?</tr>', tabs[1], re.S):
    c = cells(r)
    if c and re.fullmatch(r'\d{3}', c[0]):
        section[int(c[0])] = {'rw_nat': c[1], 'rw_user': c[2], 'math_nat': c[3], 'math_user': c[4]}
assert len(total) == 121 and min(total) == 400 and max(total) == 1600, len(total)
assert len(section) == 61 and min(section) == 200 and max(section) == 800, len(section)

STATE_FIX = {'district-of-columbia': 'District of Columbia', 'us-virgin-islands': 'US Virgin Islands', 'puerto-rico': 'Puerto Rico'}
NUM = r'([\d,]+)'

def txt(pdf):
    return subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True, check=True).stdout

def parse_state(t, name):
    m = re.search(r'^SAT\s*\nTotal\s+Test Takers.*?\n.*?\n\s*\nTotal\s+([\d,]+)\s+(\d{3,4})\s+(\d{3})\s+(\d{3})\s+(\d+)%\s+(\d+)%\s+(\d+)%\s+(\d+)%', t, re.S | re.M)
    if not m:
        return None
    takers, tot, rw, ma, both, mrw, mma, none = m.groups()
    p = re.search(r'Class of 2026\s+SAT\s+([\d,]+)\s+(\d+)%', t)
    iq = re.search(r'Interquartile Ranges.*?\nSAT\s*\nPercentile.*?\n.*?\n\s*\n75th\s+(\d+)\s+(\d+)\s+(\d+)\s*\n50th\s+(\d+)\s+(\d+)\s+(\d+)\s*\n25th\s+(\d+)\s+(\d+)\s+(\d+)', t, re.S)
    row = {
        'state': name, 'test_takers': int(takers.replace(',', '')), 'participation_rate_pct': int(p.group(2)) if p else None,
        'mean_total': int(tot), 'mean_rw': int(rw), 'mean_math': int(ma),
        'met_both_pct': int(both), 'met_rw_pct': int(mrw), 'met_math_pct': int(mma), 'met_none_pct': int(none),
        'p75': None, 'p50': None, 'p25': None,
    }
    if p:
        assert int(p.group(1).replace(',', '')) == row['test_takers'], (name, p.group(1), takers)
    if iq:
        g = [int(x) for x in iq.groups()]
        row['p75'] = {'total': g[0], 'rw': g[1], 'math': g[2]}
        row['p50'] = {'total': g[3], 'rw': g[4], 'math': g[5]}
        row['p25'] = {'total': g[6], 'rw': g[7], 'math': g[8]}
    return row

states, files, misses = [], [], []
pdfdir = os.path.join(src, 'pdf')
for f in sorted(os.listdir(pdfdir)):
    m = re.match(r'2026-(.+?)-sat-suite-of-assessments-annual-report', f)
    if not m or m.group(1) == 'total-group':
        continue
    slug = m.group(1)
    name = STATE_FIX.get(slug) or ' '.join(w.capitalize() for w in slug.split('-'))
    t = txt(os.path.join(pdfdir, f))
    assert name.upper() in t.upper(), (name, f)
    r = parse_state(t, name)
    if r is None:
        misses.append(name); continue
    r['source'] = 'https://reports.collegeboard.org/media/pdf/' + f
    states.append(r)
    files.append({'file': f, 'sha256': hashlib.sha256(open(os.path.join(pdfdir, f), 'rb').read()).hexdigest()})

tt = open(os.path.join(src, 'total.txt'), encoding='utf8').read()
m = re.search(r'^Total\s+([\d,]+)\s+(\d{4})\s+(\d{3})\s+(\d{3})\s+(\d+)%\s+(\d+)%\s+(\d+)%\s+(\d+)%', tt, re.M)
iq = re.search(r'Interquartile Ranges\s*\n\s*\n\s*\n\s*(\d{3,4})\s*\n\s*25th percentile\s*\n\s*(\d{3,4})\s*\n\s*50th percentile\s*\n\s*(\d{3,4})\s*\n\s*75th percentile', tt)
seg = tt[tt.find('Total and Section Scores'):]
seg = seg[:seg.find('Section Scores', 30)]
bands = re.findall(r'^(\d{3,4})–(\d{3,4})\s+([\d,]+)\s+(\d+)%', seg, re.M)
perfect = re.search(r'(\d[\d,]*)\s*\n\s*Students\s*\n.*?scoring 1600', seg, re.S)
national = {
    'test_takers': int(m.group(1).replace(',', '')), 'mean_total': int(m.group(2)), 'mean_rw': int(m.group(3)), 'mean_math': int(m.group(4)),
    'met_both_pct': int(m.group(5)), 'met_rw_pct': int(m.group(6)), 'met_math_pct': int(m.group(7)), 'met_none_pct': int(m.group(8)),
    'p25_total': int(iq.group(1)), 'p50_total': int(iq.group(2)), 'p75_total': int(iq.group(3)),
    'total_score_bands': [{'band': f'{a}-{b}', 'test_takers': int(n.replace(',', '')), 'pct': int(p)} for a, b, n, p in bands],
    'scored_1600': int(perfect.group(1).replace(',', '')) if perfect else None,
    'source': 'https://reports.collegeboard.org/media/pdf/2026-total-group-sat-suite-of-assessments-annual-report-ada.pdf',
}
assert len(national['total_score_bands']) == 6 and sum(b['test_takers'] for b in national['total_score_bands']) == national['test_takers'], national['total_score_bands']

sys.stderr.write(f'states parsed {len(states)}, misses {misses}\n')
out = ['// Generated by scripts/build_data.py from College Board sources fetched 2026-11-03. Do not edit by hand.']
out.append('export const PERCENTILE_SOURCE = "https://research.collegeboard.org/reports/sat-suite/understanding-scores/sat";')
out.append('export const TOTAL_PERCENTILES: Record<number, { nat: string; user: string }> = ' + json.dumps(total) + ';')
out.append('export const SECTION_PERCENTILES: Record<number, { rw_nat: string; rw_user: string; math_nat: string; math_user: string }> = ' + json.dumps(section) + ';')
out.append('export const NATIONAL_2026 = ' + json.dumps(national) + ' as const;')
out.append('export interface StateRow { state: string; test_takers: number; participation_rate_pct: number | null; mean_total: number; mean_rw: number; mean_math: number; met_both_pct: number; met_rw_pct: number; met_math_pct: number; met_none_pct: number; p75: { total: number; rw: number; math: number } | null; p50: { total: number; rw: number; math: number } | null; p25: { total: number; rw: number; math: number } | null; source: string }')
out.append('export const STATES_2026: StateRow[] = ' + json.dumps(states) + ';')
out.append('export const SOURCE_FILES = ' + json.dumps(files) + ';')
print('\n'.join(out))
