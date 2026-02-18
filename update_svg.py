#!/usr/bin/env python3
import sys

# Read the complete SVG content
# The user should paste their complete SVG here or pass it as input
if len(sys.argv) > 1:
    with open(sys.argv[1], 'r') as f:
        svg_content = f.read()
else:
    # Default: write the structure and user can add paths
    svg_content = """<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1248 832">
  <style>
    .decorative-path { fill: #7FA694; fill-opacity: 0.12; }
  </style>
  <!-- Paste all your path elements here -->
</svg>"""

with open('assets/images/resonance-decorative.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
    
print('SVG file updated')
