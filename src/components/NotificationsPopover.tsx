import React from 'react';
import { 
  Bell, 
  X, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  Activity, 
  CheckCheck, 
  Video, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onOpenChat: () => void;
  onOpenAppointments: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onOpenChat,
  onOpenAppointments
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'scale':
        return <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs"
      />

      {/* Popover Card */}
      <div 
        dir="rtl"
        className="fixed top-20 left-4 sm:left-12 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-teal-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm">التنبيهات والإشعارات</h3>
              <span className="text-[10px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} إشعار جديد غير مقروء` : 'جميع الإشعارات مقروءة'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-teal-300 hover:text-teal-200 flex items-center gap-1 cursor-pointer bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>قراءة الكل</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto stroke-1 opacity-50" />
              <p className="text-xs">لا توجد إشعارات حالياً</p>
            </div>
          ) : (
            notifications.map((item, idx) => (
              <div 
                key={`notif-popover-${item.id || 'notif'}-${idx}`}
                className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-3 ${
                  !item.isRead ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.timestamp.includes('T') 
                        ? new Date(item.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                        : item.timestamp.split(' ')[1] || item.timestamp
                      }
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Actions inside notification */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {item.meetUrl && (
                      <a
                        href={item.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Video className="w-3 h-3" />
                        <span>دخول Google Meet</span>
                      </a>
                    )}

                    {item.type === 'chat' && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenChat();
                        }}
                        className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>فتح الدردشة</span>
                      </button>
                    )}

                    {item.type === 'appointment' && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAppointments();
                        }}
                        className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        عرض تفاصيل الموعد ←
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[11px] text-slate-400">
            تنبيهات مشفرة فورية لحجوزاتك واستشاراتك الإكلينيكية
          </span>
        </div>
      </div>
    </>
  );
};
