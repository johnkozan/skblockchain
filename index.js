require('dotenv').config()
const emoji = require('node-emoji');
const CoinMarketCap = require('coinmarketcap-api')
let Big = require('big.js');
Big = require('toformat')(Big)

// Generate stats for 'Market Mondays'
async function markets() {
  try {
    const client = new CoinMarketCap(process.env.COINMARKETCAP_API_KEY)
    const currency = 'CAD';
    const cryptoCount = 5;

    const prices = await client.getTickers({limit: cryptoCount, convert: currency});

    console.log('Market Monday\n');
    console.log(`Top ${cryptoCount} cryptocurrencies by market cap:\n`);
    prices.data.forEach(d => {
      const price = new Big(d.quote[currency].price);
      const change = new Big(d.quote[currency].percent_change_7d);
      const upDown = change.lt(0) ? 'down' : 'up';
      const chart = change.lt(0) ? emoji.get(':chart_with_downwards_trend:') : emoji.get(':chart_with_upwards_trend:');
      const decimals = price.lt(1) ? 4 : 0;

      console.log(`${chart} ${d.name} (${d.symbol}) $${price.toFormat(decimals)} CAD - ${upDown} ${change.abs().toString()}% this week ${chart}`);
    });
  } catch (err) {
    console.error(err);
  }
}

markets();
