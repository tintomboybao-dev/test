from playwright.sync_api import sync_playwright
from pathlib import Path
import json
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading, functools
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/index.html'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(1024,768),(768,900),(375,812),(320,640)]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.goto('about:blank')
  page.set_content((root/'index.html').read_text('utf-8'), wait_until='load')
  page.wait_for_timeout(250)
  assert page.locator('text=Toán rời rạc').count()>0
  overflow=page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
  print(f'width {width}: overflow={overflow}, errors={errors}, topics={page.locator(".topic-card").count()}')
  assert not errors,errors
  assert overflow <= 1,(width,overflow)
  if width==1440:page.screenshot(path='/mnt/data/sui-study-lab-v2/tests/desktop.png',full_page=True)
  if width==375:page.screenshot(path='/mnt/data/sui-study-lab-v2/tests/mobile.png',full_page=True)
  if width==375:
   page.get_by_role('button',name='Mở danh sách môn học').click()
   assert 'menu-open' in page.locator('body').get_attribute('class')
   page.locator('#scrim').click(position={'x':350,'y':150})
  page.get_by_role('button',name='Bài giải').first.click()
  assert page.locator('.problem-card').count()==19
  page.locator('#searchInput').fill('Fibonacci')
  assert page.locator('.problem-card').count()==1
  page.locator('#searchInput').fill('')
  page.locator('[data-problem="8"]').click()
  assert page.locator('.solution-step').count()==5
  assert page.locator('svg[aria-label^="Venn"]').count()==1
  assert '29 sinh viên' in page.locator('.final-answer').inner_text()
  if width==1440: page.screenshot(path='/mnt/data/sui-study-lab-v2/tests/detail-desktop.png',full_page=True)
  if width==375: page.screenshot(path='/mnt/data/sui-study-lab-v2/tests/detail-mobile.png',full_page=True)
  page.locator('[data-action="complete"]').click()
  assert 'Đã nắm vững' in page.locator('[data-action="complete"]').inner_text()
  page.locator('#noteInput').fill('Sủi ghi chú: Venn không đếm lặp')
  page.locator('[data-action="save-note"]').click()
  # Opaque about:blank cannot persist localStorage in this sandbox; persistence checked separately in JS.
  page.get_by_role('button',name='Công thức').first.click()
  assert page.locator('.formula-card').count()>=10
  page.get_by_role('button',name='Tự luyện').first.click()
  assert page.locator('.quiz-option').count()==4
  page.locator('[data-choice="3"]').click()
  assert page.locator('.quiz-feedback').count()==1
  page.locator('[data-action="quiz-next"]').click()
  assert 'CÂU HỎI 2' in page.locator('.quiz-head').inner_text()
  page.close()
 browser.close()
print('SMOKE TEST PASS')
