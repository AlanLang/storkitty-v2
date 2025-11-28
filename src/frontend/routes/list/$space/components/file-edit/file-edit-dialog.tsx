import { fileExtensions } from "../file-icon";
import { TextFileEditDialog } from "./text-edit-dialog";
import type { FileEditDialogProps } from "./type";

export function FileEditDialog(props: FileEditDialogProps) {
  const { fileName } = props;

  const isText =
    fileExtensions.text.some((extension) => fileName.endsWith(extension)) ||
    fileExtensions.code.some((extension) => fileName.endsWith(extension));
  if (isText) {
    return <TextFileEditDialog {...props} />;
  }
  return null;
}
