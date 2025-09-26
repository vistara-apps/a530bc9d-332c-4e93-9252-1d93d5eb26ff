import { NextRequest, NextResponse } from 'next/server';
import { guideDb, userDb, analyticsDb } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const walletAddress = searchParams.get('walletAddress');
    const premium = searchParams.get('premium') === 'true';

    let guides;

    if (search) {
      guides = await guideDb.search(search, category || undefined);
    } else if (category) {
      guides = await guideDb.getByCategory(category);
    } else if (premium) {
      guides = await guideDb.getPremium();
    } else {
      guides = await guideDb.getAll();
    }

    // If wallet address provided, check user's saved guides
    let userSavedGuides: string[] = [];
    if (walletAddress) {
      const user = await userDb.get(walletAddress);
      if (user) {
        userSavedGuides = user.savedGuides;
      }
    }

    const guidesWithSaved = guides.map(guide => ({
      ...guide,
      isSaved: userSavedGuides.includes(guide.guideId),
    }));

    return NextResponse.json({ guides: guidesWithSaved });

  } catch (error) {
    console.error('Get guides error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve guides' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { guideId, walletAddress, action } = await request.json();

    if (!guideId || !walletAddress || !action) {
      return NextResponse.json(
        { error: 'Guide ID, wallet address, and action are required' },
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

    const guide = await guideDb.get(guideId);
    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      );
    }

    if (action === 'save') {
      if (!user.savedGuides.includes(guideId)) {
        user.savedGuides.push(guideId);
        await userDb.update(user.userId, { savedGuides: user.savedGuides });

        // Log analytics
        await analyticsDb.logEvent({
          eventId: `save_guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.userId,
          eventType: 'guide_saved',
          eventData: { guideId, category: guide.category },
          timestamp: new Date(),
          sessionId: `session_${user.userId}_${Date.now()}`,
        });
      }
    } else if (action === 'unsave') {
      user.savedGuides = user.savedGuides.filter(id => id !== guideId);
      await userDb.update(user.userId, { savedGuides: user.savedGuides });
    } else if (action === 'read') {
      // Increment read count
      guide.readCount += 1;
      await guideDb.set(guide);

      // Log analytics
      await analyticsDb.logEvent({
        eventId: `read_guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.userId,
        eventType: 'guide_read',
        eventData: { guideId, category: guide.category },
        timestamp: new Date(),
        sessionId: `session_${user.userId}_${Date.now()}`,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Guide action error:', error);
    return NextResponse.json(
      { error: 'Failed to process guide action' },
      { status: 500 }
    );
  }
}

