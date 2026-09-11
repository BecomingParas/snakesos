/**
 * AI Confirmation Dialog
 * Displays confirmation UI for AI tool write operations
 */

'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface AIConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  toolName: string;
  action: string;
  parameters: Record<string, any>;
  warning?: string;
}

export function AIConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  toolName,
  action,
  parameters,
  warning,
}: AIConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Confirm Action
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div>
              The AI assistant wants to perform the following action:
            </div>

            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{toolName}</Badge>
                <span className="text-sm font-medium">{action}</span>
              </div>

              {Object.keys(parameters).length > 0 && (
                <div className="mt-2 text-xs space-y-1">
                  <div className="font-medium text-foreground">Parameters:</div>
                  {Object.entries(parameters).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-mono text-muted-foreground">
                        {key}:
                      </span>
                      <span className="font-mono">
                        {typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {warning && (
              <div className="flex items-start gap-2 text-warning text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </div>
            )}

            <div className="text-sm">
              Do you want to allow this action to proceed?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm & Execute
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
