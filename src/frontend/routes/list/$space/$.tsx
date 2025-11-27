import { FileType, type FileInfo } from "@/api/file/list";
import { MenuList, type MenuListProps } from "@/components/menu-list";
import { TimeDisplay } from "@/components/time-display";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { QUERY_KEY, useFileList } from "@/hooks/use-file-list";
import { useFileUploadDialog } from "@/hooks/use-task";
import { formatFileSize } from "@/lib/file";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Circle,
  CloudDownload,
  Copy,
  FilePlus,
  FolderOpen,
  FolderPen,
  FolderPlus,
  Home,
  Link,
  MoreHorizontalIcon,
  MoreVertical,
  SendToBack,
  SquareArrowOutUpRight,
  Trash2,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { FileDeleteDialog } from "./components/file-delete-dialog";
import { FileIcon } from "./components/file-icon";
import { FileListEmpty } from "./components/file-list-empty";
import { FolderCreateDialog } from "./components/folder-create-dialog";
import { FolderDeleteDialog } from "./components/folder-delete-dialog";
import { ListContextMenu } from "./components/list-context-menu";
import { FileListSidebar } from "./components/sidebar";

export const Route = createFileRoute("/list/$space/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const [needDelete, setNeedDelete] = useState<FileInfo | null>(null);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);

  const { space, _splat } = Route.useParams();
  const path = `${space}/${_splat}`;
  const { openFileDialog } = useFileUploadDialog();

  return (
    <div className="flex h-full w-full">
      <FileListSidebar />
      <ListContextMenu
        onUpload={openFileDialog}
        onCreateFolder={() => setIsCreateFolderDialogOpen(true)}
      >
        <SidebarInset className="flex-1 flex flex-col">
          <div className="border-b p-4 flex items-center h-18">
            <FileToolbar
              onOpenFileUpload={openFileDialog}
              onCreateFolder={() => setIsCreateFolderDialogOpen(true)}
            />
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4">
            <FileBreadcrumb />
            <FileList onDelete={setNeedDelete} />
          </div>
        </SidebarInset>
      </ListContextMenu>

      <FolderDeleteDialog
        path={path}
        name={needDelete?.name ?? ""}
        count={needDelete?.items ?? 0}
        isOpen={needDelete?.fileType === FileType.Folder}
        onCancel={() => setNeedDelete(null)}
        onFinish={() => {
          setNeedDelete(null);
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY, path],
          });
        }}
      />

      <FileDeleteDialog
        path={path}
        name={needDelete?.name ?? ""}
        size={needDelete?.size ?? undefined}
        isOpen={needDelete?.fileType === FileType.File}
        onCancel={() => setNeedDelete(null)}
        onFinish={() => {
          setNeedDelete(null);
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY, path],
          });
        }}
      />

      <FolderCreateDialog
        path={path}
        isOpen={isCreateFolderDialogOpen}
        onCancel={() => setIsCreateFolderDialogOpen(false)}
        onFinish={() => {
          setIsCreateFolderDialogOpen(false);
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY, path],
          });
        }}
      />
    </div>
  );
}

interface FileToolbarProps {
  onOpenFileUpload: () => void;
  onCreateFolder: () => void;
}

function FileToolbar(props: FileToolbarProps) {
  return (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="flex-1 flex items-center gap-2">
        <SidebarTrigger />
        <Input placeholder="搜索文件" className="w-full" />
      </div>
      <div className="flex items-center gap-2">
        <Toggle
          aria-label="Toggle bookmark"
          size="sm"
          variant="outline"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-primary"
        >
          <Circle />
        </Toggle>
        <ButtonGroup>
          <Button variant="outline" onClick={props.onOpenFileUpload}>
            <UploadIcon />
            上传
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="More Options"
                className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
              >
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={props.onOpenFileUpload}>
                  <UploadIcon />
                  上传文件
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FilePlus />
                  新建文件
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    props.onCreateFolder();
                  }}
                >
                  <FolderPlus />
                  新建文件夹
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <CloudDownload />
                  远程下载
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </div>
  );
}

