const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const axios = require('axios');
const redis = require('redis');
const APIKey = '141094484e25bf2f7582d66324f7258c';
const redisClient = redis.createClient({ url: 'redis://13.234.45.179:6379' })
app.get('/weather/city', async (req, res) => {


    let url = `https://api.openweathermap.org/data/2.5/weather?q=${req.city}&units=metric&appid=${APIKey}`
    redisClient.exists(req.city, async (err, result) => {
        if (err) {

            let weatherData = await axios.get(url)
            sendResp(weatherData);
        } else if (result === 1) {
            redisClient.get(req.city, (err, result) => {
                sendResp(result);
            })
        } else {
            let weatherData = await axios.get(url)

            sendResp(weatherData);

            redisClient.set(req.city, weatherData, 'EX', 900, (error, reply) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(`Key ${key} set with value ${value} and expiry ${expirySeconds} seconds and ${reply}.`);
                }
            })



        }
    })
    function sendResp(weatherData) {




        res.json(weatherData);
    }

})


app.get('/weather/gps', async (req, res) => {

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.latitude}&lon=${req.longitude}&appid=${APIKey}`
    redisClient.exists(req.ip, async (err, result) => {
        if (err) {

            let weatherData = await axios.get(url)
            sendResp(weatherData);
        } else if (result === 1) {
            redisClient.get(req.ip, (err, result) => {
                sendResp(result);
            })
        } else {
            let weatherData = await axios.get(url)


            sendResp(weatherData);

            redisClient.set(req.ip, weatherData, 'EX', 900, (error, reply) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(`Key ${key} set with value ${value} and expiry ${expirySeconds} seconds and ${reply}.`);
                }
            })



        }
    })
    function sendResp(weatherData) {




        res.json(weatherData);
    }

})


app.listen(8080, () => {
    console.log('listining on port 8080');
})


