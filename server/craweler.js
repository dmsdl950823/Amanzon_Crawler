const axios = require('axios')
const cheerio = require('cheerio')
const log = console.log


const fetchShelves = async () => {
  try {
    // const response = await axios.get('https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=shelves&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309')
    const response = await axios.get('https://www.amazon.com/s?k=shelves&page=3&crid=36QNR0DBY6M7J&qid=1641848554&refresh=1&sprefix=s%2Caps%2C309&ref=sr_pg_3')

    const html = response.data
    const $ = cheerio.load(html)
    const shelves = []

    $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
      const shelf = $(el)

      const title = shelf.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
      const asin = shelf.attr('data-asin') // asin number
      const href = shelf.find('a.a-link-normal.s-link-style.a-text-normal').attr('href')

      console.log(title, ' :: ', href)

      shelves.push(title)
    })

    return shelves
  } catch (error) {
    
  }
}

// fetchShelves().then(shelves => console.log(shelves))
fetchShelves().then(shelves => console.log('done!'))


// const getHtml = async () => {
//   try {
//     // return await axios.get('https://www.amazon.com')
//     return await axios.get('https://www.amazon.com/s?k=supplies&i=office-products&page=3&crid=1MBPZOLKFQY9G&qid=1641847967&sprefix=su%2Coffice-products%2C331&ref=sr_pg_3')
//   } catch (error) {
//     console.error('error : ', error)
//     throw error
//   }
// }

// getHtml()
//   .then(html => {
//     const $ = cheerio.load(html.data)

//     console.log($.html())

//     // const options = $('.nav-search-dropdown').children('option')
//     // log(options)

//     // const searchBar = $('#twotabsearchtextbox')
//     // searchBar.val('ㅇㅅㅇ?')
//     // console.log(searchBar)

//   })