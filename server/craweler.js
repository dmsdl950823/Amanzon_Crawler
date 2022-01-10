const axios = require('axios')
const cheerio = require('cheerio')
const log = console.log

const getHtml = async () => {
  try {
    return await axios.get('https://www.amazon.com')
  } catch (error) {
    throw error
  }
}

getHtml()
  .then(html => {
    const $ = cheerio.load(html.data)

    const options = $('.nav-search-dropdown').children('option')
    // log(options)

    const searchBar = $('#twotabsearchtextbox')
    searchBar.val('ㅇㅅㅇ?')
    console.log(searchBar)

  })