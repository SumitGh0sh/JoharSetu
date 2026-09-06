const express = require('express');
const router = express.Router();
const { getDashboardStats, getGisHeatmap, getHotspotAlerts } = require('../controllers/analyticsController');

router.get('/dashboard', getDashboardStats);
router.get('/gis-heatmap', getGisHeatmap);
router.get('/hotspots', getHotspotAlerts);

module.exports = router;

