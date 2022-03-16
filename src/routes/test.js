const express = require('express');
const router = new express.Router();
const { getTitleResponse, URLParser} = require('../helpers/helpers');

router.get('/I/want/title', async (req, res) => {
  try{
    let addresses = req.query.address;
    if (addresses) {
      addresses = typeof addresses === "object" ? addresses : [`${addresses}`]
      let parsedURL = URLParser(addresses)
      let result = []
      for (let i = 0; i < parsedURL.length; i++) {
        try {
          let title = await getTitleResponse(parsedURL[i])
          result.push(`${"<li>" + addresses[i]} - "${title}"</li></br>`)
        } catch (err) {
          result.push(`${"<li>" + addresses[i]} - "NO RESPONSE"</li></br>`)
        }
      }
      result = result.join(' ')
      const html = `<html><head></head><body><h1>following are the titles of given websites: </h1><ul>${result}</ul></body></html>`
      res.set('Content-Type', 'text/html');
      return res.status(200).send(Buffer.from(html))
  
  
    } else {
      return res.status(404).send("ERROR: No URL Found.")
    }
  } catch(err) {
    return res.status(400).send("ERROR: Bad Request")
  }
})

module.exports = router