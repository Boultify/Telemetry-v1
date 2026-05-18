// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter } from 'recharts';
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280

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
<<<<<<< HEAD
          <div className="text-[#FFDF9E] text-[10px] mt-1">
            {gForceItem?.value ? gForceItem.value.toFixed(3) : '0'} G
          </div>
          <div className="text-gray-500 text-[8px] mt-2">
            ⏱{label}
          </div>
=======
          <div className={`text-[10px] mt-1 ${gForceItem?.payload?.isSpike ? 'text-red-400 font-bold' : 'text-[#FFDF9E]'}`}>
            {gForceItem?.value ? gForceItem.value.toFixed(3) : '0'} G
            {gForceItem?.payload?.isSpike && (
              <span className="ml-2 text-red-500 font-bold">
                ⚡ SUDDEN SPIKE! 
                {gForceItem.value > 0 ? ` +${gForceItem.value.toFixed(2)}G Rise` : ` ${gForceItem.value.toFixed(2)}G Drop`}
              </span>
            )}
          </div>
          <div className="text-gray-500 text-[8px] mt-2">⏱ {label}</div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
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

<<<<<<< HEAD
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
=======
  const spikeScatterData = data
    .filter(point => point.isSpike === true && Math.abs(point.gForce) > 1.2)
    .map(point => ({
      x: point.time,
      y: point.gForce,
      severity: Math.abs(point.gForce),
      direction: point.gForce > 0 ? 'positive' : 'negative',
      size: Math.min(Math.abs(point.gForce) / 1.5, 18),
      rawG: point.gForce
    }));

  return (
    <div className="bg-surface-container rounded-2xl border border-white/5 p-8 mt-6">
      <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">LIVE VELOCITY & G-FORCE (LAST 30 SEC)</h3>
      
      <div className="mb-6 p-4 bg-surface-container-low rounded-lg border border-white/10">
        <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">⚡ SPIKE MAGNITUDE LEGEND</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-green-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              POSITIVE SPIKE (SUDDEN INCREASE / ACCELERATION)
            </div>
            <div className="space-y-1 pl-4">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-green-300"></div>
                <span>Minor Rise: <strong className="text-white">+1.2G to +3.4G</strong></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-green-500"></div>
                <span>Moderate Rise: <strong className="text-white">+3.4G to +8G</strong></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-green-600 ring-2 ring-green-400"></div>
                <span>Heavy Rise: <strong className="text-white">+8G to +20G</strong></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-green-700 ring-4 ring-green-300 animate-pulse"></div>
                <span>Severe Rise: <strong className="text-white">+20G+</strong></span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-bold text-red-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              NEGATIVE SPIKE (SUDDEN DROP / DECELERATION)
            </div>
            <div className="space-y-1 pl-4">
              <div className="flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-red-300"></div>
                <span>Minor Drop: <strong className="text-white">-1.2G to -3.4G</strong></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-red-500"></div>
                <span>Moderate Drop: <strong className="text-white">-3.4G to -8G</strong></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-red-600 ring-2 ring-red-400"></div>
                <span>Heavy Drop: <strong className="text-white">-8G to -20G</strong></span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-red-700 ring-4 ring-red-300 animate-pulse"></div>
                <span>Severe Drop: <strong className="text-white">-20G+</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '450px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="time" 
              axisLine={{ stroke: '#333538', strokeWidth: 1 }}
              tickLine={false} 
              tick={{ fill: '#434652', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              yAxisId="left" 
              orientation="left"
              tick={{ fill: '#9ECAFF', fontSize: 10 }}
              label={{ value: 'Velocity (km/h)', angle: -90, position: 'insideLeft', fill: '#9ECAFF', fontSize: 10 }}
              domain={[0, 'auto']}
              axisLine={{ stroke: '#333538', strokeWidth: 1 }}
              tickLine={false}
            />
            
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fill: '#FFDF9E', fontSize: 10 }}
              label={{ value: 'G-Force', angle: 90, position: 'insideRight', fill: '#FFDF9E', fontSize: 10 }}
              domain={[-25, 25]}
              axisLine={{ stroke: '#333538', strokeWidth: 1 }}
              tickLine={false}
            />
            
            <ReferenceLine yAxisId="right" y={0} stroke="#555" strokeWidth={1} strokeDasharray="2 2" />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(158, 202, 255, 0.15)', strokeWidth: 1 }} />
            
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="velocity" 
              stroke="#9ECAFF" 
<<<<<<< HEAD
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6, fill: '#9ECAFF', stroke: '#fff', strokeWidth: 2 }} 
            />
