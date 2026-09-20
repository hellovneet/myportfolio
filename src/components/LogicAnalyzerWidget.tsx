import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  Sliders,
  Cpu,
  Zap,
  Info,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

type ProtocolMode = 'i2c' | 'uart' | 'spi';

interface PacketToken {
  timeMs: number;
  label: string;
  type: 'start' | 'addr' | 'ack' | 'data' | 'stop';
  color: string;
}

export function LogicAnalyzerWidget() {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [protocol, setProtocol] = useState<ProtocolMode>('i2c');
  const [timebaseUs, setTimebaseUs] = useState<number>(50); // micro-seconds per div
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);

  // Packets for the selected protocol
  const packets: Record<ProtocolMode, PacketToken[]> = {
    i2c: [
      { timeMs: 40, label: 'START', type: 'start', color: '#ff7ec9' },
      { timeMs: 120, label: 'ADDR: 0x3C [W]', type: 'addr', color: '#7de2ff' },
      { timeMs: 220, label: 'ACK: 0', type: 'ack', color: '#7cffb2' },
      { timeMs: 310, label: 'REG: 0x40', type: 'data', color: '#ffd09e' },
      { timeMs: 410, label: 'ACK: 0', type: 'ack', color: '#7cffb2' },
      { timeMs: 500, label: 'PAYLOAD: 0xAF', type: 'data', color: '#a98cff' },
      { timeMs: 600, label: 'STOP', type: 'stop', color: '#ff4b4b' },
    ],
    uart: [
      { timeMs: 50, label: 'IDLE (HIGH)', type: 'start', color: '#8d9aaa' },
      { timeMs: 120, label: 'START (0)', type: 'start', color: '#ff7ec9' },
      { timeMs: 240, label: "CHAR 'O' (0x4F)", type: 'data', color: '#7de2ff' },
      { timeMs: 420, label: "CHAR 'K' (0x4B)", type: 'data', color: '#7cffb2' },
      { timeMs: 580, label: 'STOP (1)', type: 'stop', color: '#ff4b4b' },
    ],
    spi: [
      { timeMs: 40, label: 'CS LOW', type: 'start', color: '#ff7ec9' },
      { timeMs: 140, label: 'CMD: 0x03 READ', type: 'addr', color: '#7de2ff' },
      { timeMs: 280, label: 'ADDR: 0x0010', type: 'data', color: '#ffd09e' },
      { timeMs: 460, label: 'MISO: 0x5A7E', type: 'data', color: '#7cffb2' },
      { timeMs: 600, label: 'CS HIGH', type: 'stop', color: '#ff4b4b' },
    ],
  };

  // Channels definition
  const channelLabels: Record<ProtocolMode, { ch: string; name: string; color: string }[]> = {
    i2c: [
      { ch: 'D0', name: 'I2C_SCL (Clock)', color: '#ffd09e' },
      { ch: 'D1', name: 'I2C_SDA (Data)', color: '#7de2ff' },
      { ch: 'D2', name: 'GPIO_INT (PIR Alert)', color: '#ff7ec9' },
      { ch: 'D3', name: 'PWM_CH1 (Servo 50Hz)', color: '#7cffb2' },
    ],
    uart: [
      { ch: 'D0', name: 'UART_TX (115200)', color: '#7de2ff' },
      { ch: 'D1', name: 'UART_RX (Echo)', color: '#7cffb2' },
      { ch: 'D2', name: 'RTS / CTS (Flow)', color: '#a98cff' },
      { ch: 'D3', name: 'BAUD_TICK (8.68µs)', color: '#ffd09e' },
    ],
    spi: [
      { ch: 'D0', name: 'SPI_SCK (10 MHz)', color: '#ffd09e' },
      { ch: 'D1', name: 'SPI_MOSI (Host Out)', color: '#7de2ff' },
      { ch: 'D2', name: 'SPI_MISO (Chip In)', color: '#7cffb2' },
      { ch: 'D3', name: 'SPI_CS (Chip Select)', color: '#ff7ec9' },
    ],
  };

  // Waveform drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      // Clear dark background
      ctx.fillStyle = '#03080e';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid divisions
      ctx.strokeStyle = 'rgba(125, 226, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridStep = 40;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      const numChannels = 4;
      const channelHeight = height / numChannels;
      const channels = channelLabels[protocol];

      if (isRunning) {
        offsetRef.current += 1.8;
      }
      const scrollOffset = offsetRef.current;

      // Draw each channel
      channels.forEach((ch, idx) => {
        const top = idx * channelHeight;
        const baseline = top + channelHeight - 8;
        const highline = top + 14;

        // Baseline divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, top + channelHeight);
        ctx.lineTo(width, top + channelHeight);
        ctx.stroke();

        // Waveform logic
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = ch.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();

        let prevHigh = false;

        for (let x = 0; x < width; x += 1) {
          const sampleTime = (x + scrollOffset) * 0.08;
          let isHigh = false;

          if (protocol === 'i2c') {
            if (idx === 0) {
              // I2C Clock: square pulses
              isHigh = Math.sin(sampleTime * 2.2) > 0;
            } else if (idx === 1) {
              // I2C Data: pseudo-random data words with holds
              const word = Math.floor(sampleTime * 0.55);
              isHigh = (word % 3 === 0 || word % 5 === 0) && Math.sin(sampleTime * 0.8) > -0.2;
            } else if (idx === 2) {
              // PIR interrupt: occasional pulse
              isHigh = Math.sin(sampleTime * 0.18) > 0.85;
            } else {
              // PWM: Duty cycle 75%
              const cycle = (sampleTime * 1.5) % (Math.PI * 2);
              isHigh = cycle < Math.PI * 1.4;
            }
          } else if (protocol === 'uart') {
            if (idx === 0) {
              // TX bursts
              const frame = Math.floor(sampleTime * 0.4);
              isHigh = (frame % 2 === 0 && Math.sin(sampleTime * 1.8) > -0.1) || Math.sin(sampleTime * 0.25) > 0.4;
            } else if (idx === 1) {
              // RX echo
              const frame = Math.floor((sampleTime - 12) * 0.4);
              isHigh = frame % 3 === 0 && Math.sin(sampleTime * 1.6) > 0;
            } else if (idx === 2) {
              // RTS
              isHigh = Math.sin(sampleTime * 0.3) > -0.5;
            } else {
              // Baud tick
              isHigh = Math.sin(sampleTime * 3.5) > 0.7;
            }
          } else {
            // SPI
            if (idx === 0) {
              // SCK fast burst
              const csHigh = Math.sin(sampleTime * 0.2) > 0.6;
              isHigh = !csHigh && Math.sin(sampleTime * 4.0) > 0;
            } else if (idx === 1) {
              // MOSI
              isHigh = Math.sin(sampleTime * 1.3) > 0.1;
            } else if (idx === 2) {
              // MISO
              isHigh = Math.sin((sampleTime + 4) * 1.1) > -0.2;
            } else {
              // CS active low
              isHigh = Math.sin(sampleTime * 0.2) > 0.6;
            }
          }

          const currentY = isHigh ? highline : baseline;

          if (x === 0) {
            ctx.moveTo(x, currentY);
          } else {
            if (isHigh !== prevHigh) {
              // Vertical transition edge
              ctx.lineTo(x, prevHigh ? baseline : highline);
            }
            ctx.lineTo(x, currentY);
          }
          prevHigh = isHigh;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
      });

      // Hover measurement crosshair
      if (hoveredX !== null && hoveredX >= 0 && hoveredX <= width) {
        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hoveredX, 0);
        ctx.lineTo(hoveredX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Measurement badge
        const timeUs = Math.round(hoveredX * (timebaseUs / 40));
        ctx.fillStyle = '#050b12';
        ctx.strokeStyle = '#7de2ff';
        ctx.lineWidth = 1;
        ctx.fillRect(hoveredX + 6, 8, 85, 20);
        ctx.strokeRect(hoveredX + 6, 8, 85, 20);

        ctx.fillStyle = '#7de2ff';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`T = ${timeUs} µs`, hoveredX + 12, 22);
      }

      if (running) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, protocol, timebaseUs, hoveredX]);

  // Adjust canvas pixel resolution to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }, []);

  return (
    <div
      id="digital-logic-analyzer"
      className="mt-8 border border-white/10 rounded-3xl bg-gradient-to-br from-white/[0.035] to-white/[0.01] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#7de2ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Control ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 font-mono-custom text-[9px] tracking-widest text-[#7de2ff] uppercase mb-1">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#7de2ff]/10 border border-[#7de2ff]/30 font-semibold">
              <Activity className="w-3 h-3 text-[#7de2ff] animate-pulse" />
              DIGITAL LOGIC ANALYZER
            </span>
            <span className="text-[#8d9aaa]">24MS/s &bull; 4 CHANNELS &bull; 3.3V CMOS</span>
          </div>
          <h3 className="font-display font-semibold text-xl text-[var(--text)] tracking-tight">
            Protocol Bus &amp; Signal Analyzer
          </h3>
        </div>

        {/* Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Protocol selector */}
          <div className="p-1 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center gap-1 font-mono-custom text-[10px]">
            <button
              onClick={() => setProtocol('i2c')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                protocol === 'i2c'
                  ? 'bg-[#7de2ff]/20 text-[#7de2ff] border border-[#7de2ff]/40 font-semibold'
                  : 'text-[#8d9aaa] hover:text-white'
              }`}
            >
              I2C (100kHz)
            </button>
            <button
              onClick={() => setProtocol('uart')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                protocol === 'uart'
                  ? 'bg-[#7cffb2]/20 text-[#7cffb2] border border-[#7cffb2]/40 font-semibold'
                  : 'text-[#8d9aaa] hover:text-white'
              }`}
            >
              UART (115.2k)
            </button>
            <button
              onClick={() => setProtocol('spi')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                protocol === 'spi'
                  ? 'bg-[#ffd09e]/20 text-[#ffd09e] border border-[#ffd09e]/40 font-semibold'
                  : 'text-[#8d9aaa] hover:text-white'
              }`}
            >
              SPI (10MHz)
            </button>
          </div>

          {/* Timebase toggle */}
          <div className="flex items-center gap-1 font-mono-custom text-[10px]">
            <button
              onClick={() => setTimebaseUs((prev) => (prev === 25 ? 100 : prev === 50 ? 25 : 50))}
              className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-[#8d9aaa] hover:text-white hover:border-white/20 transition-all cursor-pointer"
              title="Toggle horizontal timebase"
            >
              {timebaseUs} µs/div
            </button>
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-xl border font-mono-custom text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isRunning
                ? 'border-[#7cffb2]/40 bg-[#7cffb2]/10 text-[#7cffb2]'
                : 'border-white/15 bg-white/[0.04] text-[#8d9aaa] hover:text-white'
            }`}
            title={isRunning ? 'Freeze signal stream' : 'Resume live sampling'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Protocol Packet Decoded Strip */}
      <div className="mb-4 p-3 rounded-2xl border border-white/10 bg-[#050b12]/80 relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono-custom text-[9px] text-[#8d9aaa]">
          <span className="font-semibold text-white uppercase">HARDWARE DECODER:</span>
          <span>CH0 + CH1</span>
        </div>

        {/* Dynamic Packet Tokens */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono-custom text-[9px]">
          {packets[protocol].map((pkt, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded border text-white font-medium flex items-center gap-1"
              style={{
                borderColor: `${pkt.color}50`,
                backgroundColor: `${pkt.color}15`,
                color: pkt.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: pkt.color }}
              />
              {pkt.label}
            </span>
          ))}
        </div>
      </div>

      {/* Logic Analyzer Stage: Channel Headers (Left) + Canvas Grid (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 relative z-10">
        {/* Channel Labels Column */}
        <div className="flex flex-col justify-between py-2 space-y-2 select-none">
          {channelLabels[protocol].map((ch) => (
            <div
              key={ch.ch}
              className="h-[46px] p-2 rounded-xl border border-white/10 bg-[#04080e] flex flex-col justify-center shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono-custom text-[10px] font-bold"
                  style={{ color: ch.color }}
                >
                  {ch.ch}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[9px] font-mono-custom text-[#8d9aaa] truncate">
                {ch.name}
              </span>
            </div>
          ))}
        </div>

        {/* Real-time Oscilloscope Waveform Canvas */}
        <div className="relative rounded-2xl border border-white/15 overflow-hidden bg-[#03080e] h-[200px] shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredX(e.clientX - rect.left);
            }}
            onMouseLeave={() => setHoveredX(null)}
          />

          {/* Time markers bar at bottom */}
          <div className="absolute bottom-1 inset-x-2 flex justify-between font-mono-custom text-[8px] text-[#627181] pointer-events-none select-none">
            <span>0.0 µs</span>
            <span>200.0 µs</span>
            <span>400.0 µs</span>
            <span>600.0 µs</span>
            <span>800.0 µs</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono-custom text-[9px] text-[#627181] relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-[#7de2ff] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#7cffb2]" />
            TRIGGER: AUTO (RISING EDGE ON D0)
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">SAMPLE DEPTH: 16K SAMPLES</span>
        </div>

        <span className="text-[#ffd09e]">HOVER CANVAS TO INSPECT TIME DELTA (Δt)</span>
      </div>
    </div>
  );
}
