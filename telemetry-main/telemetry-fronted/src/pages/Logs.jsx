import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { api } from '../utils/api';
import { useFleet } from '../context/FleetContext';
import DeviceSetupRequired from '../components/DeviceSetupRequired';

export default function Logs() {
  const { activeDeviceId, hasActiveDevice, loading: fleetLoading } = useFleet();
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasActiveDevice) {
      setLogs([]);
      setSelectedLog(null);
      setIsLoading(false);
      return;
    }
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/telemetry/incidents/${activeDeviceId}`);
        if (response?.ok) {
          const data = await response.json();
          setLogs(data);
          setSelectedLog(data.length > 0 ? data[0] : null);
        } else {
          setLogs([]);
          setSelectedLog(null);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [activeDeviceId, hasActiveDevice]);

  // Helper function to get incident type text
  const getIncidentType = (gForce) => {
    if (gForce > 20) return { text: 'Severity', icon: 'warning', color: 'text-red-500' };
    if (gForce > 8) return { text: 'Heavy Impact', icon: 'report', color: 'text-yellow-500' };
    if (gForce > 3.4) return { text: 'Moderate Impact', icon: 'vibration', color: 'text-purple-400' };
    if (gForce > 1.2) return { text: 'Minor Bump', icon: 'error_outline', color: 'text-gray-400' };
    return { text: 'Nominal Reading', icon: 'check_circle', color: 'text-outline' };
  };

  if (fleetLoading || isLoading) {
    return <div className="p-8 text-center text-primary animate-pulse tracking-widest font-bold">LOADING INCIDENT ARCHIVE...</div>;
  }

  if (!hasActiveDevice) {
    return <DeviceSetupRequired title="Select a vehicle in Admin" />;
  }

  return (
    <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto overflow-hidden text-on-surface">
      <div className="p-8 pb-4 shrink-0">
        <h1 className="font-headline text-3xl font-black tracking-tighter uppercase">Incident Archive</h1>
        <p className="text-xs text-outline font-medium tracking-wide mt-1">
          Review of recent high-impact telemetry data points
        </p>
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low shrink-0">
            <h3 className="text-sm font-bold uppercase tracking-widest">Event Log</h3>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
              Showing {logs.length} Recent Events
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">Event Type</th>
                  <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">Magnitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {logs.length > 0 ? logs.map((log) => {
                  const incident = getIncidentType(log.imu.peak_g);
                  return (
                    <tr 
                      key={log._id} 
                      onClick={() => setSelectedLog(log)}
                      className={`cursor-pointer transition-colors ${selectedLog?._id === log._id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-primary/5 border-l-2 border-transparent'}`}
                    >
                      <td className="px-6 py-4 text-[11px] font-mono text-on-surface">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 ${incident.color}`}>
                          <span className="material-symbols-outlined text-lg">{incident.icon}</span>
                          <span className="text-xs font-bold">{incident.text}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-xs font-black ${incident.color}`}>
                        {log.imu.peak_g.toFixed(3)} G
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-outline">No log data found for this device.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Preview Panel */}
        {selectedLog && (
          <div className="w-full lg:w-96 shrink-0 bg-surface-container border border-outline-variant/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-outline-variant/10 flex items-center justify-between shrink-0">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest">Event Detail</h3>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${getIncidentType(selectedLog.imu.peak_g).color.replace('text-','bg-')}/30 ${getIncidentType(selectedLog.imu.peak_g).color}`}>
                {getIncidentType(selectedLog.imu.peak_g).text}
              </span>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-[9px] font-bold text-outline uppercase tracking-[0.2em] mb-2">Event Timestamp</p>
                  <h4 className="font-headline text-lg font-bold text-on-surface">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-3 rounded border border-outline-variant/5">
                    <p className="text-[8px] font-bold text-outline uppercase mb-1">Peak Force</p>
                    <p className={`text-lg font-headline font-bold ${getIncidentType(selectedLog.imu.peak_g).color}`}>
                      {selectedLog.imu.peak_g.toFixed(3)} G
                    </p>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded border border-outline-variant/5">
                    <p className="text-[8px] font-bold text-outline uppercase mb-1">Velocity</p>
                    <p className="text-lg font-headline font-bold text-on-surface">
                      {selectedLog.gps.velocity_kmh.toFixed(1)} KM/H
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase">Location</span>
                    <span className="text-[10px] font-mono text-on-surface">
                      {selectedLog.gps.latitude.toFixed(4)}, {selectedLog.gps.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase">Altitude</span>
                    <span className="text-[10px] font-bold text-on-surface">
                      {selectedLog.gps.altitude_m.toFixed(1)} M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase">Satellites</span>
                    <span className="text-[10px] font-bold text-on-surface">
                      {selectedLog.gps.satellites}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
=======

const SPIKE_SEVERITY = {
    critical: { label: 'Critical Spike', color: 'text-red-500',    bg: 'bg-red-500/15',    border: 'border-red-500/30',    icon: 'emergency', minDelta: 15.0 },
    severe:   { label: 'Severe Impact',  color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30', icon: 'warning',   minDelta: 7.0  },
    moderate: { label: 'Moderate Spike', color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', icon: 'report',    minDelta: 3.5  },
    minor:    { label: 'Minor Bump',     color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30', icon: 'vibration', minDelta: 1.5  },
    none:     { label: 'Nominal',        color: 'text-outline',    bg: 'bg-surface-container-high', border: 'border-transparent', icon: 'check_circle', minDelta: 0 },
};

function getSpikeSeverity(deltaG) {
    const abs = Math.abs(deltaG || 0);
    if (abs >= 15.0) return 'critical';
    if (abs >= 7.0)  return 'severe';
    if (abs >= 3.5)  return 'moderate';
    if (abs >= 1.5)  return 'minor';
    return 'none';
}

/**
 * Computes spike info for a log entry.
 * Priority:
 *  1. Server-saved spike data (new documents)
 *  2. Client-side delta computed from prevG passed in (when iterating sorted array)
 *  3. Fallback: treat high peak_g itself as the indicator for legacy data
 */
function computeIncidentInfo(log, prevG) {
    // 1. Server spike data
    if (log.spike?.detected === true && (log.spike?.delta_g || 0) > 0) {
        const sev = log.spike.severity || getSpikeSeverity(log.spike.delta_g);
        return { ...SPIKE_SEVERITY[sev] || SPIKE_SEVERITY.none, severity: sev, deltaG: log.spike.delta_g, prevG: log.spike.prev_g || prevG, currentG: log.imu?.peak_g || 0 };
    }

    // 2. Client-side delta from consecutive records
    if (prevG !== null && prevG !== undefined) {
        const deltaG   = Math.abs((log.imu?.peak_g || 0) - prevG);
        const severity = getSpikeSeverity(deltaG);
        if (severity !== 'none') {
            return { ...SPIKE_SEVERITY[severity], severity, deltaG, prevG, currentG: log.imu?.peak_g || 0 };
        }
    }

    // 3. Legacy fallback: use raw peak_g thresholds so old data still shows something
    const g = log.imu?.peak_g || 0;
    if (g > 20)  return { ...SPIKE_SEVERITY.critical, severity: 'critical', deltaG: g, prevG: 0, currentG: g, label: 'Critical (legacy)' };
    if (g > 8)   return { ...SPIKE_SEVERITY.severe,   severity: 'severe',   deltaG: g, prevG: 0, currentG: g, label: 'Severe (legacy)'   };
    if (g > 3.4) return { ...SPIKE_SEVERITY.moderate, severity: 'moderate', deltaG: g, prevG: 0, currentG: g, label: 'Moderate (legacy)' };
    if (g > 1.2) return { ...SPIKE_SEVERITY.minor,    severity: 'minor',    deltaG: g, prevG: 0, currentG: g, label: 'Minor (legacy)'    };

    return { ...SPIKE_SEVERITY.none, severity: 'none', deltaG: 0, prevG: 0, currentG: g };
}

export default function Logs() {
    const [logs, setLogs]               = useState([]);
    const [logsWithInfo, setLogsWithInfo] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedIdx, setSelectedIdx]  = useState(0);
    const [isLoading, setIsLoading]     = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'critical', 'severe', 'moderate', 'minor'
    const deviceId = "VX-9902";

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Try the spike-based endpoint first; fall back to history if empty
                let data = [];
                const incidentRes = await fetch(`http://localhost:5000/api/telemetry/incidents/${deviceId}`);
                if (incidentRes.ok) {
                    data = await incidentRes.json();
                }

                // If spike endpoint returns nothing (old data), fall back to history with a
                // minimum G threshold so we still get interesting records
                if (!data || data.length === 0) {
                    console.log("No spike data found — falling back to history endpoint");
                    const historyRes = await fetch(`http://localhost:5000/api/telemetry/history/${deviceId}?limit=100`);
                    if (historyRes.ok) {
                        const allData = await historyRes.json();
                        // Filter to only entries with peak_g > 1.2 for the logs view
                        data = allData.filter(entry => (entry.imu?.peak_g || 0) > 1.2);
                    }
                }

                if (data && data.length > 0) {
                    // Sort newest first for display
                    const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setLogs(sorted);

                    // Compute spike info for each log using consecutive G values
                    // Note: sorted newest-first, so "previous" in time = next in array
                    const enriched = sorted.map((log, i) => {
                        const prevLog  = sorted[i + 1]; // older entry (one step back in time)
                        const prevG    = prevLog ? (prevLog.imu?.peak_g || 0) : null;
                        const info     = computeIncidentInfo(log, prevG);
                        return { log, info };
                    });

                    setLogsWithInfo(enriched);
                    setFilteredLogs(enriched);
                    setSelectedIdx(0);
                }
            } catch (error) {
                console.error("Failed to fetch logs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [deviceId]);

    // Filter logs based on selected severity
    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredLogs(logsWithInfo);
        } else {
            const filtered = logsWithInfo.filter(item => item.info.severity === activeFilter);
            setFilteredLogs(filtered);
            // Reset selected index if out of bounds
            if (selectedIdx >= filtered.length) {
                setSelectedIdx(filtered.length > 0 ? 0 : -1);
            }
        }
    }, [activeFilter, logsWithInfo]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-primary animate-pulse tracking-widest font-bold">LOADING INCIDENT ARCHIVE...</div>;
    }

    const selected = filteredLogs[selectedIdx];

    // Count spikes by severity for filter badges
    const severityCounts = {
        all: logsWithInfo.length,
        critical: logsWithInfo.filter(item => item.info.severity === 'critical').length,
        severe: logsWithInfo.filter(item => item.info.severity === 'severe').length,
        moderate: logsWithInfo.filter(item => item.info.severity === 'moderate').length,
        minor: logsWithInfo.filter(item => item.info.severity === 'minor').length,
    };

    return (
        <div className="flex flex-col h-full w-full max-w-[1600px] mx-auto overflow-hidden text-on-surface">
            <div className="p-8 pb-4 shrink-0">
                <h1 className="font-headline text-3xl font-black tracking-tighter uppercase">Incident Archive</h1>
                <p className="text-xs text-outline font-medium tracking-wide mt-1">
                    Sudden G-force spikes detected from telemetry — smooth acceleration excluded
                </p>
            </div>

            {/* Filter Buttons */}
            <div className="px-8 pb-4">
                <div className="flex gap-2 flex-wrap border-b border-white/5 pb-3">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === 'all' 
                                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                : 'bg-surface-container text-outline hover:bg-surface-container-high'
                        }`}
                    >
                        ALL SPIKES
                        <span className="ml-2 text-[10px] opacity-75">({severityCounts.all})</span>
                    </button>
                    <button
                        onClick={() => handleFilterChange('critical')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === 'critical' 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        }`}
                    >
                        🔴 CRITICAL
                        <span className="ml-2 text-[10px] opacity-75">({severityCounts.critical})</span>
                    </button>
                    <button
                        onClick={() => handleFilterChange('severe')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === 'severe' 
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20'
                        }`}
                    >
                        🟠 SEVERE
                        <span className="ml-2 text-[10px] opacity-75">({severityCounts.severe})</span>
                    </button>
                    <button
                        onClick={() => handleFilterChange('moderate')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === 'moderate' 
                                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' 
                                : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20'
                        }`}
                    >
                        🟡 MODERATE
                        <span className="ml-2 text-[10px] opacity-75">({severityCounts.moderate})</span>
                    </button>
                    <button
                        onClick={() => handleFilterChange('minor')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === 'minor' 
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                                : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20'
                        }`}
                    >
                        🟣 MINOR
                        <span className="ml-2 text-[10px] opacity-75">({severityCounts.minor})</span>
                    </button>
                </div>
                
                {/* Active filter indicator */}
                {activeFilter !== 'all' && (
                    <div className="mt-2 text-xs text-outline flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">filter_alt</span>
                        Showing only {activeFilter.toUpperCase()} spikes
                        <button 
                            onClick={() => handleFilterChange('all')}
                            className="text-primary hover:underline text-[10px]"
                        >
                            Clear filter
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 px-8 pb-8 flex flex-col lg:flex-row gap-6 overflow-hidden">

                {/* ── Event Log Table ─────────────────────────────────────── */}
                <div className="flex-1 bg-surface-container-lowest border border-outline-variant/10 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low shrink-0">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Spike Event Log</h3>
                        <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                            {filteredLogs.length} Events {activeFilter !== 'all' && `(${activeFilter})`}
                        </span>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {filteredLogs.length === 0 ? (
                            <div className="p-12 text-center text-outline">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">filter_alt_off</span>
                                <p>No {activeFilter !== 'all' ? activeFilter : ''} spikes found</p>
                                {activeFilter !== 'all' && (
                                    <button 
                                        onClick={() => handleFilterChange('all')}
                                        className="mt-3 text-xs text-primary hover:underline"
                                    >
                                        Show all spikes
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant/10">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">Timestamp</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">Spike Type</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">ΔG Change</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-[0.2em]">Peak G</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    {filteredLogs.map(({ log, info }, idx) => {
                                        const isSelected = selectedIdx === idx;
                                        return (
                                            <tr
                                                key={log._id}
                                                onClick={() => setSelectedIdx(idx)}
                                                className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-primary/5 border-l-2 border-transparent'}`}
                                            >
                                                <td className="px-6 py-4 text-[11px] font-mono text-on-surface">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`flex items-center gap-2 ${info.color}`}>
                                                        <span className="material-symbols-outlined text-lg">{info.icon}</span>
                                                        <span className="text-xs font-bold">{info.label}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 text-xs font-mono ${info.color}`}>
                                                    <div className="flex items-center gap-1 text-[10px]">
                                                        <span className="text-outline">{(info.prevG || 0).toFixed(2)}g</span>
                                                        <span className="text-outline">→</span>
                                                        <span className="font-bold">{(info.currentG || 0).toFixed(2)}g</span>
                                                    </div>
                                                    <div className={`text-[10px] font-black mt-0.5 ${info.color}`}>Δ{(info.deltaG || 0).toFixed(3)}g</div>
                                                </td>
                                                <td className={`px-6 py-4 text-xs font-black ${info.color}`}>
                                                    {log.imu.peak_g.toFixed(3)} G
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* ── Detail Panel ─────────────────────────────────────────── */}
                {selected && (() => {
                    const { log, info } = selected;
                    return (
                        <div className={`w-full lg:w-96 shrink-0 bg-surface-container border ${info.border} rounded-xl flex flex-col overflow-hidden shadow-2xl`}>
                            <div className={`p-5 border-b ${info.border} flex items-center justify-between shrink-0 ${info.bg}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined ${info.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{info.icon}</span>
                                    <h3 className="font-headline font-bold text-sm uppercase tracking-widest">Spike Detail</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${info.color} ${info.bg} border ${info.border}`}>
                                    {info.label}
                                </span>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <div className="p-6 space-y-6">
                                    <div>
                                        <p className="text-[9px] font-bold text-outline uppercase tracking-[0.2em] mb-2">Event Timestamp</p>
                                        <h4 className="font-headline text-lg font-bold text-on-surface">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </h4>
                                    </div>

                                    {/* Spike change visualization */}
                                    <div className={`p-4 rounded-xl border ${info.border} ${info.bg}`}>
                                        <p className="text-[9px] font-bold text-outline uppercase tracking-[0.2em] mb-3">Sudden G-Force Change</p>
                                        <div className="flex items-center gap-3">
                                            <div className="text-center">
                                                <p className="text-[9px] text-outline uppercase mb-1">Before</p>
                                                <p className="text-xl font-headline font-bold font-mono text-on-surface">{(info.prevG || 0).toFixed(3)}g</p>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center gap-1">
                                                <div className={`text-xs font-black font-mono ${info.color}`}>Δ{(info.deltaG || 0).toFixed(3)}g</div>
                                                <div className="w-full flex items-center">
                                                    <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${info.color.includes('red') ? '#ef4444' : info.color.includes('orange') ? '#f97316' : info.color.includes('yellow') ? '#eab308' : '#a855f7'})` }}></div>
                                                    <span className="text-[10px] mx-1">→</span>
                                                </div>
                                                <div className={`text-[9px] font-bold uppercase ${info.color}`}>{info.label}</div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] text-outline uppercase mb-1">After</p>
                                                <p className={`text-xl font-headline font-bold font-mono ${info.color}`}>{(info.currentG || 0).toFixed(3)}g</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-surface-container-low p-3 rounded border border-outline-variant/5">
                                            <p className="text-[8px] font-bold text-outline uppercase mb-1">Peak Force</p>
                                            <p className={`text-lg font-headline font-bold ${info.color}`}>{log.imu.peak_g.toFixed(3)} G</p>
                                        </div>
                                        <div className="bg-surface-container-low p-3 rounded border border-outline-variant/5">
                                            <p className="text-[8px] font-bold text-outline uppercase mb-1">Velocity</p>
                                            <p className="text-lg font-headline font-bold text-on-surface">{log.gps.velocity_kmh.toFixed(1)} KM/H</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-outline uppercase">Location</span>
                                            <span className="text-[10px] font-mono text-on-surface">{log.gps.latitude.toFixed(4)}, {log.gps.longitude.toFixed(4)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-outline uppercase">Altitude</span>
                                            <span className="text-[10px] font-bold text-on-surface">{log.gps.altitude_m.toFixed(1)} M</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-outline uppercase">Satellites</span>
                                            <span className="text-[10px] font-bold text-on-surface">{log.gps.satellites}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
