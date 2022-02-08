const fs = require("fs"); // Or `import fs from "fs";` with ESM
// console.log(fs)
// if (fs.existsSync('C:\Users\dmsdl\OneDrive\바탕 화면\practice\Amanzon_Crawler\server\assets\csvs')) {
//     // Do something
//     console.log(222)
// } else {
//   console.log(111)
// }

var path = require("path")
// var csvFilePath = path.resolve("./assets/csvs/test.csv")
var csvFilePath = path.resolve("./test.csv")

const csv = require('csvtojson')
// const path = require('path')
// console.log(path.normalize('test.csv'))

// const csvFilePath = 'C:\Users\dmsdl\OneDrive\바탕 화면\practice\Amanzon_Crawler\server\assets\csvs\test.csv'

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
})

// const test = async () => {
//   // Async / await usage
//   const jsonArray = await csv().fromFile(csvFilePath);
//   console.log(jsonArray)
// }

// test()