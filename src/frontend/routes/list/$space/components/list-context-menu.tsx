import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ListContextMenuProps {
  children: React.ReactNode;
  onUpload: () => void;
  onCreateFolder: () => void;
}
export function ListContextMenu({ children, ...props }: ListContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset onClick={props.onUpload}>
          上传文件
          <ContextMenuShortcut>⌘u</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          新建文件
          <ContextMenuShortcut>⌘n</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={props.onCreateFolder}>
          新建文件夹
          <ContextMenuShortcut>⌘m</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          远程下载
          <ContextMenuShortcut>⌘d</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          文件上传指示器
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>远程下载指示器</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          多选
          <ContextMenuShortcut>⌘e</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          全选
          <ContextMenuShortcut>⌘a</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>刷新</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
