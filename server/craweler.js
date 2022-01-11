
const axios = require('axios')
const cheerio = require('cheerio')
const log = console.log


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
        host: '168.196.211.10',
        port: 55443
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

const forPuppeteerTest = () => {
  const puppeteer = require('puppeteer');
  
  puppeteer.launch({
    headless: true,
    // https://free-proxy-list.net/ (프록시서버)
    args: ['--proxy-server=47.243.135.104:8080', '--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080','--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"']
  }).then(async browser => {
  
    // https://zenscrape.com/how-to-scrape-amazon-product-information-with-nodejs-and-puppeteer/
    const page = await browser.newPage()
    await page.goto("https://www.amazon.com/s?k=supplies&page=2&qid=1641879572&ref=sr_pg_2");
  
    await page.screenshot({ path: 'example.png' });
    await page.waitForSelector('.s-desktop-width-max.s-desktop-content.sg-row')

    const productInfo = await page.evaluate(() => {
      console.log()
    })
      // const productInfo = await page.evaluate(() => {
      //   console.log(document)


      //   // return {
      //   //   width: document.documentElement.clientWidth,
      //   //   height: document.documentElement.clientHeight,
      //   //   deviceScaleFactor: window.devicePixelRatio,
      //   // };


      //   /* Get product title */
      //   // let title = document.body.querySelector('#productTitle').innerText;

      //   // /* Get review count */
      //   // let reviewCount = document.body.querySelector('#acrCustomerReviewText').innerText;
      //   // let formattedReviewCount = reviewCount.replace(/[^0-9]/g,'').trim();

      //   // /* Get and format rating */
      //   // let ratingElement = document.body.querySelector('.a-icon.a-icon-star').getAttribute('class');
      //   // let integer = ratingElement.replace(/[^0-9]/g,'').trim();
      //   // let parsedRating = parseInt(integer) / 10;

      //   // /* Get availability */
      //   // let availability = document.body.querySelector('#availability').innerText; 
      //   // let formattedAvailability = availability.replace(/[^0-9]/g, '').trim();

      //   // /* Get list price */
      //   // let listPrice = document.body.querySelector('.priceBlockStrikePriceString').innerText;

      //   // /* Get price */
      //   // let price = document.body.querySelector('#priceblock_ourprice').innerText;

      //   // /* Get product description */
      //   // let description = document.body.querySelector('#renewedProgramDescriptionAtf').innerText;

      //   // /* Get product features */
      //   // let features = document.body.querySelectorAll('#feature-bullets ul li');
      //   // let formattedFeatures = [];

      //   // features.forEach((feature) => {
      //   //     formattedFeatures.push(feature.innerText);
      //   // });

      //   // /* Get comparable items */
      //   // let comparableItems = document.body.querySelectorAll('#HLCXComparisonTable .comparison_table_image_row .a-link-normal');                
      //   // formattedComparableItems = [];

      //   // comparableItems.forEach((item) => {
      //   //     formattedComparableItems.push("https://amazon.com" + item.getAttribute('href'));
      //   // });

        
      //   // var product = { 
      //   //     "title": title,
      //   //     "rating": parsedRating,
      //   //     "reviewCount" : formattedReviewCount,
      //   //     "listPrice": listPrice,
      //   //     "price": price,
      //   //     "availability": formattedAvailability,
      //   //     "description": description,
      //   //     "features": formattedFeatures,
      //   //     "comparableItems": formattedComparableItems
      //   // };

      //   // return product;
      // });
  
      // console.log(productInfo);
      await browser.close();
  
  }).catch(function(error) {
      console.error(error);
  })
}

forPuppeteerTest()