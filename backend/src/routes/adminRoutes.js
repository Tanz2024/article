import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Admin middleware - all routes require admin access
router.use(authenticateToken);
router.use(requireAdmin);

// Get all articles for admin management
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          author: {
            select: { id: true, username: true, email: true }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      articles,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles for admin:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Approve article
router.patch('/articles/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'PUBLISHED',
        publishedAt: new Date()
      },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    res.json({ message: 'Article approved successfully', article });
  } catch (error) {
    console.error('Error approving article:', error);
    res.status(500).json({ error: 'Failed to approve article' });
  }
});

// Reject article
router.patch('/articles/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'REJECTED',
        rejectionReason: reason
      },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    res.json({ message: 'Article rejected successfully', article });
  } catch (error) {
    console.error('Error rejecting article:', error);
    res.status(500).json({ error: 'Failed to reject article' });
  }
});

// Delete article (admin)
router.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related records first
    await prisma.like.deleteMany({ where: { articleId: parseInt(id) } });
    await prisma.comment.deleteMany({ where: { articleId: parseInt(id) } });
    await prisma.bookmark.deleteMany({ where: { articleId: parseInt(id) } });
    
    // Delete the article
    await prisma.article.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Get all users for admin management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          _count: {
            select: { articles: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Ban/Unban user
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true
      }
    });

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, 
      user 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalArticles,
      pendingArticles,
      publishedArticles,
      rejectedArticles,
      totalComments,
      totalLikes
    ] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PENDING' } }),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'REJECTED' } }),
      prisma.comment.count(),
      prisma.like.count()
    ]);

    // Get recent activity
    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { username: true }
        }
      }
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    res.json({
      stats: {
        totalUsers,
        totalArticles,
        pendingArticles,
        publishedArticles,
        rejectedArticles,
        totalComments,
        totalLikes
      },
      recentActivity: {
        articles: recentArticles,
        users: recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
