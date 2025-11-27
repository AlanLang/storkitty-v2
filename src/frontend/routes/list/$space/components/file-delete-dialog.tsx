import { deleteFile } from "@/api/file/delete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatFileSize } from "@/lib/file";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface FileDeleteDialogProps {
  path: string;
  name: string;
  isOpen: boolean;
  size?: number;
  onCancel: () => void;
  onFinish: () => void;
}

export function FileDeleteDialog({
  path,
  name,
  size,
  isOpen,
  onCancel,
  onFinish,
}: FileDeleteDialogProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      onFinish();
    },
  });

  const handleClose = () => {
    if (isPending) return;
    onCancel();
  };

  const handleConfirm = async () => {
    mutate({ path, name });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">删除文件</DialogTitle>
              <DialogDescription className="text-left">
                此操作无法撤销
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 overflow-x-hidden">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                <div className="h-4 w-4 rounded bg-muted-foreground/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {size ? formatFileSize(size) : "未知大小"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">
              确定要删除文件 "{name}" 吗？此操作无法撤销。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isPending ? "删除中..." : "确认删除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
