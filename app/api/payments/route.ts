import { NextRequest, NextResponse } from 'next/server';
import { paymentDb, userDb, analyticsDb } from '@/lib/database';
import { processPayment } from '@/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount, itemType, itemId, paymentMethod } = await request.json();

    if (!walletAddress || !amount || !itemType || !itemId) {
      return NextResponse.json(
        { error: 'Wallet address, amount, item type, and item ID are required' },
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

    // Create payment transaction
    const transactionId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transaction = {
      transactionId,
      userId: user.userId,
      amount,
      currency: 'ETH',
      type: itemType as 'query' | 'guide' | 'course' | 'subscription',
      itemId,
      status: 'pending' as const,
      timestamp: new Date(),
    };

    await paymentDb.createTransaction(transaction);

    // Process the payment
    try {
      const result = await processPayment(transaction, paymentMethod);

      if (result.success) {
        // Update transaction status
        await paymentDb.updateTransactionStatus(transactionId, 'completed', result.transactionHash);

        // Update user balance if it's a deposit/top-up
        if (itemType === 'deposit') {
          await userDb.update(user.userId, { balance: user.balance + amount });
        }

        // Log successful payment
        await analyticsDb.logEvent({
          eventId: `payment_success_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.userId,
          eventType: 'payment_completed',
          eventData: { transactionId, amount, itemType, itemId },
          timestamp: new Date(),
          sessionId: `session_${user.userId}_${Date.now()}`,
        });

        return NextResponse.json({
          success: true,
          transactionId,
          transactionHash: result.transactionHash,
        });
      } else {
        // Update transaction status to failed
        await paymentDb.updateTransactionStatus(transactionId, 'failed');

        // Log failed payment
        await analyticsDb.logEvent({
          eventId: `payment_failed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.userId,
          eventType: 'payment_failed',
          eventData: { transactionId, amount, itemType, itemId, error: result.error },
          timestamp: new Date(),
          sessionId: `session_${user.userId}_${Date.now()}`,
        });

        return NextResponse.json(
          { error: result.error || 'Payment failed' },
          { status: 402 }
        );
      }
    } catch (paymentError) {
      console.error('Payment processing error:', paymentError);

      // Update transaction status to failed
      await paymentDb.updateTransactionStatus(transactionId, 'failed');

      return NextResponse.json(
        { error: 'Payment processing failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

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

    const transactions = await paymentDb.getUserTransactions(user.userId);

    return NextResponse.json({
      transactions: transactions.map(t => ({
        transactionId: t.transactionId,
        amount: t.amount,
        currency: t.currency,
        type: t.type,
        itemId: t.itemId,
        status: t.status,
        transactionHash: t.transactionHash,
        timestamp: t.timestamp,
      })),
      balance: user.balance,
    });

  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment history' },
      { status: 500 }
    );
  }
}

