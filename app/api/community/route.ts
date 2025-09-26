import { NextRequest, NextResponse } from 'next/server';
import { communityDb, userDb, analyticsDb } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    let posts;

    if (category) {
      posts = await communityDb.getPostsByCategory(category, limit);
    } else {
      posts = await communityDb.getRecentPosts(limit);
    }

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Get community posts error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve community posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, walletAddress, title, content, category, tags, postId, commentContent, commentId } = await request.json();

    if (!action || !walletAddress) {
      return NextResponse.json(
        { error: 'Action and wallet address are required' },
        { status: 400 }
      );
    }

    const user = await userDb.get(walletAddress);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'create_post') {
      if (!title || !content || !category) {
        return NextResponse.json(
          { error: 'Title, content, and category are required for creating a post' },
          { status: 400 }
        );
      }

      const post = await communityDb.createPost(
        user.userId,
        title,
        content,
        category,
        tags || []
      );

      // Log analytics
      await analyticsDb.logEvent({
        eventId: `create_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: 'post_created',
        eventData: { postId: post.postId, category, tags: tags || [] },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });

      return NextResponse.json({ post });

    } else if (action === 'like_post') {
      if (!postId) {
        return NextResponse.json(
          { error: 'Post ID is required for liking a post' },
          { status: 400 }
        );
      }

      const post = await communityDb.getPost(postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      const isLiked = post.likedBy.includes(user.userId);

      if (isLiked) {
        // Unlike
        post.likes -= 1;
        post.likedBy = post.likedBy.filter(id => id !== user.userId);
      } else {
        // Like
        post.likes += 1;
        post.likedBy.push(user.userId);
      }

      await communityDb.setPost(post);

      // Log analytics
      await analyticsDb.logEvent({
        eventId: `like_post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: isLiked ? 'post_unliked' : 'post_liked',
        eventData: { postId },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });

      return NextResponse.json({ post, liked: !isLiked });

    } else if (action === 'add_comment') {
      if (!postId || !commentContent) {
        return NextResponse.json(
          { error: 'Post ID and comment content are required for adding a comment' },
          { status: 400 }
        );
      }

      const post = await communityDb.getPost(postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      const newComment = {
        commentId: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        content: commentContent,
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
      };

      post.comments.push(newComment);
      await communityDb.setPost(post);

      // Log analytics
      await analyticsDb.logEvent({
        eventId: `add_comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: 'comment_added',
        eventData: { postId, commentId: newComment.commentId },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });

      return NextResponse.json({ post, newComment });

    } else if (action === 'like_comment') {
      if (!postId || !commentId) {
        return NextResponse.json(
          { error: 'Post ID and comment ID are required for liking a comment' },
          { status: 400 }
        );
      }

      const post = await communityDb.getPost(postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      const comment = post.comments.find(c => c.commentId === commentId);
      if (!comment) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        );
      }

      const isLiked = comment.likedBy.includes(user.userId);

      if (isLiked) {
        // Unlike
        comment.likes -= 1;
        comment.likedBy = comment.likedBy.filter(id => id !== user.userId);
      } else {
        // Like
        comment.likes += 1;
        comment.likedBy.push(user.userId);
      }

      await communityDb.setPost(post);

      return NextResponse.json({ post, liked: !isLiked });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Community action error:', error);
    return NextResponse.json(
      { error: 'Failed to process community action' },
      { status: 500 }
    );
  }
}

