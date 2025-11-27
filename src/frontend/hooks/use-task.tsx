import type { FileType } from "@/api/file/list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon } from "@/routes/list/$space/components/file-icon";
import { animated, config, useSpring } from "@react-spring/web";
import {
  ChevronDownIcon,
  Loader2,
  Maximize2,
  Minimize2,
  Trash2,
  XIcon,
} from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";

import { useIsMobile } from "./use-mobile";
import { useWindowSize } from "./use-window-size";

export function useTaskDrawer() {
  const { setOpen } = useContext(DrawerContext);
  return setOpen;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [mini, setMini] = useState(false);
  const [open, setOpen] = useState<DrawerType | null>(null);
  const isMobile = useIsMobile();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

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

  const taskTitle = useMemo(() => {
    return open === "upload-file" ? "上传队列" : "远程下载";
  }, [open]);

  // Spring animation for the container
  const containerSpring = useSpring({
    width: mini ? "60px" : isMobile ? `${windowWidth}px` : "400px",
    height: mini ? "60px" : isMobile ? `${windowHeight}px` : "500px",
    borderRadius: mini ? "30px" : isMobile ? "0px" : "12px",
    right: mini ? "16px" : isMobile ? "0px" : "16px",
    bottom: mini ? "16px" : isMobile ? "0px" : "16px",
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0px) scale(1)" : "translateY(120%) scale(1)",
    pointerEvents: (open ? "auto" : "none") as "auto" | "none",
    config: { ...config.stiff, tension: 280, friction: 30 },
  });

  // Spring for content opacity
  const contentSpring = useSpring({
    opacity: mini ? 0 : 1,
    pointerEvents: (mini ? "none" : "auto") as "auto" | "none",
    config: { duration: 200 },
  });

  // Spring for mini indicator opacity
  const miniSpring = useSpring({
    opacity: mini ? 1 : 0,
    pointerEvents: (mini ? "auto" : "none") as "auto" | "none",
    config: { duration: 200 },
  });

  // Spring for overlay opacity
  const overlaySpring = useSpring({
    opacity: open && !mini ? 1 : 0,
    pointerEvents: (open && !mini ? "auto" : "none") as "auto" | "none",
    config: { duration: 200 },
  });

  const inProgressCount = task.uploads.filter(
    (u) => u.status === "in_progress",
  ).length;

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <TaskContext.Provider value={{ task, setTask }}>
        {children}

        {/* Overlay */}
        <animated.div
          style={overlaySpring}
          className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40"
          onClick={() => setOpen(null)}
        />

        {/* Fixed Container */}
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          <animated.div
            style={{
              ...containerSpring,
              position: "absolute",
              overflow: "hidden",
            }}
            className="bg-background border shadow-xl pointer-events-auto"
          >
            {/* Expanded Content */}
            <animated.div
              style={contentSpring}
              className="absolute inset-0 flex flex-col w-full h-full"
            >
              <div className="flex items-center justify-between bg-muted/50 p-3 border-b">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-background/80"
                    onClick={() => setOpen(null)}
                  >
                    <XIcon className="size-4" />
                  </Button>
                  <span className="font-medium text-sm">{taskTitle}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full -ml-1"
                      >
                        <ChevronDownIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setMini(true)}
                  >
                    <Minimize2 className="size-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                {task.uploads.map((upload, index) => (
                  <div
                    key={`${upload.fileName}-${index}`}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 group border-b border-border/50 last:border-0 relative"
                  >
                    {upload.status === "in_progress" && (
                      <div
                        className="absolute bottom-0 left-0 top-0 bg-primary/5 pointer-events-none transition-all duration-300"
                        style={{
                          width: `${(upload.uploaded / upload.size) * 100}%`,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-8 h-8 flex items-center justify-center rounded bg-muted">
                        <FileIcon
                          fileInfo={{
                            fileType: "file" as FileType,
                            name: upload.fileName,
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium leading-none">
                          {upload.fileName}
                        </p>
                        <div className="flex items-center gap-2">
                          {upload.status === "in_progress" && (
                            <span className="text-xs text-muted-foreground">
                              {upload.uploaded} / {upload.size}
                            </span>
                          )}
                          {upload.status === "completed" && (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                              完成
                            </span>
                          )}
                          {upload.status === "failed" && (
                            <span className="text-xs text-red-500">失败</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </animated.div>

            {/* Collapsed Content (Mini) */}
            <animated.div
              style={miniSpring}
              className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setMini(false)}
            >
              <div className="relative">
                {inProgressCount > 0 ? (
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="absolute text-[10px] font-bold">
                      {inProgressCount}
                    </span>
                  </div>
                ) : (
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Maximize2 className="size-5" />
                  </div>
                )}
              </div>
            </animated.div>
          </animated.div>
        </div>
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
