import React, { useState, useEffect, useMemo } from 'react';
<<<<<<< HEAD
import { api } from '../utils/api';
import { useFleet } from '../context/FleetContext';
import DeviceSetupRequired from '../components/DeviceSetupRequired';

export default function History() {
  const { activeDeviceId, hasActiveDevice, loading: fleetLoading } = useFleet();
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasActiveDevice) {
      setHistoryData([]);
      setIsLoading(false);
      return;
    }
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/telemetry/history/${activeDeviceId}`);
        if (response?.ok) {
          const data = await response.json();
          setHistoryData([...data].reverse());
        } else {
          setHistoryData([]);
=======

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const deviceId = "VX-9902";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/telemetry/history/${deviceId}`);
        if (response.ok) {
          const data = await response.json();
          const reversedData = [...data].reverse();
          setHistoryData(reversedData);
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        }
      } catch (error) {
        console.error("Failed to fetch history data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
<<<<<<< HEAD
  }, [activeDeviceId, hasActiveDevice]);

  // Calculate REAL stats from the fetched data
  const peakGForce = useMemo(() => {
    if (historyData.length === 0) return 0;
    return Math.max(...historyData.map(log => log.imu.peak_g));
=======
  }, []);

  const peakGForce = useMemo(() => {
    if (historyData.length === 0) return 0;
    return Math.max(...historyData.map(log => Math.abs(log.imu.peak_g)));
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
  }, [historyData]);

  const avgVelocity = useMemo(() => {
    if (historyData.length === 0) return 0;
    const totalVelocity = historyData.reduce((sum, log) => sum + log.gps.velocity_kmh, 0);
    return totalVelocity / historyData.length;
  }, [historyData]);

