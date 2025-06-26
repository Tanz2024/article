import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3 }),
  body('firstName').isLength({ min: 1 }),
  body('lastName').isLength({ min: 1 }),
  body('phoneNumber').isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const { email, password, username, firstName, middleName, lastName, phoneNumber, bday } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Construct full name
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
    if (!fullName || fullName.toLowerCase() === 'not set') {
      fullName = 'User';
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        username,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        birthday: bday,
        role: 'user'
      }
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { articles: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Profile request - req.user:', req.user);
    console.log('Profile request - req.user.id:', req.user?.id);
    
    if (!req.user?.id) {
      return res.status(400).json({ error: 'User ID not found in token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user.id) },
      include: {
        articles: true,
        bookmarks: true,
        likes: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      country: user.country,
      location: user.location,
      language: user.language,
      timezone: user.timezone,
      skills: user.skills || [],
      interests: user.interests || [],
      bio: user.bio,
      birthday: user.birthday,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      articles: user.articles,
      bookmarks: user.bookmarks,
      likes: user.likes,
      socialStats: {
        followers: user._count.followers,
        following: user._count.following
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().isLength({ max: 50 }),
  body('middleName').optional().isLength({ max: 50 }),
  body('lastName').optional().isLength({ max: 50 }),
  body('phoneNumber').optional().isMobilePhone(),
  body('country').optional().isLength({ max: 100 }),
  body('location').optional().isLength({ max: 100 }),
  body('language').optional().isLength({ max: 50 }),
  body('timezone').optional().isLength({ max: 50 }),
  body('bio').optional().isLength({ max: 500 }),
  body('birthday').optional().isISO8601(),
  body('avatar').optional().custom((value) => {
    if (value === '' || value === null) return true;
    // Allow local avatar URLs in development
    if (process.env.NODE_ENV !== 'production' && typeof value === 'string' && value.startsWith('/api/users/uploads/avatars/')) {
      return true;
    }
    // Only validate as URL if not empty
    try {
      new URL(value);
      return true;
    } catch {
      throw new Error('Invalid avatar URL');
    }
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data', details: errors.array() });
    }

    const { 
      name,
      firstName, 
      middleName, 
      lastName, 
      phone,
      phoneNumber, 
      country, 
      location, 
      language, 
      timezone, 
      bio, 
      birthday, 
      avatar
    } = req.body;

    // Construct full name from parts if provided, or use the name field directly
    let fullName = name;
    if (firstName || middleName || lastName) {
      fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
    }
    if (!fullName || fullName.toLowerCase() === 'not set') {
      fullName = 'User';
    }

    // Use phone or phoneNumber (for backward compatibility)
    const phoneValue = phone || phoneNumber;

    // Update user directly in User model
    const updateData = {
      name: fullName,
      firstName,
      middleName,
      lastName,
      phone: phoneValue,
      phoneNumber: phoneValue, // Keep both for compatibility
      country,
      location,
      language,
      timezone,
      bio,
      birthday,
      avatar
    };
    // Only include fields that are defined (avoid undefined overwrites)
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    // Return updated user data
    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      firstName: updatedUser.firstName,
      middleName: updatedUser.middleName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      phoneNumber: updatedUser.phoneNumber,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      country: updatedUser.country,
      location: updatedUser.location,
      language: updatedUser.language,
      timezone: updatedUser.timezone,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      role: updatedUser.role
    };

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile by ID (admin only)
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        articles: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user notifications (dynamic)
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get user badges (dynamic)
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const badges = await prisma.badge.findMany({
      where: { userId: req.user.id },
      orderBy: { earnedAt: 'desc' },
      take: 20
    });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Get user recent activity (dynamic)
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { authorId: req.user.id },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    const comments = await prisma.comment.findMany({
      where: { authorId: req.user.id },
      select: { id: true, content: true, createdAt: true, articleId: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    const likes = await prisma.like.findMany({
      where: { userId: req.user.id },
      select: { id: true, articleId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    // Merge and sort by date
    const activity = [
      ...articles.map(a => ({ type: 'article', action: 'Published', title: a.title, date: a.createdAt })),
      ...comments.map(c => ({ type: 'comment', action: 'Commented', title: c.content, date: c.createdAt })),
      ...likes.map(l => ({ type: 'like', action: 'Liked', title: `Article #${l.articleId}`, date: l.createdAt }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Get/Update user skills and interests
router.get('/skills-interests', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { skills: true, interests: true }
    });
    res.json({
      skills: user?.skills || [],
      interests: user?.interests || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills and interests' });
  }
});

router.put('/skills-interests', authenticateToken, async (req, res) => {
  try {
    const { skills, interests } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { skills, interests }
    });
    res.json({ message: 'Skills and interests updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skills and interests' });
  }
});

// Social Connection Endpoints

// Get suggested connections (users not followed by current user)
router.get('/suggested-connections', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Get users the current user is already following
    const following = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true }
    });
    
    const followingIds = following.map(f => f.followingId);
    followingIds.push(currentUserId); // Exclude self
    
    // Get suggested users (not followed, active users)
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: { notIn: followingIds },
        isActive: true,
        isBanned: false
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        _count: {
          select: { followers: true }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    
    // Calculate mutual followers for each suggested user
    const suggestedWithMutual = await Promise.all(
      suggestedUsers.map(async (user) => {
        const mutualFollowers = await prisma.follow.count({
          where: {
            followingId: user.id,
            followerId: { in: followingIds.slice(0, -1) }
          }
        });
        
        return {
          id: user.id,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.name,
          avatar: user.avatar,
          bio: user.bio,
          followersCount: user._count.followers,
          mutualFollowers,
          isFollowing: false
        };
      })
    );
    
    res.json(suggestedWithMutual);
  } catch (error) {
    console.error('Get suggested connections error:', error);
    res.status(500).json({ error: 'Failed to fetch suggested connections' });
  }
});

// Get followers
router.get('/followers', authenticateToken, async (req, res) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: req.user.id },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            _count: { select: { followers: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const formattedFollowers = followers.map(f => ({
      id: f.follower.id,
      name: f.follower.firstName && f.follower.lastName 
        ? `${f.follower.firstName} ${f.follower.lastName}` 
        : f.follower.name,
      avatar: f.follower.avatar,
      bio: f.follower.bio,
      followersCount: f.follower._count.followers,
      followedAt: f.createdAt
    }));
    
    res.json(formattedFollowers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Get following
router.get('/following', authenticateToken, async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.user.id },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            _count: { select: { followers: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const formattedFollowing = following.map(f => ({
      id: f.following.id,
      name: f.following.firstName && f.following.lastName 
        ? `${f.following.firstName} ${f.following.lastName}` 
        : f.following.name,
      avatar: f.following.avatar,
      bio: f.following.bio,
      followersCount: f.following._count.followers,
      followedAt: f.createdAt
    }));
    
    res.json(formattedFollowing);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// Follow a user
router.post('/:userId/follow', authenticateToken, async (req, res) => {
  try {
    const followingId = parseInt(req.params.userId);
    const followerId = req.user.id;
    
    if (followingId === followerId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true, name: true }
    });
    
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    
    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Check if they follow me back (will become friends)
    const theyFollowMe = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followingId,
          followingId: followerId
        }
      }
    });
    
    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    });

    const becameFriends = !!theyFollowMe;

    // Create notification for the followed user
    const notificationMessage = becameFriends 
      ? `🎉 You and ${req.user.name} are now friends!`
      : `${req.user.name} started following you`;
      
    await prisma.notification.create({
      data: {
        userId: followingId,
        type: becameFriends ? 'success' : 'info',
        message: notificationMessage
      }
    });
    
    res.json({ 
      message: 'Successfully followed user',
      becameFriends,
      userName: userToFollow.name
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.post('/:userId/unfollow', authenticateToken, async (req, res) => {
  try {
    const followingId = parseInt(req.params.userId);
    const followerId = req.user.id;
    
    // Check if user exists and get their name
    const userToUnfollow = await prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true, name: true }
    });
    
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if they were friends (both following each other)
    const theyFollowMe = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followingId,
          followingId: followerId
        }
      }
    });

    const wasFriends = !!theyFollowMe;
    
    // Delete follow relationship
    const deletedFollow = await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId
      }
    });
    
    if (deletedFollow.count === 0) {
      return res.status(404).json({ error: 'Follow relationship not found' });
    }

    // Create notification for the unfollowed user
    const notificationMessage = wasFriends 
      ? `💔 You and ${req.user.name} are no longer friends`
      : `${req.user.name} unfollowed you`;
      
    await prisma.notification.create({
      data: {
        userId: followingId,
        type: 'info',
        message: notificationMessage
      }
    });
    
    res.json({ 
      message: 'Successfully unfollowed user',
      wasUnfriended: wasFriends,
      userName: userToUnfollow.name
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Get profile views count
router.get('/profile-views', authenticateToken, async (req, res) => {
  try {
    const viewsCount = await prisma.profileView.count({
      where: { viewedId: req.user.id }
    });
    
    res.json({ views: viewsCount });
  } catch (error) {
    console.error('Get profile views error:', error);
    res.status(500).json({ error: 'Failed to fetch profile views' });
  }
});

// Record profile view
router.post('/:userId/view', authenticateToken, async (req, res) => {
  try {
    const viewedId = parseInt(req.params.userId);
    const viewerId = req.user.id;
    
    if (viewedId === viewerId) {
      return res.status(400).json({ error: 'Cannot view your own profile' });
    }
    
    // Check if user exists
    const userToView = await prisma.user.findUnique({
      where: { id: viewedId }
    });
    
    if (!userToView) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create or update profile view (upsert to avoid duplicates)
    await prisma.profileView.upsert({
      where: {
        viewerId_viewedId: {
          viewerId,
          viewedId
        }
      },
      update: {
        createdAt: new Date()
      },
      create: {
        viewerId,
        viewedId
      }
    });
    
    res.json({ message: 'Profile view recorded' });
  } catch (error) {
    console.error('Record profile view error:', error);
    res.status(500).json({ error: 'Failed to record profile view' });
  }
});

// Get friends (mutual followers)
router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Get users that follow me
    const myFollowers = await prisma.follow.findMany({
      where: { followingId: currentUserId },
      select: { followerId: true }
    });
    
    const myFollowerIds = myFollowers.map(f => f.followerId);
    
    // Get users that I follow who also follow me (friends)
    const friends = await prisma.follow.findMany({
      where: { 
        followerId: currentUserId,
        followingId: { in: myFollowerIds }
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            _count: { select: { followers: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const formattedFriends = friends.map(f => ({
      id: f.following.id,
      name: f.following.firstName && f.following.lastName 
        ? `${f.following.firstName} ${f.following.lastName}` 
        : f.following.name,
      avatar: f.following.avatar,
      bio: f.following.bio,
      followersCount: f.following._count.followers,
      isFriend: true,
      followedAt: f.createdAt
    }));
    
    res.json(formattedFriends);  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Get user profile by ID (public endpoint for profile views)
// This route must be last to avoid matching other routes
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log('Public profile request - userId param:', req.params.userId);
    console.log('Public profile request - parsed userId:', userId);
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        skills: true,
        interests: true,
        country: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            followers: true,
            following: true
          }
        },
        articles: {
          select: {
            id: true,
            title: true,
            summary: true,
            imageUrl: true,
            category: true,
            tags: true,
            status: true,
            views: true,
            likes: true,
            createdAt: true
          },
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' },
          take: 6
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedUser = {
      id: user.id,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.name,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills || [],
      interests: user.interests || [],
      country: user.country,
      location: user.location,
      joinedAt: user.createdAt,
      stats: {
        articles: user._count.articles,
        followers: user._count.followers,
        following: user._count.following
      },
      recentArticles: user.articles
    };

    res.json(formattedUser);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded avatars locally in development
if (process.env.NODE_ENV !== 'production') {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  router.use('/uploads/avatars', express.static(uploadsDir));
}

// Upload avatar image
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    let avatarUrl = null;
    let usedCloudinary = false;
    // Try Cloudinary first if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME !== 'demo-cloud') {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'avatars',
              transformation: [
                { width: 1080, height: 1080, crop: 'fill', gravity: 'face' },
                { quality: 'auto:good' }
              ]
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else resolve(result);
            }
          ).end(req.file.buffer);
        });
        avatarUrl = result.secure_url;
        usedCloudinary = true;
      } catch (cloudErr) {
        console.error('Cloudinary failed, will try local disk:', cloudErr);
      }
    }
    // Fallback to local disk if Cloudinary fails or not configured
    if (!avatarUrl) {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `avatar_${req.user.id}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      avatarUrl = `/api/users/uploads/avatars/${filename}`;
    }
    // Update user's avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl }
    });
    res.json({ 
      message: 'Avatar uploaded successfully',
      avatarUrl,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      },
      usedCloudinary
    });
  } catch (error) {
    console.error('Avatar upload error (detailed):', error);
    res.status(500).json({ error: 'Failed to upload avatar', details: error?.message || error });
  }
});

export default router;
