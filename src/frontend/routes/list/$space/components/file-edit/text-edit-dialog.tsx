import { getFileContent, saveFileContent } from "@/api/file/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { OnMount } from "@monaco-editor/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Blocks, Copy, Loader2, Save, X } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { DIALOG_CONTENT_CLASSNAME } from "../constant";
import type { FileEditDialogProps } from "./type";

const Editor = lazy(() => import("@monaco-editor/react"));

export function TextFileEditDialog(props: FileEditDialogProps) {
  const { path, fileName, isOpen, onCancel, onFinish } = props;
  const filePath = `${path}/${fileName}`;
  const fileExtension = fileName.split(".").pop() || "txt";
  const editorRef = useRef<Parameters<OnMount>[0]>(null);
  const isChanged = useRef(false);

  useHotkeys(
    "mod+s",
    () => {
      handleSave();
    },
    {
      enabled: isOpen,
      preventDefault: true,
    },
  );

  const { data, isLoading } = useQuery({
    queryKey: ["file-content", filePath],
    queryFn: () => getFileContent(filePath),
    enabled: isOpen,
  });

  const { mutate: saveContent, isPending: isSaving } = useMutation({
    mutationFn: async (content: string) => {
      await saveFileContent(filePath, content);
    },
    onSuccess: () => {
      isChanged.current = false;
      toast.success("保存成功");
    },
  });

  const handleSave = () => {
    saveContent(editorRef.current?.getValue() || "");
  };

  const handleFormat = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  const handleClose = () => {
    if (isChanged.current) {
      onFinish();
    } else {
      onCancel();
    }
    isChanged.current = false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        showCloseButton={false}
        className={cn(
          DIALOG_CONTENT_CLASSNAME,
          "sm:max-w-[90vw] sm:w-[90vw] sm:h-[90vh] w-full max-w-full h-full sm:rounded-lg rounded-none flex flex-col p-0 gap-0 overflow-hidden",
        )}
      >
        <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            {fileName}
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={handleFormat}
            >
              <Blocks />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={handleClose}
            >
              <X />
            </Button>
          </div>
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
                defaultValue={data}
                theme="light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  padding: { top: 16, bottom: 16 },
                }}
                onMount={(editor) => {
                  editor.onKeyDown((event) => {
                    if (
                      event.keyCode === 49 &&
                      (event.metaKey || event.ctrlKey)
                    ) {
                      event.preventDefault();
                      handleSave();
                    }
                  });
                  editorRef.current = editor;
                }}
                keepCurrentModel={true}
              />
            </Suspense>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const getLanguage = (ext: string) => {
  // 文件扩展名到 Monaco 语言映射
  const extensionToMonacoLanguage: Record<string, string> = {
    // JavaScript 系列
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",

    // Python
    py: "python",
    pyw: "python",

    // Rust
    rs: "rust",

    // Go
    go: "go",

    // Java/Kotlin
    java: "java",
    kt: "kotlin",
    kts: "kotlin",

    // C/C++
    c: "c",
    cpp: "cpp",
    cxx: "cpp",
    cc: "cpp",
    h: "c",
    hpp: "cpp",

    // PHP
    php: "php",

    // Ruby
    rb: "ruby",

    // Swift
    swift: "swift",

    // Shell
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    fish: "shell",

    // Web
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",

    // 配置文件
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "ini",
    ini: "ini",
    conf: "ini",
    config: "ini",

    // 数据库
    sql: "sql",

    // 其他
    md: "markdown",
    txt: "plaintext",
    log: "plaintext",
    gitignore: "plaintext",
    dockerfile: "dockerfile",
  };
  return extensionToMonacoLanguage[ext] || "plaintext";
};
