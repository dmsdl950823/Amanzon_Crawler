
const axios = require('axios')
const cheerio = require('cheerio')
const log = console.log
const puppeteer = require('puppeteer')

const forPuppeteerTest = async () => {

  console.log('Browser Start!')
  // console.log('pupeteer', puppeteer)
  
  const browser = await puppeteer.launch({
    headless: false,
    // https://free-proxy-list.net/ (프록시서버)
    // args: ['--proxy-server=47.243.135.104:8080', '--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    slowMo: 30,   
  })

  const page = await browser.newPage() // 크롬 브라우저의 탭 하나 생성
  
  // https://www.tabnine.com/code/javascript/functions/puppeteer/Page/waitForSelector :: 참고 문헌
  await page.setViewport({ width: 1920, height: 1080 })

  // await page.click('.list_nav.type_fix > .nav_item:nth-of-type(4)')
  // await page.waitForSelector()

  // console.log('bye!!!!')
  // await browser.close() 

  await page.goto('https://www.amazon.com')

  // postcode 설정
  // await page.click('#nav-global-location-slot')
  // await page.waitForSelector('#GLUXSignInButton')
  // await page.type('.GLUX_Full_Width.a-declarative', '10001')
  // await page.click('#GLUXZipUpdate-announce')

  // await page.waitForSelector('.a-popover-footer')
  // await page.click('.a-popover-footer #GLUXConfirmClose')

  // console.log('클릭한겨?')

  // 텍스트 입력, 페이지 끝까지 기다리기
  await page.type('#twotabsearchtextbox', 'cat')
  await page.click('#nav-search-submit-button')
  await page.waitForSelector('.navFooterBackToTopText')

  // 목록 가져올때까지 기다리기
  await page.waitForSelector('.s-main-slot')
  const elements = await page.$$('.s-main-slot > .sg-col-4-of-12')

  // https://www.youtube.com/watch?v=sm2A4gpIiD0
  for (let i = 0; i < elements.length; i++) {
    const item = elements[i]

    // const title = await item.$eval('h2 a.a-link-normal.s-underline-text span.a-text-normal', el => el.textContent)
  }

  // ===
  // ===
  // ===
  // await page.screenshot({ path: 'amazon_nyan_cat_pullovers_list.png' })
  // await page.click('#pagnNextString')
  // await page.waitForSelector('#resultsCol')
  // const pullovers = await page.$$('a.a-link-normal.a-text-normal')
  // await pullovers[2].click()
  // await page.waitForSelector('#ppd')
  // await page.screenshot({ path: screenshot })
  
  console.log('bye!!')
  await browser.close()
}

forPuppeteerTest()