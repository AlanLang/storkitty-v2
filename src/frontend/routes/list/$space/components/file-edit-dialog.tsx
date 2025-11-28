import { getFileContent, saveFileContent } from "@/api/file/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";
import { DIALOG_CONTENT_CLASSNAME } from "./constant";
import { fileExtensions } from "./file-icon";

const Editor = lazy(() => import("@monaco-editor/react"));

interface FileEditDialogProps {
  path: string;
  fileName: string;
  isOpen: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

export function FileEditDialog(props: FileEditDialogProps) {
  const { fileName } = props;

  const isText =
    fileExtensions.text.some((extension) => fileName.endsWith(extension)) ||
    fileExtensions.code.some((extension) => fileName.endsWith(extension));
  if (isText) {
    return <TextFileEditDialog {...props} />;
  }
  return <div>FileEditDialog</div>;
}

export function TextFileEditDialog(props: FileEditDialogProps) {
  const { path, fileName, isOpen, onCancel, onFinish } = props;
  const filePath = `${path}/${fileName}`;
  const [content, setContent] = useState("");
  const fileExtension = fileName.split(".").pop() || "txt";

  const { data, isLoading } = useQuery({
    queryKey: ["file-content", filePath],
    queryFn: () => getFileContent(filePath),
    enabled: isOpen,
  });

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      await saveFileContent(filePath, content);
    },
    onSuccess: () => {
      toast.success("保存成功");
      onFinish();
    },
    onError: () => {
      toast.error("保存失败");
    },
  });

  const getLanguage = (ext: string) => {
    const map: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      json: "json",
      html: "html",
      css: "css",
      md: "markdown",
      txt: "plaintext",
    };
    return map[ext] || "plaintext";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        className={cn(
          DIALOG_CONTENT_CLASSNAME,
          "sm:max-w-[90vw] sm:w-[90vw] sm:h-[90vh] w-full max-w-full h-full sm:rounded-lg rounded-none flex flex-col p-0 gap-0 overflow-hidden",
        )}
      >
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <span>编辑文件: {fileName}</span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <Editor
                height="100%"
                defaultLanguage={getLanguage(fileExtension)}
                value={content}
                onChange={(value) => setContent(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </Suspense>
          )}
        </div>

        <DialogFooter className="p-4 border-t shrink-0 bg-muted/10">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            取消
          </Button>
          <Button onClick={() => save()} disabled={isSaving || isLoading}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
