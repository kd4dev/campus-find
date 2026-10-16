import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

describe('Messaging Security & Access Control', () => {
  const aliceId = new mongoose.Types.ObjectId();
  const bobId = new mongoose.Types.ObjectId();
  const charlieId = new mongoose.Types.ObjectId();

  const conversation = {
    _id: new mongoose.Types.ObjectId(),
    participants: [aliceId, bobId], // Mongoose ObjectIds
  };

  it('demonstrates why Array.prototype.includes fails on Mongoose ObjectIds and string IDs', () => {
    const currentUserIdString = aliceId.toString();

    // In JavaScript, an array of ObjectIds checked against a string with .includes will always be false
    // @ts-ignore
    const brokenCheck = conversation.participants.includes(currentUserIdString);
    expect(brokenCheck).toBe(false); // Demonstrates the exact bug that was causing 403s!
  });

  it('correctly validates participants using toString comparison', () => {
    const aliceIdString = aliceId.toString();
    const bobIdString = bobId.toString();
    const charlieIdString = charlieId.toString();

    const isParticipant = (userId: string) =>
      conversation.participants.some((p: any) => p.toString() === userId);

    expect(isParticipant(aliceIdString)).toBe(true);
    expect(isParticipant(bobIdString)).toBe(true);
    expect(isParticipant(charlieIdString)).toBe(false);
  });

  it('allows ADMIN role bypass to inspect conversations for safety', () => {
    const canAccessConversation = (userId: string, role: string) => {
      if (role === 'ADMIN') return true;
      return conversation.participants.some((p: any) => p.toString() === userId);
    };

    expect(canAccessConversation(charlieId.toString(), 'ADMIN')).toBe(true);
    expect(canAccessConversation(charlieId.toString(), 'USER')).toBe(false);
  });
});
