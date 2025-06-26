import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all articles (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    
    let where = { status: 'approved' };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search articles
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    let where = {
      status: 'approved',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } }
      ]
    };

    if (category) {
      where.category = category;
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(articles);
  } catch (error) {
    console.error('Search articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await prisma.article.update({
      where: { id: articleId },
      data: { views: { increment: 1 } }
    });

    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get articles by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const articles = await prisma.article.findMany({
      where: { 
        category: category,
        status: 'approved' 
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json(articles);
  } catch (error) {
    console.error('Get articles by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit new article (authenticated users only)
router.post('/', authenticateToken, [
  body('title').isLength({ min: 5 }),
  body('content').isLength({ min: 50 }),
  body('category').isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const { title, content, category, tags, imageUrl } = req.body;
    
    const article = await prisma.article.create({
      data: {
        title,
        content,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        imageUrl,
        authorId: req.user.id,
        status: 'pending'
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update article (author only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { title, content, category, tags, imageUrl } = req.body;

    // Check if user is the author
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }    if (existingArticle.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to edit this article' });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        content,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
        imageUrl,
        status: 'pending' // Reset to pending when edited
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(article);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete article (author or admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }    if (existingArticle.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this article' });
    }

    await prisma.article.delete({
      where: { id: articleId }
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's articles (authenticated)
router.get('/user/my-articles', authenticateToken, async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(articles);
  } catch (error) {
    console.error('Get user articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all articles (including pending)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(articles);
  } catch (error) {
    console.error('Get all articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update article status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const articleId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { status },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(article);
  } catch (error) {
    console.error('Update article status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments for an article
router.get('/:id/comments', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    const comments = await prisma.comment.findMany({
      where: { 
        articleId,
        parentId: null // Only top-level comments
      },
      include: {
        author: {
          select: { id: true, username: true }
        },
        replies: {
          include: {
            author: {
              select: { id: true, username: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format comments for frontend
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      authorName: comment.author?.username || 'Anonymous',
      createdAt: comment.createdAt,
      replies: comment.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        authorName: reply.author?.username || 'Anonymous',
        createdAt: reply.createdAt,
        parentId: reply.parentId
      }))
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Post a comment on an article
router.post('/:id/comments', authenticateToken, [
  body('content').isLength({ min: 1, max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Comment content is required and must be under 500 characters' });
    }

    const articleId = parseInt(req.params.id);
    const { content, parentId } = req.body;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId: req.user.id,
        parentId: parentId ? parseInt(parentId) : null
      },
      include: {
        author: {
          select: { id: true, username: true }
        }
      }
    });

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      authorName: comment.author.username,
      createdAt: comment.createdAt,
      parentId: comment.parentId
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Delete a comment (author or admin only)
router.delete('/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Get related articles by category and tags (excluding current article)
router.get('/:id/related', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { category: true, tags: true }
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Find related articles by category or overlapping tags, exclude current article
    const related = await prisma.article.findMany({
      where: {
        id: { not: articleId },
        status: 'approved',
        OR: [
          { category: article.category },
          { tags: { hasSome: article.tags } }
        ]
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        category: true,
        tags: true,
        author: { select: { id: true, name: true } },
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
    res.json(related);
  } catch (error) {
    console.error('Get related articles error:', error);
    res.status(500).json({ error: 'Failed to fetch related articles' });
  }
});

export default router;
