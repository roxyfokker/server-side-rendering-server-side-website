import express from 'express'

import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express()); 

app.set('views', './views')


async function haalDataVanDirectus(endpoint, params = {}) {
  const url = 'https://fdnd-agency.directus.app/items/' + endpoint + '?' + new URLSearchParams(params);
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

// data ophalen uit directus en omzetten naar json 

// endpoint                -> de collectie in directus ophalen
// params                  -> eventuele filters sortering
// fetch(url)              -> vraagt de data op bij directus via http
// await response.json()   -> zet om naar json
// return json.data        -> je krijgt een array van items die in routes gebruikt kunnen worden en naar liquid kan sturen



// Routes
app.get('/', async function (request, response) {
   // Render index.liquid uit de Views map
   // Geef hier eventueel data aan mee
  response.render('index.liquid', { title: 'Home', path: request.path });
});

app.get('/instrumenten', async function (request, response) {

  const instruments = await haalDataVanDirectus('preludefonds_instruments');
  
  response.render('instrumenten_overzicht.liquid', {instruments, path: request.path});

});

app.get('/instrumenten/:key', async function (request, response) {
  // TODO: data ophalen voor het specifieke instrument
  const instrument = await haalDataVanDirectus('preludefonds_instruments/' + request.params.key);
  response.render('instrument_detail.liquid', { instrument, path: request.path});
});











// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
