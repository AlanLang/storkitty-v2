import { renameFile } from "@/api/file/rename";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { FolderPen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FileRenameDialogProps {
  path: string;
  name: string;
  isOpen: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

export function FileRenameDialog({
  path,
  name,
  isOpen,
  onCancel,
  onFinish,
}: FileRenameDialogProps) {
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    if (isOpen) {
      setNewName(name);
    }
  }, [isOpen, name]);

  const { mutate, isPending } = useMutation({
    mutationFn: renameFile,
    onSuccess: () => {
      onFinish();
    },
  });

  const handleClose = () => {
    if (isPending) return;
    onCancel();
  };

  const handleConfirm = async () => {
    if (!newName || newName === name) {
      return;
    }
    mutate({ path, from: name, to: newName });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FolderPen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">重命名</DialogTitle>
              <DialogDescription className="text-left">
                请输入新的名称
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="请输入名称"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirm();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || !newName || newName === name}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "重命名中..." : "确认"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
