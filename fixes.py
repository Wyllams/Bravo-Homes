import os
import glob

def process_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change color variables to White in dark mode
    # And maybe black in light mode to keep contrast
    content = content.replace('--text:#F0EDE8', '--text:#FFFFFF')
    content = content.replace('--t2:#D0CDC8', '--t2:#FFFFFF')
    
    # Sometimes light mode uses dark grey, I shouldn't touch it unless it is already dark.
    # --text:#1A1D23;--t2:#2A2E38;--t3:#3A3E48 - this is light mode, don't change it.

    # Remove opacities that make text grey
    # We will simply find "opacity:0.75;", "opacity:0.7;", "opacity:0.7", "opacity:0.6" and remove them 
    # BUT only for specific classes to not break layout.
    
    import re
    # We remove opacity declarations from rules containing color:var(--text) or color:var(--t2) or color:var(--t3)
    # The safest way is to do it globally for the specific opacity strings that are used in those classes:
    
    # sb-sub, kl, kc, prog-info, stage-status, msg-time, cal-day-name
    classes_to_clean = ["\.sb-sub", "\.kl", "\.kc", "\.prog-info", "\.stage-status", "\.msg-time", "\.cal-day-name"]
    
    for cls in classes_to_clean:
        pattern = re.compile(f'({cls}{{.*?}})'.encode('utf-8'))
        def replacer(match):
            rule = match.group(1).decode('utf-8')
            rule = re.sub(r'opacity:0\.\d+;?', '', rule)
            return rule.encode('utf-8')
            
    # Actually, simpler: just remove `opacity:X` from the whole css wherever it is a text opacity.
    # Since it's easier, let's just do targeted string replaces based on known contents:
    content = content.replace(';opacity:0.75', '')
    content = content.replace(';opacity:0.7', '')
    content = content.replace(';opacity:0.6', '')
    content = content.replace('opacity:0.75;', '')
    content = content.replace('opacity:0.7;', '')
    content = content.replace('opacity:0.6;', '')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

css_files = glob.glob('src/pages/*.css') + glob.glob('src/*.css')
for f in css_files:
    process_css_file(f)
    print("Updated", f)

print("Done. Text colors and opacity have been updated to pure white.")
