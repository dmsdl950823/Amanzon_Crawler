const catetories = require('./component/categories')

const puppeteer = require('puppeteer')

const fs = require('fs')
const fastcsv = require('fast-csv')
const ws = fs.createWriteStream('data.csv')

// csv 파일로 저장하기
const saveWithCSV = (json) => {
  // const jsonData = [ { id: 1,
  //   name: 'Node.js',
  //   description: 'JS web applications',
  //   created_at: '2021-09-02' },
  // { id: 2,
  //   name: 'Vue.js',
  //   description: 'for building UI',
  //   created_at: '2021-09-05' },
  // { id: 3,
  //   name: 'Angular.js',
  //   description: 'for building mobile & desktop web app',
  //   created_at: '2021-09-08' }
  // ]
  
  return fastcsv
    .write(json, { headers: true })
    .on('finish', function () {
      console.log('Write to csv successfully!')
      return true
    })
    .pipe(ws)
}


// 크롤러 (직접 Input 입력하는 방식)
const forPuppeteerWithInput = async () => {

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
  await page.goto('https://www.amazon.com')

  // [postcode 설정]
  // await page.click('#nav-global-location-slot')
  // await page.waitForSelector('#GLUXSignInButton')
  // await page.type('.GLUX_Full_Width.a-declarative', '10001') // 뉴욕 포스트코드
  // await page.click('#GLUXZipUpdate-announce')

  // await page.waitForSelector('.a-popover-footer')
  // await page.click('.a-popover-footer #GLUXConfirmClose')

  console.log('클릭한겨?')

  // [텍스트 입력, 페이지 끝까지 기다리기]
  await page.type('#twotabsearchtextbox', 'cat')
  await page.click('#nav-search-submit-button')
  await page.waitForSelector('.navFooterBackToTopText')

  // [목록 가져올때까지 기다리기]
  await page.waitForSelector('.s-main-slot')
  const elements = await page.$$('.s-main-slot > .sg-col-4-of-12')

  
  const result = []

  // [items 목록 순회]
  // https://www.youtube.com/watch?v=sm2A4gpIiD0
  for (let i = 0; i < elements.length; i++) {
    const item = elements[i]

    const title = await item.$eval('h2 a.a-link-normal.s-underline-text span.a-text-normal', el => el.textContent)
    const image = await item.$eval('div.s-product-image-container img.s-image', el => el.getAttribute('src'))

    // const image
    // const brand
    // const price
    // const category
    // const rank
    // const sales
    // const revenue
    // const reviews
    // const rating
    // const weight

    const object = {
      title,
      image
    }
    result.push(object)
  }

  await saveWithCSV(result)

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

// forPuppeteerWithInput()



// 크롤러 (페이지만 입력하는 방식)
const forPuppeteerWithPage = async () => {

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
  await page.goto('https://www.amazon.com')

  // [postcode 설정]
  await page.click('#nav-global-location-slot')
  await page.waitForSelector('#GLUXSignInButton')
  await page.type('.GLUX_Full_Width.a-declarative', '10001') // 뉴욕 포스트코드
  await page.click('#GLUXZipUpdate-announce')

  await page.waitForSelector('.a-popover-footer')
  await page.click('.a-popover-footer #GLUXConfirmClose')
  // console.log('클릭한겨?')

  // [카테고리 설정]
  const category = catetories['Office Products']
  const search_input = 'supplies'

  // [텍스트 입력, 페이지 끝까지 기다리기]
  // [현재 URL - Query Parameter 저장]
  // const query = await page.evaluate(() => location.href.split('www.amazon.com')[1])

  
  // [물품 정보 저장]
  const result = []

  // [페이지 돌면서 물품들 확인]
  for (let pg = 1; pg < 2; pg++) {
    // await page.goto('https://www.amazon.com/s?{search_input}&i={category}&page={pg}') // 페이지 이동
    const url = `https://www.amazon.com/s?k=${search_input}&i=${category}&page=${pg}`
    console.log(`GO page ${pg} =>`, url)

    await page.goto(url)
    await page.waitForSelector('.s-main-slot') // [목록 가져올때까지 기다리기]

    const elements = await page.$$('.s-main-slot > .sg-col-4-of-12')
  
    // [items 목록 순회]
    // https://www.youtube.com/watch?v=sm2A4gpIiD0
    for (let i = 0; i < elements.length; i++) {
      const item = elements[i]

      const title = await item.$eval('h2 a.a-link-normal.s-underline-text span.a-text-normal', el => el.textContent)
      const image = await item.$eval('div.s-product-image-container img.s-image', el => el.getAttribute('src'))

      // const image
      // const brand
      // const price
      // const category
      // const rank
      // const sales
      // const revenue
      // const reviews
      // const rating
      // const weight

      const object = {
        title,
        image
      }
      result.push(object)
    }
  }

  await saveWithCSV(result)

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

forPuppeteerWithPage()