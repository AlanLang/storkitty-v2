import { deleteFolder } from "@/api/folder/delete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface FolderDeleteDialogProps {
  path: string;
  name: string;
  isOpen: boolean;
  count: number;
  onCancel: () => void;
  onFinish: () => void;
}

export function FolderDeleteDialog({
  path,
  name,
  isOpen,
  count,
  onCancel,
  onFinish,
}: FolderDeleteDialogProps) {
  const [confirmInput, setConfirmInput] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      onFinish();
    },
  });

  const handleClose = () => {
    if (isPending) return;
    onCancel();
  };

  const canDelete = count > 0 ? confirmInput === name : true;

  const handleConfirm = async () => {
    if (!canDelete) return;
    mutate({ path, name });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive animate-heartbeat" />
            </div>
            <div>
              <DialogTitle className="text-left">删除文件夹</DialogTitle>
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
                <div className="h-4 w-4 rounded bg-primary/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {`包含 ${count} 个项目`}
                </p>
              </div>
            </div>
          </div>

          {count > 0 && (
            <div className="space-y-3">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ 警告：此文件夹不为空
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  {`删除此文件夹将同时删除其中的所有 ${count} 个项目，且无法恢复。`}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-input"
                  className="text-sm font-medium block"
                >
                  请输入文件夹名称 "
                  <span className="text-destructive">{name}</span>" 以确认删除：
                </label>
                <input
                  id="confirm-input"
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="输入文件夹名称"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  disabled={isPending}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canDelete || isPending}
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
