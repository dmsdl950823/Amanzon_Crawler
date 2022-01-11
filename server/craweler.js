
const axios = require('axios')
const cheerio = require('cheerio')
const log = console.log
const puppeteer = require('puppeteer')


const fetchShelves = async () => {
  try {
    // const response = await axios.get('https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=shelves&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309')
    const response = await axios.get('https://www.amazon.com/s?k=shelves&page=3&crid=36QNR0DBY6M7J&qid=1641848554&refresh=1&sprefix=s%2Caps%2C309&ref=sr_pg_3', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      },
      proxy: {
        protocol: 'https',
        host: '101.99.95.54',
        port: 80
      }
    })

    
    const html = response.data
    const $ = cheerio.load(html)
    const shelves = []
    console.log(html)

    $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
      const shelf = $(el)

      const title = shelf.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
      const asin = shelf.attr('data-asin') // asin number
      const href = shelf.find('a.a-link-normal.s-link-style.a-text-normal').attr('href')

      // console.log(title, ' :: ', href)

      shelves.push(title)
    })

    return shelves
  } catch (error) {
    throw error
  }
}

// fetchShelves().then(shelved => console.log('done!'))
// .catch((error) => {
//   console.error(error, '@@ :: Error')
// })

// 사용 예시
// https://zenscrape.com/how-to-scrape-amazon-product-information-with-nodejs-and-puppeteer/

const forPuppeteerTest = () => {

  console.log('Browser Start!')
  // console.log('pupeteer', puppeteer)
  
  puppeteer.launch({
    headless: false,
    // https://free-proxy-list.net/ (프록시서버)
    // args: ['--proxy-server=47.243.135.104:8080', '--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    slowMo: 30,   
  }).then(async browser => {

    const page = await browser.newPage() // 크롬 브라우저의 탭 하나 생성
    
    await page.setViewport({ width: 1920, height: 1080 })
    // await page.screenshot({ path: 'screenshot/open.png' })
    // await page.goto("https://www.amazon.com/s?k=supplies&page=2&qid=1641879572&ref=sr_pg_2");

    console.log('페이지 로딩 된건디?')
    
    Promise.all([
      await page.goto("https://www.naver.com/"),
      await page.waitForSelector() // 화면이 로딩될때까지 기다려라
    ])

    // https://www.youtube.com/watch?v=eynT_cMvOTU 동영상 강의
    console.log('finish waiting..!!!')

    let target = "//span[text()='쇼핑']/ancestor::a"
    await page.waitForXPath(target) // 해당 xpath 를 찾을때 까지 기본적으로 30 초 기다림
    let s = await page.$x(target)
    s = s[0]
    
    await Promise.all([
      await s.click(),
      await page.waitForSelector() // 화면이 로딩될때까지 기다려라
    ])

    await page.waitForTimeout(3000) // 3 초 정도 기다림
    await browser.close()
  
  }).catch(function(error) {
      console.error(error)
  })
}

forPuppeteerTest()