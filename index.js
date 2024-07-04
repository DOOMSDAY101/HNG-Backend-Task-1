let express = require('express')
require('dotenv').config()
let app = express();

const PORT = process.env.PORT;
const TOKEN = process.env.TOKEN
const API_KEY = process.env.API_KEY
app.set("trust proxy", true);


app.get('/', (req, res) => {
    res.send("visit /api/hello?visitor_name='Your Name' for the magic")
})
app.get('/api/hello', async (req, res) => {
    let { visitor_name } = req.query;

    const request = await fetch(`https://ipinfo.io/json?token=${TOKEN}`);
    const response = await request.json();

    const userIPAddr = response.ip;
    const userCity = response.city

    // get weather
    let weatherReq = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${userCity}`)
    let weatherRes = await weatherReq.json();
    const { temp_c } = weatherRes.current

    res.json({ "client_ip": userIPAddr, "location": userCity, "greeting": `Hello, ${visitor_name}!, the temperature is ${temp_c} degrees Celcius in ${userCity}` })
})

app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
})