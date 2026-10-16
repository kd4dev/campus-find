import { NextResponse } from 'next/server';
import { getUnreadNotificationCount } from '@/lib/actions/notification.actions';

export async function GET() {
  try {
    const count = await getUnreadNotificationCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}
