require('dotenv')
const express = require('express')
const axios = require("axios");
const app = express()
app.use(express.json())

const BOT_TOKEN = process.env.BOT_TOKEN

const TELEGRAM_API = 'https://api.telegram.org/bot' + BOT_TOKEN
console.log(TELEGRAM_API)

app.post('/', (req,res) => {
    if (req.body.hasOwnProperty('my_chat_member')) { console.log('Group Message'); return; }
    if (req.body.message || req.body.channel_post) {
        console.log(req.body)
        console.log('It\'s a dm')

        const chatId = req.body.message.chat.id;
        const sentMessage = req.body.message.text;
        if (sentMessage === 'hello') {
            console.log('Sending hELLO')
            axios.post(TELEGRAM_API + '/sendMessage',
                {
                    chat_id: chatId,
                    text: 'hello back 👋'
                })
                .then((response) => {
                    console.log(response)
                    res.status(200).send(response);
                }).catch((error) => {
                    console.log(error)
                res.send(error);
            });
        } else {
            // if no hello present, just respond with 200
            res.status(200).send({});
        }
    }

})


app.listen(80, ()=> {
    console.log('🚀 app running on port', 80)
})