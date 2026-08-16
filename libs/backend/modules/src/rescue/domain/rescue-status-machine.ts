/**
 * Rescue Status State Machine
 * Enforces valid status transitions and business rules
 */

export enum RescueStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export class RescueStatusMachine {
  /**
   * Valid status transitions
   */
  private static readonly TRANSITIONS: Record<RescueStatus, RescueStatus[]> = {
    [RescueStatus.PENDING]: [
      RescueStatus.ASSIGNED,
      RescueStatus.CANCELLED,
      RescueStatus.EXPIRED,
    ],
    [RescueStatus.ASSIGNED]: [
      RescueStatus.ACCEPTED,
      RescueStatus.CANCELLED,
      RescueStatus.PENDING, // Admin can unassign
    ],
    [RescueStatus.ACCEPTED]: [
      RescueStatus.IN_PROGRESS,
      RescueStatus.CANCELLED,
    ],
    [RescueStatus.IN_PROGRESS]: [
      RescueStatus.COMPLETED,
      RescueStatus.CANCELLED,
      RescueStatus.CLOSED,
    ],
    [RescueStatus.COMPLETED]: [
      // Terminal state - cannot transition
    ],
    [RescueStatus.CANCELLED]: [
      RescueStatus.PENDING, // Admin can reopen
    ],
    [RescueStatus.CLOSED]: [
      RescueStatus.PENDING, // Admin can reopen
    ],
    [RescueStatus.EXPIRED]: [
      RescueStatus.PENDING, // Admin can reopen
    ],
  };

  /**
   * Check if status transition is valid
   */
  static canTransition(from: RescueStatus, to: RescueStatus): boolean {
    const allowedTransitions = this.TRANSITIONS[from] || [];
    return allowedTransitions.includes(to);
  }

  /**
   * Validate status transition or throw error
   */
  static validateTransition(from: RescueStatus, to: RescueStatus): void {
    if (!this.canTransition(from, to)) {
      throw new Error(
        `Invalid status transition: Cannot change from ${from} to ${to}`
      );
    }
  }

  /**
   * Get all valid next states
   */
  static getValidNextStates(currentStatus: RescueStatus): RescueStatus[] {
    return this.TRANSITIONS[currentStatus] || [];
  }

  /**
   * Check if status is terminal
   */
  static isTerminal(status: RescueStatus): boolean {
    return [
      RescueStatus.COMPLETED,
    ].includes(status);
  }

  /**
   * Check if status allows modifications
   */
  static canModify(status: RescueStatus): boolean {
    return ![
      RescueStatus.COMPLETED,
      RescueStatus.CANCELLED,
      RescueStatus.CLOSED,
      RescueStatus.EXPIRED,
    ].includes(status);
  }

  /**
   * Get status timeline event name
   */
  static getTimelineEvent(status: RescueStatus): string {
    const events: Record<RescueStatus, string> = {
      [RescueStatus.PENDING]: 'RESCUE_CREATED',
      [RescueStatus.ASSIGNED]: 'VOLUNTEER_ASSIGNED',
      [RescueStatus.ACCEPTED]: 'RESCUE_ACCEPTED',
      [RescueStatus.IN_PROGRESS]: 'RESCUE_IN_PROGRESS',
      [RescueStatus.COMPLETED]: 'RESCUE_COMPLETED',
      [RescueStatus.CANCELLED]: 'RESCUE_CANCELLED',
      [RescueStatus.CLOSED]: 'RESCUE_CLOSED',
      [RescueStatus.EXPIRED]: 'RESCUE_EXPIRED',
    };
    return events[status] || 'STATUS_CHANGED';
  }
}
