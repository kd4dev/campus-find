import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { Item } from '@/lib/models/Item';
import { Claim } from '@/lib/models/Claim';
import { Conversation } from '@/lib/models/Conversation';
import { Message } from '@/lib/models/Message';
import { Handover } from '@/lib/models/Handover';
import { Notification } from '@/lib/models/Notification';
import { Report } from '@/lib/models/Report';

describe('Database Models Schema & Validation', () => {
  it('validates User model schema correctly', () => {
    const validUser = new User({
      clerkUserId: 'user_123',
      name: 'John Doe',
      email: 'john@college.edu',
      role: 'USER',
    });
    const err = validUser.validateSync();
    expect(err).toBeUndefined();

    // Invalid: missing required clerkUserId & email
    const invalidUser = new User({});
    const invalidErr = invalidUser.validateSync();
    expect(invalidErr?.errors.clerkUserId).toBeDefined();
    expect(invalidErr?.errors.name).toBeDefined();
    expect(invalidErr?.errors.email).toBeDefined();
  });

  it('validates Item model schema correctly', () => {
    const validItem = new Item({
      type: 'LOST',
      itemName: 'Blue Backpack',
      category: 'Bag',
      description: 'Lost near student center',
      location: 'Student Center',
      date: new Date(),
      userId: new mongoose.Types.ObjectId(),
    });
    const err = validItem.validateSync();
    expect(err).toBeUndefined();
    expect(validItem.status).toBe('ACTIVE');

    // Invalid item type
    const invalidItem = new Item({
      type: 'UNKNOWN_TYPE',
      itemName: 'Phone',
      category: 'Electronics',
      description: 'Found phone',
      location: 'Gym',
      date: new Date(),
      userId: new mongoose.Types.ObjectId(),
    });
    const invalidErr = invalidItem.validateSync();
    expect(invalidErr?.errors.type).toBeDefined();
  });

  it('validates Claim model schema and statuses', () => {
    const claim = new Claim({
      itemId: new mongoose.Types.ObjectId(),
      claimantId: new mongoose.Types.ObjectId(),
      finderId: new mongoose.Types.ObjectId(),
    });
    const err = claim.validateSync();
    expect(err).toBeUndefined();
    expect(claim.status).toBe('PENDING');

    const validStatuses = [
      'PENDING',
      'CHAT_VERIFICATION',
      'PROOF_SUBMITTED',
      'APPROVED',
      'REJECTED',
      'HANDOVER_PENDING',
      'COMPLETED',
      'CANCELLED',
    ];

    validStatuses.forEach((status) => {
      claim.status = status as any;
      expect(claim.validateSync()).toBeUndefined();
    });
  });

  it('validates Handover model and OTP schema', () => {
    const handover = new Handover({
      claimId: new mongoose.Types.ObjectId(),
      finderId: new mongoose.Types.ObjectId(),
      claimantId: new mongoose.Types.ObjectId(),
      otpHash: '123456',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    const err = handover.validateSync();
    expect(err).toBeUndefined();
    expect(handover.status).toBe('CREATED');
    expect(handover.attemptCount).toBe(0);
  });

  it('validates Conversation and Message models', () => {
    const conv = new Conversation({
      itemId: new mongoose.Types.ObjectId(),
      participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    });
    expect(conv.validateSync()).toBeUndefined();

    const msg = new Message({
      conversationId: conv._id,
      senderId: new mongoose.Types.ObjectId(),
      content: 'Hello, I think you found my item!',
    });
    expect(msg.validateSync()).toBeUndefined();
  });

  it('validates Notification model schema', () => {
    const notif = new Notification({
      userId: new mongoose.Types.ObjectId(),
      type: 'NEW_CLAIM',
      title: 'Update on item',
      message: 'Someone responded to your item',
    });
    expect(notif.validateSync()).toBeUndefined();
    expect(notif.read).toBe(false);
  });

  it('validates Report model schema and reasons', () => {
    const report = new Report({
      reporterId: new mongoose.Types.ObjectId(),
      itemId: new mongoose.Types.ObjectId(),
      reason: 'FAKE_LISTING',
      details: 'This item was never lost here',
    });
    expect(report.validateSync()).toBeUndefined();
    expect(report.status).toBe('PENDING');

    const validReasons = ['SPAM', 'INAPPROPRIATE', 'FAKE_LISTING', 'HARASSMENT', 'OTHER'];
    validReasons.forEach((reason) => {
      report.reason = reason as any;
      expect(report.validateSync()).toBeUndefined();
    });
  });
});
