import { renameFolder } from "@/api/folder/rename";
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
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { FolderPen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FolderRenameDialogProps {
  path: string;
  name: string;
  isOpen: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

export function FolderRenameDialog({
  path,
  name,
  isOpen,
  onCancel,
  onFinish,
}: FolderRenameDialogProps) {
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    if (isOpen) {
      setNewName(name);
    }
  }, [isOpen, name]);

  const { mutate, isPending } = useMutation({
    mutationFn: renameFolder,
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
              <DialogTitle className="text-left">重命名文件夹</DialogTitle>
              <DialogDescription className="text-left">
                请输入新的文件夹名称
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">文件夹名称</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="输入文件夹名称"
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || !newName || newName === name}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
