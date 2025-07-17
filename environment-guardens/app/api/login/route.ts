import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToMongo } from '../../lib/mongodbconnect';
import jwt from 'jsonwebtoken';
import { AccountId, PublicKey } from '@hashgraph/sdk';

export async function POST(request: Request) {
  try {
    const { accountId, signature, challenge } = await request.json();
    if (!accountId || !signature || !challenge) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Connect to MongoDB and find user
    const mongoclient = await connectToMongo();
    const db = mongoclient.db('planetGuardensDB');
    const collection = db.collection('users');
    const user = await collection.findOne({ accountId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch public key from mirror node REST API
    // (You could cache/store this in DB for efficiency)
    const mirrorUrl = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`;
    const mirrorRes = await fetch(mirrorUrl);
    if (!mirrorRes.ok) {
      return NextResponse.json({ message: 'Failed to fetch public key' }, { status: 500 });
    }
    const mirrorData = await mirrorRes.json();
    const publicKeyStr = mirrorData.key?.key;
    if (!publicKeyStr) {
      return NextResponse.json({ message: 'No public key found for account' }, { status: 400 });
    }
    const publicKey = PublicKey.fromString(publicKeyStr);

    // Verify signature
    function prefixHederaMessage(message: string) {
      return `\x19Hedera Signed Message:\n${message.length}${message}`;
    }
    // Prefix the challenge message as per Hedera standard
    const prefixed = prefixHederaMessage(challenge);
    const challengeBytes = Buffer.from(prefixed, 'utf8');
    const signatureBytes = Buffer.from(signature, 'base64');
    const isValid = publicKey.verify(challengeBytes, signatureBytes);
    console.log('publicKey', publicKey);
    console.log('challenge', challenge);
    console.log('prefixed', prefixed);
    console.log('challengeBytes', challengeBytes);
    console.log('signatureBytes', signatureBytes);
    console.log('isValid', isValid);
    if (!isValid) {
      console.log("Invalid signature");
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // Issue JWT
    const token = jwt.sign({ accountId, name: user.name, type: user.type }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ message: 'Login successful', accountId });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error', error: true }, { status: 500 });
  }
}
