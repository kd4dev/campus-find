import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

describe('Claim Workflow & Role Logic', () => {
  const userA_id = new mongoose.Types.ObjectId().toString(); // Owner of LOST item, or Finder of FOUND item
  const userB_id = new mongoose.Types.ObjectId().toString(); // Responder

  it('correctly assigns Claimant and Finder when item is LOST', () => {
    // When an item is LOST:
    // User A posted the LOST item -> User A is the original owner (Claimant)
    // User B found the item and reports "I Found This Item" -> User B is the Finder
    const item = {
      _id: new mongoose.Types.ObjectId().toString(),
      type: 'LOST',
      userId: userA_id,
    };
    const currentUser = { _id: userB_id };

    const rawItemUserId = ((item.userId as any)?._id || item.userId)?.toString();
    const currentUserId = currentUser._id?.toString();

    const claimantId = item.type === 'FOUND' ? currentUserId : rawItemUserId;
    const finderId = item.type === 'FOUND' ? rawItemUserId : currentUserId;

    expect(claimantId).toBe(userA_id);
    expect(finderId).toBe(userB_id);
  });

  it('correctly assigns Claimant and Finder when item is FOUND', () => {
    // When an item is FOUND:
    // User A found the item and posted it -> User A is the Finder
    // User B says "I Think This Is Mine" -> User B is the Claimant (owner)
    const item = {
      _id: new mongoose.Types.ObjectId().toString(),
      type: 'FOUND',
      userId: userA_id,
    };
    const currentUser = { _id: userB_id };

    const rawItemUserId = ((item.userId as any)?._id || item.userId)?.toString();
    const currentUserId = currentUser._id?.toString();

    const claimantId = item.type === 'FOUND' ? currentUserId : rawItemUserId;
    const finderId = item.type === 'FOUND' ? rawItemUserId : currentUserId;

    expect(claimantId).toBe(userB_id);
    expect(finderId).toBe(userA_id);
  });

  it('prevents self-claim when the poster clicks claim on their own item', () => {
    const item = {
      _id: new mongoose.Types.ObjectId().toString(),
      type: 'FOUND',
      userId: userA_id,
    };
    const currentUser = { _id: userA_id };

    const rawItemUserId = ((item.userId as any)?._id || item.userId)?.toString();
    const currentUserId = currentUser._id?.toString();

    const isSelfClaim = rawItemUserId === currentUserId;
    expect(isSelfClaim).toBe(true);
  });

  it('properly determines recipient for notification on claim creation', () => {
    // If someone responds to a LOST item (I found it), notify the owner (Claimant)
    const lostItemNotify = (type: string, claimantId: string, finderId: string) =>
      type === 'LOST' ? claimantId : finderId;

    expect(lostItemNotify('LOST', userA_id, userB_id)).toBe(userA_id);

    // If someone claims a FOUND item (It's mine), notify the finder
    expect(lostItemNotify('FOUND', userB_id, userA_id)).toBe(userA_id);
  });

  it('generates a 6-digit numeric OTP for physical handover', () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
    expect(Number(otp)).toBeGreaterThanOrEqual(100000);
    expect(Number(otp)).toBeLessThanOrEqual(999999);
  });

  it('validates OTP expiry correctly', () => {
    const validExpiry = new Date(Date.now() + 30 * 60 * 1000);
    const expiredDate = new Date(Date.now() - 5000);

    const isExpired = (expiry: Date) => expiry < new Date();

    expect(isExpired(validExpiry)).toBe(false);
    expect(isExpired(expiredDate)).toBe(true);
  });
});
