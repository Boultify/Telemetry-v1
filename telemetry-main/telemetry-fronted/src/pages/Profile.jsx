import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { api } from '../utils/api';

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, saveProfile, hasDevice } = useProfile();

  const [driverName, setDriverName] = useState('');
  const [email, setEmail] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [telemetryDeviceIds, setTelemetryDeviceIds] = useState([]);

  useEffect(() => {
    const loadTelemetryDevices = async () => {
      const res = await api.get('/api/telemetry/devices');
      if (res?.ok) {
        setTelemetryDeviceIds(await res.json());
      }
    };
    loadTelemetryDevices();
  }, []);

  const applyToForm = (data) => {
    setDriverName(data?.driverName || user?.username || '');
    setEmail(data?.email || user?.email || '');
    setDeviceId(data?.deviceId || '');
    setEmergencyNumber(data?.emergencyNumber || '');
  };

  useEffect(() => {
    if (!loading && profile) {
      applyToForm(profile);
    } else if (!loading && user && !profile) {
      applyToForm({ driverName: user.username, email: user.email, deviceId: '', emergencyNumber: '' });
    }
  }, [loading, profile?._id, profile?.updatedAt]);

  const handleSaveProfile = async () => {
    setSaveMessage('');
    setIsSaving(true);
    const result = await saveProfile({
      driverName,
      email,
      deviceId: deviceId.trim(),
      emergencyNumber,
    });
    setIsSaving(false);

    if (result.success) {
      if (result.profile) {
        applyToForm(result.profile);
      }
      const savedId = result.profile?.deviceId || deviceId.trim();
      const count = result.profile?.telemetryCount ?? 0;
      setSaveMessage(
        `success:${result.message} Saved to MongoDB profiles collection. Device ID: ${savedId}. Telemetry records found: ${count}.`
      );
    } else {
      setSaveMessage('error:' + (result.error || 'Failed to save profile'));
    }
  };

  const messageType = saveMessage.startsWith('success:') ? 'success' : saveMessage.startsWith('error:') ? 'error' : null;
  const messageText = saveMessage.replace(/^(success|error):/, '');

=======

