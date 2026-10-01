export const dynamic = 'force-dynamic';

import { getUserNotifications, markNotificationsAsRead } from "@/lib/actions/notification.actions";
import { getCurrentDbUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function NotificationsPage() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const notifications = await getUserNotifications();
  
  // Mark as read when page is visited
  if (notifications.some((n: any) => !n.read)) {
    await markNotificationsAsRead();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center flex flex-col items-center">
          <CheckCircle className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-1">You don't have any notifications right now.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden divide-y divide-gray-100">
          {notifications.map((notification: any) => (
            <div key={notification._id} className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                  
                  {notification.link && (
                    <Link href={notification.link} className="inline-block mt-2 text-sm text-blue-600 hover:underline font-medium">
                      View details &rarr;
                    </Link>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
