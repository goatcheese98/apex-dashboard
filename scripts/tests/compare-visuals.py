"""Compare cloud screenshots: python3 compare-visuals.py BEFORE AFTER REPORT.

Requires Pillow and NumPy in the cloud verification environment. Reports all
pixel differences; does not turn a tolerance into an asserted visual approval.
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

before, after, report = map(Path, sys.argv[1:])
results = []
for path in sorted(after.glob('*.png')):
    old_path = before / path.name
    old = Image.open(old_path).convert('RGB')
    new = Image.open(path).convert('RGB')
    size = (max(old.width, new.width), max(old.height, new.height))
    left = Image.new('RGB', size, 'white')
    right = left.copy()
    left.paste(old, (0, 0))
    right.paste(new, (0, 0))
    delta = np.abs(np.asarray(left).astype('int16') - np.asarray(right).astype('int16')).max(axis=2)
    results.append({
        'file': path.name, 'beforeSize': old.size, 'afterSize': new.size,
        'changedPixels': int((delta > 0).sum()),
        'changedOver8': int((delta > 8).sum()),
        'percentOver8': round(float((delta > 8).mean() * 100), 5),
        'beforeSHA256': hashlib.sha256(old_path.read_bytes()).hexdigest(),
        'afterSHA256': hashlib.sha256(path.read_bytes()).hexdigest(),
    })
report.write_text(json.dumps({
    'baseline': 'f052b3b22bb45e1722c5d6cf834bd0d82678a92e',
    'engine': 'Cloud system Chromium; fixed clock and seeded samples; reduced motion; animations/transitions disabled',
    'threshold': 'Every changed pixel is counted; also report maximum channel difference >8/255. No visual approval threshold.',
    'comparisons': results,
}, indent=2) + '\n')
for result in results:
    print(result['file'], result['beforeSize'], result['afterSize'], result['percentOver8'])
