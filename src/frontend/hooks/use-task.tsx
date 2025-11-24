import type { FileType } from "@/api/file/list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FileIcon } from "@/routes/list/$space/components/file-icon";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import {
  ChevronDownIcon,
  Ellipsis,
  PlusIcon,
  Trash2,
  XIcon,
} from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";

export function useTaskDrawer() {
  const { setOpen } = useContext(DrawerContext);
  return setOpen;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [mini, setMini] = useState(false);
  const [open, setOpen] = useState<DrawerType | null>(null);
  const [task, setTask] = useState<Task>({
    uploads: [
      {
        fileName: "test.txt",
        size: 100,
        status: "in_progress",
        speed: 100,
        uploaded: 40,
      },
      {
        fileName: "avatar.png",
        size: 1000,
        status: "completed",
      },
      {
        fileName: "demo.zip",
        size: 1000,
        status: "failed",
      },
      {
        fileName: "demo.zip",
        size: 1000,
        status: "failed",
      },
      {
        fileName: "demo.zip",
        size: 1000,
        status: "failed",
      },
      {
        fileName: "demo.zip",
        size: 1000,
        status: "failed",
      },
      {
        fileName: "demo.zip",
        size: 1000,
        status: "failed",
      },
    ],
  });
  const miniButtonIconClass = cn(
    "size-5 transition-transform duration-200",
    mini ? "rotate-180" : "",
  );
  const contentClass = cn(
    "flex flex-col transition-all duration-200",
    mini ? "h-0" : "h-[350px]",
  );

  const taskTitle = useMemo(() => {
    return open === "upload-file" ? "上传队列" : "远程下载";
  }, [open]);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <TaskContext.Provider value={{ task, setTask }}>
        <Sheet
          modal={false}
          open={!!open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen ? "upload-file" : null);
          }}
        >
          {children}
          <SheetContent
            showShadow={!mini}
            className="w-full sm:w-[500px] rounded-xl inset-x-auto right-0 h-fit sm:m-[32px] overflow-hidden"
            onClose={() => setOpen(null)}
          >
            <div className="flex items-center justify-between bg-muted p-2">
              <div className="flex items-center gap-2">
                <SheetCloseButton />
                <SheetTitle>{taskTitle}</SheetTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-ring/20 "
                    >
                      <ChevronDownIcon className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuGroup>
                      <DropdownMenuRadioGroup
                        value={open ?? "upload-file"}
                        onValueChange={(value) => setOpen(value as DrawerType)}
                      >
                        <DropdownMenuRadioItem value="upload-file">
                          上传队列
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="remote-download">
                          远程下载
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-ring/20 "
                >
                  <Ellipsis className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-ring/20 "
                >
                  <PlusIcon className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-ring/20 "
                  onClick={() => setMini(!mini)}
                >
                  <ChevronDownIcon className={miniButtonIconClass} />
                </Button>
              </div>
            </div>
            <ScrollArea className={cn(contentClass)}>
              {task.uploads.map((upload) => (
                <div
                  key={upload.fileName}
                  className={cn(
                    "flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer group mt-0 border-b border-border relative",
                  )}
                >
                  {upload.status === "in_progress" && (
                    <ProgressDrawer
                      total={upload.size}
                      uploaded={upload.uploaded}
                    />
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-muted group-hover:bg-muted/80">
                      <FileIcon
                        fileInfo={{
                          fileType: "file" as FileType,
                          name: upload.fileName,
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{upload.fileName}</p>
                      {upload.status === "in_progress" && (
                        <p className="text-xs text-muted-foreground">
                          {upload.uploaded} / {upload.size}
                        </p>
                      )}
                      {upload.status === "completed" && (
                        <p className="text-xs text-sky-400">完成</p>
                      )}
                      {upload.status === "failed" && (
                        <p className="text-xs text-red-400">失败</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Trash2 className="size-3 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </TaskContext.Provider>
    </DrawerContext.Provider>
  );
}

type UploadFileTask =
  | {
      fileName: string;
      size: number;
      status: "completed" | "failed";
    }
  | {
      fileName: string;
      size: number;
      status: "in_progress";
      speed: number;
      uploaded: number;
    };

type Task = {
  uploads: UploadFileTask[];
};

const TaskContext = createContext<{
  task: Task;
  setTask: (task: Task) => void;
}>({
  task: {
    uploads: [],
  },
  setTask: () => {},
});

type DrawerType = "upload-file" | "remote-download";

const DrawerContext = createContext<{
  open: DrawerType | null;
  setOpen: (open: DrawerType | null) => void;
}>({
  open: null,
  setOpen: () => {},
});

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <div
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/10 backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  showShadow = true,
  onClose,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  showShadow?: boolean;
  onClose?: () => void;
}) {
  return (
    <SheetPrimitive.Portal>
      {showShadow && <SheetOverlay onClick={onClose} />}
      <SheetPrimitive.Content
        onFocusOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom bottom-0 h-auto border-t",
          className,
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetCloseButton() {
  return (
    <SheetPrimitive.Close className="p-2 rounded-full hover:bg-ring/20">
      <XIcon className="size-5" />
      <span className="sr-only">Close</span>
    </SheetPrimitive.Close>
  );
}

function ProgressDrawer({
  total,
  uploaded,
}: {
  total: number;
  uploaded: number;
}) {
  const progress = uploaded / total;
  return (
    <div
      className="absolute bottom-0 left-0 top-0 bg-primary/10 pointer-events-none"
      style={{ width: `${progress * 100}%` }}
    ></div>
  );
}