=======
              strokeWidth={2.5} 
              dot={false} 
              activeDot={{ r: 4, fill: '#9ECAFF', stroke: '#fff', strokeWidth: 1 }} 
            />
            
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="gForce" 
              stroke="#FFDF9E" 
<<<<<<< HEAD
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              activeDot={{ r: 4, fill: '#FFDF9E', stroke: '#fff', strokeWidth: 2 }}
=======
              strokeWidth={1.5} 
              strokeDasharray="4 4"
              opacity={0.6}
              dot={false} 
            />
            
            <Scatter
              yAxisId="right"
              data={spikeScatterData}
              shape={(props) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy) return null;
                
                const severity = payload.severity;
                let size = 6, borderWidth = 2, outerRing = false, glowIntensity = '';
                
                if (severity > 20) { size = 18; borderWidth = 3; outerRing = true; glowIntensity = '0 0 20px currentColor'; }
                else if (severity > 8) { size = 13; borderWidth = 2.5; glowIntensity = '0 0 10px currentColor'; }
                else if (severity > 3.4) { size = 9; borderWidth = 2; }
                else if (severity > 1.2) { size = 7; borderWidth = 1.5; }
                
                let fillColor;
                if (payload.direction === 'positive') {
                  if (severity > 20) fillColor = '#00FF88';
                  else if (severity > 8) fillColor = '#44FF44';
                  else if (severity > 3.4) fillColor = '#88FF88';
                  else fillColor = '#AAFFAA';
                } else {
                  if (severity > 20) fillColor = '#FF0000';
                  else if (severity > 8) fillColor = '#FF3333';
                  else if (severity > 3.4) fillColor = '#FF6666';
                  else fillColor = '#FF8888';
                }
                
                if (outerRing) {
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={size + 5} fill="none" stroke={fillColor} strokeWidth={1.5} opacity={0.6} className="animate-ping" style={{ animationDuration: '1.5s' }} />
                      <circle cx={cx} cy={cy} r={size} fill={fillColor} stroke="#fff" strokeWidth={borderWidth} style={{ filter: `drop-shadow(${glowIntensity})` }} />
                      <circle cx={cx} cy={cy} r={size - 4} fill="#fff" opacity={0.9} />
                    </g>
                  );
                }
                
                return <circle cx={cx} cy={cy} r={size} fill={fillColor} stroke="#fff" strokeWidth={borderWidth} style={glowIntensity ? { filter: `drop-shadow(${glowIntensity})` } : {}} className={severity > 8 ? "animate-pulse" : ""} style={{ animationDuration: '1s' }} />;
              }}
            />
            
            <Scatter
              yAxisId="right"
              data={spikeScatterData.filter(d => d.severity > 20)}
              shape={(props) => {
                const { cx, cy } = props;
                if (!cx || !cy) return null;
                return <text x={cx} y={cy - 15} fill="#FF4444" fontSize={9} fontWeight="bold" textAnchor="middle" className="animate-pulse">CRITICAL!</text>;
              }}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

