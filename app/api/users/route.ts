import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
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

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      userId: user.userId,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
      totalQueries: user.totalQueries,
      savedGuides: user.savedGuides,
      completedCourses: user.completedCourses,
      balance: user.balance,
      subscriptionTier: user.subscriptionTier,
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, action } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    let user = await userDb.get(walletAddress);

    if (action === 'create' || !user) {
      user = await userDb.create(walletAddress);
      return NextResponse.json({
        user: {
          userId: user.userId,
          walletAddress: user.walletAddress,
          createdAt: user.createdAt,
          lastActive: user.lastActive,
          totalQueries: user.totalQueries,
          savedGuides: user.savedGuides,
          completedCourses: user.completedCourses,
          balance: user.balance,
          subscriptionTier: user.subscriptionTier,
        },
        created: true,
      });
    }

    if (action === 'update_activity') {
      user = await userDb.update(user.userId, { lastActive: new Date() });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('User action error:', error);
    return NextResponse.json(
      { error: 'Failed to process user action' },
      { status: 500 }
    );
  }
}

