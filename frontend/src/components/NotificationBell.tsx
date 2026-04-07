import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { apiGetNotifications, apiGetUnreadCount, apiMarkAllRead } from '../api';

interface NotificationBellProps {
  userId: number | null;
}

interface AppNotification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = () => {
    if (!userId) return;
    apiGetNotifications(userId).then((data) => {
      if (Array.isArray(data)) setNotifications(data);
    }).catch(() => {});
    apiGetUnreadCount(userId).then((data) => {
      if (data?.count !== undefined) setUnread(Number(data.count));
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [userId]);

  const handleOpen = () => {
    setOpen(true);
    if (unread > 0 && userId) {
      apiMarkAllRead(userId).then(() => { setUnread(0); load(); }).catch(() => {});
    }
  };

  return (
    <>
      <button onClick={handleOpen} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
        <Bell size={22} color="var(--secondary)" />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', backgroundColor: '#ea4335', borderRadius: '50%', fontSize: '10px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', backgroundColor: '#fff', borderRadius: '24px 24px 0 0', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 900, fontSize: '18px' }}>Notifications</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {notifications.length > 0 && (
                  <button onClick={() => { if (userId) apiMarkAllRead(userId).then(load); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6a0dad', fontWeight: 700 }}>
                    <CheckCheck size={16} /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: '#a1a1a1', fontSize: '14px' }}>
                  <Bell size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <div>No notifications yet</div>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f8f8f8', backgroundColor: n.read ? '#fff' : '#faf5ff' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.read ? '#e0e0e0' : '#6a0dad', marginTop: '6px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px' }}>{n.title}</div>
                        <div style={{ fontSize: '13px', color: '#717171', marginTop: '2px' }}>{n.message}</div>
                        <div style={{ fontSize: '11px', color: '#a1a1a1', marginTop: '4px' }}>
                          {new Date(n.createdAt).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBell;