<<<<<<< HEAD
  if (fleetLoading || isLoading) {
    return <div className="p-8 text-center text-primary animate-pulse">LOADING PERFORMANCE ARCHIVES...</div>;
  }

  if (!hasActiveDevice) {
    return <DeviceSetupRequired title="Select a vehicle in Admin" />;
=======
  const spikeCount = useMemo(() => {
    return historyData.filter(log => log.spike?.detected === true).length;
  }, [historyData]);

  if (isLoading) {
    return <div className="p-8 text-center text-primary animate-pulse">LOADING PERFORMANCE ARCHIVES...</div>;
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 w-full">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="space-y-1">
<<<<<<< HEAD
          <p className="font-label text-xs uppercase tracking-[0.2em] text-outline">
            Historical System Analytics
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">
            PERFORMANCE ARCHIVES
          </h2>
=======
          <p className="font-label text-xs uppercase tracking-[0.2em] text-outline">Historical System Analytics</p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">PERFORMANCE ARCHIVES</h2>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-high px-4 py-2 rounded-lg">
            <span className="text-xs text-outline">Total Records: </span>
            <span className="text-lg font-bold text-primary">{historyData.length}</span>
          </div>
<<<<<<< HEAD
=======
          <div className="bg-surface-container-high px-4 py-2 rounded-lg">
            <span className="text-xs text-outline">Sudden Spikes: </span>
            <span className="text-lg font-bold text-red-500">{spikeCount}</span>
          </div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<<<<<<< HEAD
        {/* REAL Average Velocity Card */}
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-4">
            Average Velocity
          </p>
=======
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-4">Average Velocity</p>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-5xl font-bold text-primary">{avgVelocity.toFixed(1)}</span>
            <span className="font-label text-sm text-outline">KM/H</span>
          </div>
        </div>

<<<<<<< HEAD
        {/* REAL Peak G-Force Card */}
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5 hover:border-secondary/30 transition-all">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-4">
            Peak G-Force (All-time)
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-5xl font-bold text-secondary">{peakGForce.toFixed(3)}</span>
            <span className="font-label text-sm text-outline">G</span>
          </div>
        </div>
        
        {/* Log Count Card */}
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-4">
            Total Logs Retrieved
          </p>
=======
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-4">Peak |G| (All-time)</p>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-5xl font-bold text-secondary">{peakGForce.toFixed(3)}</span>
            <span className="font-label text-sm text-outline">|G|</span>
          </div>
        </div>
        
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] text-outline uppercase mb-4">Total Logs Retrieved</p>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-5xl font-bold">{historyData.length}</span>
            <span className="font-label text-sm text-outline">entries</span>
          </div>
<<<<<<< HEAD
          <p className="text-xs text-outline mt-2">⬇Newest entries shown first</p>
        </div>
      </div>

      {/* Detailed Log Section - NEWEST ON TOP */}
=======
          <p className="text-xs text-outline mt-2">⬇ Newest entries shown first</p>
        </div>
      </div>

>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
      <div className="bg-surface-container rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="font-headline text-xl font-bold tracking-tight">RECENT TELEMETRY LOGS</h3>
<<<<<<< HEAD
            <p className="text-xs text-outline mt-1 uppercase tracking-widest">⬇Newest data at the top</p>
          </div>
          <div className="text-xs bg-primary/10 px-3 py-1 rounded-full text-primary">
            {historyData.length} records
          </div>
=======
            <p className="text-xs text-outline mt-1 uppercase tracking-widest">⚠️ SPIKE = Sudden change (ΔG ≥ 1.5G) | ✓ SMOOTH = Gradual change</p>
          </div>
          <div className="text-xs bg-primary/10 px-3 py-1 rounded-full text-primary">{historyData.length} records</div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-white/5 sticky top-0">
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">#</th>
<<<<<<< HEAD
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Timestamp (Newest First)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Peak G-Force</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Velocity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Location (Lat, Lng)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest text-center">GPS Fix</th>
=======
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">ΔG Change</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Peak G</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Velocity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">Location</th>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyData.length > 0 ? historyData.map((log, index) => {
                const logDate = new Date(log.timestamp);
<<<<<<< HEAD
                const isNewest = index === 0;
                const isCrash = log.imu.peak_g > 20;
                const isHeavy = log.imu.peak_g > 8;
                const isModerate = log.imu.peak_g > 3.4;
                
                return (
                  <tr 
                    key={log._id} 
                    className={`hover:bg-surface-bright transition-colors group cursor-pointer ${
                      isNewest ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-xs text-outline font-mono">
                      {index + 1}
                      {isNewest && <span className="ml-2 text-[8px] text-primary">NEWEST</span>}
=======
                const isSpike = log.spike?.detected || false;
                const deltaG = log.spike?.delta_g || 0;
                const severity = log.spike?.severity || 'none';
                
                let severityColor = 'text-gray-400';
                if (severity === 'critical') severityColor = 'text-red-500';
                else if (severity === 'severe') severityColor = 'text-orange-500';
                else if (severity === 'moderate') severityColor = 'text-yellow-500';
                else if (severity === 'minor') severityColor = 'text-purple-400';
                
                return (
                  <tr key={log._id} className={`hover:bg-surface-bright transition-colors ${isSpike ? 'bg-red-500/5' : ''}`}>
                    <td className="px-6 py-4 text-xs text-outline font-mono">
                      {index + 1}
                      {isSpike && <span className="ml-2 text-[8px] text-red-500">⚠️ SPIKE</span>}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
                    </td>
                    <td className="px-6 py-4 text-xs text-outline-variant font-mono">
                      <div className="font-bold">{logDate.toLocaleDateString()}</div>
                      <div className="text-primary">{logDate.toLocaleTimeString()}</div>
                    </td>
<<<<<<< HEAD
                    <td className={`px-6 py-4 text-sm font-bold font-mono ${
                      isCrash ? 'text-red-500 animate-pulse' :
                      isHeavy ? 'text-yellow-500' :
                      isModerate ? 'text-purple-400' : 'text-gray-400'
                    }`}>
                      {log.imu.peak_g.toFixed(3)} G
                      {isCrash && <span className="ml-2 text-[10px] text-red-500">SEVERITY</span>}
                      {!isCrash && isHeavy && <span className="ml-2 text-[10px] text-yellow-500">HEAVY</span>}
                      {!isCrash && !isHeavy && isModerate && <span className="ml-2 text-[10px] text-purple-400">MODERATE</span>}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">
                      {log.gps.velocity_kmh.toFixed(1)} KM/H
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-outline">
                      {log.gps.latitude.toFixed(6)}, {log.gps.longitude.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${
                        log.gps.fixed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.gps.fixed ? 'FIXED' : 'NO FIX'}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-outline">
                    No historical data found for device: {activeDeviceId}
                    <div className="text-xs mt-2">Make sure your hardware is sending telemetry data</div>
                  </td>
                </tr>
=======
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${isSpike ? severityColor : 'text-gray-400'}`}>
                        {isSpike ? severity.toUpperCase() : 'SMOOTH TRANSITION'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-mono ${isSpike ? severityColor : 'text-gray-400'}`}>
                      {isSpike ? `Δ${deltaG.toFixed(3)}G` : '—'}
                    </td>
                    <td className={`px-6 py-4 text-sm font-mono ${log.imu.peak_g > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {log.imu.peak_g > 0 ? '+' : ''}{log.imu.peak_g.toFixed(3)} G
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{log.gps.velocity_kmh.toFixed(1)} KM/H</td>
                    <td className="px-6 py-4 text-xs font-mono text-outline">{log.gps.latitude.toFixed(4)}, {log.gps.longitude.toFixed(4)}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" className="p-8 text-center text-outline">No historical data found for device: {deviceId}</td></tr>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
              )}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
        
        <div className="p-4 border-t border-white/5 bg-surface-container-low">
          <div className="text-center text-[10px] text-outline">
            Showing {historyData.length} records • Newest entries appear at the top
          </div>
        </div>
=======
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
      </div>
    </div>
  );
}