import express from 'express';
import { uploadImage, uploadVideo, deleteFile } from '../services/cloudinary.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Upload single file (image or video)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { mimetype, buffer } = req.file;
    const { folder = 'tanznews' } = req.body;

    let result;
    
    if (mimetype.startsWith('image/')) {
      // Convert buffer to base64 for Cloudinary
      const base64File = `data:${mimetype};base64,${buffer.toString('base64')}`;
      result = await uploadImage(base64File, folder);
    } else if (mimetype.startsWith('video/')) {
      const base64File = `data:${mimetype};base64,${buffer.toString('base64')}`;
      result = await uploadVideo(base64File, `${folder}/videos`);
    } else {
      return res.status(400).json({ error: 'Only images and videos are allowed' });
    }

    res.json({
      message: 'File uploaded successfully',
      url: result.url,
      publicId: result.publicId,
      type: mimetype.startsWith('image/') ? 'image' : 'video'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Delete file
router.delete('/:publicId', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Decode the publicId (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    
    const result = await deleteFile(decodedPublicId);
    
    res.json({
      message: 'File deleted successfully',
      result
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

// Upload profile avatar
router.post('/avatar', authenticateToken, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { mimetype, buffer } = req.file;
    
    if (!mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only images are allowed for avatars' });
    }

    const base64File = `data:${mimetype};base64,${buffer.toString('base64')}`;
    const result = await uploadImage(base64File, 'tanznews/avatars');

    res.json({
      message: 'Avatar uploaded successfully',
      url: result.url,
      publicId: result.publicId
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: error.message || 'Avatar upload failed' });
  }
});

export default router;
