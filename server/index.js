const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose') // mongodb 연결

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI // db URI
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })
mongoose.connect(uri)
const connection = mongoose.connection
connection.once('open', () => {
  console.log('MongoDB database connection establised successfully')
})

const excerciseRouter = require('./routes/exercies')
const usersRouter = require('./routes/users')

app.use('/exercises', excerciseRouter)
app.use('/users', usersRouter)


app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
// app.listen(port, () => )