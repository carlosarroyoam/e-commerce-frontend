export interface AlertDialogData {
  title: string;
  description?: string;
  primaryButtonLabel?: string;
  showSecondaryButton?: boolean;
  secondaryButtonLabel?: string;
}

export interface AlertDialogResult {
  accepted: boolean;
}
