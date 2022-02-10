const colors = require('./component/logcolors')
const catetories = require('./component/categories')

const puppeteer = require('puppeteer')

const fs = require('fs')
const fastcsv = require('fast-csv')

let pageCount = 60 



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

  // console.log(json)
  const ws = fs.createWriteStream(`upto_${pageCount - 1}.csv`)
  console.log(`${colors.fgGreen}   @@@ 일단 ${pageCount - 1} 까진 저장 @@@   `, colors.reset)

  return fastcsv
    .write(json, { headers: true })
    .on('finish', function () {
      console.log('Write to csv successfully!')
      return true
    })
    .pipe(ws)
}


// 크롤러 (페이지만 입력하는 방식) ✅
const forPuppeteerWithPage = async (innerpagecnt = 1) => {
  console.log(`${colors.bgBlue}     >>> Browser Start! <<<    `, colors.reset)
  // console.log('pupeteer', puppeteer)
  
  // [물품 정보 저장] ✅
  const result = []

  const browser = await puppeteer.launch({
    headless: false,
    // https://free-proxy-list.net/ (프록시서버)
    // args: ['--proxy-server=47.243.135.104:8080', '--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1020,890','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    slowMo: 30,
  })


  try {
    const page = await browser.newPage() // 크롬 브라우저의 탭 하나 생성
    // await page.setDefaultNavigationTimeout(0)
    
    // https://www.tabnine.com/code/javascript/functions/puppeteer/Page/waitForSelector :: 참고 문헌
    // https://ourcodeworld.com/articles/read/1106/how-to-solve-puppeteer-timeouterror-navigation-timeout-of-30000-ms-exceeded :: timeout 관련 문헌
    await page.setViewport({ width: 1020, height: 890 })
    await page.goto('https://www.amazon.com', { waitUntil: 'load', timeout: 0 })
  
    // [postcode 설정] ✅
    await page.click('#nav-global-location-slot')
    await page.waitForSelector('#GLUXSignInButton')
    await page.type('.GLUX_Full_Width.a-declarative', '10001') // 뉴욕 포스트코드
    await page.click('#GLUXZipUpdate-announce')
  
    await page.waitForSelector('.a-popover-footer')
    await page.evaluate(() => location.reload(true))
  
    // [카테고리 설정] ✅
    const category = catetories['Office Products']
    const search_input = 'supplies'
  
    // [텍스트 입력, 페이지 끝까지 기다리기] 🟨
    // [현재 URL - Query Parameter 저장]
    // const query = await page.evaluate(() => location.href.split('www.amazon.com')[1])
  
    
    // [페이지 돌면서 물품들 확인] ✅
    for (let pg = innerpagecnt; pg <= 200; pg++) {
      // await page.goto('https://www.amazon.com/s?{search_input}&i={category}&page={pg}') // 페이지 이동
      const url = `https://www.amazon.com/s?k=${search_input}&i=${category}&page=${pg}`
      console.log(`@@ GO page :: ${pg} =>`, url)

      await page.goto(url, { waitUntil: 'load', timeout: 0 })
      await page.waitForSelector('.s-main-slot') // [목록 가져올때까지 기다리기]

      const elements = await page.$$('.s-main-slot > .sg-col-4-of-12')
    
      // [items 목록 순회] ✅
      // https://www.youtube.com/watch?v=sm2A4gpIiD0
      for (let i = 0; i < elements.length; i++) {
        const item = elements[i]

        // [Sponsed 인경우 건너뛰기] ✅
        const sponsered = await item.$('a.s-sponsored-label-text') || false
        console.log(`${colors.fgMagenta}sponsered :: ${!!sponsered}`, colors.reset)
        if (sponsered) continue

        const price1 = await item.$('div.a-section.a-spacing-small span.a-price') || null
        const image = await item.$eval('div.s-product-image-container img.s-image', el => el.getAttribute('src'))
        const href = await item.$eval('a.a-link-normal.s-no-outline', el => el.getAttribute('href'))
        const asin = await item.evaluate(el => el.getAttribute('data-asin'), item)

        console.log('└ href ===> ', `https://www.amazon.com${href}`)
        console.log('└ asin ===> ', asin)

        // [item 상세] ✅
        const detailPage = await browser.newPage()
        await detailPage.setViewport({ width: 1020, height: 890 })
        await detailPage.goto(`https://www.amazon.com${href}`, { waitUntil: 'load', timeout: 0 })
        
        const title = await detailPage.$eval('#title', el => el.textContent)
        const price2 = await detailPage.$('#corePriceDisplay_desktop_feature_div span.a-offscreen') || null
        const price3 = await detailPage.$('span.a-price.a-text-price.a-size-medium.apexPriceToPay span.a-offscreen') || null
        const rateNode = await detailPage.$('#acrCustomerReviewLink.a-link-normal') || null
        
        
        const details = {}

        const tableIterator = async (trs) => {
          for (let i = 0; i < trs.length; i++) {
            const tr = trs[i]

            // 나중에 🟨 key 값 통일하기
            const th = await tr.$eval('th.prodDetSectionEntry', el => el.textContent) || null
            const td = await tr.$eval('td', el => {
              const isReview = el.querySelector('#averageCustomerReviews #acrCustomerReviewText')
              
              if (isReview) { // Review 섹션인경우 review 갯수
                return el.textContent.trim().split('}')[1].split(' out of 5 stars')[0]
              }
              return el.textContent
            }) || null

            // console.log(`${th.trim()} :: ${td.trim()}`)

            const key = th.trim().replace(/\s/g, '_').toLowerCase()
            details[key] = td.trim()
          }
        }
        
        
        const hasDetail = await detailPage.$('#prodDetails') || false
        if (hasDetail) {
          // [Product Information - Technical Details] ✅
          await detailPage.waitForSelector('#prodDetails') // [목록 가져올때까지 기다리기]
          const technicalDetails = await detailPage.$$('#productDetails_techSpec_section_1 tbody tr')
          // console.log('---- technicalDetails ---')
          await tableIterator(technicalDetails)
          
          // [Product Information - Additional Information] ✅
          const additionalInfos = await detailPage.$$('#productDetails_detailBullets_sections1 tbody tr')
          // console.log('---- additionalInfos ---')
          await tableIterator(additionalInfos)
        }

        // [방어로직들]
        const priceNode = await (price1 || price2 || price3)
        const price = priceNode ? await priceNode.evaluate(el => el.textContent.split('$')[1], priceNode) : null
        //  console.log(price1 ? 'price1' : null, price2 ? 'price2' : null, price3 ? 'price3' : null)

        const rating = rateNode ? await rateNode.evaluate(el => el.textContent.trim().replace(/ ratings| rating/gi, '').replace(/,/gi, ''), rateNode) : null

        // 기타 처리...
        if (details.best_sellers_rank !== undefined) {
          details.best_sellers_rank = Number(details.best_sellers_rank.split(' in ')[0].replace('#', '').replace(/,/g, ''))
        }

        if (details.item_weight === undefined) details.item_weight = ''
        else { // pound, ounce 변환
          const weight = details.item_weight.split(' ')
          const num = Number(weight[0])
          const unit = weight[1]

          const unitCalc = {
            ounces: data => data * 1,
            pounds: data => data * 16
          }[unit]

          details.item_weight = unitCalc(num)
        }
        if (details.size === undefined) details.size = ''
        if (details.brand === undefined) details.brand = ''
        console.log(details)



        // const category 😢
        // const rank 🤷‍♂️
        // const sales 😢
        // const revenue 😢

        // 상세페이지 닫기 ✅
        detailPage.close()


        // =================
        // ====== 결론 ======
        // =================

        const object = {
          title: title.trim(),
          image,
          price,
          href: `https://www.amazon.com${href}`,
          asin,
          rating,
          ...details
        }

        // console.log(object)
        result.push(object)
        console.log(result.length)
      }

      pageCount += 1
    }

    // 저장하기 ✅
    const writed = await saveWithCSV(result)
    
    if (writed) {
      console.log(`${colors.bgYellow}    ### BYE ###   `, colors.reset)
      await browser.close()
    }
      
  } catch (error) {
    // 에러가 나도 저장하기 ✅
    const writed = await saveWithCSV(result)
    console.log(error)
    
    if (writed) {
      console.log(`${colors.bgRed}    >>> Error Occured!! <<<   `, colors.reset)
      await browser.close()


      return forPuppeteerWithPage(pageCount)
    }
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
}

forPuppeteerWithPage(pageCount)


// ================
// ===== TEST =====
// ================



// 크롤러 테스터
const TEST = async () => {
  console.log(`${colors.bgGreen}     >>> TEST Browser Start! <<<    `, colors.reset)
  // console.log('pupeteer', puppeteer)
  
  const browser = await puppeteer.launch({
    headless: false,
    // https://free-proxy-list.net/ (프록시서버)
    // args: ['--proxy-server=47.243.135.104:8080', '--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1020,890','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'],
    slowMo: 30,
  })

  const testPage = await browser.newPage() // 크롬 브라우저의 탭 하나 생성
  await testPage.setViewport({ width: 1020, height: 890 })
  await testPage.goto('https://www.amazon.com/Professional-Painting-Supplies-Hobbyists-Beginners/dp/B08L7K5N4Z/ref=sr_1_10?keywords=supplies&qid=1644148891&s=office-products&sr=1-10', { waitUntil: 'load', timeout: 0 })

  const test = {}

  const tableIterator = async (trs) => {
    for (let i = 0; i < trs.length; i++) {
      const tr = trs[i]

      const th = await tr.$eval('th.prodDetSectionEntry', el => el.textContent) || null
      const td = await tr.$eval('td', el => {
        const isReview = el.querySelector('#averageCustomerReviews #acrCustomerReviewText')
        if (isReview) return `${el.textContent.trim().split('}')[1].split(' out of 5 stars')[0]} (${isReview.textContent})`
        return el.textContent
      }) || null

      console.log(`${th.trim()} :: ${td.trim()}`)

      const key = th.trim().replace(/\s/g, '_').toLowerCase()
      test[key] = td.trim()
    }
  }
  
  const hasDetail = await testPage.$('#prodDetails') || false
  if (hasDetail) {
    // Product Information - Technical Details
    await testPage.waitForSelector('#prodDetails') // [목록 가져올때까지 기다리기]
    const technicalDetails = await testPage.$$('#productDetails_techSpec_section_1 tbody tr')
    console.log('---- technicalDetails ---')
    await tableIterator(technicalDetails)
    
    // Product Information - Additional Information
    const additionalInfos = await testPage.$$('#productDetails_detailBullets_sections1 tbody tr')
    console.log('---- additionalInfos ---')
    await tableIterator(additionalInfos)
  } else {
    console.log('ㄻㄴㄷㄻㄴㄷ..?')
  }

  console.log(test)

  
  console.log('bye!!')
  // await browser.close()
}

// TEST()

// =====
// =====
// =====
// =====

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
