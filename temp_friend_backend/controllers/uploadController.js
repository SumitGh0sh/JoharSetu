const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * Handle Image/Evidence Upload to Cloudinary
 */
const uploadImage = async (req, res, next) => {
  try {
    const { image, folder = 'sih26043_evidence' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data (base64 or data URL) is required' });
    }

    const uploadResult = await uploadToCloudinary(image, folder);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      format: uploadResult.format,
      dimensions: {
        width: uploadResult.width,
        height: uploadResult.height,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};
