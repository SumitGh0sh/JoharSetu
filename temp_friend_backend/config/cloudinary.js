require('dotenv').config();
const crypto = require('crypto');

/**
 * Cloudinary Upload Helper (Using secure REST API with SHA-1 signature)
 * Uploads base64 data URI, file buffer, or remote URL directly to Cloudinary
 * 
 * @param {string} fileData - Base64 Data URI (e.g. 'data:image/jpeg;base64,...') or remote image URL
 * @param {string} folder - Folder name in Cloudinary (default: 'sih26043_evidence')
 * @returns {Promise<{url: string, publicId: string, format: string, width: number, height: number}>}
 */
const uploadToCloudinary = async (fileData, folder = 'sih26043_evidence') => {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials (CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) missing in .env');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Signature parameters must be sorted alphabetically
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const formData = new URLSearchParams();
  formData.append('file', fileData);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('signature', signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary Upload Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    width: data.width,
    height: data.height,
  };
};

module.exports = {
  uploadToCloudinary,
};
