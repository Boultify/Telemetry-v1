<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useFleet } from '../context/FleetContext';

export default function Admin() {
  const { selectedDeviceId, setSelectedDeviceId } = useFleet();
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [telemetryDeviceIds, setTelemetryDeviceIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const emptyStats = (rosterCount = 0) => ({
    deviceId: null,
    totalVehicles: rosterCount,
    minorBumps: 0,
    moderateImpacts: 0,
    heavyImpacts: 0,
    severityEvents: 0,
    totalTelemetryRecords: 0,
  });

  const fetchAdminData = useCallback(async (deviceId) => {
    setIsLoading(true);
    setError('');
    try {
      const [vehiclesRes, devicesRes] = await Promise.all([
        api.get('/api/admin/vehicles'),
        api.get('/api/telemetry/devices'),
      ]);

      if (!vehiclesRes?.ok) {
        throw new Error('Failed to load admin data. Make sure you are logged in and the backend is running.');
      }

      const vehiclesData = await vehiclesRes.json();
      setVehicles(vehiclesData);
      setTelemetryDeviceIds(devicesRes?.ok ? await devicesRes.json() : []);

      if (!deviceId) {
        setStats(emptyStats(vehiclesData.length));
        setIncidents([]);
        return;
      }

      const q = `?deviceId=${encodeURIComponent(deviceId)}`;
      const [statsRes, incidentsRes] = await Promise.all([
        api.get(`/api/admin/stats${q}`),
        api.get(`/api/admin/incidents${q}`),
      ]);

      if (!statsRes?.ok || !incidentsRes?.ok) {
        throw new Error('Failed to load stats for selected vehicle.');
      }

      setStats(await statsRes.json());
      setIncidents(await incidentsRes.json());
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData(selectedDeviceId);
  }, [selectedDeviceId, fetchAdminData]);

  const getIncidentType = (gForce) => {
    if (gForce > 20) return { text: 'Severity', color: 'bg-red-500/20 text-red-500', icon: 'emergency' };
    if (gForce > 8) return { text: 'Heavy Impact', color: 'bg-yellow-500/20 text-yellow-500', icon: 'report' };
    if (gForce > 3.4) return { text: 'Moderate Impact', color: 'bg-purple-400/20 text-purple-400', icon: 'vibration' };
    if (gForce > 1.2) return { text: 'Minor Bump', color: 'bg-gray-400/20 text-gray-400', icon: 'minor_crash' };
    return { text: 'Nominal Event', color: 'bg-surface-container-high', icon: 'speed' };
  };

  if (isLoading && !stats) {
    return (
      <div className="p-8 text-center text-primary animate-pulse font-bold tracking-widest">
        LOADING GLOBAL FLEET DATA...
=======
// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LiveChart = ({ data, isLive }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E2023] border border-white/10 rounded-lg p-3 shadow-2xl">
          <div className="text-[#9ECAFF] font-bold text-xs">{payload[0]?.value?.toFixed(1) || 0} KM/H</div>
          <div className="text-[#FFDF9E] text-[10px] mt-1">{payload[1]?.value?.toFixed(3) || 0} G</div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-container rounded-2xl border border-white/5 p-8 mt-6">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-headline text-2xl font-bold text-on-surface">
            VELOCITY & G-FORCE
          </h3>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-xs font-bold text-yellow-400">WAITING FOR DATA</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-[400px] text-slate-500">
          <p>No telemetry data available. Waiting for hardware connection...</p>
        </div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <header className="mb-8 border-l-2 border-primary pl-6">
        <h1 className="text-3xl font-bold headline-font tracking-tight uppercase">GLOBAL FLEET OVERVIEW</h1>
        <p className="text-outline uppercase text-xs tracking-[0.2em] mt-1 font-label">
          Real-time Telemetry &amp; Asset Surveillance
          {selectedDeviceId ? ` — viewing ${selectedDeviceId}` : ' — select a vehicle to view telemetry'}
        </p>
      </header>

      {error && (
        <div className="mb-6 p-3 rounded-lg border border-red-500 bg-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {selectedDeviceId && stats?.totalTelemetryRecords === 0 && telemetryDeviceIds.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border border-secondary/50 bg-secondary/10 text-sm">
          <p className="font-bold text-secondary">
            No telemetry in MongoDB for &quot;{selectedDeviceId}&quot;
          </p>
          <p className="text-on-surface-variant mt-2">
            Profile IDs (VX-9002, VX-9901) are not the same as telemetry IDs unless they match exactly.
            Your hardware data is stored under:{' '}
            <span className="font-mono font-bold text-primary">{telemetryDeviceIds.join(', ')}</span>.
            Click that ID below to load your old data.
          </p>
        </div>
      )}

      {telemetryDeviceIds.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border border-primary/30 bg-primary/5 text-sm text-on-surface-variant">
          <span className="font-bold text-primary">Device IDs with telemetry in MongoDB — click to load data: </span>
          <span className="flex flex-wrap gap-2 mt-2">
            {telemetryDeviceIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedDeviceId(selectedDeviceId === id ? null : id)}
                className={`px-3 py-1 rounded font-mono text-xs border transition-colors ${
                  selectedDeviceId === id
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
                }`}
              >
                {id}
              </button>
            ))}
          </span>
          <span className="block text-xs text-outline mt-2">
            Selection applies to Dashboard, Logs, Safety, and this Admin view.
          </span>
        </div>
      )}

      {!selectedDeviceId && (
        <div className="mb-6 p-4 rounded-lg border border-outline-variant/30 bg-surface-container text-sm text-outline text-center">
          No vehicle selected — telemetry stats and alerts show 0. Select a Device ID or fleet row below.
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container p-6 rounded-lg">
            <label className="text-[10px] uppercase tracking-[0.2em] text-outline font-label block mb-4">
              {selectedDeviceId ? 'Selected vehicle' : 'Roster size'}
            </label>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold headline-font text-primary tracking-tighter">
                {stats?.totalVehicles ?? 0}
              </span>
              <span className="text-xs text-outline mb-2">REGISTERED</span>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-lg">
            <label className="text-[10px] uppercase tracking-[0.2em] text-outline font-label block mb-2">
              Telemetry records
            </label>
            <span className="text-3xl font-bold headline-font text-secondary">
              {stats?.totalTelemetryRecords ?? 0}
            </span>
          </div>
          <div className="bg-surface-container p-6 rounded-lg">
            <label className="text-[10px] uppercase tracking-[0.2em] text-outline font-label block mb-4">
              Incident Summary
            </label>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Minor Bump &gt; 1.2g</span>
                <span className="text-lg font-bold headline-font text-outline">{stats?.minorBumps ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Moderate Impact &gt; 3.4g</span>
                <span className="text-lg font-bold headline-font text-primary">{stats?.moderateImpacts ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Heavy Impact &gt; 8g</span>
                <span className="text-lg font-bold headline-font text-secondary">{stats?.heavyImpacts ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Severity &gt; 20g</span>
                <span className="text-lg font-bold headline-font text-error">{stats?.severityEvents ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-lg overflow-hidden min-h-[350px] flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center gap-4 flex-wrap">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-outline font-label block mb-1">
                VEHICLE ROSTER
              </label>
              <h2 className="text-xl font-bold headline-font">REGISTERED FLEET ASSETS</h2>
              <p className="text-xs text-outline mt-1">Click a row to view that vehicle&apos;s stats</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDeviceId(null)}
              disabled={!selectedDeviceId}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border border-outline-variant/30 text-outline hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear selection
            </button>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-high">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Asset ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Driver</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Records</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Emergency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => {
                    const isSelected = selectedDeviceId === vehicle.deviceId;
                    const hasTelemetry = (vehicle.telemetryCount ?? 0) > 0;
                    return (
                      <tr
                        key={vehicle._id || vehicle.deviceId}
                        onClick={() =>
                          setSelectedDeviceId(
                            selectedDeviceId === vehicle.deviceId ? null : vehicle.deviceId
                          )
                        }
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary/15' : 'hover:bg-surface-bright'
                        }`}
                      >
                        <td className="px-6 py-4 text-xs headline-font font-bold text-primary">
                          {vehicle.deviceId}
                          {hasTelemetry ? (
                            <span className="ml-2 text-[9px] text-green-400 font-label uppercase">has data</span>
                          ) : (
                            <span className="ml-2 text-[9px] text-outline font-label uppercase">no data</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface">{vehicle.driverName || '—'}</td>
                        <td className="px-6 py-4 text-xs text-outline">{vehicle.telemetryCount ?? 0}</td>
                        <td className="px-6 py-4 text-xs font-mono text-outline">{vehicle.emergencyNumber || '—'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-outline">
                      No vehicles with a Device ID yet. Save a profile with a Device ID on the Profile page.
                      {telemetryDeviceIds.length > 0 && (
                        <span className="block mt-2 text-primary">
                          Telemetry exists for: {telemetryDeviceIds.join(', ')} — use one of these IDs in Profile.
                        </span>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 bg-surface-container rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-outline-variant/10">
            <h2 className="text-xl font-bold headline-font">
              {selectedDeviceId
                ? `RECENT HIGH-G ALERTS — ${selectedDeviceId}`
                : 'RECENT HIGH-G ALERTS > 1.2g (ALL FLEET)'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest">
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Timestamp</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Asset ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Event Type</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Magnitude</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-outline uppercase tracking-widest font-label">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {incidents.length > 0 ? (
                  incidents.map((incident) => {
                    const eventType = getIncidentType(incident.imu?.peak_g ?? 0);
                    return (
                      <tr key={incident._id} className="hover:bg-surface-bright transition-colors group">
                        <td className="px-6 py-4 text-xs font-medium tabular-nums text-on-surface-variant">
                          {new Date(incident.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-xs headline-font font-bold text-primary">{incident.deviceId}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">{eventType.icon}</span>
                            <span className="text-xs font-semibold">{eventType.text}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${eventType.color}`}>
                            {(incident.imu?.peak_g ?? 0).toFixed(3)}G
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant font-mono">
                          {incident.gps?.latitude != null && incident.gps?.longitude != null
                            ? `${incident.gps.latitude.toFixed(4)}°, ${incident.gps.longitude.toFixed(4)}°`
                            : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-outline">
                      No high-G incidents for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
    <div className="bg-surface-container rounded-2xl border border-white/5 p-8 mt-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline text-2xl font-bold text-on-surface">
          VELOCITY & G-FORCE (LAST {data.length} POINTS)
        </h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isLive ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
          <span className={`text-xs font-bold ${isLive ? 'text-green-400' : 'text-yellow-400'}`}>
            {isLive ? 'LIVE' : 'CACHED'}
          </span>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#282A2D" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#434652', fontSize: 11 }} />
            <YAxis yAxisId="left" hide={true} domain={[0, 'dataMax + 20']} />
            <YAxis yAxisId="right" orientation="right" hide={true} domain={[0, 'dataMax + 1']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(158, 202, 255, 0.2)', strokeWidth: 1 }} />
            <Line yAxisId="left" type="monotone" dataKey="velocity" stroke="#9ECAFF" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="gForce" stroke="#FFDF9E" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {!isLive && data.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-yellow-400 text-sm">
            ⚠️ No new data received. Showing last {data.length} cached points.
          </p>
        </div>
      )}
    </div>
  );
};

export default function Admin() {
  const [telemetry, setTelemetry] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [latency, setLatency] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [incidents, setIncidents] = useState([]);
  
  const lastTimestampRef = useRef(null);
  const deviceId = "VX-9902";

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/vehicles');
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/incidents');
        if (response.ok) {
          const data = await response.json();
          setIncidents(data);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchStats();
    fetchVehicles();
    fetchIncidents();
    
    const statsInterval = setInterval(fetchStats, 10000);
    const vehiclesInterval = setInterval(fetchVehicles, 30000);
    const incidentsInterval = setInterval(fetchIncidents, 15000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(vehiclesInterval);
      clearInterval(incidentsInterval);
    };
  }, []);

  // Fetch telemetry
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/telemetry/latest/${deviceId}`);
        if (response.ok) {
          const data = await response.json();
          
          if (isWaiting) {
            setIsWaiting(false);
          }
          
          const isNewData = !lastTimestampRef.current || 
                           new Date(data.timestamp).getTime() > new Date(lastTimestampRef.current).getTime();

          if (isNewData) {
            setTelemetry(data);
            setIsLive(true);
            setLastUpdateTime(new Date());
            lastTimestampRef.current = data.timestamp;

            const receivedTime = new Date().getTime();
            const sentTime = new Date(data.timestamp).getTime();
            setLatency(receivedTime - sentTime);

            const newPoint = {
              time: new Date(data.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              }),
              velocity: data.gps?.velocity_kmh || 0,
              gForce: data.imu?.peak_g || 0,
              timestamp: data.timestamp
            };

            setChartData(prevData => {
              const updated = [...prevData, newPoint].slice(-50);
              return updated;
            });
          } else {
            setIsLive(false);
            
            if (lastTimestampRef.current) {
              const staleness = new Date().getTime() - new Date(lastTimestampRef.current).getTime();
              setLatency(staleness);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching telemetry:", error);
        setIsLive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWaiting, deviceId]);

  if (isWaiting) {
    return (
      <div className="text-white p-8 text-center">
        <div className="animate-pulse mb-4">
          <div className="inline-block w-16 h-16 border-4 border-[#9ecaff] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xl">Loading Admin Dashboard...</p>
        <p className="text-sm text-slate-500 mt-2">Waiting for hardware connection</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full text-white">
      <h1 className="text-3xl font-black uppercase mb-8">Admin Panel: {deviceId}</h1>
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e2023] p-6 rounded-xl border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Total Vehicles</p>
          <p className="text-4xl font-bold text-[#9ecaff]">{stats?.totalVehicles || 0}</p>
        </div>
        <div className="bg-[#1e2023] p-6 rounded-xl border border-yellow-500/30">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Moderate Impacts</p>
          <p className="text-4xl font-bold text-yellow-400">{stats?.moderateImpacts || 0}</p>
        </div>
        <div className="bg-[#1e2023] p-6 rounded-xl border border-red-500/30">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Severe Crashes</p>
          <p className="text-4xl font-bold text-red-400">{stats?.severeImpacts || 0}</p>
        </div>
      </div>

      {/* STATUS BADGES */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className={`px-4 py-2 rounded font-bold text-xs ${
          telemetry?.gps?.fixed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          GPS: {telemetry?.gps?.fixed ? 'FIXED' : 'SEARCHING'}
        </div>
        
        <div className="px-4 py-2 bg-[#1e2023] rounded font-bold text-xs text-[#9ecaff]">
          SATELLITES: {telemetry?.gps?.satellites || 0}
        </div>
        
        <div className={`px-4 py-2 rounded font-bold text-xs border ${
          isLive 
            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
            : latency > 10000 
              ? 'bg-red-500/20 text-red-400 border-red-500/30' 
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        }`}>
          STATUS: {isLive ? 'LIVE' : latency > 10000 ? 'OFFLINE' : 'CACHED'}
        </div>
        
        <div className="px-4 py-2 bg-[#1e2023] rounded font-bold text-xs text-[#FFDF9E] border border-[#FFDF9E]/30">
          {isLive ? `LATENCY: ${latency} ms` : `STALE: ${Math.floor(latency / 1000)}s ago`}
        </div>

        {lastUpdateTime && (
          <div className="px-4 py-2 bg-[#1e2023] rounded font-bold text-xs text-slate-500">
            LAST UPDATE: {lastUpdateTime.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* DETAILED TELEMETRY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-xl border ${
          telemetry?.imu?.peak_g > 7.0 
            ? 'bg-red-500/20 border-red-500' 
            : 'bg-[#1e2023] border-white/5'
        }`}>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Peak G-Force</p>
          <p className={`text-4xl font-bold ${
            telemetry?.imu?.peak_g > 7.0 ? 'text-red-500 animate-pulse' : 'text-white'
          }`}>
            {telemetry?.imu?.peak_g?.toFixed(3) || '0.000'} <span className="text-sm">g</span>
          </p>
          {telemetry?.imu?.peak_g > 7.0 && (
            <p className="text-xs text-red-500 font-bold mt-2">⚠️ SEVERE CRASH</p>
          )}
        </div>

        <div className="bg-[#1e2023] p-6 rounded-xl border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Velocity</p>
          <p className="text-4xl font-bold text-[#9ecaff]">
            {telemetry?.gps?.velocity_kmh?.toFixed(1) || '0.0'} <span className="text-sm text-slate-500">km/h</span>
          </p>
        </div>

        <div className="bg-[#1e2023] p-6 rounded-xl border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Altitude</p>
          <p className="text-4xl font-bold text-[#FFDF9E]">
            {telemetry?.gps?.altitude_m?.toFixed(0) || '0'} <span className="text-sm text-slate-500">m</span>
          </p>
        </div>

        <div className="bg-[#1e2023] p-6 rounded-xl border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Satellites</p>
          <p className="text-4xl font-bold text-white">
            {telemetry?.gps?.satellites || 0}
          </p>
        </div>
        
        <div className="bg-[#1e2023] p-6 rounded-xl border border-white/5 col-span-full">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Accel (X / Y / Z)</p>
          <p className="text-2xl font-mono text-[#FFDF9E]">
            {telemetry?.imu?.accel_x?.toFixed(3) || '0.000'} / {' '}
            {telemetry?.imu?.accel_y?.toFixed(3) || '0.000'} / {' '}
            {telemetry?.imu?.accel_z?.toFixed(3) || '0.000'}
          </p>
        </div>
        
        <div className="bg-[#1e2023] p-6 rounded-xl border border-white/5 col-span-full">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Live Coordinates</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xl font-mono">
              {telemetry?.gps?.latitude?.toFixed(6) || '0.000000'}, {telemetry?.gps?.longitude?.toFixed(6) || '0.000000'}
            </span>
            {telemetry?.gps?.latitude !== 0 && telemetry?.gps?.longitude !== 0 && (
              <a 
                href={`https://www.google.com/maps?q=${telemetry.gps.latitude},${telemetry.gps.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 rounded-lg text-slate-500 hover:text-[#9ecaff] hover:bg-[#282a2d] transition-colors border border-white/10"
              >
                <span className="material-symbols-outlined text-sm mr-1">open_in_new</span>
                Open in Maps
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* CHART */}
      <LiveChart data={chartData} isLive={isLive} />

      {/* FLEET VEHICLES SECTION */}
      {vehicles.length > 0 && (
        <div className="mt-8 bg-[#1e2023] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold uppercase tracking-widest">Registered Fleet Vehicles</h3>
            <p className="text-xs text-slate-500 mt-1">All vehicles with active telemetry profiles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#282a2d]">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Driver Name</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Emergency Contact</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.map((vehicle, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-sm font-mono text-[#9ecaff]">{vehicle.deviceId}</td>
                    <td className="px-6 py-4 text-sm">{vehicle.driverName || '—'}</td>
                    <td className="px-6 py-4 text-sm">{vehicle.email || '—'}</td>
                    <td className="px-6 py-4 text-sm font-mono">{vehicle.emergencyNumber || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${vehicle.hasCrashed ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {vehicle.hasCrashed ? 'CRASH DETECTED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECENT INCIDENTS SECTION */}
      {incidents.length > 0 && (
        <div className="mt-8 bg-[#1e2023] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold uppercase tracking-widest">Recent Fleet Incidents</h3>
            <p className="text-xs text-slate-500 mt-1">Last 50 detected spikes across all vehicles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#282a2d]">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Delta G</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Peak G</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider">Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {incidents.slice(0, 20).map((incident, idx) => {
                  const severityColor = incident.spike?.severity === 'severe' ? 'text-red-400' : 'text-yellow-400';
                  return (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {new Date(incident.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-[#9ecaff]">{incident.deviceId}</td>
                      <td className={`px-6 py-4 text-sm font-bold uppercase ${severityColor}`}>
                        {incident.spike?.severity || 'unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">{incident.spike?.delta_g?.toFixed(3) || '0'}g</td>
                      <td className="px-6 py-4 text-sm font-mono">{incident.imu?.peak_g?.toFixed(3) || '0'}g</td>
                      <td className="px-6 py-4 text-sm font-mono">{incident.gps?.velocity_kmh?.toFixed(1) || '0'} km/h</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
