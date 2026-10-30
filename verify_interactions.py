from playwright.sync_api import sync_playwright
from pathlib import Path
p=Path(__file__).resolve().parents[1]
html=(p/'index.html').read_text(encoding='utf-8')
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':375,'height':800})
 errors=[]
 page.on('pageerror',lambda exc:errors.append(str(exc)))
 page.set_content(html)
 page.locator('.mobile-nav a[href="#/formulas"]').click()
 page.wait_for_timeout(100)
 page.locator('#search-box').fill('Stars and Bars')
 assert 1<=page.locator('.formula-item').count()<20
 page.locator('#search-box').fill('')
 page.locator('#topic-filter').select_option('nhithuc')
 assert page.locator('.formula-item').count()==2
 page.locator('#theme-toggle').click()
 assert page.locator('html').get_attribute('data-theme')=='dark'
 page.screenshot(path=str(p/'preview-dark-formulas.png'),full_page=False)
 page.locator('#font-up').click()
 assert float(page.locator('html').evaluate("el=>getComputedStyle(el).fontSize.replace('px','')"))>16
 page.locator('.mobile-nav a[href="#/practice"]').click()
 page.wait_for_timeout(100)
 page.locator('#topic-filter').select_option('nhithuc')
 assert page.locator('.problem-row').count()==6
 page.locator('#search-box').fill('x²y²z²')
 assert page.locator('.problem-row').count()==1
 assert not errors,errors
 print('OK: search, filter, dark mode, font scaling, practice topic filter, no JS errors')
 b.close()
