import { isEligibleForAssignment } from '../../../libs/backend/modules/src/lib/rescuer-eligibility';

describe('isEligibleForAssignment', () => {
  it('rejects unverified applicants from the assignment pool', () => {
    expect(
      isEligibleForAssignment({
        status: 'PENDING',
        isAvailableNow: true,
        userStatus: 'ACTIVE',
      }),
    ).toBe(false);
  });

  it('allows only verified, active, available rescuers', () => {
    expect(
      isEligibleForAssignment({
        status: 'VERIFIED',
        isAvailableNow: true,
        userStatus: 'ACTIVE',
      }),
    ).toBe(true);
  });

  it('removes suspended rescuers from the assignment pool', () => {
    expect(
      isEligibleForAssignment({
        status: 'SUSPENDED',
        isAvailableNow: true,
        userStatus: 'ACTIVE',
      }),
    ).toBe(false);
  });

  it('requires the user account to stay active', () => {
    expect(
      isEligibleForAssignment({
        status: 'VERIFIED',
        isAvailableNow: true,
        userStatus: 'INACTIVE',
      }),
    ).toBe(false);
  });
});
