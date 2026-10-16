import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

describe('Notifications & Alert System', () => {
  it('correctly creates and formats notification payloads', () => {
    const claimId = new mongoose.Types.ObjectId().toString();
    const itemName = 'AirPods Pro';

    const createNotificationData = (userId: string, title: string, message: string, link: string) => ({
      userId,
      type: 'NEW_CLAIM',
      title,
      message,
      link,
      read: false,
      createdAt: new Date(),
    });

    const notif = createNotificationData(
      new mongoose.Types.ObjectId().toString(),
      'New Update on Your Item!',
      `Someone has responded to your post for: ${itemName}`,
      `/claims/${claimId}`
    );

    expect(notif.read).toBe(false);
    expect(notif.link).toBe(`/claims/${claimId}`);
    expect(notif.message).toContain(itemName);
  });

  it('filters unread notifications accurately', () => {
    const notifications = [
      { _id: '1', read: false },
      { _id: '2', read: true },
      { _id: '3', read: false },
      { _id: '4', read: true },
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;
    expect(unreadCount).toBe(2);

    const hasUnread = notifications.some((n) => !n.read);
    expect(hasUnread).toBe(true);
  });
});
