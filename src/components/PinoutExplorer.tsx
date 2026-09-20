import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface PinDefinition {
  pin: number;
  gpio: string;
  name: string;
  side: 'left' | 'right';
  type: 'power' | 'adc' | 'i2c' | 'spi' | 'gpio' | 'touch';
  desc: string;
  connectedTo?: string;
  specs: string;
}

const ESP32_PINS: PinDefinition[] = [
  // Left Side (Pins 1 to 15)
  { pin: 1, gpio: 'EN', name: 'ENABLE (RST)', side: 'left', type: 'power', desc: 'Chip enable & hardware reboot pin', specs: 'Active HIGH, internal 10k pull-up' },
  { pin: 2, gpio: 'GPIO 36', name: 'VP / SENSOR_VP', side: 'left', type: 'adc', desc: 'ADC1_CH0 ultra-low-noise preamp input', specs: 'Input only, RTC GPIO 0' },
  { pin: 3, gpio: 'GPIO 39', name: 'VN / SENSOR_VN', side: 'left', type: 'adc', desc: 'ADC1_CH3 analog conversion input', specs: 'Input only, RTC GPIO 3' },
  { pin: 4, gpio: 'GPIO 34', name: 'ADC1_CH6', side: 'left', type: 'adc', desc: 'General analog sensor reading', specs: 'Input only, no software pullup' },
  { pin: 5, gpio: 'GPIO 35', name: 'ADC1_CH7', side: 'left', type: 'adc', desc: 'Light dependent resistor (LDR) channel', specs: 'Input only, 0-3.3V range' },
  { pin: 6, gpio: 'GPIO 32', name: 'ADC1_CH4 / TOUCH 9', side: 'left', type: 'touch', desc: 'Capacitive touch & ADC channel', specs: 'RTC GPIO 9, 3.3V CMOS' },
  { pin: 7, gpio: 'GPIO 33', name: 'ADC1_CH5 / TOUCH 8', side: 'left', type: 'touch', desc: 'Capacitive touch & wake-up pin', specs: 'RTC GPIO 8, 3.3V CMOS' },
  { pin: 8, gpio: 'GPIO 25', name: 'DAC 1 / ADC2_CH8', side: 'left', type: 'gpio', desc: 'True 8-bit digital-to-analog audio out', specs: 'DAC1, RTC GPIO 6' },
  { pin: 9, gpio: 'GPIO 26', name: 'DAC 2 / ADC2_CH9', side: 'left', type: 'gpio', desc: 'True 8-bit DAC output channel 2', specs: 'DAC2, RTC GPIO 7' },
  { pin: 10, gpio: 'GPIO 27', name: 'TOUCH 7 / ADC2_CH7', side: 'left', type: 'touch', desc: 'PIR Motion Sensor Interrupt Line', connectedTo: 'HC-SR501 PIR Motion Sensor', specs: 'Interrupt with wake-on-motion' },
  { pin: 11, gpio: 'GPIO 14', name: 'HSPI_CLK / TOUCH 6', side: 'left', type: 'spi', desc: 'Hardware SPI bus clock signal', specs: 'Fast clocking up to 40MHz' },
  { pin: 12, gpio: 'GPIO 12', name: 'HSPI_MISO / TOUCH 5', side: 'left', type: 'spi', desc: 'SPI Master-In-Slave-Out line', specs: 'Boot strapping pin (MTDI)' },
  { pin: 13, gpio: 'GPIO 13', name: 'HSPI_MOSI / TOUCH 4', side: 'left', type: 'spi', desc: 'SPI Master-Out-Slave-In line', specs: 'RTC GPIO 14, 40mA drive' },
  { pin: 14, gpio: 'GND', name: 'GROUND (0V)', side: 'left', type: 'power', desc: 'System common signal ground', specs: 'Reference plane' },
  { pin: 15, gpio: 'VIN', name: 'RAW POWER IN (5V)', side: 'left', type: 'power', desc: 'AMS1117 LDO Voltage Regulator Input', specs: 'Accepts 4.5V - 9V DC input' },

  // Right Side (Pins 16 to 30)
  { pin: 16, gpio: '3V3', name: 'REGULATED 3.3V OUT', side: 'right', type: 'power', desc: '3.3V Rail powering sensors & ICs', specs: 'Peak 600mA low-dropout supply' },
  { pin: 17, gpio: 'GND', name: 'GROUND (0V)', side: 'right', type: 'power', desc: 'System common signal ground', specs: 'Reference plane' },
  { pin: 18, gpio: 'GPIO 15', name: 'HSPI_CS / TOUCH 3', side: 'right', type: 'spi', desc: 'Hardware SPI Chip Select line', specs: 'Boot strapping pin (MTDO)' },
  { pin: 19, gpio: 'GPIO 2', name: 'ONBOARD BLUE LED', side: 'right', type: 'gpio', desc: 'Onboard status indicator LED', connectedTo: 'SMD Blue LED (COM/STATUS)', specs: 'Strap pin, active HIGH' },
  { pin: 20, gpio: 'GPIO 4', name: 'DHT22 DATA LINE', side: 'right', type: 'gpio', desc: 'Single-wire bi-directional bus', connectedTo: 'DHT22 Temp & Humidity Sensor', specs: 'Requires 4.7kΩ pull-up' },
  { pin: 21, gpio: 'GPIO 16', name: 'UART2 RX / PWM 1', side: 'right', type: 'gpio', desc: 'Hardware UART2 Receive or LEDC PWM', specs: 'General purpose I/O' },
  { pin: 22, gpio: 'GPIO 17', name: 'UART2 TX / PWM 2', side: 'right', type: 'gpio', desc: 'Hardware UART2 Transmit or LEDC PWM', specs: 'General purpose I/O' },
  { pin: 23, gpio: 'GPIO 5', name: 'VSPI_CS / HC-SR04 ECHO', side: 'right', type: 'spi', desc: 'High-speed timer input for sonar pulse', connectedTo: 'HC-SR04 Sonar Echo Pin', specs: 'Time-of-flight capture' },
  { pin: 24, gpio: 'GPIO 18', name: 'VSPI_CLK / SERVO PWM', side: 'right', type: 'spi', desc: '50Hz 16-bit Hardware Timer PWM', connectedTo: 'SG90 Micro Servo Horn', specs: '1.0ms - 2.0ms duty cycle pulse' },
  { pin: 25, gpio: 'GPIO 19', name: 'VSPI_MISO / HC-SR04 TRIG', side: 'right', type: 'spi', desc: 'Ultrasonic 10µs ping trigger pulse', connectedTo: 'HC-SR04 Sonar Trigger Pin', specs: 'Microsecond pulse gen' },
  { pin: 26, gpio: 'GPIO 21', name: 'I2C_SDA (SERIAL DATA)', side: 'right', type: 'i2c', desc: 'Primary hardware I2C Data line', connectedTo: 'SSD1306 OLED / BMP280', specs: 'Internal pullup available' },
  { pin: 27, gpio: 'GPIO 3', name: 'U0RXD (SERIAL RX)', side: 'right', type: 'gpio', desc: 'UART0 Serial Console input', specs: 'CP2102 USB-to-UART bridge' },
  { pin: 28, gpio: 'GPIO 1', name: 'U0TXD (SERIAL TX)', side: 'right', type: 'gpio', desc: 'UART0 Serial Console output', specs: '115200 default debug baud' },
  { pin: 29, gpio: 'GPIO 22', name: 'I2C_SCL (SERIAL CLK)', side: 'right', type: 'i2c', desc: 'Primary hardware I2C Clock line', connectedTo: 'SSD1306 OLED / BMP280', specs: 'Clock stretching supported' },
  { pin: 30, gpio: 'GPIO 23', name: 'VSPI_MOSI / NEOPIXEL', side: 'right', type: 'spi', desc: 'High-speed 800kHz timing data line', connectedTo: 'WS2812B NeoPixel Ring', specs: '800kHz single-wire NZR' },
];

