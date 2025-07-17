import { NextResponse } from 'next/server';
import { connectToMongo } from '@/app/lib/mongodbconnect';

export async function POST(request: Request) {
  try {
    const { accountId, amount } = await request.json();
    if (!accountId || !amount) {
      return NextResponse.json({ message: 'Missing accountId or amount' }, { status: 400 });
    }
    // TODO: Process transfer back on Hedera (mirror node)
    // For now, just update user type
    const mongoclient = await connectToMongo();
    const db = mongoclient.db('planetGuardensDB');
    const collection = db.collection('users');
    const user = await collection.findOne({ accountId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (user.type !== 'verifier') {
      return NextResponse.json({ message: 'User is not a verifier' }, { status: 400 });
    }
    await collection.updateOne({ accountId }, { $set: { type: 'contributor' } });
    return NextResponse.json({ message: 'Unstaking successful, user is now a contributor' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: true }, { status: 500 });
  }
} 