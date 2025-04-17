// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { harvestFromChaos } = require('./services/harvester');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('DB connected'));

// Endpoint to manually trigger harvesting
app.post('/harvest', async (req, res) => {
  const result = await harvestFromChaos(req.body.rawData);
  res.json(result);
});

// Background job to auto-process every 10 mins
cron.schedule('*/10 * * * *', async () => {
  console.log('🌌 Silent system running...');
  // pull data from queue/db/logs etc
  const rawData = await fetchUnstructuredChaos(); // implement this
  await harvestFromChaos(rawData);
});

app.listen(3000, () => console.log('🌐 Chaos Harvester running on 3000'));
