import React, { useState, useEffect, useRef, useCallback } from 'react';
<<<<<<< HEAD
import { useFleet } from '../context/FleetContext';
=======
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: 'bg-red-500/15',    border: 'border-red-500/30',    label: 'CRITICAL', icon: 'RD' },
  severe:   { color: '#f97316', bg: 'bg-orange-500/15', border: 'border-orange-500/30', label: 'SEVERE',   icon: 'OR' },
  moderate: { color: '#eab308', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', label: 'MODERATE', icon: 'YL' },
  minor:    { color: '#a855f7', bg: 'bg-purple-500/15', border: 'border-purple-500/30', label: 'MINOR',    icon: 'MN' },
};

const HIGH_SEVERITY = ['critical', 'severe'];
const STORAGE_KEY = 'dismissed_crashes';

function CrashCard({ crash, onDismiss, onSmsSent }) {
  const [smsState, setSmsState] = useState(() => {
    const sentKey = `sms_sent_${crash.id}`;
    return localStorage.getItem(sentKey) === 'true' ? 'sent' : 'idle';
  });
  
  const cfg = SEVERITY_CONFIG[crash.severity] || SEVERITY_CONFIG.moderate;

  const sendSms = async () => {
    setSmsState('sending');
    try {
<<<<<<< HEAD
      const res = await fetch('http://ec2-47-128-147-152.ap-southeast-1.compute.amazonaws.com:8080/api/alert/sms', {
=======
      const res = await fetch('http://localhost:5000/api/alert/sms', {
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId:  crash.deviceId,
          severity:  crash.severity,
          deltaG:    crash.deltaG,
          prevG:     crash.prevG,
          currentG:  crash.currentG,
          timestamp: crash.timestamp,
          lat:       crash.lat,
          lng:       crash.lng,
        }),
      });
      
      if (res.ok) {
        setSmsState('success');
        localStorage.setItem(`sms_sent_${crash.id}`, 'true');
        if (onSmsSent) onSmsSent(crash.id);
        
        setTimeout(() => {
          setSmsState('sent');
        }, 3000);
      } else {
        setSmsState('failed');
      }
    } catch (err) {
      setSmsState('failed');
    }
  };

  const cardBg =
    smsState === 'success' ? 'bg-green-500/10 border-green-500/30' :
    smsState === 'failed'  ? 'bg-red-500/10 border-red-500/30'     :
    smsState === 'sent'    ? 'bg-gray-500/10 border-gray-500/30'   :
    cfg.bg + ' ' + cfg.border;

  const mapsUrl = crash.lat && crash.lng
    ? 'https://maps.google.com/?q=' + crash.lat + ',' + crash.lng
    : '#';

  const latStr = crash.lat ? Number(crash.lat).toFixed(6) : '';
  const lngStr = crash.lng ? Number(crash.lng).toFixed(6) : '';
  const timeStr = new Date(crash.timestamp).toLocaleString();
  const deltaStr = Number(crash.deltaG).toFixed(3);
  const peakStr  = Number(crash.currentG).toFixed(3);

  return (
    <div
      className={'relative rounded-xl border p-4 transition-all duration-500 ' + cardBg}
      style={{ borderColor: smsState === 'idle' ? cfg.color + '44' : undefined }}
    >
      <button
        onClick={function() { onDismiss(crash.id); }}
        className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors text-xs font-bold"
      >
        ✕
      </button>

      <div className="flex items-start gap-3 pr-7">
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded mt-0.5" style={{ background: cfg.color + '33', color: cfg.color }}>
          {cfg.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ background: cfg.color + '22', color: cfg.color }}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {timeStr}
            </span>
          </div>
          <p className="text-sm font-bold text-white mt-1">
            Impact Spike -- {crash.deviceId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-black/20 rounded-lg px-3 py-2">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Delta G</p>
          <p className="text-sm font-mono font-bold" style={{ color: cfg.color }}>
            {deltaStr}g
          </p>
        </div>
        <div className="bg-black/20 rounded-lg px-3 py-2">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Peak G</p>
          <p className="text-sm font-mono font-bold text-white">
            {peakStr}g
          </p>
        </div>
        {crash.lat && crash.lng && (
          <div className="bg-black/20 rounded-lg px-3 py-2 col-span-2">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">GPS</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-blue-400 hover:text-blue-300 underline break-all">
              {latStr}, {lngStr}
            </a>
          </div>
        )}
      </div>

      <div className="mt-3">
        {smsState === 'idle' && (
          <button
            onClick={sendSms}
            className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: cfg.color + '22', color: cfg.color, border: '1px solid ' + cfg.color + '44' }}
            onMouseEnter={function(e) { e.currentTarget.style.background = cfg.color + '44'; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = cfg.color + '22'; }}
          >
            <span className="material-symbols-outlined text-sm">send</span>
            Send SMS Alert
          </button>
        )}

        {smsState === 'sending' && (
          <div className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </div>
        )}

        {smsState === 'success' && (
          <div className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            SMS Sent Successfully
          </div>
        )}

        {smsState === 'failed' && (
          <div className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30">
            <button
              onClick={sendSms}
              className="flex items-center justify-center gap-2 w-full"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry SMS
            </button>
          </div>
        )}

        {smsState === 'sent' && (
          <div className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <span className="material-symbols-outlined text-sm">done_all</span>
            Alert Sent
          </div>
        )}
      </div>
    </div>
  );
}

