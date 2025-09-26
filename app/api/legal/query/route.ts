import { NextRequest, NextResponse } from 'next/server';
import { userDb, queryDb, analyticsDb } from '@/lib/database';
import { generateLegalResponse } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { question, walletAddress, category } = await request.json();

    if (!question || !walletAddress) {
      return NextResponse.json(
        { error: 'Question and wallet address are required' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await userDb.get(walletAddress);
    if (!user) {
      user = await userDb.create(walletAddress);
    }

    // Check if this is a premium query (complex legal scenarios)
    const isPremium = question.toLowerCase().includes('lawsuit') ||
                     question.toLowerCase().includes('contract dispute') ||
                     question.toLowerCase().includes('employment termination') ||
                     question.length > 500;

    const cost = isPremium ? 1000000000000000 : 0; // 0.001 ETH for premium queries

    // Check user balance for premium queries
    if (isPremium && user.balance < cost) {
      return NextResponse.json(
        { error: 'Insufficient balance for premium query', required: cost, balance: user.balance },
        { status: 402 }
      );
    }

    // Generate AI response
    const answer = await generateLegalResponse(question, category);

    // Create query record
    const query = await queryDb.create(user.userId, question, answer, isPremium, cost);

    // Update user stats
    await userDb.update(user.userId, {
      totalQueries: user.totalQueries + 1,
      balance: isPremium ? user.balance - cost : user.balance,
    });

    // Log analytics
    await analyticsDb.logEvent({
      eventId: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.userId,
      eventType: 'legal_query',
      eventData: {
        questionLength: question.length,
        category,
        isPremium,
        cost,
      },
      timestamp: new Date(),
      sessionId: `session_${user.userId}_${Date.now()}`,
    });

    return NextResponse.json({
      queryId: query.queryId,
      answer,
      isPremium,
      cost,
      remainingBalance: user.balance - (isPremium ? cost : 0),
    });

  } catch (error) {
    console.error('Legal query error:', error);
    return NextResponse.json(
      { error: 'Failed to process legal query' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    const queries = await queryDb.getByUser(user.userId, limit);

    return NextResponse.json({
      queries: queries.map(q => ({
        queryId: q.queryId,
        question: q.question,
        answer: q.answer,
        timestamp: q.timestamp,
        isPremium: q.isPremium,
        cost: q.cost,
      })),
    });

  } catch (error) {
    console.error('Get queries error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve queries' },
      { status: 500 }
    );
  }
}

