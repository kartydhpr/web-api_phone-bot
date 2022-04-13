const Vonage = require('@vonage/server-sdk')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  applicationId: process.env.APP_ID,
  privateKey: 'private.key'
})

const ncco = [
  {
    action: 'talk',
    text: 'Hello!'
  },
  {
    action: 'talk',
    text: 'The following is a message from your devilishly handsome friend, Karty.'
  },
  {
    action: 'talk',
    text: 'Please say the magic word.'
  },
  {
    eventUrl: [
      'https://phone-bot.kartydhpr.repl.co/magicWord'
    ],
    eventMethod: 'POST',
    action: 'input',
    type: [ 'speech' ],
    speech: {
      context: [
        'otters'
      ],
      endOnSilence: 0.5,
      saveAudio: true      
    }
  }
]

vonage.calls.create({
  to: [{
    type: 'phone',
    number: '13122088189'//12245785737 elise's phone no.
  }],
  from: {
    type: 'phone',
    number: '12013553476'
  },
  ncco
}, (error, response) => {
  if (error) console.error(error)
  if (response) console.log(response)
})

app.post('/magicWord', (req, res) => {
  console.log(req.body.speech.results)
  const results = req.body.speech.results[0]
  if (results.text.toLowerCase().includes('otters')) {
    res.json([{
      action: 'stream',
      streamUrl:['https://cdn.discordapp.com/attachments/949182794209329195/963904389796470804/sky_becomes_sea.mp3']
    }])
  } else {
    res.json([
      {
        action: 'talk',
        text: 'That\'s not the magic word.'
      },
      {
        action: 'talk',
        text: 'Please say the magic word.'
      },
      {
        eventUrl: [
          'https://phone-bot.kartydhpr.repl.co/magicWord'
        ],
        eventMethod: 'POST',
        action: 'input',
        type: [ 'speech' ],
        speech: {
          context: [
            'otters'
          ],
          endOnSilence: 0.5,
          saveAudio: true      
        }
      }
    ])
  }
})

app.listen(process.env.PORT)