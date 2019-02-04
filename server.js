// init project
const express = require('express');
const app = express();
const getRandomInt = require('./utils.js').getRandomInt;
const scrapeIt = require("scrape-it");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.set('view engine', 'ejs');

const MAX_ARCHILLECT_NUM = 211437;

async function getArchillectImageURL(image_id) {
  const url = `http://archillect.com/${image_id}`;
  console.log(url);
  return (await scrapeIt(url, {image_url: {selector: '#ii', attr: "src"}})).data.image_url;
}

async function getArchillectImage(opts) {
  opts = opts || {};
  const allowGifs = opts.allowGifs != null ? opts.allowGifs : true;
  
  while(true) {
    const image_id = getRandomInt(1, MAX_ARCHILLECT_NUM);
    const image_url = await getArchillectImageURL(image_id);
    if (image_url.endsWith('gif') && !allowGifs) {
      continue;
    }
    return image_url;
  }
}

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', async function(request, response) {
  const image_url = await getArchillectImage();
  response.render('index', {image_url});
});

app.get('/nogif', async function(request, response) {
  const image_url = await getArchillectImage({allowGifs: false});
  response.render('index', {image_url});
});


// Start the app
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
