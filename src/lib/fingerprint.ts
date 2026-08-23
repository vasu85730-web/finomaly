import { RawTelemetry } from './telemetry';

export type NormalizedVector = number[];

export class VectorFingerprintingEngine {
  static extractVector(raw: RawTelemetry): NormalizedVector {
    // We need to extract meaningful features
    // 1. Average Dwell Time (Thold)
    // 2. Average Flight Time (Tpause)
    // 3. Backspace Frequency (backspaces / total keystrokes)
    // 4. Typing Speed (keystrokes / totalTime)
    // 5. Mouse movement variance/jerkiness (optional/simplified)
    // 6. Sensor tilt averages (simplified)

    let totalDwell = 0;
    let dwellCount = 0;
    let totalFlight = 0;
    let flightCount = 0;

    const keydowns: Record<string, number> = {};
    let lastKeyupTime = 0;

    for (const stroke of raw.keystrokes) {
      if (stroke.eventType === 'down') {
        keydowns[stroke.key] = stroke.timestamp;
        if (lastKeyupTime > 0 && stroke.timestamp > lastKeyupTime) {
          totalFlight += stroke.timestamp - lastKeyupTime;
          flightCount++;
        }
      } else {
        const downTime = keydowns[stroke.key];
        if (downTime) {
          totalDwell += stroke.timestamp - downTime;
          dwellCount++;
          delete keydowns[stroke.key];
        }
        lastKeyupTime = stroke.timestamp;
      }
    }

    const avgDwell = dwellCount > 0 ? totalDwell / dwellCount : 0;
    const avgFlight = flightCount > 0 ? totalFlight / flightCount : 0;
    const totalKeys = raw.keystrokes.length / 2;
    const backspaceFreq = totalKeys > 0 ? raw.backspaceCount / totalKeys : 0;
    const typingSpeed = raw.totalTime > 0 ? totalKeys / (raw.totalTime / 1000) : 0;

    // Mouse jerkiness (average distance between points)
    let totalDistance = 0;
    for (let i = 1; i < raw.mouseMovements.length; i++) {
      const dx = raw.mouseMovements[i].x - raw.mouseMovements[i-1].x;
      const dy = raw.mouseMovements[i].y - raw.mouseMovements[i-1].y;
      totalDistance += Math.sqrt(dx*dx + dy*dy);
    }
    const avgMouseSpeed = raw.mouseMovements.length > 1 && raw.totalTime > 0 
      ? totalDistance / (raw.totalTime / 1000) 
      : 0;

    const vector = [
      avgDwell,
      avgFlight,
      backspaceFreq * 1000, // Scale to be somewhat comparable
      typingSpeed * 10,     // Scale
      avgMouseSpeed
    ];

    return this.normalize(vector);
  }

  static normalize(vector: number[]): NormalizedVector {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector.map(() => 0);
    return vector.map(val => val / magnitude);
  }

  static cosineSimilarity(v1: NormalizedVector, v2: NormalizedVector): number {
    if (v1.length !== v2.length) return 0;
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      mag1 += v1[i] * v1[i];
      mag2 += v2[i] * v2[i];
    }
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
  }

  static evaluateScore(score: number): { status: 'MATCH CONFIRMED' | 'RUSHED STATE (SAFE)' | 'MULE DETECTED', percentage: number } {
    const percentage = Math.round(score * 100);
    if (percentage >= 85) return { status: 'MATCH CONFIRMED', percentage };
    if (percentage >= 65) return { status: 'RUSHED STATE (SAFE)', percentage };
    return { status: 'MULE DETECTED', percentage };
  }
}
