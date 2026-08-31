import {
  classifyConfidence,
  classifySafety,
  detectDangerFromSpecies,
} from '../../../libs/backend/modules/src/ai/application/snake-identification.service';

describe('snake identification service', () => {
  it('classifies high confidence as HIGH_CONFIDENCE', () => {
    expect(classifyConfidence(0.9)).toBe('HIGH_CONFIDENCE');
  });

  it('classifies medium confidence as MEDIUM_CONFIDENCE', () => {
    expect(classifyConfidence(0.7)).toBe('MEDIUM_CONFIDENCE');
  });

  it('classifies low confidence as LOW_CONFIDENCE', () => {
    expect(classifyConfidence(0.5)).toBe('LOW_CONFIDENCE');
  });

  it('treats unknown species as unknown safety state', () => {
    expect(classifySafety(null, 'LOW_CONFIDENCE')).toBe('UNKNOWN');
  });

  it('marks venomous species as high risk when confidence is sufficient', () => {
    expect(detectDangerFromSpecies({ venomous: true }, 'HIGH_CONFIDENCE')).toBe('HIGH_RISK');
  });

  it('marks harmless species as low risk when confidence is sufficient', () => {
    expect(detectDangerFromSpecies({ venomous: false }, 'HIGH_CONFIDENCE')).toBe('LOW_RISK');
  });
});
