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

    // log($)
  })