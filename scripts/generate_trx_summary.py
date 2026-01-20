#!/usr/bin/env python3
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

def parse_trx(trx_path):
    ns = {'t': 'http://microsoft.com/schemas/VisualStudio/TeamTest/2010'}
    tree = ET.parse(trx_path)
    root = tree.getroot()

    results = []
    for ur in root.findall('.//t:UnitTestResult', ns):
        name = ur.get('testName')
        outcome = ur.get('outcome')
        duration = ur.get('duration')
        start = ur.get('startTime')
        end = ur.get('endTime')
        exec_id = ur.get('executionId')
        stdout_el = ur.find('.//t:StdOut', ns)
        stdout = stdout_el.text.strip() if stdout_el is not None and stdout_el.text else ''
        results.append({
            'name': name,
            'outcome': outcome,
            'duration': duration,
            'start': start,
            'end': end,
            'stdout': stdout,
        })

    summary = root.find('.//t:ResultSummary', ns)
    counters = {}
    if summary is not None:
        c = summary.find('t:Counters', ns)
        if c is not None:
            counters = c.attrib

    return results, counters

def render_html(results, counters, out_path):
    html = []
    html.append('<!doctype html>')
    html.append('<html><head><meta charset="utf-8"><title>TRX Test Summary</title>')
    html.append('<style>body{font-family:Segoe UI,Arial;margin:18px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}th{background:#f4f4f4;text-align:left}</style>')
    html.append('</head><body>')
    html.append('<h1>TRX Test Summary</h1>')

    html.append('<h2>Counters</h2>')
    html.append('<table>')
    html.append('<tr><th>Metric</th><th>Value</th></tr>')
    if counters:
        for k, v in counters.items():
            html.append(f'<tr><td>{k}</td><td>{v}</td></tr>')
    else:
        html.append('<tr><td colspan="2">No counters found</td></tr>')
    html.append('</table>')

    html.append('<h2>Tests</h2>')
    html.append('<table>')
    html.append('<tr><th>Name</th><th>Outcome</th><th>Duration</th><th>Start</th><th>End</th><th>StdOut</th></tr>')
    for r in results:
        stdout = (r['stdout'].replace('\n','<br/>')) if r['stdout'] else ''
        html.append('<tr>')
        html.append(f'<td>{r["name"]}</td>')
        html.append(f'<td>{r["outcome"]}</td>')
        html.append(f'<td>{r["duration"]}</td>')
        html.append(f'<td>{r["start"]}</td>')
        html.append(f'<td>{r["end"]}</td>')
        html.append(f'<td style="white-space:pre-wrap">{stdout}</td>')
        html.append('</tr>')
    html.append('</table>')

    html.append('</body></html>')

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text('\n'.join(html), encoding='utf-8')

def main():
    if len(sys.argv) < 3:
        print('Usage: generate_trx_summary.py <input.trx> <output.html>')
        sys.exit(2)
    trx = sys.argv[1]
    out = sys.argv[2]
    results, counters = parse_trx(trx)
    render_html(results, counters, out)
    print('Wrote', out)

if __name__ == '__main__':
    main()