function FileBreadcrumb() {
  const { space, _splat } = Route.useParams();
  const navigate = useNavigate();
  const breadcrumbPaths = _splat === "" ? [] : _splat?.split("/") || [];

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          navigate({ to: "/list/$space/$", params: { space, _splat: "" } });
        }}
        className="p-1 h-6 hover:bg-muted"
      >
        <Home className="h-4 w-4" />
      </Button>

      {breadcrumbPaths.map((pathPart, index) => (
        <div key={pathPart} className="flex items-center space-x-2">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigate({
                to: "/list/$space/$",
                params: {
                  space,
                  _splat: breadcrumbPaths.slice(0, index + 1).join("/"),
                },
              });
            }}
            className={`p-1 h-6 text-sm hover:bg-muted ${
              index === breadcrumbPaths.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {pathPart}
          </Button>
        </div>
      ))}

      {breadcrumbPaths.length === 0 && (
        <>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-foreground font-medium">根目录</span>
        </>
      )}
    </div>
  );
}

function FileList({ onDelete }: { onDelete: (file: FileInfo) => void }) {
  const { space, _splat } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useFileList({ space, splat: _splat });

  const handleClick = (file: FileInfo) => {
    if (file.fileType === "folder") {
      navigate({
        to: "/list/$space/$",
        params: { space, _splat: `${_splat}/${file.name}` },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="divide-y divide-border border animate-fade-in-delayed">
        {Array.from({ length: 5 }, (_, index) => index + 1).map((step) => (
          <div
            key={step}
            className="flex items-center p-3 hover:bg-muted/50 cursor-pointer group mt-0 gap-3"
          >
            <Skeleton className="w-8 h-8 flex items-center justify-center rounded bg-muted group-hover:bg-muted/80" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">加载失败</h3>
        <p className="text-muted-foreground text-center">
          无法获取文件列表，请检查网络连接或重试
        </p>
      </div>
    );
  }

  if (data && data.files.length === 0) {
    return <FileListEmpty />;
  }

  return (
    <div data-testid="file-list" className="divide-y divide-border border">
      {data?.files.map((file) => (
        <FileListItem
          key={file.name}
          file={file}
          onClick={handleClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface FileListItemProps {
  file: FileInfo;
  onDelete: (file: FileInfo) => void;
  onClick: (file: FileInfo) => void;
}

function FileListItem({ file, onClick, onDelete }: FileListItemProps) {
  const items: MenuListProps["items"] = [
    {
      label: "下载",
      icon: <CloudDownload className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
    {
      label: "预览",
      icon: <SquareArrowOutUpRight className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
    {
      label: "复制链接",
      icon: <Link className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
    {
      type: "separator",
    },
    {
      label: "重命名",
      icon: <FolderPen className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
    {
      label: "复制",
      icon: <Copy className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
    {
      label: "移动",
      icon: <SendToBack className="mr-2 h-4 w-4" />,
      onClick: () => {},
    },
    {
      type: "separator",
    },
    {
      label: "删除",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: () => onDelete(file),
    },
  ];

  return (
    <MenuList
      type="context"
      key={file.name}
      className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer group mt-0"
      items={items}
      onClick={() => onClick(file)}
    >
      <div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-muted group-hover:bg-muted/80">
            <FileIcon fileInfo={file} />
          </div>
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {file.fileType === "folder"
                ? `${file.items || 0} 项目`
                : file.size
                  ? formatFileSize(file.size)
                  : "未知大小"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-muted-foreground">
            <TimeDisplay timeString={file.modified} />
          </div>
          <div className="flex items-center opacity-0 group-hover:opacity-100 [&:has([data-state=open])]:opacity-100 transition-opacity">
            <MenuList type="dropdown" items={items}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
                data-testid={`file-more-actions-button-${file.name}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </MenuList>
          </div>
        </div>
      </div>
    </MenuList>
  );
}
