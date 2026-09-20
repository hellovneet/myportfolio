import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Flame,
  Radio,
  Zap,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export interface TelemetryPoint {
  time: string;
  temp: number;
  humidity: number;
  distance: number;
  voltage: number;
}

type MetricView = 'environmental' | 'sonar' | 'power';

interface IoTSensorChartWidgetProps {
  currentTemp: number;
  currentHumidity: number;
  currentDistance: number;
  isStreaming: boolean;
  onToggleStream: () => void;
}

export function IoTSensorChartWidget({
  currentTemp,
  currentHumidity,
  currentDistance,
  isStreaming,
  onToggleStream,
}: IoTSensorChartWidgetProps) {
  const [activeMetric, setActiveMetric] = useState<MetricView>('environmental');
  const [anomalyOffset, setAnomalyOffset] = useState<{ temp: number; dist: number }>({
    temp: 0,
    dist: 0,
  });

  // Rolling buffer of telemetry data points
  const [data, setData] = useState<TelemetryPoint[]>(() => {
    const initial: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      const t = new Date(now - i * 1500);
      const timeStr = `${String(t.getMinutes()).padStart(2, '0')}:${String(
        t.getSeconds()
      ).padStart(2, '0')}`;
      initial.push({
        time: timeStr,
        temp: Number((currentTemp + (Math.sin(i) * 0.4)).toFixed(1)),
        humidity: Math.round(currentHumidity + Math.cos(i) * 1.5),
        distance: Math.round(currentDistance + (Math.sin(i * 1.5) * 2)),
        voltage: Number((3.3 + (Math.random() * 0.03 - 0.015)).toFixed(3)),
      });
    }
    return initial;
  });

  const packetCountRef = useRef<number>(15);
  const [packetRate, setPacketRate] = useState<number>(42);

  // Decaying anomaly effect
  useEffect(() => {
    if (anomalyOffset.temp !== 0 || anomalyOffset.dist !== 0) {
      const timer = setTimeout(() => {
        setAnomalyOffset((prev) => ({
          temp: Math.max(0, prev.temp * 0.65),
          dist: Math.max(0, prev.dist * 0.65),
        }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [anomalyOffset]);

  // Live telemetry stream interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`;

      // Simulate micro sensor noise + current user sliders + any anomaly spike
      const jitterTemp = (Math.random() * 0.3 - 0.15) + (anomalyOffset.temp > 0.1 ? anomalyOffset.temp : 0);
      const jitterHum = (Math.random() * 0.8 - 0.4);
      const jitterDist = (Math.random() * 1.8 - 0.9) - (anomalyOffset.dist > 1 ? anomalyOffset.dist : 0);
      const jitterVolt = (Math.random() * 0.02 - 0.01);

      const newPoint: TelemetryPoint = {
        time: timeStr,
        temp: Number((currentTemp + jitterTemp).toFixed(1)),
        humidity: Math.round(Math.min(99, Math.max(10, currentHumidity + jitterHum))),
        distance: Math.max(4, Math.round(currentDistance + jitterDist)),
        voltage: Number((3.3 + jitterVolt).toFixed(3)),
      };

      packetCountRef.current += 1;
      setPacketRate(Math.floor(40 + Math.random() * 6));

      setData((prev) => [...prev.slice(1), newPoint]);
    }, 1400);

    return () => clearInterval(interval);
  }, [isStreaming, currentTemp, currentHumidity, currentDistance, anomalyOffset]);

  const handleInjectThermalSpike = () => {
    setAnomalyOffset({ temp: 8.5, dist: 0 });
  };

  const handleInjectObstacleSpike = () => {
    setAnomalyOffset({ temp: 0, dist: 24 });
  };

  const latestPoint = data[data.length - 1] || {
    temp: currentTemp,
    humidity: currentHumidity,
    distance: currentDistance,
    voltage: 3.3,
  };

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-2xl border border-white/20 bg-[#050b12]/95 backdrop-blur-xl shadow-2xl font-mono-custom text-xs">
          <div className="text-[10px] text-[#8d9aaa] pb-1.5 mb-1.5 border-b border-white/10 flex items-center justify-between gap-4">
            <span>PACKET TIME</span>
            <span className="text-white font-semibold">{label}</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="font-bold text-white">
                  {entry.value} {entry.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="iot-sensor-dashboard-widget"
      className="mt-8 pt-8 border-t border-white/10 relative z-10"
    >
      {/* Widget Header & Metrics Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-mono-custom text-[9px] tracking-widest text-[#7de2ff] uppercase mb-1">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#7de2ff]/10 border border-[#7de2ff]/30">
              <Activity className="w-3 h-3 text-[#7de2ff] animate-pulse" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="text-[#8d9aaa]">ADC 12-BIT &bull; SAMPLING: 714 ms</span>
          </div>
          <h3 className="font-display font-semibold text-xl text-[var(--text)] tracking-tight">
            Real-Time Sensor Oscilloscope
          </h3>
        </div>

        {/* View Switcher Pills & Simulation Injection */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Buttons */}
          <div className="p-1 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center gap-1 font-mono-custom text-[10px]">
            <button
              onClick={() => setActiveMetric('environmental')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeMetric === 'environmental'
                  ? 'bg-[#7de2ff]/20 text-[#7de2ff] border border-[#7de2ff]/40 shadow-sm font-semibold'
                  : 'text-[#8d9aaa] hover:text-white'
              }`}
            >
              DHT22 Env (°C / %)
            </button>
            <button
              onClick={() => setActiveMetric('sonar')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeMetric === 'sonar'
                  ? 'bg-[#7cffb2]/20 text-[#7cffb2] border border-[#7cffb2]/40 shadow-sm font-semibold'
                  : 'text-[#8d9aaa] hover:text-white'
              }`}
            >
              HC-SR04 Sonar (cm)
            </button>
            <button
              onClick={() => setActiveMetric('power')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeMetric === 'power'
                  ? 'bg-[#ffd09e]/20 text-[#ffd09e] border border-[#ffd09e]/40 shadow-sm font-semibold'
                  : 'text-[#8d9aaa] hover:text-white'
              }`}
            >
              Supply Rail (VDD)
            </button>
          </div>

          {/* Stream Pause / Resume */}
          <button
            onClick={onToggleStream}
            className={`p-2 rounded-xl border text-xs font-mono-custom flex items-center gap-1.5 transition-all cursor-pointer ${
              isStreaming
                ? 'border-[#7cffb2]/40 bg-[#7cffb2]/10 text-[#7cffb2]'
                : 'border-white/15 bg-white/[0.04] text-[#8d9aaa] hover:text-white'
            }`}
            title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Temp KPI */}
        <div className="p-3.5 rounded-2xl border border-white/10 bg-[#050b12]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#ff9f5a] font-mono-custom text-[8px]">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              TEMPERATURE
            </span>
            <span className="text-[#8d9aaa]">DHT22</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono-custom text-white">
              {latestPoint.temp.toFixed(1)}
            </span>
            <span className="text-xs font-mono-custom text-[#ff9f5a]">°C</span>
          </div>
          <span className="text-[8px] font-mono-custom text-[#8d9aaa] mt-1">
            Hum: {latestPoint.humidity}% RH
          </span>
        </div>

        {/* Distance KPI */}
        <div className="p-3.5 rounded-2xl border border-white/10 bg-[#050b12]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7de2ff] font-mono-custom text-[8px]">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3" />
              SONAR DISTANCE
            </span>
            <span className="text-[#8d9aaa]">ECHO</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono-custom text-white">
              {latestPoint.distance}
            </span>
            <span className="text-xs font-mono-custom text-[#7de2ff]">cm</span>
          </div>
          <span
            className={`text-[8px] font-mono-custom mt-1 ${
              latestPoint.distance < 20 ? 'text-red-400 font-bold' : 'text-[#7cffb2]'
            }`}
          >
            {latestPoint.distance < 20 ? '⚠ Proximity Alert' : '✓ Corridor Clear'}
          </span>
        </div>

        {/* Rail VDD KPI */}
        <div className="p-3.5 rounded-2xl border border-white/10 bg-[#050b12]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#ffd09e] font-mono-custom text-[8px]">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              ESP32 VDD RAIL
            </span>
            <span className="text-[#8d9aaa]">ADC CH0</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono-custom text-white">
              {latestPoint.voltage.toFixed(3)}
            </span>
            <span className="text-xs font-mono-custom text-[#ffd09e]">V</span>
          </div>
          <span className="text-[8px] font-mono-custom text-[#7cffb2] mt-1">
            ✓ LDO Regulated
          </span>
        </div>

        {/* Throughput KPI */}
        <div className="p-3.5 rounded-2xl border border-white/10 bg-[#050b12]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7cffb2] font-mono-custom text-[8px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              MQTT STREAM
            </span>
            <span className="text-[#8d9aaa]">QoS 0</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono-custom text-white">
              {packetRate}
            </span>
            <span className="text-xs font-mono-custom text-[#7cffb2]">pkt/m</span>
          </div>
          <span className="text-[8px] font-mono-custom text-[#8d9aaa] mt-1">
            0% Dropped &bull; CRC32 OK
          </span>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-5 rounded-3xl border border-white/10 bg-[#04090e]/90 shadow-2xl relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(125,226,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,226,255,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Chart Subhead with Interactive Injectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-3 font-mono-custom text-[10px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#7de2ff] animate-ping" />
              LIVE TELEMETRY WINDOW (LAST 15 FRAMES)
            </span>
            <span className="text-[#657383]">|</span>
            <span className="text-[#8d9aaa]">
              {activeMetric === 'environmental' && 'Tracking Ambient Temp (°C) & Humidity (%)'}
              {activeMetric === 'sonar' && 'Tracking Acoustic Ping Reflections (cm)'}
              {activeMetric === 'power' && 'Tracking Microcontroller LDO Rail Stability (V)'}
            </span>
          </div>

          {/* Real-time anomaly simulation triggers */}
          <div className="flex items-center gap-2 font-mono-custom text-[9px]">
            <span className="text-[#627181] hidden sm:inline">Simulate Anomaly:</span>
            {activeMetric === 'environmental' && (
              <button
                onClick={handleInjectThermalSpike}
                className="px-2.5 py-1 rounded-lg border border-[#ff9f5a]/40 bg-[#ff9f5a]/10 hover:bg-[#ff9f5a]/20 text-[#ff9f5a] transition-all cursor-pointer flex items-center gap-1"
              >
                <Flame className="w-3 h-3" />
                <span>+8.5°C Spike</span>
              </button>
            )}
            {activeMetric === 'sonar' && (
              <button
                onClick={handleInjectObstacleSpike}
                className="px-2.5 py-1 rounded-lg border border-[#7de2ff]/40 bg-[#7de2ff]/10 hover:bg-[#7de2ff]/20 text-[#7de2ff] transition-all cursor-pointer flex items-center gap-1"
              >
                <Radio className="w-3 h-3" />
                <span>Obstacle Incursion</span>
              </button>
            )}
            <span className="text-[9px] px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-[#8d9aaa]">
              BUFFER: 15/15
            </span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-[240px] sm:h-[260px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="#627181"
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <YAxis
                stroke="#627181"
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                domain={
                  activeMetric === 'environmental'
                    ? [10, 60]
                    : activeMetric === 'sonar'
                    ? [0, 200]
                    : [3.25, 3.35]
                }
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Render Lines Based on Selected Metric View */}
              {activeMetric === 'environmental' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Temperature"
                    unit="°C"
                    stroke="#ff9f5a"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#ff9f5a', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#ff9f5a', stroke: '#fff', strokeWidth: 1.5 }}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity"
                    unit="%"
                    stroke="#7de2ff"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2, fill: '#7de2ff', strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: '#7de2ff', stroke: '#fff', strokeWidth: 1 }}
                    isAnimationActive={false}
                  />
                </>
              )}

              {activeMetric === 'sonar' && (
                <Line
                  type="monotone"
                  dataKey="distance"
                  name="Obstacle Distance"
                  unit="cm"
                  stroke="#7cffb2"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#7cffb2', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#7cffb2', stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              )}

              {activeMetric === 'power' && (
                <Line
                  type="monotone"
                  dataKey="voltage"
                  name="VDD Voltage"
                  unit="V"
                  stroke="#ffd09e"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#ffd09e', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#ffd09e', stroke: '#fff', strokeWidth: 1.5 }}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer info bar */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono-custom text-[9px] text-[#627181] relative z-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#ff9f5a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f5a]" />
              Temp (°C)
            </span>
            <span className="flex items-center gap-1 text-[#7de2ff]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff]" />
              Humidity (%)
            </span>
            <span className="flex items-center gap-1 text-[#7cffb2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2]" />
              Sonar (cm)
            </span>
            <span className="flex items-center gap-1 text-[#ffd09e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd09e]" />
              VDD (3.3V)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-[#7de2ff]" />
            <span>SERIAL STREAM: MQTT JSON ENCODED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
