// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../utils/api';
import { useFleet } from '../context/FleetContext';
import DeviceSetupRequired from '../components/DeviceSetupRequired';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to update map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const LiveChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const velocityItem = payload.find(item => item.dataKey === 'velocity');
      const gForceItem = payload.find(item => item.dataKey === 'gForce');
      
      return (
        <div className="bg-[#1E2023] border border-white/10 rounded-lg p-3 shadow-2xl">
          <div className="text-[#9ECAFF] font-bold text-xs">
            {velocityItem?.value ? velocityItem.value.toFixed(1) : '0'} KM/H
          </div>
          <div className="text-[#FFDF9E] text-[10px] mt-1">
            {gForceItem?.value ? gForceItem.value.toFixed(3) : '0'} G
          </div>
          <div className="text-gray-500 text-[8px] mt-2">
            ⏱{label}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface-container rounded-2xl border border-white/5 p-8 mt-6">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-8">LIVE VELOCITY & G-FORCE (LAST 30 SEC)</h3>
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available. Waiting for telemetry...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container rounded-2xl border border-white/5 p-8 mt-6">
      <h3 className="font-headline text-2xl font-bold text-on-surface mb-8">LIVE VELOCITY & G-FORCE (LAST 30 SEC)</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#282A2D" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#434652', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="left" hide={true} domain={[0, 'dataMax + 20']} />
            <YAxis yAxisId="right" orientation="right" hide={true} domain={[0, 'dataMax + 1']} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(158, 202, 255, 0.2)', strokeWidth: 1 }}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="velocity" 
              stroke="#9ECAFF" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, fill: '#9ECAFF', stroke: '#fff', strokeWidth: 2 }} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="gForce" 
              stroke="#FFDF9E" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              activeDot={{ r: 4, fill: '#FFDF9E', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ONLY ONE Dashboard component - keep this one
export default function Dashboard() {
  const { activeDeviceId, hasActiveDevice, existsInTelemetry, loading: fleetLoading, isAdmin } = useFleet();
  const [telemetry, setTelemetry] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [latency, setLatency] = useState(0);
  const [dataReady, setDataReady] = useState(false);

  const format12HourTime = (date) => {
    if (!date) return 'Invalid Date';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    });
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const response = await api.get(`/api/telemetry/history/${activeDeviceId}?limit=30`);
      
      if (response && response.ok) {
        const data = await response.json();
        console.log("Historical Data Retrieved:", data.length, "entries");
        
        if (data && data.length > 0) {
          const historicalPoints = data.map((entry) => {
            let timestamp;
            if (entry.timestampISO) {
              timestamp = new Date(entry.timestampISO);
            } else if (entry.timestamp) {
              timestamp = new Date(entry.timestamp);
            } else {
              timestamp = new Date();
            }
            
            const velocity = entry.gps?.velocity_kmh || 0;
            const gForce = entry.imu?.peak_g || 0;
            
            return {
              time: format12HourTime(timestamp),
              velocity: velocity,
              gForce: gForce,
              fullTimestamp: timestamp.getTime()
            };
          });
          
          setChartData(historicalPoints);
          
          setTelemetry(data[data.length - 1]);
        } else {
          setChartData([]);
        }
      } else if (response?.status === 404) {
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  // Fetch latest telemetry
  const fetchLatestTelemetry = async () => {
    try {
      const response = await api.get(`/api/telemetry/latest/${activeDeviceId}`);
      
      if (response && response.ok) {
        const data = await response.json();
        
        let serverTime;
        if (data.timestampISO) {
          serverTime = new Date(data.timestampISO).getTime();
        } else if (data.timestamp) {
          serverTime = new Date(data.timestamp).getTime();
        } else {
          serverTime = Date.now();
        }
        
        const currentTime = new Date().getTime();
        const currentLatency = currentTime - serverTime;
        setLatency(currentLatency);

        setTelemetry(data);

        if (data && data.gps && data.imu) {
          let timestamp;
          if (data.timestampISO) {
            timestamp = new Date(data.timestampISO);
          } else if (data.timestamp) {
            timestamp = new Date(data.timestamp);
          } else {
            timestamp = new Date();
          }
          
          if (isNaN(timestamp.getTime())) {
            console.error("Invalid timestamp");
            return;
          }
          
          const newPoint = {
            time: format12HourTime(timestamp),
            velocity: data.gps.velocity_kmh || 0,
            gForce: data.imu.peak_g || 0,
            fullTimestamp: timestamp.getTime()
          };

          setChartData(prevData => {
            const isDuplicate = prevData.some(point => 
              point.fullTimestamp === newPoint.fullTimestamp
            );
            
            if (isDuplicate) {
              return prevData;
            }
            
            const updated = [...prevData, newPoint];
            return updated.slice(-30);
          });
        }
      }
    } catch (error) { 
      console.error("Fetch Exception:", error);
    }
  };

  useEffect(() => {
    if (!hasActiveDevice) {
      setTelemetry(null);
      setChartData([]);
      setDataReady(true);
      return;
    }
    setDataReady(false);
    let interval;
    const load = async () => {
      await fetchHistoricalData();
      await fetchLatestTelemetry();
      setDataReady(true);
      interval = setInterval(fetchLatestTelemetry, 1000);
    };
    load();
    return () => { if (interval) clearInterval(interval); };
  }, [activeDeviceId, hasActiveDevice]);

  if (fleetLoading || !dataReady) {
    return <div className="text-white p-8 text-center animate-pulse">Loading...</div>;
  }

  if (!hasActiveDevice) {
    return (
      <DeviceSetupRequired
        title={isAdmin ? 'Select a vehicle in Admin' : 'Set your Device ID on Profile'}
      />
    );
  }

  if (!existsInTelemetry) {
    return (
      <DeviceSetupRequired title="Device ID not found in MongoDB telemetries" />
    );
  }

  if (!telemetry) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto w-full text-white space-y-6">
        <h1 className="text-3xl font-black uppercase">Live Telemetry: {activeDeviceId}</h1>
        <div className="p-8 rounded-xl border border-white/10 bg-surface-container text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-outline">sensors_off</span>
          <p className="text-lg font-bold">No telemetry records for this device ID</p>
          <p className="text-sm text-outline">Showing 0 data. In Admin, click VX-9902 to view existing MongoDB telemetry.</p>
        </div>
        <LiveChart data={[]} />
      </div>
    );
  }

  const currentLocalTime = new Date().toLocaleString();
  
  let dataTimestamp = 'N/A';
  if (telemetry.timestampISO) {
    dataTimestamp = new Date(telemetry.timestampISO).toLocaleString();
  } else if (telemetry.timestamp) {
    dataTimestamp = new Date(telemetry.timestamp).toLocaleString();
  }

  const isCrashed = (telemetry.imu?.peak_g || 0) > 3.4;

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full text-white">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-black uppercase">Live Telemetry: {activeDeviceId}</h1>
        <div className="text-sm text-outline bg-surface-container px-3 py-1 rounded">
          🖥️ {currentLocalTime}
        </div>
      </div>
      
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className={`px-4 py-2 rounded font-bold text-xs ${telemetry.gps?.fixed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          GPS: {telemetry.gps?.fixed ? 'FIXED' : 'SEARCHING'}
        </div>
        <div className="px-4 py-2 bg-surface-container-high rounded font-bold text-xs text-primary">
          SATELLITES: {telemetry.gps?.satellites || 0}
        </div>
        <div className="px-4 py-2 bg-surface-container-high rounded font-bold text-xs text-secondary border border-secondary/30">
          LATENCY: {latency > 3000 ? "OFFLINE" : `${latency} ms`}
        </div>
        <div className="px-4 py-2 bg-surface-container-high rounded font-bold text-xs text-info">
          Last updated Time: {dataTimestamp}
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-surface-container rounded-xl border border-white/5 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-high/50">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${isCrashed ? 'text-red-500' : 'text-primary'}`}>map</span>
            <span className="font-headline font-bold uppercase tracking-tight text-on-surface">
              Live Vehicle Location
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded ${isCrashed ? 'bg-red-500/20 text-red-500' : 'bg-primary/10 text-primary'}`}>
              LIVE FEED
            </span>
          </div>
        </div>
        
        <div className="relative" style={{ height: '400px', width: '100%' }}>
          <MapContainer
            center={[telemetry.gps?.latitude || 0, telemetry.gps?.longitude || 0]}
            zoom={15}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ zIndex: 0, background: '#1a1a1a' }}
          >
            <ChangeView center={[telemetry.gps?.latitude || 0, telemetry.gps?.longitude || 0]} zoom={15} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={[telemetry.gps?.latitude || 0, telemetry.gps?.longitude || 0]}>
              <Popup>
                <div className="text-black">
                  <b>Vehicle: {activeDeviceId}</b><br/>
                  Speed: {telemetry.gps?.velocity_kmh?.toFixed(1)} km/h<br/>
                  Status: {isCrashed ? '⚠️ CRASH DETECTED' : 'NORMAL'}<br/>
                  G-Force: {telemetry.imu?.peak_g?.toFixed(2)} G
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {isCrashed && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
              <div className="absolute -inset-12 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse" />
              <div className="absolute -inset-6 bg-red-500/30 rounded-full animate-ping" />
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-[1000] pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="font-label text-[10px] font-bold text-primary tracking-widest uppercase">
                📍 LAT: {telemetry.gps?.latitude?.toFixed(6) || '0'}, LNG: {telemetry.gps?.longitude?.toFixed(6) || '0'}
              </span>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="font-label text-[10px] font-bold tracking-widest uppercase text-green-400">
                🛰️ SPEED: {telemetry.gps?.velocity_kmh?.toFixed(1) || 0} KM/H
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${(telemetry.imu?.peak_g || 0) > 20 ? 'bg-red-500/20 border-red-500' : (telemetry.imu?.peak_g || 0) > 8 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-surface-container border-white/5'}`}>
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Peak G-Force</p>
          <p className={`text-4xl font-bold ${(telemetry.imu?.peak_g || 0) > 20 ? 'text-red-500 animate-pulse' : (telemetry.imu?.peak_g || 0) > 8 ? 'text-yellow-500 animate-pulse' : 'text-white'}`}>
            {(telemetry.imu?.peak_g || 0).toFixed(3)} <span className="text-sm">g</span>
          </p>
          {(telemetry.imu?.peak_g || 0) > 20 && <p className="text-xs text-red-500 font-bold mt-2">SEVERITY DETECTED</p>}
          {(telemetry.imu?.peak_g || 0) > 8 && (telemetry.imu?.peak_g || 0) <= 20 && <p className="text-xs text-yellow-500 font-bold mt-2">HEAVY IMPACT</p>}
        </div>

        <div className="bg-surface-container p-6 rounded-xl border border-white/5">
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Velocity</p>
          <p className="text-4xl font-bold text-primary">
            {(telemetry.gps?.velocity_kmh || 0).toFixed(1)} <span className="text-sm text-outline">km/h</span>
          </p>
        </div>

        <div className="bg-surface-container p-6 rounded-xl border border-white/5 col-span-2">
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Real-Time Accel (X / Y / Z)</p>
          <p className="text-3xl font-mono text-secondary">
            {(telemetry.imu?.accel_x || 0).toFixed(3)} / {(telemetry.imu?.accel_y || 0).toFixed(3)} / {(telemetry.imu?.accel_z || 0).toFixed(3)}
          </p>
        </div>
        
        <div className="bg-surface-container p-6 rounded-xl border border-white/5 col-span-full">
            <p className="text-xs text-outline uppercase tracking-widest mb-2">Live Coordinates</p>
            <div className="flex items-center gap-4">
                <span className="text-2xl font-mono">{(telemetry.gps?.latitude || 0).toFixed(6)}, {(telemetry.gps?.longitude || 0).toFixed(6)}</span>
                <a href={`https://www.google.com/maps?q=${telemetry.gps?.latitude || 0},${telemetry.gps?.longitude || 0}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">open_in_new</span>
                </a>
            </div>
        </div>
      </div>
      
      <LiveChart data={chartData} />
      
      <div className="flex justify-between text-xs text-outline mt-2 flex-wrap gap-2">
        <div>📈 Showing {chartData.length} of last 30 data points</div>
        <div>🗺️ Map auto-updates with vehicle location</div>
        <div>12-hour format with AM/PM</div>
      </div>
    </div>
  );
}