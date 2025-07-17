import { NextResponse } from 'next/server';
import { AccountId, PrivateKey, Client, TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { connectToMongo } from '@/app/lib/mongodbconnect';

export async function POST(request: Request) {
  try {
    const { cid, url, metadata } = await request.json();
    if (!cid) return NextResponse.json({ message: 'Missing CID' }, { status: 400 });

    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID!);
    const myPrivateKey = PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY!);
    const topicId = process.env.PROOF_TOPIC_ID!;
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: JSON.stringify({ cid, url, metadata }),
    }).execute(client);
    const getReceipt = await sendResponse.getReceipt(client);
    const transactionStatus = getReceipt.status;

    // Store proof in MongoDB for easy retrieval
    const mongoclient = await connectToMongo();
    const db = mongoclient.db('planetGuardensDB');
    const collection = db.collection('proofs');
    await collection.insertOne({ cid, url, metadata, createdAt: new Date(), status: transactionStatus.toString() });

    return NextResponse.json({ status: transactionStatus.toString(), url: url, cid: cid });
  } catch (error) {
    console.error('Error submitting proof to Hedera:', error);
    return NextResponse.json({ message: 'Internal server error', error: true }, { status: 500 });
  }
}

export async function GET() {
  try {
    const mongoclient = await connectToMongo();
    const db = mongoclient.db('planetGuardensDB');
    const collection = db.collection('proofs');
    const proofs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ proofs });
  } catch (error) {
    console.error('Error fetching proofs:', error);
    return NextResponse.json({ message: 'Internal server error', error: true }, { status: 500 });
  }
} 