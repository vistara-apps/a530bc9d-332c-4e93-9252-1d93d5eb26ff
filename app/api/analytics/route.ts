import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb, userDb } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { eventType, eventData, walletAddress, sessionId } = await request.json();

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    let userId: string | undefined;

    if (walletAddress) {
      const user = await userDb.get(walletAddress);
      if (user) {
        userId = user.userId;
      }
    }

    const event = await analyticsDb.logEvent({
      eventId: `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventType,
      eventData: eventData || {},
      timestamp: new Date(),
      sessionId: sessionId || `session_${userId || 'anonymous'}_${Date.now()}`,
    });

    return NextResponse.json({ eventId: event.eventId });

  } catch (error) {
    console.error('Analytics logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log analytics event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '50');

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

    const events = await analyticsDb.getUserEvents(user.userId, limit);

    // Filter by event type if specified
    const filteredEvents = eventType
      ? events.filter(e => e.eventType === eventType)
      : events;

    // Aggregate some basic stats
    const stats = {
      totalEvents: filteredEvents.length,
      eventTypes: filteredEvents.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      dateRange: {
        from: filteredEvents.length > 0 ? filteredEvents[filteredEvents.length - 1].timestamp : null,
        to: filteredEvents.length > 0 ? filteredEvents[0].timestamp : null,
      },
    };

    return NextResponse.json({
      events: filteredEvents,
      stats,
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}

