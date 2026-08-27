'use client';

import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmergencyRescuesCountQuery } from '@/lib/graphql/hooks/rescue.hooks';

export function EmergencyHeaderButton({
  role,
  onClick,
}: {
  role: string;
  onClick?: () => void;
}) {
  const isResponder = [
    'ADMIN',
    'SUPER_ADMIN',
    'DISTRICT_COORDINATOR',
    'VOLUNTEER',
    'VERIFIED_RESCUER',
  ].includes(role);
  const { data } = useEmergencyRescuesCountQuery({ skip: !isResponder });
  const count = data?.emergencyRescuesCount || 0;

  return (
    <Button
      size="sm"
      variant="destructive"
      className="relative h-10 font-bold"
      onClick={onClick}
    >
      <Phone className="mr-2 h-4 w-4" />
      Emergency
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-red-600 px-1 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Button>
  );
}
