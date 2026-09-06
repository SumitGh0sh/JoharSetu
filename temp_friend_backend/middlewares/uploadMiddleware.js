/**
 * Upload & Media URL Validator Middleware
 */

const validateMediaUrls = (req, res, next) => {
  const { mediaUrls } = req.body;

  if (mediaUrls) {
    if (!Array.isArray(mediaUrls)) {
      return res.status(400).json({ error: 'mediaUrls must be an array of URLs' });
    }
    // Limit to 5 media links max
    if (mediaUrls.length > 5) {
      return res.status(400).json({ error: 'Cannot upload more than 5 media files per challenge' });
    }
  }

  next();
};

module.exports = {
  validateMediaUrls,
};
