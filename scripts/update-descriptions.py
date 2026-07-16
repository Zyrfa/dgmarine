import sys, io, json, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('parsed_descriptions.json', encoding='utf-8') as f:
    descs = json.load(f)

with open('lib/mock-products.ts', encoding='utf-8') as f:
    content = f.read()

def normalize(s):
    s = s.lower().replace('dg ', '').replace('/', '').replace('-', ' ')
    return re.sub(r'\s+', ' ', s).strip()

desc_map = {normalize(k): k for k in descs.keys()}

MANUAL = {
    'antifreeze coolant el':   'Antifreeze EL',
    'antifreeze coolant':      'Antifreeze',
    'elektrocleaner fast dry': 'Elektrocleaner fast fry',
}

def find_desc(en_name):
    norm = normalize(en_name)
    key = desc_map.get(norm) or MANUAL.get(norm)
    if key and key in descs:
        return descs[key]
    return None

def esc_single(s):
    # Escape single quotes for use inside '...'
    return s.replace("'", "\\'")

def update_product_block(block):
    en_name_m = re.search(r"name: \{[^}]*en: '([^']+)'", block, re.DOTALL)
    if not en_name_m:
        return block
    en_name = en_name_m.group(1)
    d = find_desc(en_name)
    if not d:
        print(f'  NO DESC: {en_name}')
        return block

    en_full  = esc_single(d['en'])
    pl_full  = esc_single(d['pl'])
    en_short = esc_single(d['en_short'])
    pl_short = esc_single(d['pl_short'])

    # Replace shortDesc block
    block = re.sub(
        r"shortDesc: \{[^}]+\}",
        f"shortDesc: {{ en: '{en_short}', pl: '{pl_short}', de: '{en_short}' }}",
        block
    )
    # Replace description block
    block = re.sub(
        r"description: \{[^}]+\}",
        f"description: {{ en: '{en_full}', pl: '{pl_full}', de: '{en_full}' }}",
        block
    )
    print(f'  OK: {en_name}')
    return block

# Split content into product blocks and update each
parts = re.split(r'(\n  \{)', content)
result = []
for i, part in enumerate(parts):
    if i > 0 and i % 2 == 0:
        part = update_product_block(part)
    result.append(part)

new_content = ''.join(result)

with open('lib/mock-products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('\nDone.')
