import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get article analytics
router.get('/article/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    // Check if user owns the article or is admin
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { authorId: true }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get analytics for the article
    const analytics = await prisma.analytics.findUnique({
      where: { articleId }
    });

    // Get like and comment counts
    const [likeCount, commentCount] = await Promise.all([
      prisma.like.count({ where: { articleId } }),
      prisma.comment.count({ where: { articleId } })
    ]);

    res.json({
      articleId,
      views: analytics?.views || 0,
      likes: likeCount,
      shares: analytics?.shares || 0,
      comments: commentCount,
      lastViewed: analytics?.updatedAt
    });
  } catch (error) {
    console.error('Error fetching article analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Track article view
router.post('/article/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    // Check if article exists and is published
    const article = await prisma.article.findFirst({
      where: { 
        id: articleId,
        status: 'PUBLISHED'
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Update or create analytics record
    const analytics = await prisma.analytics.upsert({
      where: { articleId },
      update: {
        views: {
          increment: 1
        }
      },
      create: {
        articleId,
        views: 1,
        shares: 0
      }
    });

    res.json({ message: 'View recorded', views: analytics.views });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Track article share
router.post('/article/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    // Check if article exists and is published
    const article = await prisma.article.findFirst({
      where: { 
        id: articleId,
        status: 'PUBLISHED'
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Update or create analytics record
    const analytics = await prisma.analytics.upsert({
      where: { articleId },
      update: {
        shares: {
          increment: 1
        }
      },
      create: {
        articleId,
        views: 0,
        shares: 1
      }
    });

    res.json({ message: 'Share recorded', shares: analytics.shares });
  } catch (error) {
    console.error('Error tracking share:', error);
    res.status(500).json({ error: 'Failed to track share' });
  }
});

// Get user's article analytics summary
router.get('/user/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's articles with analytics
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        views: true, // Use direct fields
        shares: true,
        likes: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate totals
    const totals = articles.reduce((acc, article) => {
      acc.views += article.views || 0;
      acc.shares += article.shares || 0;
      acc.likes += article.likes || 0;
      acc.comments += article._count.comments;
      return acc;
    }, { views: 0, shares: 0, likes: 0, comments: 0 });

    res.json({
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        status: article.status,
        createdAt: article.createdAt,
        views: article.views || 0,
        shares: article.shares || 0,
        likes: article.likes || 0,
        comments: article._count.comments
      })),
      totals
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get popular articles (for admin)
router.get('/popular', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { limit = 10, period = 'week' } = req.query;
    
    // Calculate date filter based on period
    const now = new Date();
    let dateFilter;
    
    switch (period) {
      case 'day':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(0); // All time
    }

    // Get articles with analytics, ordered by views
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        createdAt: {
          gte: dateFilter
        }
      },
      include: {
        author: {
          select: { username: true }
        },
        analytics: {
          select: {
            views: true,
            shares: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        analytics: {
          views: 'desc'
        }
      },
      take: parseInt(limit)
    });

    res.json({
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        author: article.author.username,
        createdAt: article.createdAt,
        views: article.analytics?.views || 0,
        shares: article.analytics?.shares || 0,
        likes: article._count.likes,
        comments: article._count.comments
      })),
      period
    });
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    res.status(500).json({ error: 'Failed to fetch popular articles' });
  }
});

// Get analytics for current user (views, likes, comments over time)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Get all articles by user
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      select: { id: true, createdAt: true }
    });
    const articleIds = articles.map(a => a.id);
    if (articleIds.length === 0) {
      return res.json({
        months: [],
        views: [],
        likes: [],
        comments: []
      });
    }
    // Get analytics for each article, grouped by month (last 12 months)
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    // Views
    const viewsByMonth = await prisma.analytics.groupBy({
      by: ['month'],
      _sum: { views: true },
      where: {
        articleId: { in: articleIds },
        updatedAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 11, 1)
        }
      },
      orderBy: { month: 'asc' },
      // Prisma does not support direct month grouping, so we use raw query below
    });
    // Likes
    const likesByMonth = await prisma.$queryRaw`
      SELECT to_char("createdAt", 'YYYY-MM') as month, COUNT(*) as count
      FROM "Like"
      WHERE "articleId" = ANY(${articleIds})
        AND "createdAt" >= ${new Date(now.getFullYear(), now.getMonth() - 11, 1)}
      GROUP BY month
      ORDER BY month ASC;
    `;
    // Comments
    const commentsByMonth = await prisma.$queryRaw`
      SELECT to_char("createdAt", 'YYYY-MM') as month, COUNT(*) as count
      FROM "Comment"
      WHERE "articleId" = ANY(${articleIds})
        AND "createdAt" >= ${new Date(now.getFullYear(), now.getMonth() - 11, 1)}
      GROUP BY month
      ORDER BY month ASC;
    `;
    // Map to months array
    const viewsMap = {};
    // Fallback: use $queryRaw for views as well
    const viewsRaw = await prisma.$queryRaw`
      SELECT to_char("updatedAt", 'YYYY-MM') as month, SUM("views") as count
      FROM "Analytics"
      WHERE "articleId" = ANY(${articleIds})
        AND "updatedAt" >= ${new Date(now.getFullYear(), now.getMonth() - 11, 1)}
      GROUP BY month
      ORDER BY month ASC;
    `;
    viewsRaw.forEach((v) => { viewsMap[v.month] = Number(v.count); });
    const likesMap = {};
    likesByMonth.forEach((l) => { likesMap[l.month] = Number(l.count); });
    const commentsMap = {};
    commentsByMonth.forEach((c) => { commentsMap[c.month] = Number(c.count); });
    // Build arrays for chart
    const views = months.map(m => viewsMap[m] || 0);
    const likes = months.map(m => likesMap[m] || 0);
    const comments = months.map(m => commentsMap[m] || 0);
    res.json({
      months,
      views,
      likes,
      comments
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

export default router;
