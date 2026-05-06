import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { api } from '../../hooks/useApi';
import UserAvatar from '../shared/UserAvatar';
import HealthBar from '../shared/HealthBar';

interface DisplayModeUser {
  id: number;
  displayName: string;
  avatarColor: string;
  avatarType?: string;
  avatarPreset?: string;
  avatarPhotoUrl?: string;
}

interface DisplayTask {
  id: number;
  name: string;
  translationKey?: string;
  iconKey?: string;
  health: number;
  effort: number;
  roomId: number;
  roomName: string;
  roomColor: string;
  roomAccent: string;
  lastCompletedAt: string | null;
  isSeasonal: boolean;
  onDemand?: boolean;
  frequencyDays: number;
  dueDate?: string;
  dueInDays?: number;
  assignedUsers?: Array<{ id: number; displayName: string; avatarColor: string }>;
}

interface UserTasks {
  incomplete: DisplayTask[];
  completed: DisplayTask[];
}

interface DisplayModeData {
  displayUsers: DisplayModeUser[];
  userTasks: Record<number, UserTasks>;
  currentUser: any;
}

export function DisplayMode() {
  const { t } = useTranslation('en');
  const [data, setData] = useState<DisplayModeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showHealth, setShowHealth] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const result = await api.dashboardDisplay();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load display data:', err);
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading && !data) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--warm-bg)',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--warm-text-light)' }}>
          {t('common.loading')}...
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const localeMap: Record<string, string> = { en: 'en-US', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', it: 'it-IT' };
  const today = new Date().toLocaleDateString(localeMap['en'] || 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--warm-bg)',
      padding: '24px',
      fontFamily: 'Nunito',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        padding: '20px',
        backgroundColor: 'var(--warm-card)',
        borderRadius: '16px',
        border: '1.5px solid var(--warm-border)',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 900,
          color: 'var(--warm-text)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px',
        }}>
          {t('nav.home')}
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--warm-text-light)',
          margin: 0,
        }}>
          {today}
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '32px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1.5px solid var(--warm-border)',
            backgroundColor: 'var(--warm-bg-subtle)',
            color: 'var(--warm-text)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
        <button
          onClick={() => setShowHealth(!showHealth)}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1.5px solid var(--warm-border)',
            backgroundColor: 'var(--warm-bg-subtle)',
            color: 'var(--warm-text)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {showHealth ? 'Hide Health' : 'Show Health'}
        </button>
      </div>

      {/* Tasks Grid */}
      {data.displayUsers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--warm-text-light)',
          fontSize: '16px',
        }}>
          {t('display.noUsers')}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(data.displayUsers.length, 4)}, minmax(0, 1fr))`,
          gap: '24px',
        }}>
          {data.displayUsers.map((user) => {
            const tasks = data.userTasks[user.id];
            if (!tasks) return null;

            return (
              <div
                key={user.id}
                style={{
                  backgroundColor: 'var(--warm-card)',
                  borderRadius: '16px',
                  border: '1.5px solid var(--warm-border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* User Header */}
                <div style={{
                  padding: '20px',
                  backgroundColor: 'var(--warm-bg-subtle)',
                  borderBottom: '1.5px solid var(--warm-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                   <UserAvatar
                     name={user.displayName}
                     color={user.avatarColor}
                     size={48}
                     avatarType={user.avatarType as 'letter' | 'preset' | 'photo' | undefined}
                     avatarPreset={user.avatarPreset}
                     avatarPhotoUrl={user.avatarPhotoUrl}
                   />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: 'var(--warm-text)',
                    }}>
                      {user.displayName}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--warm-text-light)',
                    }}>
                      {tasks.incomplete.length} pending
                      {showCompleted && tasks.completed.length > 0 && ` • ${tasks.completed.length} done`}
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  maxHeight: '600px',
                }}>
                  {/* Incomplete Tasks */}
                  {tasks.incomplete.length > 0 && (
                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--warm-text-light)',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '1px',
                      }}>
                        {t('display.pending')}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.incomplete.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '14px 16px',
                      backgroundColor: 'var(--warm-bg-subtle)',
                      borderRadius: '12px',
                      border: '1px solid var(--warm-border)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}>
                      <div style={{
                        flex: 1,
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--warm-text)',
                          marginBottom: '4px',
                        }}>
                          {task.name}
                        </div>
                         {showHealth && (
                            <HealthBar
                              value={task.health}
                              showLabel={false}
                            />
                          )}
                       </div>
                       <button
                         onClick={async () => {
                           try {
                             await api.completeTask(task.id);
                           } catch (err: any) {
                             console.error('Failed to complete task:', err);
                           }
                         }}
                         style={{
                           padding: '6px 12px',
                           borderRadius: '8px',
                           border: '1.5px solid var(--warm-border)',
                           backgroundColor: 'var(--warm-accent-light)',
                           color: 'var(--warm-text)',
                           fontSize: '12px',
                           fontWeight: 700,
                           cursor: 'pointer',
                           transition: 'all 0.2s ease',
                         }}
                       >
                         Done
                       </button>
                     </div>
                   </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Tasks */}
                  {showCompleted && tasks.completed.length > 0 && (
                    <div style={{ padding: '16px', borderTop: '1.5px solid var(--warm-border)' }}>
                      <h3 style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--warm-text-light)',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        letterSpacing: '1px',
                      }}>
                        {t('display.completed')}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.completed.map((task) => (
                          <div
                            key={task.id}
                            style={{
                              padding: '14px 16px',
                              backgroundColor: 'var(--warm-bg-subtle)',
                              borderRadius: '12px',
                              border: '1px solid var(--warm-border)',
                              opacity: 0.7,
                            }}
                          >
                            <div style={{
                              fontSize: '14px',
                              fontWeight: 700,
                              color: 'var(--warm-text)',
                              textDecoration: 'line-through',
                              marginBottom: '4px',
                            }}>
                              {task.name}
                            </div>
                             {showHealth && (
                               <HealthBar
                                 value={task.health}
                                 showLabel={false}
                               />
                             )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