export function PinoutExplorer() {
  const [selectedPin, setSelectedPin] = useState<PinDefinition>(ESP32_PINS[19]); // default GPIO 4 (DHT22)
  const [filter, setFilter] = useState<'all' | 'i2c' | 'spi' | 'adc' | 'power'>('all');

  const getPinColor = (type: PinDefinition['type']) => {
    switch (type) {
      case 'power':
        return '#ff4b4b'; // red
      case 'i2c':
        return '#7de2ff'; // cyan
      case 'spi':
        return '#ffd09e'; // amber
      case 'adc':
        return '#7cffb2'; // emerald
      case 'touch':
        return '#ff7ec9'; // magenta
      default:
        return '#a98cff'; // purple
    }
  };

  const isHighlighted = (pin: PinDefinition) => {
    if (filter === 'all') return true;
    if (filter === 'i2c') return pin.type === 'i2c';
    if (filter === 'spi') return pin.type === 'spi';
    if (filter === 'adc') return pin.type === 'adc';
    if (filter === 'power') return pin.type === 'power';
    return true;
  };

  return (
    <div
      id="esp32-pinout-explorer"
      className="mt-16 p-6 sm:p-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] shadow-2xl relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#7de2ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 font-mono-custom text-[9px] tracking-widest text-[#7de2ff] uppercase mb-1">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#7de2ff]/10 border border-[#7de2ff]/30 font-semibold">
              <Cpu className="w-3 h-3 text-[#7de2ff]" />
              HARDWARE ARCHITECTURE
            </span>
            <span className="text-[#8d9aaa]">ESP32-WROOM-32D &bull; 30-PIN DEVKIT V1</span>
          </div>
          <h3 className="font-display font-semibold text-xl sm:text-2xl text-[var(--text)] tracking-tight">
            Interactive Microcontroller Pinout Matrix
          </h3>
          <p className="text-xs text-[#8d9aaa] mt-1 max-w-[520px]">
            Explore multiplexed silicon buses, ADC/DAC peripherals, and active sensor line mappings powering the IoT bench.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-2xl border border-white/10 bg-white/[0.02] font-mono-custom text-[10px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#7de2ff]/20 text-[#7de2ff] border border-[#7de2ff]/40 font-semibold'
                : 'text-[#8d9aaa] hover:text-white'
            }`}
          >
            All Pins
          </button>
          <button
            onClick={() => setFilter('i2c')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'i2c'
                ? 'bg-[#7de2ff]/20 text-[#7de2ff] border border-[#7de2ff]/40 font-semibold'
                : 'text-[#8d9aaa] hover:text-white'
            }`}
          >
            I2C Bus
          </button>
          <button
            onClick={() => setFilter('spi')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'spi'
                ? 'bg-[#ffd09e]/20 text-[#ffd09e] border border-[#ffd09e]/40 font-semibold'
                : 'text-[#8d9aaa] hover:text-white'
            }`}
          >
            SPI &amp; PWM
          </button>
          <button
            onClick={() => setFilter('adc')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'adc'
                ? 'bg-[#7cffb2]/20 text-[#7cffb2] border border-[#7cffb2]/40 font-semibold'
                : 'text-[#8d9aaa] hover:text-white'
            }`}
          >
            ADC &amp; Analog
          </button>
          <button
            onClick={() => setFilter('power')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'power'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-[#8d9aaa] hover:text-white'
            }`}
          >
            Power Rails
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: Pinout Diagram (Left/Center) + Live Inspector Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 relative z-10 items-start">
        {/* Hardware Chip Board Representation */}
        <div className="p-5 rounded-3xl border border-white/10 bg-[#04080e]/95 relative overflow-hidden shadow-inner">
          {/* Chip Center Graphic */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 font-mono-custom text-[10px] text-[#8d9aaa]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7de2ff] animate-pulse" />
              ESP-WROOM-32 DUAL-CORE XTENSA LX6
            </span>
            <span className="text-[#627181]">CLICK ANY PIN TO INSPECT</span>
          </div>

          {/* DIP Package Simulation Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Left Header Pins (1 to 15) */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono-custom text-[#657383] pb-1 border-b border-white/5 flex justify-between">
                <span>PIN 1-15</span>
                <span>LEFT RAIL</span>
              </div>
              {ESP32_PINS.filter((p) => p.side === 'left').map((p) => {
                const highlighted = isHighlighted(p);
                const isSelected = selectedPin.pin === p.pin;
                const color = getPinColor(p.type);

                return (
                  <button
                    key={p.pin}
                    onClick={() => setSelectedPin(p)}
                    onMouseEnter={() => setSelectedPin(p)}
                    className={`w-full p-2 rounded-xl text-left border font-mono-custom text-[10px] transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white text-white shadow-md scale-[1.02]'
                        : highlighted
                        ? 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                        : 'opacity-30 border-transparent text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-[10px]">{p.gpio}</span>
                    </div>
                    <span className="text-[8px] text-[#657383] shrink-0 font-light">#{p.pin}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Header Pins (16 to 30) */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono-custom text-[#657383] pb-1 border-b border-white/5 flex justify-between">
                <span>RIGHT RAIL</span>
                <span>PIN 16-30</span>
              </div>
              {ESP32_PINS.filter((p) => p.side === 'right').map((p) => {
                const highlighted = isHighlighted(p);
                const isSelected = selectedPin.pin === p.pin;
                const color = getPinColor(p.type);

                return (
                  <button
                    key={p.pin}
                    onClick={() => setSelectedPin(p)}
                    onMouseEnter={() => setSelectedPin(p)}
                    className={`w-full p-2 rounded-xl text-left border font-mono-custom text-[10px] transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white text-white shadow-md scale-[1.02]'
                        : highlighted
                        ? 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
                        : 'opacity-30 border-transparent text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-[10px]">{p.gpio}</span>
                    </div>
                    <span className="text-[8px] text-[#657383] shrink-0 font-light">#{p.pin}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Pin Inspector Card */}
        <div className="p-6 rounded-3xl border border-white/10 bg-[#050b12]/95 shadow-2xl relative flex flex-col justify-between h-full">
          <div>
            {/* Tag & Pin Number */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono-custom font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{
                  backgroundColor: `${getPinColor(selectedPin.type)}15`,
                  color: getPinColor(selectedPin.type),
                  border: `1px solid ${getPinColor(selectedPin.type)}40`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getPinColor(selectedPin.type) }}
                />
                {selectedPin.type.toUpperCase()} DOMAIN
              </span>
              <span className="font-mono-custom text-xs text-[#8d9aaa]">
                PHYSICAL PIN <strong className="text-white">#{selectedPin.pin}</strong>
              </span>
            </div>

            {/* GPIO Title & Silicon Label */}
            <h4 className="font-display font-semibold text-2xl text-white tracking-tight mb-1">
              {selectedPin.gpio}
            </h4>
            <p className="font-mono-custom text-xs text-[#7de2ff] mb-4">
              {selectedPin.name}
            </p>

            {/* Description */}
            <p className="text-xs text-[#8d9aaa] leading-relaxed mb-6">
              {selectedPin.desc}
            </p>

            {/* Active Hardware Connection in Portfolio */}
            {selectedPin.connectedTo ? (
              <div className="p-3.5 rounded-2xl border border-[#7cffb2]/30 bg-[#7cffb2]/[0.06] mb-6 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#7cffb2] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono-custom text-[9px] font-bold text-[#7cffb2] uppercase tracking-wider block">
                    CONNECTED PERIPHERAL ON BENCH:
                  </span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">
                    {selectedPin.connectedTo}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] mb-6 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#8d9aaa] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono-custom text-[9px] font-semibold text-[#8d9aaa] uppercase tracking-wider block">
                    HEADER STATUS:
                  </span>
                  <span className="text-xs text-slate-300 mt-0.5 block">
                    Available GPIO expansion breakout line
                  </span>
                </div>
              </div>
            )}

            {/* Electrical Specs */}
            <div className="space-y-2 font-mono-custom text-[11px] pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-slate-400">
                <span>VOLTAGE LEVEL:</span>
                <span className="text-white font-medium">3.3V CMOS Tolerant</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>MAX CURRENT:</span>
                <span className="text-white font-medium">40 mA Source / Sink</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>FEATURES:</span>
                <span className="text-[#ffd09e] truncate max-w-[200px] text-right">
                  {selectedPin.specs}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hardware Hint */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-mono-custom text-[9px] text-[#627181]">
            <span>XTENSA DUAL CORE 32-BIT</span>
            <span className="text-[#7de2ff]">ESP-IDF V5.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
