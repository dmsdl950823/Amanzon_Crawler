const express = require('express')
const bodyParser = require('bodyParser')
const cors = require('cors')


const app = express();

// Middleware

app.use(bodyParser.json())
app.use(cors)