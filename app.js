const Koa = require('koa');
const cors = require('@koa/cors');
const axios = require('axios');
const app = new Koa();
const port = process.env.PORT || 3001;

const apiKey = 'a5dfe3897dbc4976a14144200230511';

// Use the CORS middleware to allow cross-origin requests
app.use(cors());

function checkParams (ctx) {
  const location = ctx.query.location;
  if (!location) {
    ctx.status = 400;
    ctx.body = { error: 'Location is required' };
    return false;
  }
  return true;
}

// Get current weather information
app.use(async (ctx) => {
  if (!(await checkParams(ctx))) return;
  if (ctx.path === '/current') {
    try {
      const currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ctx.query.location}&aqi=yes`;
      const response = await axios.get(currentWeatherUrl);
      ctx.body = response.data;
    } catch (e) {
      const { response: { data: { error } } } = e;
      ctx.status = 500;
      ctx.body = error;
    }
  }
});

// Get weather forecast for the next 7 days
app.use(async (ctx) => {
  if (!(await checkParams(ctx))) return;
  if (ctx.path === '/forecast') {
    try {
      const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ctx.query.location}&days=7&aqi=yes&alerts=no`;
      const response = await axios.get(forecastUrl);
      ctx.body = response.data;
    } catch (e) {
      const { response: { data: { error } } } = e;
      ctx.status = 500;
      ctx.body = error;
    }
  }
});

app.listen(port, () => {
  console.log(`Koa server is running on port ${port}`);
});
