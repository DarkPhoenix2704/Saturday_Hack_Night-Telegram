require('dotenv')
const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require("body-parser");
const {BOT_TOKEN} = process.env

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`
app.use(bodyParser.json())

app.post('/', async (req) => {
    console.log(req.body)
    if (req.body.hasOwnProperty('my_chat_member')) {
        console.log('Group Chat Not Allowed')
    } else {
        const chatId = req.body.message.chat.id
        const text = req.body.message.text

    }


})

app.listen(80, async () => {
    console.log('🚀 app running on port', 80)
})