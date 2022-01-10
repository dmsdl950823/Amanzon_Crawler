const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv')

const axios = require('axios')
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
    // console.log(html)
    const $ = cheerio.load(html.data)

    console.log($.html())

    // const options = $('.nav-search-dropdown')//.children('option')
    // log(options.html())
    // console.log(options)

    // const getNac = $('#nav-main')
    // log(getNac.html())

    // const searchBar = $('#twotabsearchtextbox')
    // searchBar.val('ㅇㅅㅇ?')
    // console.log(searchBar)

  })