const Challenge = require('../models/Challenge');
const Proposal = require('../models/Proposal');
const User = require('../models/User');

/**
 * System-wide analytics summary
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const totalChallenges = await Challenge.countDocuments();
    const resolvedChallenges = await Challenge.countDocuments({ status: 'Resolved' });
    const inProgressChallenges = await Challenge.countDocuments({ status: { $in: ['In-Progress', 'Solution Proposed', 'Assigned'] } });
    const activeProposals = await Proposal.countDocuments();
    const registeredUniversities = await User.distinct('organization', { role: { $in: ['student', 'faculty'] } });

    // Category breakdown
    const categoryStats = await Challenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // District breakdown
    const districtStats = await Challenge.aggregate([
      { $group: { _id: '$location.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Severity breakdown
    const severityStats = await Challenge.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      metrics: {
        totalChallenges,
        resolvedChallenges,
        inProgressChallenges,
        activeProposals,
        participatingInstitutions: registeredUniversities.length,
        resolutionRate: totalChallenges > 0 ? ((resolvedChallenges / totalChallenges) * 100).toFixed(1) : 0,
      },
      categoryStats,
      districtStats,
      severityStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GIS Geo-Coordinates Heatmap for District Map Visualizations
 */
const getGisHeatmap = async (req, res, next) => {
  try {
    const challenges = await Challenge.find(
      { 'location.latitude': { $ne: null }, 'location.longitude': { $ne: null } },
      'title category severity aiUrgencyScore location status'
    );

    const points = challenges.map((c) => ({
      id: c._id,
      title: c.title,
      category: c.category,
      severity: c.severity,
      urgencyScore: c.aiUrgencyScore,
      status: c.status,
      lat: c.location.latitude,
      lng: c.location.longitude,
      district: c.location.district,
    }));

    return res.status(200).json({
      success: true,
      count: points.length,
      points,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Detect Crisis Hotspots (Clusters of 3+ complaints in same block/district within 14 days)
 */
const getHotspotAlerts = async (req, res, next) => {
  try {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const hotspotClusters = await Challenge.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: {
            district: '$location.district',
            category: '$category',
          },
          count: { $sum: 1 },
          avgUrgency: { $avg: '$aiUrgencyScore' },
          sampleTitles: { $push: '$title' },
          challengeIds: { $push: '$_id' },
        },
      },
      { $match: { count: { $gte: 2 } } }, // 2 or more related complaints in district
      { $sort: { count: -1, avgUrgency: -1 } },
    ]);

    const hotspots = hotspotClusters.map((cluster) => {
      const isCritical = cluster.count >= 4 || cluster.avgUrgency >= 75;
      return {
        district: cluster._id.district,
        category: cluster._id.category,
        incidentCount: cluster.count,
        severityLevel: isCritical ? 'CRITICAL_HOTSPOT' : 'WARNING_CLUSTER',
        averageUrgencyScore: Math.round(cluster.avgUrgency),
        sampleComplaints: cluster.sampleTitles.slice(0, 3),
        challengeIds: cluster.challengeIds,
        recommendedAction: `Dispatch immediate technical assessment team from nearby Engineering College & alert District Magistrate (${cluster._id.district}).`,
      };
    });

    return res.status(200).json({
      success: true,
      activeHotspotsCount: hotspots.length,
      hotspots,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getGisHeatmap,
  getHotspotAlerts,
};

