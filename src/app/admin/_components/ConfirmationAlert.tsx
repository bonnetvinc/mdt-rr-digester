import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog';
import { cn } from '~/lib/utils';

type ConfirmationAlertProps = {
  readonly title: string;
  readonly description: string;
  readonly confirmActionLabel: string;
  readonly confirmActionHandler: () => void;
  readonly confirmActionType: 'info' | 'danger';
  readonly cancelActionLabel: string;
  readonly cancelActionHandler: () => void;
  readonly showConfirmationAlert: boolean;
};

export default function ConfirmationAlert({
  title,
  description,
  confirmActionLabel,
  confirmActionHandler,
  confirmActionType,
  cancelActionLabel,
  cancelActionHandler,
  showConfirmationAlert
}: ConfirmationAlertProps) {
  const baseClassName = 'cursor-pointer bg-main text-white';
  const dangerClassName = 'bg-red-600 text-white';

  return (
    <AlertDialog open={showConfirmationAlert}>
      <AlertDialogContent className="border-slate-200 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-2xl text-main">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer border-slate-200" onClick={cancelActionHandler}>
            {cancelActionLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(baseClassName, {
              [dangerClassName]: confirmActionType === 'danger'
            })}
            onClick={confirmActionHandler}
          >
            {confirmActionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
