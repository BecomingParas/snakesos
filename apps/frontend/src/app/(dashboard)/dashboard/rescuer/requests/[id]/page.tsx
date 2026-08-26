'use client';

import RescuerHistoryDetailPage from '../../history/[id]/page';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RescuerRequestDetailPage({ params }: PageProps) {
  return <RescuerHistoryDetailPage params={params} />;
}
