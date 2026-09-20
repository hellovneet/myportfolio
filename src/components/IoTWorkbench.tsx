import { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Radio,
  Activity,
  Wifi,
  Sliders,
  Terminal,
  Zap,
  RotateCw,
  Flame,
  Droplets,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Reveal } from './Reveal';
import { IoTSensorChartWidget } from './IoTSensorChartWidget';

type LedMode = 'rainbow' | 'cyan' | 'amber' | 'emerald' | 'alert';

interface PacketLog {
  id: string;
  timestamp: string;
  topic: string;
  payload: string;
  type: 'telemetry' | 'gpio' | 'wifi' | 'mqtt';
}

export function IoTWorkbench() {
  // Interactive IoT Sensor States
  const [distance, setDistance] = useState<number>(38); // HC-SR04 cm
  const [temperature, setTemperature] = useState<number>(25.4); // DHT22 °C
  const [humidity, setHumidity] = useState<number>(52); // DHT22 %
  const [servoAngle, setServoAngle] = useState<number>(75); // SG90 servo degrees
  const [gpio2Led, setGpio2Led] = useState<boolean>(true); // Onboard ESP32 LED
  const [pirMotion, setPirMotion] = useState<boolean>(false); // PIR sensor
  const [ledMode, setLedMode] = useState<LedMode>('cyan'); // NeoPixel Ring mode
  const [isStreaming, setIsStreaming] = useState<boolean>(true); // Serial monitor active

  // Logs stream
  const [logs, setLogs] = useState<PacketLog[]>([
    {
      id: '1',
      timestamp: '00:01.120',
      topic: 'sys/boot',
      payload: 'ESP32-WROOM-32D (240MHz, 520KB SRAM) ready',
      type: 'wifi',
    },
    {
      id: '2',
      timestamp: '00:01.340',
      topic: 'net/wifi',
      payload: 'Connected to SSID "VINEET_LAB_5G" (RSSI -48dBm)',
      type: 'wifi',
    },
    {
      id: '3',
      timestamp: '00:01.890',
      topic: 'mqtt/broker',
      payload: 'CONNACK (0) connected to mqtt.hellovneet.local:1883',
      type: 'mqtt',
    },
  ]);

  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logs to bottom when updated
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic simulated sensor packet telemetry
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;

      // Alternate topics
      const topics = [
        {
          topic: 'iot/sensors/dht22',
          payload: JSON.stringify({ temp_c: temperature, hum_pct: humidity }),
          type: 'telemetry' as const,
        },
        {
          topic: 'iot/sensors/sonar',
          payload: JSON.stringify({ dist_cm: distance, echo_us: Math.round(distance * 58) }),
          type: 'telemetry' as const,
        },
        {
          topic: 'iot/actuators/servo',
          payload: JSON.stringify({ angle: servoAngle, pwm_us: 1000 + Math.round((servoAngle / 180) * 1000) }),
          type: 'gpio' as const,
        },
      ];

      const sample = topics[Math.floor(Math.random() * topics.length)];

      setLogs((prev) => [
        ...prev.slice(-18),
        {
          id: Math.random().toString(),
          timestamp: timeStr,
          topic: sample.topic,
          payload: sample.payload,
          type: sample.type,
        },
      ]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isStreaming, temperature, humidity, distance, servoAngle]);

  const addManualLog = (topic: string, payload: string, type: 'telemetry' | 'gpio' | 'wifi' | 'mqtt') => {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;

    setLogs((prev) => [
      ...prev.slice(-18),
      {
        id: Math.random().toString(),
        timestamp: timeStr,
        topic,
        payload,
        type,
      },
    ]);
  };

  const handleToggleGpio2 = () => {
    const next = !gpio2Led;
    setGpio2Led(next);
    addManualLog('esp32/gpio/2', `DigitalWrite(2, ${next ? 'HIGH' : 'LOW'})`, 'gpio');
  };

  const triggerMotionSensor = () => {
    setPirMotion(true);
    addManualLog('iot/sensors/pir', 'PIR_INTERRUPT: MOTION_DETECTED [RISING_EDGE]', 'telemetry');
    setTimeout(() => {
      setPirMotion(false);
      addManualLog('iot/sensors/pir', 'PIR_RESET: STANDBY [FALLING_EDGE]', 'telemetry');
    }, 2800);
  };

  const sweepServo = () => {
    const target = servoAngle > 90 ? 15 : 165;
    setServoAngle(target);
    addManualLog('iot/actuators/servo', `SERVO_SWEEP -> Target: ${target}°`, 'gpio');
  };

  // Color mapping for NeoPixel ring
  const getNeoPixelColors = () => {
    switch (ledMode) {
      case 'rainbow':
        return ['#ff4b4b', '#ff9f5a', '#ffd09e', '#7cffb2', '#7de2ff', '#a98cff', '#ff7ec9', '#ff3b88'];
      case 'cyan':
        return Array(8).fill('#7de2ff');
      case 'amber':
        return Array(8).fill('#ff9f5a');
      case 'emerald':
        return Array(8).fill('#7cffb2');
      case 'alert':
        return ['#ff3b3b', '#ff3b3b', '#ffffff', '#ffffff', '#ff3b3b', '#ff3b3b', '#ffffff', '#ffffff'];
      default:
        return Array(8).fill('#7de2ff');
    }
  };

  const neoPixelColors = getNeoPixelColors();

  return (
    <section id="iot-lab" className="w-[min(1180px,92vw)] mx-auto py-24 sm:py-32 relative z-10">
      {/* Section Header */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-[50px_1fr_auto] gap-4 md:gap-6 items-end mb-12">
          <span className="font-mono-custom text-xs text-[#7de2ff] pb-1 font-semibold hidden md:block">
            04
          </span>
          <div>
            <div className="flex items-center gap-3 md:hidden mb-2">
              <span className="font-mono-custom text-xs text-[#7de2ff] font-semibold">04</span>
              <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase">
                HARDWARE LAB &amp; CIRCUIT SIMULATION
              </p>
            </div>
            <p className="font-mono-custom text-[9px] tracking-[0.18em] text-[#657383] uppercase hidden md:block mb-2">
              HARDWARE LAB &amp; CIRCUIT SIMULATION
            </p>
            <h2 className="font-display font-semibold text-[clamp(34px,5vw,58px)] leading-[0.96] tracking-[-0.05em] text-[var(--text)]">
              Interactive <em className="not-italic text-[#7de2ff]">IoT Workbench.</em>
            </h2>
          </div>
          <p className="max-w-[320px] text-xs text-[#8d9aaa] leading-relaxed">
            Test sensors, trigger GPIO interrupts, adjust sonar distance and monitor live MQTT telemetry packets.
          </p>
        </div>
      </Reveal>

      {/* Main Workbench Stage Container */}
      <div className="border border-white/10 rounded-[32px] bg-gradient-to-br from-white/[0.035] to-white/[0.01] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient Halo */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7de2ff]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Control Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10 relative z-10">
          <div className="flex flex-wrap items-center gap-3 font-mono-custom text-[10px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7de2ff]/10 border border-[#7de2ff]/30 text-[#7de2ff] font-medium">
              <Cpu className="w-3 h-3" />
              ESP32-WROOM-32D
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#8d9aaa]">
              <Wifi className="w-3 h-3 text-[#7cffb2]" />
              Wi-Fi: CONNECTED (-48 dBm)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#8d9aaa]">
              <Radio className="w-3 h-3 text-[#ff9f5a]" />
              MQTT: 115200 BAUD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono-custom transition-all cursor-pointer ${
                isStreaming
                  ? 'border-[#7cffb2]/40 bg-[#7cffb2]/10 text-[#7cffb2]'
                  : 'border-white/15 bg-white/[0.04] text-[#8d9aaa] hover:text-white'
              }`}
            >
              <Activity className={`w-3 h-3 ${isStreaming ? 'animate-pulse' : ''}`} />
              <span>{isStreaming ? 'STREAM: LIVE' : 'STREAM: PAUSED'}</span>
            </button>
            <button
              onClick={() => {
                setDistance(38);
                setTemperature(25.4);
                setHumidity(52);
                setServoAngle(75);
                setGpio2Led(true);
                addManualLog('sys/reset', 'RESTORED_WORKBENCH_FACTORY_PRESETS', 'wifi');
              }}
              title="Reset to defaults"
              className="p-1.5 rounded-xl border border-white/10 bg-white/[0.03] text-[#8d9aaa] hover:text-white hover:border-white/30 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Hardware Breadboard (Left) & Controls/Serial Stream (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column: Interactive Microcontroller PCB & Hardware Modules (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Visual ESP32 PCB Layout */}
            <div
              id="iot-esp32-pcb"
              className="relative p-6 sm:p-8 rounded-3xl border border-[#7de2ff]/30 bg-gradient-to-br from-[#08121a] via-[#0b1723] to-[#0d1c2b] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(125,226,255,0.06)] overflow-hidden"
            >
              {/* Gold PCB Grid Ground Plane Dots */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#ffd09e 0.75px, transparent 0.75px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Animated PCB Circuit Copper Traces */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path d="M 50 40 L 140 40 L 170 80 L 320 80" stroke="#ffd09e" strokeWidth="1" fill="none" />
                <path d="M 50 180 L 120 180 L 160 140 L 260 140" stroke="#7de2ff" strokeWidth="1" fill="none" className="animate-dash-flow" />
                <path d="M 280 240 L 360 240 L 400 200" stroke="#7cffb2" strokeWidth="1" fill="none" />
                <circle cx="170" cy="80" r="3" fill="#ffd09e" />
                <circle cx="160" cy="140" r="3" fill="#7de2ff" />
              </svg>

              {/* PCB Silkscreen Header */}
              <div className="flex items-center justify-between font-mono-custom text-[8px] text-[#ffd09e] tracking-widest uppercase mb-6 relative z-10">
                <span>HELLOVNEET // HARDWARE LAB REV 3.2</span>
                <span className="text-[#7de2ff]">ESP32-DEVKIT-V1</span>
              </div>

              {/* Hardware Units Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                {/* 1. ESP32 MCU Shield Unit */}
                <div className="p-4 rounded-2xl border border-white/15 bg-[#050b11]/90 shadow-xl flex flex-col justify-between">
                  {/* Metal Shield Can with Laser Engraving */}
                  <div className="p-3.5 rounded-xl border border-slate-600/60 bg-gradient-to-br from-slate-700/50 to-slate-900/80 shadow-inner mb-4 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-300 font-mono-custom text-[9px]">
                      <span className="font-bold tracking-wider">ESP-WROOM-32</span>
                      <Wifi className="w-3.5 h-3.5 text-[#7de2ff]" />
                    </div>
                    <div className="font-mono-custom text-[7px] text-slate-400 mt-1 leading-tight">
                      <div>FCC ID: 2AC7Z-ESPWROOM32</div>
                      <div>2.4GHz Wi-Fi + BT + BLE</div>
                    </div>
                    {/* Meandering PCB Antenna Simulation on Top */}
                    <div className="mt-2.5 h-3 border-t-2 border-b-2 border-[#ffd09e]/70 rounded flex items-center justify-around opacity-60">
                      <span className="w-1 h-full bg-[#ffd09e]/50" />
                      <span className="w-1 h-full bg-[#ffd09e]/50" />
                      <span className="w-1 h-full bg-[#ffd09e]/50" />
                      <span className="w-1 h-full bg-[#ffd09e]/50" />
                    </div>
                  </div>

                  {/* Status LEDs on board */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono-custom text-[8px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff3b3b]" />
                      <span className="text-slate-400">PWR (3.3V)</span>
                    </div>

                    <div
                      onClick={handleToggleGpio2}
                      className="flex items-center gap-1.5 cursor-pointer group/led"
                      title="Click to toggle GPIO2 LED"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          gpio2Led
                            ? 'bg-[#7de2ff] shadow-[0_0_12px_#7de2ff,0_0_20px_#7de2ff]'
                            : 'bg-slate-700'
                        }`}
                      />
                      <span className="text-[#7de2ff] group-hover/led:underline font-semibold">
                        GPIO2: {gpio2Led ? 'HIGH' : 'LOW'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. I2C OLED 128x64 Micro Display */}
                <div className="p-4 rounded-2xl border border-white/15 bg-[#03070b]/95 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between font-mono-custom text-[8px] text-[#7de2ff] mb-2">
                    <span>SSD1306 OLED (0x3C)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7de2ff] animate-ping" />
                  </div>

                  {/* High-contrast Monochrome OLED Screen */}
                  <div className="p-3 rounded-xl border border-[#7de2ff]/40 bg-[#001018] shadow-[inset_0_0_15px_rgba(125,226,255,0.2)] font-mono-custom text-[9px] leading-tight text-[#7de2ff] space-y-1">
                    <div className="flex justify-between border-b border-[#7de2ff]/30 pb-1">
                      <span>VINEET OS v4.2</span>
                      <span>192.168.1.142</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span>TMP: {temperature.toFixed(1)}°C</span>
                      <span>HUM: {humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DIST: {distance} cm</span>
                      <span className={distance < 20 ? 'text-red-400 font-bold' : 'text-[#7cffb2]'}>
                        {distance < 20 ? '! PROXIMITY !' : 'CLEAR'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[8px] text-[#ffd09e] pt-1 border-t border-[#7de2ff]/20">
                      <span>SERVO: {servoAngle}°</span>
                      <span>PIR: {pirMotion ? 'TRIGGER' : 'STANDBY'}</span>
                    </div>
                  </div>

                  <div className="font-mono-custom text-[7px] text-[#627181] text-right mt-2">
                    I2C BUS: SCL(22) • SDA(21)
                  </div>
                </div>
              </div>

              {/* Hardware Sensor Modules Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 relative z-10">
                {/* Sonar HC-SR04 Module */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-[#060e16]/80 flex flex-col items-center text-center">
                  <span className="font-mono-custom text-[8px] text-[#8d9aaa] tracking-wider mb-2">
                    ULTRASONIC HC-SR04
                  </span>
                  {/* Two Sonar Sensor Mesh Transducers */}
                  <div className="flex items-center gap-3 relative my-1">
                    <div className="w-9 h-9 rounded-full border-2 border-slate-400 bg-slate-800 flex items-center justify-center shadow-inner relative">
                      <div className="w-5 h-5 rounded-full border border-dashed border-slate-300 opacity-60" />
                      <span className="absolute text-[7px] font-mono-custom text-slate-400 font-bold">T</span>
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-slate-400 bg-slate-800 flex items-center justify-center shadow-inner relative">
                      <div className="w-5 h-5 rounded-full border border-dashed border-slate-300 opacity-60" />
                      <span className="absolute text-[7px] font-mono-custom text-slate-400 font-bold">R</span>
                    </div>
                    {/* Animated Sonic wavefront pulses */}
                    <span className="absolute -right-4 w-4 h-8 border-r-2 border-[#7de2ff] rounded-r-full animate-ping opacity-60" />
                  </div>
                  <span className="font-mono-custom text-[11px] font-bold text-white mt-1">
                    {distance} cm
                  </span>
                  <span className="font-mono-custom text-[7px] text-[#7de2ff]">
                    ECHO: {Math.round(distance * 58)} µs
                  </span>
                </div>

                {/* NeoPixel 8-LED RGB Ring */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-[#060e16]/80 flex flex-col items-center text-center">
                  <span className="font-mono-custom text-[8px] text-[#8d9aaa] tracking-wider mb-2">
                    WS2812B RGB RING
                  </span>
                  {/* Circular LED array */}
                  <div className="relative w-12 h-12 flex items-center justify-center my-0.5">
                    {neoPixelColors.map((col, i) => {
                      const angle = (i / 8) * (2 * Math.PI) - Math.PI / 2;
                      const r = 18;
                      const cx = 24 + r * Math.cos(angle);
                      const cy = 24 + r * Math.sin(angle);
                      return (
                        <span
                          key={i}
                          className="absolute w-2.5 h-2.5 rounded-full shadow-[0_0_8px_var(--glow)] transition-all duration-300"
                          style={
                            {
                              left: `${cx - 5}px`,
                              top: `${cy - 5}px`,
                              backgroundColor: col,
                              '--glow': col,
                            } as any
                          }
                        />
                      );
                    })}
                    <span className="w-4 h-4 rounded-full bg-black/60 border border-white/20" />
                  </div>
                  <span className="font-mono-custom text-[9px] text-[#ffd09e] uppercase mt-1">
                    MODE: {ledMode}
                  </span>
                  <span className="font-mono-custom text-[7px] text-[#627181]">
                    DIN → GPIO 18 (PWM)
                  </span>
                </div>

                {/* Micro Servo SG90 Motor */}
                <div className="p-3.5 rounded-2xl border border-white/10 bg-[#060e16]/80 flex flex-col items-center text-center">
                  <span className="font-mono-custom text-[8px] text-[#8d9aaa] tracking-wider mb-2">
                    SERVO SG90 MOTOR
                  </span>
                  {/* Rotating Servo Horn */}
                  <div className="relative w-12 h-12 flex items-center justify-center my-0.5">
                    <div className="w-10 h-7 bg-blue-600 rounded-md border border-blue-400 shadow-md flex items-center justify-center relative">
                      <div
                        className="absolute w-7 h-2 bg-white rounded-full shadow origin-left transition-transform duration-300"
                        style={{
                          transform: `rotate(${servoAngle - 90}deg)`,
                          left: '50%',
                        }}
                      />
                      <div className="w-3 h-3 rounded-full bg-slate-900 border border-white z-10" />
                    </div>
                  </div>
                  <span className="font-mono-custom text-[11px] font-bold text-white mt-1">
                    {servoAngle}° ANGLE
                  </span>
                  <span className="font-mono-custom text-[7px] text-[#7cffb2]">
                    PWM: {1000 + Math.round((servoAngle / 180) * 1000)} µs
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Hardware Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-custom text-[10px]">
              <button
                onClick={handleToggleGpio2}
                className="p-3 rounded-xl border border-white/10 hover:border-[#7de2ff]/50 bg-white/[0.02] hover:bg-[#7de2ff]/10 text-white flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#7de2ff]" />
                <span>Toggle LED 2</span>
              </button>

              <button
                onClick={triggerMotionSensor}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  pirMotion
                    ? 'border-red-400 bg-red-500/20 text-red-300'
                    : 'border-white/10 hover:border-[#ffd09e]/50 bg-white/[0.02] hover:bg-[#ffd09e]/10 text-white'
                }`}
              >
                <Eye className="w-4 h-4 text-[#ffd09e]" />
                <span>{pirMotion ? 'Motion Detected!' : 'Trigger PIR'}</span>
              </button>

              <button
                onClick={sweepServo}
                className="p-3 rounded-xl border border-white/10 hover:border-[#7cffb2]/50 bg-white/[0.02] hover:bg-[#7cffb2]/10 text-white flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-[#7cffb2]" />
                <span>Sweep Servo</span>
              </button>

              <button
                onClick={() => {
                  const modes: LedMode[] = ['rainbow', 'cyan', 'amber', 'emerald', 'alert'];
                  const nextIdx = (modes.indexOf(ledMode) + 1) % modes.length;
                  setLedMode(modes[nextIdx]);
                  addManualLog('iot/rgb/mode', `NEOPIXEL_PATTERN -> ${modes[nextIdx].toUpperCase()}`, 'gpio');
                }}
                className="p-3 rounded-xl border border-white/10 hover:border-[#a98cff]/50 bg-white/[0.02] hover:bg-[#a98cff]/10 text-white flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#a98cff]" />
                <span>Change RGB</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Sliders & Live MQTT Serial Console (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Real-time Hardware Controls Sliders Card */}
            <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono-custom text-[10px] text-[#7de2ff] uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  LIVE PARAMETERS
                </span>
                <span className="text-[#8d9aaa]">ANALOG / PWM</span>
              </div>

              <div className="space-y-4 font-mono-custom">
                {/* 1. Sonar Distance Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="text-[11px] text-[#8d9aaa]">Ultrasonic Distance:</span>
                    <span className="text-[#7de2ff] font-bold">{distance} cm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7de2ff]"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                    <span>5 cm (Blind zone)</span>
                    <span>180 cm (Far)</span>
                  </div>
                </div>

                {/* 2. DHT22 Temperature Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="text-[11px] text-[#8d9aaa] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#ff9f5a]" />
                      Temperature:
                    </span>
                    <span className="text-[#ff9f5a] font-bold">{temperature.toFixed(1)} °C</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    step="0.2"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ff9f5a]"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                    <span>10°C (Cool)</span>
                    <span>45°C (High Heat)</span>
                  </div>
                </div>

                {/* 3. DHT22 Humidity Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="text-[11px] text-[#8d9aaa] flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-[#7de2ff]" />
                      Relative Humidity:
                    </span>
                    <span className="text-[#7de2ff] font-bold">{humidity} %</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="95"
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7de2ff]"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                    <span>20% (Dry)</span>
                    <span>95% (Condensation)</span>
                  </div>
                </div>

                {/* 4. Servo Angle Slider */}
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                    <span className="text-[11px] text-[#8d9aaa] flex items-center gap-1">
                      <RotateCw className="w-3 h-3 text-[#7cffb2]" />
                      Servo Horn Angle:
                    </span>
                    <span className="text-[#7cffb2] font-bold">{servoAngle} °</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={servoAngle}
                    onChange={(e) => setServoAngle(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7cffb2]"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                    <span>0°</span>
                    <span>90° (Neutral)</span>
                    <span>180°</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Serial Monitor & MQTT Packet Console */}
            <div className="p-5 rounded-3xl border border-white/10 bg-[#03060a]/95 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 font-mono-custom text-[10px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-[#7de2ff]" />
                  <span>SERIAL MONITOR (COM3)</span>
                </div>
                <div className="flex items-center gap-3 text-[9px]">
                  <span className="text-[#7cffb2] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7cffb2] animate-pulse" />
                    115200 8-N-1
                  </span>
                  <button
                    onClick={() => setLogs([])}
                    className="text-[#647180] hover:text-white transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Log Terminal Window */}
              <div
                ref={logContainerRef}
                className="h-[200px] overflow-y-auto space-y-1.5 font-mono-custom text-[10px] pr-2 scrollbar-thin scrollbar-thumb-white/10"
              >
                {logs.length === 0 ? (
                  <div className="text-slate-600 text-center py-10">No packet data yet...</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="leading-relaxed break-all">
                      <span className="text-[#566473] select-none mr-2">[{log.timestamp}]</span>
                      <span
                        className={`font-semibold mr-1.5 ${
                          log.type === 'telemetry'
                            ? 'text-[#7de2ff]'
                            : log.type === 'gpio'
                            ? 'text-[#ffd09e]'
                            : log.type === 'mqtt'
                            ? 'text-[#7cffb2]'
                            : 'text-[#a98cff]'
                        }`}
                      >
                        {log.topic}:
                      </span>
                      <span className="text-slate-300">{log.payload}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Console Footnote */}
              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between font-mono-custom text-[8px] text-[#627181]">
                <span>RX/TX BUFFER: 1024 BYTES</span>
                <span className="text-[#7de2ff]">MQTT PROTOCOL v3.1.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Sensor Dashboard & Oscilloscope Chart Widget */}
        <IoTSensorChartWidget
          currentTemp={temperature}
          currentHumidity={humidity}
          currentDistance={distance}
          isStreaming={isStreaming}
          onToggleStream={() => setIsStreaming(!isStreaming)}
        />
      </div>
    </section>
  );
}
