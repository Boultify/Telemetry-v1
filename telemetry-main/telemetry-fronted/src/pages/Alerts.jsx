import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useFleet } from '../context/FleetContext';
import DeviceSetupRequired from '../components/DeviceSetupRequired';

function severityStyle(severity) {
  switch (severity) {
    case 'critical':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'severe':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'moderate':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'minor':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    default:
      return 'text-outline bg-surface-container-high border-outline-variant/20';
  }
}

export default function Alerts() {
  const { activeDeviceId, hasActiveDevice, existsInTelemetry, loading: fleetLoading, isAdmin } = useFleet();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasActiveDevice) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/telemetry/incidents/${activeDeviceId}`);
        if (res?.ok) {
          setAlerts(await res.json());
        } else {
          setAlerts([]);
        }
      } catch (err) {
        console.error('Failed to load alerts:', err);
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [activeDeviceId, hasActiveDevice]);

  if (fleetLoading || isLoading) {
    return (
      <div className="p-8 text-center text-primary animate-pulse tracking-widest font-bold">
        LOADING ALERTS...
      </div>
    );
  }

  if (!hasActiveDevice) {
    return (
      <DeviceSetupRequired
        title={isAdmin ? 'Select a vehicle in Admin' : 'Set your Device ID on Profile'}
      />
    );
  }

  if (!existsInTelemetry) {
    return <DeviceSetupRequired title="Device ID not found in MongoDB telemetries" />;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface uppercase">
          Alerts
        </h1>
        <p className="text-xs text-outline font-medium tracking-wide mt-1 uppercase">
          Impact spikes for device <span className="font-mono text-primary">{activeDeviceId}</span>
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-outline-variant/20 bg-surface-container">
          <span className="material-symbols-outlined text-5xl text-secondary mb-4 block">notifications_off</span>
          <p className="text-sm text-outline">No impact alerts recorded for this vehicle yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((entry) => {
            const ts = entry.timestamp ? new Date(entry.timestamp) : null;
            const severity = entry.spike?.severity || 'none';
            return (
              <li
                key={entry._id}
                className={`p-4 rounded-xl border flex flex-wrap items-start justify-between gap-3 ${severityStyle(severity)}`}
              >
                <div>
                  <p className="font-headline font-bold uppercase text-sm tracking-wide">
                    {severity === 'none' ? 'Spike detected' : `${severity} impact`}
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    ΔG: {(entry.spike?.delta_g ?? 0).toFixed(2)} · Peak: {(entry.imu?.peak_g ?? 0).toFixed(2)} G
                  </p>
                  {entry.gps?.latitude != null && (
                    <p className="text-[10px] font-mono mt-2 opacity-70">
                      {entry.gps.latitude.toFixed(5)}, {entry.gps.longitude?.toFixed(5)}
                    </p>
                  )}
                </div>
                <time className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                  {ts ? ts.toLocaleString() : '—'}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
