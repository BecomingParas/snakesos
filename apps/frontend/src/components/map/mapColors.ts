export function getPriorityColor(priority: string): string {
  switch (priority?.toUpperCase()) {
    case 'CRITICAL':
      return '#dc2626';
    case 'HIGH':
      return '#ea580c';
    case 'MEDIUM':
      return '#ca8a04';
    case 'LOW':
      return '#16a34a';
    default:
      return '#6b7280';
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

export function getHospitalColor(status?: string): string {
  switch (status?.toUpperCase()) {
    case 'AVAILABLE':
      return '#16a34a';
    case 'OUT_OF_STOCK':
      return '#dc2626';
    case 'UNKNOWN':
    default:
      return '#ca8a04';
  }
}

export function getHotspotColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'EXTREME':
      return '#7f1d1d';
    case 'VERY_HIGH':
      return '#dc2626';
    case 'HIGH':
      return '#ea580c';
    case 'MODERATE':
      return '#f59e0b';
    case 'LOW':
    default:
      return '#84cc16';
  }
}
