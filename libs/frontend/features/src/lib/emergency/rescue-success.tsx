'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Phone, MapPin } from 'lucide-react';
import { Button, Card, CardContent } from '@snake-rescue/ui';

interface RescueSuccessProps {
  ticketId: string;
  phone: string;
  address: string;
  municipality: string;
  onClose?: () => void;
}

const SAFETY_TIPS = [
  '🚷 Keep distance from the snake (≥ 3 meters)',
  '📸 Photo from safe distance — DO NOT touch',
  '🚪 Close doors/windows if indoors',
  '🏥 If bitten, go to Lumbini Provincial Hospital immediately',
];

export function RescueSuccess({
  ticketId,
  phone,
  address,
  municipality,
  onClose,
}: RescueSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="max-w-lg w-full"
      >
        <Card className="border-primary/30">
          <CardContent className="p-10 text-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary"
            >
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Help Is Coming!</h1>
              <p className="text-primary text-lg font-semibold">
                Rescue team has been alerted
              </p>
            </div>

            <div className="bg-card/50 rounded-2xl p-4 border border-primary/20">
              <p className="text-muted-foreground text-sm mb-1">Your Ticket ID</p>
              <p className="text-3xl font-mono font-bold text-primary">BSR-{ticketId}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-left">
                  Our team will call <span className="font-medium">{phone}</span> within 5–10
                  minutes
                </span>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-left">
                  Location: <span className="font-medium">{address}, {municipality}</span>
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-2">
              <p className="text-muted-foreground text-sm font-medium mb-2">
                While you wait — STAY SAFE:
              </p>
              {SAFETY_TIPS.map(tip => (
                <div key={tip} className="text-sm bg-muted/50 rounded-lg p-2">
                  {tip}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                <a href="tel:9816482570">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">Back Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}