<<<<<<< HEAD
// ONLY ONE Dashboard component - keep this one
export default function Dashboard() {
  const { activeDeviceId, hasActiveDevice, existsInTelemetry, loading: fleetLoading, isAdmin } = useFleet();
  const [telemetry, setTelemetry] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [latency, setLatency] = useState(0);
  const [dataReady, setDataReady] = useState(false);
=======
export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [latency, setLatency] = useState(0);
  const deviceId = "VX-9902";
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280

  const format12HourTime = (date) => {
    if (!date) return 'Invalid Date';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
<<<<<<< HEAD
    
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
=======
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/telemetry/history/${deviceId}?limit=30`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const historicalPoints = data.map((entry) => {
              let timestamp;
              if (entry.timestampISO) timestamp = new Date(entry.timestampISO);
              else if (entry.timestamp) timestamp = new Date(entry.timestamp);
              else timestamp = new Date();
              
              return {
                time: format12HourTime(timestamp),
                velocity: entry.gps?.velocity_kmh || 0,
                gForce: entry.imu?.peak_g || 0,
                isSpike: entry.spike?.detected || false,
                fullTimestamp: timestamp.getTime()
              };
            });
            setChartData(historicalPoints);
            if (data.length > 0) setTelemetry(data[data.length - 1]);
          }
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    const fetchLatestTelemetry = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/telemetry/latest/${deviceId}`);
        if (response.ok) {
          const data = await response.json();
          
          let serverTime;
          if (data.timestampISO) serverTime = new Date(data.timestampISO).getTime();
          else if (data.timestamp) serverTime = new Date(data.timestamp).getTime();
          else serverTime = Date.now();
          
          const currentLatency = Date.now() - serverTime;
          setLatency(currentLatency);
          setTelemetry(data);

          if (data && data.gps && data.imu) {
            let timestamp;
            if (data.timestampISO) timestamp = new Date(data.timestampISO);
            else if (data.timestamp) timestamp = new Date(data.timestamp);
            else timestamp = new Date();
            
            const newPoint = {
              time: format12HourTime(timestamp),
              velocity: data.gps.velocity_kmh || 0,
              gForce: data.imu.peak_g || 0,
              isSpike: data.spike?.detected || false,
              fullTimestamp: timestamp.getTime()
            };
            
            setChartData(prevData => {
              const isDuplicate = prevData.some(point => point.fullTimestamp === newPoint.fullTimestamp);
              if (isDuplicate) return prevData;
              const updated = [...prevData, newPoint];
              return updated.slice(-30);
            });
          }
        }
      } catch (error) {
        console.error("Fetch Exception:", error);
      }
    };

    fetchHistoricalData().then(() => {
      fetchLatestTelemetry();
      const interval = setInterval(fetchLatestTelemetry, 1000);
      return () => clearInterval(interval);
    });
  }, [deviceId]);

  if (!telemetry) {
    return <div className="text-white p-8 text-center animate-pulse">Waiting for hardware data...</div>;
  }

  const spikeInfo = telemetry.spike?.detected ? 
    (telemetry.spike?.delta_g >= 15 ? 'CRITICAL SPIKE' :
     telemetry.spike?.delta_g >= 7 ? 'HEAVY SPIKE' :
     telemetry.spike?.delta_g >= 3.5 ? 'MODERATE SPIKE' : 'MINOR SPIKE') : 'SMOOTH TRANSITION';
  
  const spikeDirection = telemetry.imu?.peak_g > (telemetry.spike?.prev_g || 0) ? 'RISE (+' : 'DROP (';
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full text-white">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
<<<<<<< HEAD
        <h1 className="text-3xl font-black uppercase">Live Telemetry: {activeDeviceId}</h1>
        <div className="text-sm text-outline bg-surface-container px-3 py-1 rounded">
          🖥️ {currentLocalTime}
        </div>
=======
        <h1 className="text-3xl font-black uppercase">Live Telemetry: {deviceId}</h1>
        <div className="text-sm text-outline bg-surface-container px-3 py-1 rounded">🖥️ {new Date().toLocaleString()}</div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
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
<<<<<<< HEAD
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
=======
        <div className={`px-4 py-2 rounded font-bold text-xs ${telemetry.spike?.detected ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-surface-container-high text-info'}`}>
          {telemetry.spike?.detected ? `⚠️ ${spikeDirection}${Math.abs(telemetry.spike.delta_g).toFixed(2)}G) - ${spikeInfo}` : '✓ NORMAL READING'}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
