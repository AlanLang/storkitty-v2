import {
  createFolder,
  type CreateFolderDto,
  createFolderSchema,
} from "@/api/folder/create";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FolderPlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface FolderCreateDialogProps {
  path: string;
  isOpen: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

export function FolderCreateDialog({
  path,
  isOpen,
  onCancel,
  onFinish,
}: FolderCreateDialogProps) {
  const form = useForm<CreateFolderDto>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      path: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      onFinish();
    },
  });

  const handleConfirm = async () => {
    mutate({ name: form.getValues().name, path });
  };

  const handleClose = () => {
    if (isPending) return;
    onCancel();
  };

  const canCreate = form.formState.isValid && !isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4"
          >
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FolderPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-left">创建新文件夹</DialogTitle>
                  <DialogDescription className="text-left">
                    在当前位置创建一个新的文件夹
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label
                        htmlFor="directory-name"
                        className="text-sm font-medium"
                      >
                        文件夹名称
                      </Label>
                      <Input
                        {...field}
                        placeholder="请输入文件夹名称"
                        autoFocus
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  💡 提示：文件夹名称不能包含特殊字符，且不能与系统保留名冲突
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={!canCreate}
                className="gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FolderPlus className="h-4 w-4" />
                )}
                {isPending ? "创建中..." : "创建文件夹"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
