import { NextResponse } from 'next/server';
import { VectorFingerprintingEngine, NormalizedVector } from '@/lib/fingerprint';

export async function POST(request: Request) {
  try {
    const { baselineVector, liveVector } = await request.json() as { 
      baselineVector: NormalizedVector, 
      liveVector: NormalizedVector 
    };

    if (!baselineVector || !liveVector) {
      return NextResponse.json({ error: 'Missing vectors' }, { status: 400 });
    }

    const similarityScore = VectorFingerprintingEngine.cosineSimilarity(baselineVector, liveVector);
    const evaluation = VectorFingerprintingEngine.evaluateScore(similarityScore);

    return NextResponse.json({
      score: similarityScore,
      status: evaluation.status,
      percentage: evaluation.percentage
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
