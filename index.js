let express = require('express')
// remove
let bodyParser = require('body-parser');
let crypto = require("crypto");

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
    let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ipAddr.includes('::ffff')) {
        ipAddr = ipAddr.split('::ffff:')[1]
    }
    console.log(ipAddr)
    const request = await fetch(`https://ipinfo.io/${ipAddr}/json?token=${TOKEN}`);
    const response = await request.json();

    const userIPAddr = response.ip;
    const userCity = response.city

    // get weather
    try {
        let weatherReq = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${userCity}`)
        let weatherRes = await weatherReq.json();

        if (weatherRes && weatherRes.current) {
            const { temp_c } = weatherRes.current;
            res.json({ "client_ip": userIPAddr, "location": userCity, "greeting": `Hello, ${visitor_name}!, the temperature is ${temp_c} degrees Celcius in ${userCity}` })
        } else {
            res.json({ 'error': weatherRes })
            console.error('Unexpected response structure:', weatherRes)
        }
    } catch (error) {
        console.error('Error fetching weather data:', error)
    }

});
//remove
app.post('/webhook', bodyParser.text({type: "*/*"}),(req,res)=>{
    try {
    const secret = process.env.LEMONSQUEEZY_SIGNING_KEY";
   
    const rawBody = req.body;
        if (!rawBody) {
      throw new Error("No body");
    }

    const signature = req.get("X-Signature")
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (
      !signature ||
      !crypto.timingSafeEqual(
        Buffer.from(digest, "hex"),
        Buffer.from(signature, "hex")
      )
    ) {
      throw new Error("Invalid signature.");
    }
        
    const data = JSON.parse(rawBody)
    const {
        currency,
        status,
        created_at   
    } = data.data.attributes;
    console.log(`${signature}, ${currency}, ${status}, ${created_at}`);  
    res.sendStatus(200); 
    } catch(error){
        
    }
})

app.listen(PORT, () => {
    console.log("Server running on port ", PORT)
})
