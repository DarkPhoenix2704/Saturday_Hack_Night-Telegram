require('dotenv')
const express = require('express')
const axios = require("axios");
const app = express()

app.use(express.json())
const BOT_TOKEN = process.env.BOT_TOKEN

const TELEGRAM_API = 'https://api.telegram.org/bot' + BOT_TOKEN
const GITHUB_API = 'https://api.github.com'

app.post('/', (req,res) => {
    if (req.body.hasOwnProperty('my_chat_member')) { console.log('Group Message'); return; }
    if (req.body.message || req.body.channel_post) {
        console.log(req.body)
        console.log('It\'s a dm')

        const chatId = req.body.message.chat.id;
        const sentMessage = req.body.message.text;
        let helpMessage = 'To check if repo is valid or not, send\nverify author repo_name branch_name\neg: verify darkphoenix2704 discowin';
        if (sentMessage === '/start') {
            axios.post(TELEGRAM_API + '/sendMessage',
                {
                    chat_id: chatId,
                    text: 'Hii 👋\nI\' am GhValidatorBot \nI will check if repo is valid or not \nSend me verify author_name repo_name ' +
                        '\neg:- verify microg gmscore\nType help to all commands'
                })
                .then((response) => {
                    res.status(200).send(response);
                }).catch((error) => {
                console.log(error)
                res.send(error);
            });
        } else if (sentMessage === 'help') {
            axios.post(TELEGRAM_API + '/sendMessage',
                {
                    chat_id: chatId,
                    text: helpMessage
                })
                .then((response) => {
                    res.status(200).send(response);
                }).catch((error) => {
                    console.log(error)
                res.send(error);
            });
        } else if(sentMessage.startsWith('verify')){
            console.log('DL Loading')
            const args = sentMessage.slice('verify'.length).trim().split(/ +/);
            let author = args[0]
            let repo = args[1]
            let url = GITHUB_API + '/repos/' + author + '/' + repo
            axios.get(url,{
                headers:{
                    Accept: 'application/vnd.github.v3+json'
                }
            }).then(() => {
                console.log('Valid Repo')
                axios.post(TELEGRAM_API + '/sendMessage',
                    {
                        chat_id: chatId,
                        text: 'It is a Valid Repo'
                    })
                    .then(async (response) => {
                        console.log(response)
                    }).catch((error) => {
                    console.log(error)
                    res.send(error);
                });
            }).catch(() => {
                axios.post(TELEGRAM_API + '/sendMessage',
                    {
                        chat_id: chatId,
                        text: 'This repo doesn\'t exists'
                    })
                    .then((response) => {
                        res.status(200).send(response);
                    }).catch((error) => {
                    console.log(error)
                    res.send(error);
                });
            })
        }
    }

})
app.listen(80, ()=> {
    console.log('🚀 app running on port', 80)
})