const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if env variables are present
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadImageToCloud = async (fileBuffer, originalName = 'upload.jpg') => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'polyscan_scans' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } else {
    // Fallback to local storage
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(originalName) || '.jpg';
    const filename = `scan-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, fileBuffer);
    
    return `/uploads/${filename}`;
  }
};

const deleteImageFromCloud = async (imageUrl) => {
  if (!imageUrl) return;

  if (isCloudinaryConfigured && imageUrl.includes('cloudinary.com')) {
    try {
      const parts = imageUrl.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const publicId = `polyscan_scans/${filenameWithExt.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn('[Cloudinary Delete Warning]:', err.message);
    }
  } else if (imageUrl.includes('/uploads/')) {
    try {
      const filename = imageUrl.split('/uploads/')[1];
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn('[Local Storage Delete Warning]:', err.message);
    }
  }
};

module.exports = {
  uploadImageToCloud,
  deleteImageFromCloud,
};
