const https = require('https');
const Q = require('q');
const url = require('url');

const titleParser = (body) => {
  let regExp = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
  let match = regExp.exec(body);
  if (match && match[2]) {
    return match[2]
  }
    return "NO RESPONSE"
}
let getTitleResponse =  (url) => {
  let deferred = Q.defer();
  let req = https.get(url, function (response) {
    if (response.statusCode < 200 || response.statusCode > 299) {
      deferred.reject(new Error('ErrorCode ' + response.statusCode))
    }
    let result = "";
    response.on('data', function (chunk) {
      result += chunk;
    })
    response.on('end', function () {
      const data = titleParser(result)
      deferred.resolve(data);
    })
  });

  req.on('error', function (err) {
    console.error('Error with the request:', err.message);
    deferred.reject(err);
  });

  req.end();
  return deferred.promise;
}

const URLValidator = (urls) => {
  urls.forEach(url => {
    try {
      new URL(url);
    } catch (err) {
      console.log(err)
      return false
      // throw new Error(`Bad Request: Invalid URL - ${url}`)
    }
  });
  return true
};

const URLParser = (urls) => {
  return urls.map((url) => {
    if (!url.includes('www.')) {
      return "https://www." + url
    } else if (!url.includes('https://')) {
      return "https://" + url
    }
    return url
  })
}

module.exports = { getTitleResponse, URLValidator, URLParser }