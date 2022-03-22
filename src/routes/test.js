const express = require('express');
const async = require('async');
const { getTitleResponse, URLParser} = require('../helpers/helpers');
const router = new express.Router();


router.get('/I/want/title', async (req, res) => {
  try{
    let addresses = req.query.address;
    if (addresses) {
      addresses = typeof addresses === "object" ? addresses : [`${addresses}`]
      let parsedURL = URLParser(addresses)
      async.series([
         function(callback) { 
          let result = []
      parsedURL.forEach((url)=>{
        result.push(getTitleResponse(url))
      })
          callback(null,result) 
        },
    ]).then(async (results) => {
        let result= []
        for (let i = 0; i < parsedURL.length; i++) {
          try {
            let title = await results[0][i]
            result.push(`${"<li>" + addresses[i]} - "${title}"</li>`);
          } catch (err) {
            result.push(`${"<li>" + addresses[i]} - "NO RESPONSE"</li>`);
          }
        }
      const html = `<html><head></head><body><h1>Following are the titles of given websites: </h1><ul>${result.join(' ')}</ul></body></html>`;
      return res.set('Content-Type', 'text/html').status(200).send(Buffer.from(html));
    }).catch(err => {
        console.log(err);
        return res.status(400).send("ERROR: Bad Request");
    });
  
    } else {
      return res.status(404).send("ERROR: No URL Found.");
    }
  } catch(err) {
    console.log(err);
    return res.status(400).send("ERROR: Bad Request");
  }
})

module.exports = router