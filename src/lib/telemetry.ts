export interface RawTelemetry {
  keystrokes: { key: string; eventType: 'down' | 'up'; timestamp: number }[];
  backspaceCount: number;
  totalTime: number;
  mouseMovements: { x: number; y: number; timestamp: number }[];
  sensorData: { alpha: number; beta: number; gamma: number; timestamp: number }[];
}

export class TelemetryCollector {
  private startTime: number = 0;
  private keystrokes: RawTelemetry['keystrokes'] = [];
  private backspaceCount: number = 0;
  private mouseMovements: RawTelemetry['mouseMovements'] = [];
  private sensorData: RawTelemetry['sensorData'] = [];
  private listening: boolean = false;

  start() {
    this.reset();
    this.startTime = Date.now();
    this.listening = true;
    
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('deviceorientation', this.handleDeviceOrientation);
    }
  }

  stop(): RawTelemetry {
    this.listening = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('deviceorientation', this.handleDeviceOrientation);
    }

    return {
      keystrokes: this.keystrokes,
      backspaceCount: this.backspaceCount,
      totalTime: Date.now() - this.startTime,
      mouseMovements: this.mouseMovements,
      sensorData: this.sensorData,
    };
  }

  reset() {
    this.keystrokes = [];
    this.backspaceCount = 0;
    this.mouseMovements = [];
    this.sensorData = [];
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.listening) return;
    if (e.key === 'Backspace') this.backspaceCount++;
    this.keystrokes.push({ key: e.key, eventType: 'down', timestamp: Date.now() });
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (!this.listening) return;
    this.keystrokes.push({ key: e.key, eventType: 'up', timestamp: Date.now() });
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.listening) return;
    // Throttle slightly
    const now = Date.now();
    if (this.mouseMovements.length > 0 && now - this.mouseMovements[this.mouseMovements.length - 1].timestamp < 50) return;
    this.mouseMovements.push({ x: e.clientX, y: e.clientY, timestamp: now });
  };

  private handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (!this.listening) return;
    const now = Date.now();
    if (this.sensorData.length > 0 && now - this.sensorData[this.sensorData.length - 1].timestamp < 50) return;
    this.sensorData.push({
      alpha: e.alpha || 0,
      beta: e.beta || 0,
      gamma: e.gamma || 0,
      timestamp: now,
    });
  };
}
