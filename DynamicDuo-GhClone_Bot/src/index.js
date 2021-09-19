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
        let helpMessage = 'To download Repo send\ndl author repo_name branch_name\neg: dl darkphoenix2704 discowin main';
        if (sentMessage === '/start') {
            axios.post(TELEGRAM_API + '/sendMessage',
                {
                    chat_id: chatId,
                    text: 'Hii 👋\nI\' am GhCLoneBot \nI will send you the github repo as zip\nSend me the dl author_name repo_name and Branch_name' +
                        '\neg:- dl microg gmscore master\nType help to all commands'
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
        } else if(sentMessage.startsWith('dl')){
            console.log('DL Loading')
            const args = sentMessage.slice('dl'.length).trim().split(/ +/);
            let author = args[0]
            let repo = args[1]
            let branch = args[2]
            let url = GITHUB_API + '/repos/' + author + '/' + repo
            console.log(url)
            axios.get(url,{
                headers:{
                    Accept: 'application/vnd.github.v3+json'
                }
            }).then((resp) => {
                console.log('Valid Repo')
                axios.post(TELEGRAM_API + '/sendMessage',
                    {
                        chat_id: chatId,
                        text: 'It is a Valid Repo\nPlease wait a minute'
                    })
                    .then((response) => {
                        res.status(200).send(response);
                    }).catch((error) => {
                    console.log(error)
                    res.send(error);
                });

            }).catch((error) => {
                console.log('Not Valid repo')
                axios.post(TELEGRAM_API + '/sendMessage',
                    {
                        chat_id: chatId,
                        text: 'Enter a Valid Repo'
                    })
                    .then((response) => {
                        res.status(200).send(response);
                    }).catch((error) => {
                    console.log(error)
                    res.send(error);
                });
            })
            //res.status(200).send({});
        }
    }

})


app.listen(80, ()=> {
    console.log('🚀 app running on port', 80)
})