export default function CrashNotificationSystem() {
<<<<<<< HEAD
  const { activeDeviceId, hasActiveDevice } = useFleet();
  const [crashes, setCrashes] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const seenIds = useRef(new Set());
=======
  const [crashes, setCrashes] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const seenIds = useRef(new Set());
  const deviceId = 'VX-9902';
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
  const panelRef = useRef(null);

  // Load dismissed crashes from localStorage on mount
  const getDismissedCrashes = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  const saveDismissedCrashes = (dismissedSet) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(dismissedSet)));
  };

  const pollIncidents = useCallback(async function() {
<<<<<<< HEAD
    if (!hasActiveDevice || !activeDeviceId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        'http://ec2-47-128-147-152.ap-southeast-1.compute.amazonaws.com:8080/api/telemetry/incidents/' + activeDeviceId + '?minDelta=7',
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
=======
    try {
      const res = await fetch(
        'http://localhost:5000/api/telemetry/incidents/' + deviceId + '?minDelta=7'
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
      );
      if (!res.ok) return;
      const incidents = await res.json();

      const dismissedCrashes = getDismissedCrashes();
      const newCrashes = [];
      
      incidents
        .filter(function(inc) { 
          return HIGH_SEVERITY.includes(inc.spike && inc.spike.severity); 
        })
        .forEach(function(inc) {
          const id = inc._id || inc.timestampISO;
          // Only add if not already dismissed
          if (!seenIds.current.has(id) && !dismissedCrashes.has(id)) {
            seenIds.current.add(id);
            newCrashes.push({
              id:        id,
<<<<<<< HEAD
              deviceId:  inc.deviceId  || activeDeviceId,
=======
              deviceId:  inc.deviceId  || deviceId,
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
              severity:  (inc.spike && inc.spike.severity) || 'severe',
              deltaG:    (inc.spike && inc.spike.delta_g)  || 0,
              prevG:     (inc.spike && inc.spike.prev_g)   || 0,
              currentG:  (inc.imu   && inc.imu.peak_g)     || 0,
              lat:       (inc.gps   && inc.gps.latitude)   || null,
              lng:       (inc.gps   && inc.gps.longitude)  || null,
              timestamp: inc.timestampISO || inc.timestamp || new Date().toISOString(),
            });
          }
        });

      if (newCrashes.length > 0) {
        setCrashes(function(prev) { return newCrashes.concat(prev); });
      }
    } catch (err) {
      // backend offline
    }
<<<<<<< HEAD
  }, [activeDeviceId, hasActiveDevice]);

  useEffect(function() {
    if (!hasActiveDevice) {
      setCrashes([]);
      return;
    }
    pollIncidents();
    const interval = setInterval(pollIncidents, 5000);
    return function() { clearInterval(interval); };
  }, [pollIncidents, hasActiveDevice]);
=======
  }, [deviceId]);

  useEffect(function() {
    pollIncidents();
    const interval = setInterval(pollIncidents, 5000);
    return function() { clearInterval(interval); };
  }, [pollIncidents]);
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280

  // Handle click outside to close panel
  useEffect(function() {
    function handleClickOutside(event) {
      if (panelOpen && panelRef.current && !panelRef.current.contains(event.target)) {
        setPanelOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return function() {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [panelOpen]);

  function dismiss(id) {
    // Add to dismissed crashes in localStorage
    const dismissedCrashes = getDismissedCrashes();
    dismissedCrashes.add(id);
    saveDismissedCrashes(dismissedCrashes);
    
    // Also track in seenIds
    seenIds.current.add(id);
    
    // Remove from UI
    setCrashes(function(prev) { 
      return prev.filter(function(c) { return c.id !== id; }); 
    });
  }

  function dismissAll() {
    // Add all current crashes to dismissed set
    const dismissedCrashes = getDismissedCrashes();
    crashes.forEach(function(crash) {
      dismissedCrashes.add(crash.id);
      seenIds.current.add(crash.id);
    });
    saveDismissedCrashes(dismissedCrashes);
    
    // Clear UI
    setCrashes([]);
  }

  function handleSmsSent(id) {
    console.log('SMS sent for crash:', id);
  }

  const highCount = crashes.length;

  return (
    <div>
      <button
        onClick={function() { setPanelOpen(function(o) { return !o; }); }}
        className="relative text-slate-400 hover:text-white transition-colors"
        title="Crash Notifications"
      >
        <span className="material-symbols-outlined">
          notifications
        </span>
        {highCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-black text-white animate-pulse"
            style={{ background: '#ef4444', lineHeight: '1' }}
          >
            {highCount > 99 ? '99+' : highCount}
          </span>
        )}
      </button>

      {/* Backdrop overlay - clicking this also closes the panel */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={function() { setPanelOpen(false); }}
        />
      )}

      <div
        ref={panelRef}
        className="fixed top-0 right-0 z-50 transition-transform duration-300 ease-in-out"
        style={{ 
          width: '380px', 
          height: '100vh',
          transform: panelOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="flex flex-col h-full bg-[#13151a] border-l border-white/10 shadow-2xl">

          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0f13] flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-xl">warning</span>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Crash Alerts</h2>
                <p className="text-[10px] text-slate-500 tracking-wide">
                  {highCount === 0 ? 'No active alerts' : highCount + ' high-severity event' + (highCount > 1 ? 's' : '')}
                </p>
              </div>
            </div>
            <button
              onClick={function() { setPanelOpen(false); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {crashes.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-700">shield</span>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">All Clear</p>
                <p className="text-slate-600 text-xs">No high-severity events detected</p>
              </div>
            ) : (
              crashes.map(function(crash) {
                return <CrashCard key={crash.id} crash={crash} onDismiss={dismiss} onSmsSent={handleSmsSent} />;
              })
            )}
          </div>

          {crashes.length > 0 && (
            <div className="px-4 py-3 border-t border-white/10 bg-[#0d0f13] flex-shrink-0">
              <button
                onClick={dismissAll}
                className="w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors border border-white/10"
              >
                Dismiss All
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}