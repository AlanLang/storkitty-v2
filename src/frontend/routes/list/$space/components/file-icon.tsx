import type { FileInfo } from "@/api/file/list";
import { cn } from "@/lib/utils";
import {
  File,
  FileArchive,
  FileBraces,
  FileChartColumnIncreasing,
  FileChartLine,
  FileImage,
  FileText,
  FileVideo,
  FolderOpen,
} from "lucide-react";

export function FileIcon({
  fileInfo,
}: {
  fileInfo: {
    fileType: FileInfo["fileType"];
    name: FileInfo["name"];
  };
}) {
  const baseClass = "h-4 w-4";
  if (fileInfo.fileType === "folder") {
    return <FolderOpen className={cn(baseClass, "text-primary")} />;
  }
  if (
    fileExtensions.zip.some((extension) => fileInfo.name.endsWith(extension))
  ) {
    return <FileArchive className={cn(baseClass, "text-violet-400")} />;
  }

  if (
    fileExtensions.image.some((extension) => fileInfo.name.endsWith(extension))
  ) {
    return <FileImage className={cn(baseClass, "text-red-400")} />;
  }

  if (
    fileExtensions.text.some((extension) => fileInfo.name.endsWith(extension))
  ) {
    return <FileText className={cn(baseClass, "text-blue-400")} />;
  }

  if (
    fileExtensions.code.some((extension) => fileInfo.name.endsWith(extension))
  ) {
    return <FileBraces className={cn(baseClass, "text-orange-400")} />;
  }

  if (
    fileExtensions.excalidraw.some((extension) =>
      fileInfo.name.endsWith(extension),
    )
  ) {
    return (
      <FileChartColumnIncreasing className={cn(baseClass, "text-purple-400")} />
    );
  }

  if (
    fileExtensions.markdown.some((extension) =>
      fileInfo.name.endsWith(extension),
    )
  ) {
    return <FileChartLine className={cn(baseClass, "text-red-400")} />;
  }
  if (
    fileExtensions.media.some((extension) => fileInfo.name.endsWith(extension))
  ) {
    return <FileVideo className={cn(baseClass, "text-green-400")} />;
  }

  return <File className={cn(baseClass, "text-muted-foreground")} />;
}

export const fileExtensions = {
  zip: [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".ico"],
  media: [
    ".mp4",
    ".mp3",
    ".wav",
    ".ogg",
    ".flac",
    ".wma",
    ".aac",
    ".m4a",
    ".m4v",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".mpg",
    ".mpeg",
    ".m4p",
    ".m4v",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
  ],
  markdown: [".md", ".markdown"],
  excalidraw: [".excalidraw"],
  text: [
    ".txt",
    ".log",
    ".markdown",
    ".rst",
    ".org",
    ".tex",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
  ],
  code: [
    ".py",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".html",
    ".css",
    ".scss",
    ".less",
    ".json",
    ".xml",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".conf",
    ".log",
    ".md",
    ".markdown",
    ".rst",
    ".org",
    ".tex",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
  ],
};
