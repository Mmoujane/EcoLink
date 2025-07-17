import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ loggedIn: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload === 'object' && payload !== null) {
      const { accountId, name, type } = payload as any;
      return NextResponse.json({ loggedIn: true, accountId, name, type });
    } else {
      return NextResponse.json({ loggedIn: true });
    }
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
} 