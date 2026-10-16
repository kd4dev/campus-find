import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import { Message } from '@/lib/models/Message';
import { Conversation } from '@/lib/models/Conversation';
import { getCurrentDbUser } from '@/lib/actions/user.actions';

export async function GET(req: Request) {
  try {
    const user = await getCurrentDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const since = searchParams.get('since');

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: 'Invalid conversationId' }, { status: 400 });
    }

    await connectToDatabase();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const currentUserIdStr = user._id.toString();
    const isParticipant = conversation.participants.some(
      (p: any) => p.toString() === currentUserIdStr
    );

    if (!isParticipant && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const query: any = { conversationId };
    if (since) {
      query.createdAt = { $gt: new Date(since) };
    }

    const messages = await Message.find(query).sort({ createdAt: 1 }).populate('senderId', 'name avatar');
    
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Failed to get messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { conversationId, content } = body;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId) || !content?.trim()) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    await connectToDatabase();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const currentUserIdStr = user._id.toString();
    const isParticipant = conversation.participants.some(
      (p: any) => p.toString() === currentUserIdStr
    );

    if (!isParticipant && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const message = await Message.create({
      conversationId,
      senderId: user._id,
      content: content.trim(),
      readBy: [user._id]
    });

    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate('senderId', 'name avatar');

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
