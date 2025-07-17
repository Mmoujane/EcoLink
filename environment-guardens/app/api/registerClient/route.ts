import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import {
    AccountId,
    PrivateKey,
    Client,
    TopicMessageSubmitTransaction
  } from "@hashgraph/sdk"; // v2.46.0

import { connectToMongo } from '@/app/lib/mongodbconnect';

export async function POST(request: Request) {
  try {
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID!);
    const myPrivateKey = PrivateKey.fromStringECDSA(process.env.MY_PRIVATE_KEY!);
    const topicId = process.env.Users_Topic_ID!;
    const client = Client.forTestnet();
    console.log(myAccountId, myPrivateKey);

// Set the operator account ID and operator private key
    client.setOperator(myAccountId, myPrivateKey);
    const { name, mail, type, accountId } = await request.json();
    console.log(name, mail, type, accountId);
    const mongoclient = await connectToMongo();
    const db = mongoclient.db("planetGuardensDB");
    const collection = db.collection('users');
    console.log("found collection");
    const result = await collection.findOne({accountId});
    console.log(result);
    if(result){
      console.log("already registred");
        return NextResponse.json(
        { message: 'you are already registred' },
        { status: 400 }
      );
    }
    const dataHash = createHash('sha256').update(JSON.stringify({name, mail, type, accountId})).digest("hex");
    let sendResponse = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: dataHash,
  }).execute(client);
  const getReceipt = await sendResponse.getReceipt(client);

  // Get the status of the transaction
  const transactionStatus = getReceipt.status;
  console.log("The message transaction status: " + transactionStatus.toString());
  const sequenceNumber = getReceipt.topicSequenceNumber;
  await collection.insertOne({name, mail, type, accountId, sequenceNumber, dataHash});
  return NextResponse.json({ message: 'Registration successful', status: transactionStatus.toString() });
  } catch (error) {
    console.error('Error registering client:', error);
    return NextResponse.json({ message: 'Internal server error', error: true }, { status: 500 });
  }
}