export default function Profile() {
  const [driverName, setDriverName] = useState('');
  const [email, setEmail] = useState('');
  const [carId, setCarId] = useState(''); 
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/latest`);
        if (response.ok) {
          const data = await response.json();
          setDriverName(data.driverName || '');
          setEmail(data.email || '');
          setCarId(data.deviceId || '');
          setEmergencyNumber(data.emergencyNumber || '');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: carId || "UNASSIGNED",
          driverName: driverName,
          email: email,
          emergencyNumber: emergencyNumber
        })
      });
      const result = await response.json();
      if (response.ok) {
        alert("✅ " + result.message);
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ Could not connect to the backend. Is your server running?");
    }
    setIsSaving(false);
  };

>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
<<<<<<< HEAD
          <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface uppercase">
            Operator Profile
          </h1>
          <p className="text-xs text-outline font-medium tracking-wide mt-1 uppercase">
            Manage core credentials and crash-response number
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving || loading}
            className="px-8 py-3 text-xs font-bold font-label tracking-widest rounded-lg bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
=======
          <h1 className="font-headline text-3xl font-black tracking-tighter text-on-surface uppercase">Operator Profile</h1>
          <p className="text-xs text-outline font-medium tracking-wide mt-1 uppercase">Manage core credentials and crash-response number</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSaveProfile} disabled={isSaving || isLoading} className="px-8 py-3 text-xs font-bold font-label tracking-widest rounded-lg bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
            {isSaving ? 'SAVING...' : 'SAVE PROFILE'}
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {messageText && (
        <div
          className={`p-3 rounded-lg text-xs text-center border ${
            messageType === 'success'
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'bg-red-500/20 border-red-500 text-red-400'
          }`}
        >
          {messageType === 'success' ? '✅ ' : '❌ '}
          {messageText}
        </div>
      )}

      {telemetryDeviceIds.length > 0 && (
        <div className="p-4 rounded-lg border border-secondary/30 bg-secondary/5 text-sm text-on-surface-variant">
          <span className="font-bold text-secondary">Telemetry in MongoDB uses device ID: </span>
          <span className="flex flex-wrap gap-2 mt-2">
            {telemetryDeviceIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setDeviceId(id)}
                className="px-3 py-1 rounded font-mono text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              >
                Use {id}
              </button>
            ))}
          </span>
          <span className="block text-xs text-outline mt-2">
            IDs must match <strong>exactly</strong> (VX-9002 ≠ VX-9902). Save here — Dashboard and Alerts use this Device ID when it exists in MongoDB telemetries.
          </span>
        </div>
      )}

      {!hasDevice && !loading && (
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-sm text-primary">
          Add your hardware Device ID below and save. Other pages stay empty until a device ID is set.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-20 text-primary animate-pulse font-bold tracking-widest uppercase text-sm">
          Loading Operator Data...
        </div>
=======
      {isLoading ? (
        <div className="flex items-center justify-center p-20 text-primary animate-pulse">Loading Operator Data...</div>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <div className="bg-surface-container rounded-2xl border border-white/5 p-8 relative overflow-hidden shadow-xl">
<<<<<<< HEAD
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-9xl">fingerprint</span>
              </div>

              <div className="flex flex-col items-center text-center relative z-10 gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-high relative shadow-2xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-primary">person</span>
                </div>
                <div>
                  <h2 className="font-headline text-3xl font-bold text-on-surface">
                    {driverName || user?.username || 'Operator Name'}
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-white/5 rounded-lg text-xs font-mono text-primary">
                    <span className="material-symbols-outlined text-sm">memory</span>
                    DEVICE ID: {deviceId.trim() || '—'}
=======
              <div className="flex flex-col items-center text-center relative z-10 gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-high relative shadow-2xl">
                  <img alt="Driver Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmcsr6eqlon-anHfXPYKNDE5Sj0E4WvJkC94ADdyXRT4LWHHvemno8K2M3hgpSaI4SHlihoRMgC0dvvR_5xU07dCm8jQoL1PP6XFBH33MZqOYFDmSC1watEjXjColb8OAfkMeIgjOalwN2s28QTUKkFkigKOn3yZKutelR4aCpBr3flj5DcKXlEKg6PbdXJamgPxoxcCROIvxoqIQufrlgE9Jb5yVNJJwfVKpyYb-DA5xFZHb8TuqyztzXOqu2wZObnNGFCVu7sPY" />
                </div>
                <div>
                  <h2 className="font-headline text-3xl font-bold text-on-surface">{driverName || "Operator Name"}</h2>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-white/5 rounded-lg text-xs font-mono text-primary">
                    <span className="material-symbols-outlined text-sm">directions_car</span>
                    CAR ID: {carId || "UNASSIGNED"}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-surface-container rounded-2xl border border-white/5 p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <span className="material-symbols-outlined text-primary">person</span>
<<<<<<< HEAD
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase tracking-tight">
                  General Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-sm">badge</span>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-surface-container-lowest border border-white/5 text-on-surface text-sm pl-10 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-sm">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="driver@company.com"
                      className="w-full bg-surface-container-lowest border border-white/5 text-on-surface text-sm pl-10 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    Device ID (Hardware Tracker)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-sm">memory</span>
                    <input
                      type="text"
                      value={deviceId}
                      onChange={(e) => setDeviceId(e.target.value)}
                      placeholder="e.g. VX-9902"
                      className="w-full bg-surface-container-lowest border border-white/5 text-on-surface font-mono text-sm pl-10 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-outline-variant mt-1">
                    * Must match the Device ID sent by your hardware. Telemetry on other pages is filtered by this ID.
                  </p>
=======
                <h3 className="font-headline text-lg font-bold text-on-surface uppercase tracking-tight">General Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Full Name</label>
                  <input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Enter full name" className="w-full bg-surface-container-lowest border border-white/5 text-on-surface text-sm p-3 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="driver@company.com" className="w-full bg-surface-container-lowest border border-white/5 text-on-surface text-sm p-3 rounded-lg" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Assigned Car ID (Hardware Tracker)</label>
                  <input type="text" value={carId} onChange={(e) => setCarId(e.target.value)} placeholder="e.g. VX-9902" className="w-full bg-surface-container-lowest border border-white/5 text-on-surface font-mono text-sm p-3 rounded-lg" />
                  <p className="text-[10px] text-outline-variant mt-1">* Must perfectly match the Device ID programmed into your hardware module.</p>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="bg-surface-container rounded-2xl border-l-4 border-error border-y border-r border-white/5 p-8 relative overflow-hidden shadow-[0_0_30px_rgba(255,180,171,0.03)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-error/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex items-center gap-3 mb-4 relative z-10 border-b border-error/20 pb-4">
                <div className="p-2 bg-error/10 rounded-lg">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emergency_recording
                  </span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">
                    Emergency Response Protocol
                  </h3>
                  <p className="text-[11px] text-error font-medium tracking-wide uppercase">
                    Auto-Dial Configuration on Crash Detection
                  </p>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed relative z-10">
                In the event of a severe impact (exceeding 3.4G), the Telemetry Pro system will immediately place an automated call to the mobile contact below, transmitting the emergency status and GPS coordinates.
              </p>

              <div className="relative z-10">
                <div className="space-y-2 max-w-md">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-error">
                    Emergency Mobile Contact
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-error text-sm">call</span>
                    <input
                      type="tel"
                      value={emergencyNumber}
                      onChange={(e) => setEmergencyNumber(e.target.value)}
                      placeholder="+1 (800) 555-0199"
                      className="w-full bg-error/5 border border-error/30 text-on-surface font-mono text-sm pl-10 pr-4 py-4 rounded-lg focus:ring-1 focus:ring-error transition-all outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-outline-variant mt-1">
                    * Optional until you enable crash calling. Include country code (e.g., +1).
                  </p>
=======
            <div className="bg-surface-container rounded-2xl border-l-4 border-error border-y border-r border-white/5 p-8 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4 relative z-10 border-b border-error/20 pb-4">
                <div className="p-2 bg-error/10 rounded-lg">
                  <span className="material-symbols-outlined text-error">emergency_recording</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">Emergency Response Protocol</h3>
                  <p className="text-[11px] text-error font-medium tracking-wide uppercase">Auto-Dial Configuration on Sudden Spike Detection</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed relative z-10">
                In the event of a sudden G-force spike (ΔG ≥ 7G), the Telemetry Pro system will immediately place an automated call to the mobile contact below.
              </p>
              <div className="relative z-10">
                <div className="space-y-2 max-w-md">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-error">Emergency Mobile Contact</label>
                  <input type="tel" value={emergencyNumber} onChange={(e) => setEmergencyNumber(e.target.value)} placeholder="+1 (800) 555-0199" className="w-full bg-error/5 border border-error/30 text-on-surface font-mono text-sm p-4 rounded-lg" />
                  <p className="text-[10px] text-outline-variant mt-1">* Include country code (e.g., +1 for US/Canada, +44 for UK).</p>
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