<<<<<<< HEAD
        <div className={`p-6 rounded-xl border ${(telemetry.imu?.peak_g || 0) > 20 ? 'bg-red-500/20 border-red-500' : (telemetry.imu?.peak_g || 0) > 8 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-surface-container border-white/5'}`}>
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Peak G-Force</p>
          <p className={`text-4xl font-bold ${(telemetry.imu?.peak_g || 0) > 20 ? 'text-red-500 animate-pulse' : (telemetry.imu?.peak_g || 0) > 8 ? 'text-yellow-500 animate-pulse' : 'text-white'}`}>
            {(telemetry.imu?.peak_g || 0).toFixed(3)} <span className="text-sm">g</span>
          </p>
          {(telemetry.imu?.peak_g || 0) > 20 && <p className="text-xs text-red-500 font-bold mt-2">SEVERITY DETECTED</p>}
          {(telemetry.imu?.peak_g || 0) > 8 && (telemetry.imu?.peak_g || 0) <= 20 && <p className="text-xs text-yellow-500 font-bold mt-2">HEAVY IMPACT</p>}
=======
        <div className={`p-6 rounded-xl border ${telemetry.spike?.detected ? 
          (telemetry.spike?.delta_g >= 15 ? 'bg-red-500/20 border-red-500 animate-pulse' :
           telemetry.spike?.delta_g >= 7 ? 'bg-orange-500/20 border-orange-500' :
           telemetry.spike?.delta_g >= 3.5 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-green-500/20 border-green-500') : 
          'bg-surface-container border-white/5'}`}>
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Peak G-Force</p>
          <p className={`text-4xl font-bold ${telemetry.imu?.peak_g > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {telemetry.imu?.peak_g > 0 ? '+' : ''}{telemetry.imu?.peak_g?.toFixed(3) || 0} <span className="text-sm">g</span>
          </p>
          {telemetry.spike?.detected && (
            <p className="text-xs text-red-500 font-bold mt-2">
              ⚡ SUDDEN {telemetry.imu?.peak_g > (telemetry.spike?.prev_g || 0) ? 'RISE' : 'DROP'}! 
              ΔG: {telemetry.spike?.delta_g?.toFixed(2)}G
            </p>
          )}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>

        <div className="bg-surface-container p-6 rounded-xl border border-white/5">
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Velocity</p>
<<<<<<< HEAD
          <p className="text-4xl font-bold text-primary">
            {(telemetry.gps?.velocity_kmh || 0).toFixed(1)} <span className="text-sm text-outline">km/h</span>
          </p>
=======
          <p className="text-4xl font-bold text-primary">{(telemetry.gps?.velocity_kmh || 0).toFixed(1)} <span className="text-sm text-outline">km/h</span></p>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>

        <div className="bg-surface-container p-6 rounded-xl border border-white/5 col-span-2">
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Real-Time Accel (X / Y / Z)</p>
          <p className="text-3xl font-mono text-secondary">
            {(telemetry.imu?.accel_x || 0).toFixed(3)} / {(telemetry.imu?.accel_y || 0).toFixed(3)} / {(telemetry.imu?.accel_z || 0).toFixed(3)}
          </p>
        </div>
        
        <div className="bg-surface-container p-6 rounded-xl border border-white/5 col-span-full">
<<<<<<< HEAD
            <p className="text-xs text-outline uppercase tracking-widest mb-2">Live Coordinates</p>
            <div className="flex items-center gap-4">
                <span className="text-2xl font-mono">{(telemetry.gps?.latitude || 0).toFixed(6)}, {(telemetry.gps?.longitude || 0).toFixed(6)}</span>
                <a href={`https://www.google.com/maps?q=${telemetry.gps?.latitude || 0},${telemetry.gps?.longitude || 0}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">open_in_new</span>
                </a>
            </div>
=======
          <p className="text-xs text-outline uppercase tracking-widest mb-2">Live Coordinates</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-mono">{(telemetry.gps?.latitude || 0).toFixed(6)}, {(telemetry.gps?.longitude || 0).toFixed(6)}</span>
            <a href={`https://www.google.com/maps?q=${telemetry.gps?.latitude || 0},${telemetry.gps?.longitude || 0}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined">open_in_new</span>
            </a>
          </div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
        </div>
      </div>
      
      <LiveChart data={chartData} />
<<<<<<< HEAD
      
      <div className="flex justify-between text-xs text-outline mt-2 flex-wrap gap-2">
        <div>📈 Showing {chartData.length} of last 30 data points</div>
        <div>🗺️ Map auto-updates with vehicle location</div>
        <div>12-hour format with AM/PM</div>
      </div>
=======
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
    </div>
  );
}