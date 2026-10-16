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
        <div className="bg-blue-100 dark:bg-blue-950/60 p-3 rounded-2xl mr-4 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
          <Bell className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
          <CheckCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All caught up!</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">You don't have any notifications right now.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
          {notifications.map((notification: any) => (
            <div key={notification._id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${!notification.read ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{notification.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{notification.message}</p>
                  
                  {notification.link && (
                    <Link href={notification.link} className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                      View details &rarr;
                    </Link>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-4">
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
