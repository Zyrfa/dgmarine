import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ANTIFREEZE_EL = {
    'en_short': "DG Antifreeze/Coolant EL is a premium long-life coolant designed for cooling systems of diesel, gasoline, and natural gas engines.",
    'pl_short': "DG Antifreeze/Coolant EL to wysokiej jakości płyn chłodniczy długiego działania, przeznaczony do układów chłodzenia silników diesla, benzynowych i gazowych.",
    'en': "DG Antifreeze/Coolant EL is a premium long-life coolant designed for cooling systems of diesel, gasoline, and natural gas engines. Formulated from Mono Ethylene Glycol blended with deionized water and an organic liquid corrosion inhibitor (OAT technology), it delivers comprehensive protection against temperature extremes, rust, corrosion, scale formation, and premature water pump failure. Provides freeze protection down to -37°C. How to use: Change the coolant only after confirming the engine is completely cold. Follow the manufacturer\\'s service instructions as outlined in the engine manual. The fluid must be replaced with the engine switched off — failure to do so poses a risk of burns. Top up to the level recommended by the engine manufacturer. Available format: 25 L concentrate.",
    'pl': "DG Antifreeze/Coolant EL to wysokiej jakości płyn chłodniczy długiego działania, przeznaczony do układów chłodzenia silników diesla, benzynowych i gazowych. Oparty na glikolu mono etylenowym zmieszanym z odjonizowaną wodą i organicznym cieczowym inhibitorem korozji (technologia OAT), zapewnia kompleksową ochronę przed ekstremalnymi temperaturami, rdzą, korozją, osadzaniem się kamienia kotłowego oraz przedwczesnym uszkodzeniem pompy wodnej. Ochrona przed zamarzaniem do -37°C. Płyn chłodniczy należy wymieniać wyłącznie po upewnieniu się, że silnik jest całkowicie zimny. Postępować zgodnie z instrukcją serwisową producenta zawartą w podręczniku silnika. Wymiana płynu musi odbywać się przy wyłączonym silniku – w przeciwnym razie istnieje ryzyko poparzeń. Uzupełniać do poziomu zalecanego przez producenta silnika. Dostępny format: koncentrat 25 L.",
}

ANTIFREEZE = {
    'en_short': "DG Antifreeze/Coolant is a reliable, multi-engine coolant designed for cooling systems of diesel, gasoline, and natural gas engines.",
    'pl_short': "DG Antifreeze/Coolant to niezawodny płyn chłodniczy do układów chłodzenia silników diesla, benzynowych i gazowych.",
    'en': "DG Antifreeze/Coolant is a reliable, multi-engine coolant designed for cooling systems of diesel, gasoline, and natural gas engines. Based on Mono Ethylene Glycol blended with deionized water, it provides a premium blend of long-lasting inhibitors offering protection against temperature extremes, rust, corrosion, scale build-up, and premature water pump failure. Provides freeze protection down to -37°C. Change the coolant only after confirming the engine is completely cold. Always consult the manufacturer\\'s service instructions in the engine manual. The fluid change must be carried out with the engine switched off to avoid the risk of burns. Top up to the level specified by the engine manufacturer. Available format: 25 L concentrate.",
    'pl': "DG Antifreeze/Coolant to niezawodny płyn chłodniczy do układów chłodzenia silników diesla, benzynowych i gazowych. Na bazie glikolu mono etylenowego zmieszanego z odjonizowaną wodą, dostarcza premium mieszankę długotrwałych inhibitorów chroniących przed ekstremalnymi temperaturami, rdzą, korozją, osadzaniem się kamienia i przedwczesnym uszkodzeniem pompy wodnej. Ochrona przed zamarzaniem do -37°C. Płyn chłodniczy należy wymieniać wyłącznie gdy silnik jest całkowicie zimny. Zawsze należy zapoznać się z instrukcją serwisową producenta silnika. Wymiana płynu musi odbywać się przy wyłączonym silniku – w przeciwnym razie istnieje ryzyko poparzeń. Uzupełniać do poziomu wskazanego przez producenta. Dostępny format: koncentrat 25 L.",
}

with open('lib/mock-products.ts', encoding='utf-8') as f:
    content = f.read()

def apply_desc(content, slug, d):
    # Find the product block by slug and replace its shortDesc and description
    pattern = rf"(slug: '{slug}'.*?shortDesc: \{{)[^}}]+(}}.*?description: \{{)[^}}]+(}})"
    replacement = (
        rf"\g<1> en: '{d['en_short']}', pl: '{d['pl_short']}', de: '{d['en_short']}' \g<2>"
        rf" en: '{d['en']}', pl: '{d['pl']}', de: '{d['en']}' \g<3>"
    )
    new_content, n = re.subn(pattern, replacement, content, flags=re.DOTALL)
    print(f"  {'OK' if n else 'FAILED'}: {slug} ({n} replacements)")
    return new_content

content = apply_desc(content, 'antifreeze-el', ANTIFREEZE_EL)
content = apply_desc(content, 'antifreeze', ANTIFREEZE)

with open('lib/mock-products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')
