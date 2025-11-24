use serde::Deserialize;
use tokio::fs;

use crate::backend::{
  db::DBConnection,
  error::AppError,
  extractor::storage::{StorageExtractor, WithStorage},
};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteFolderDto {
  name: String,
  path: String,
}

impl WithStorage for DeleteFolderDto {
  fn get_path(&self) -> &str {
    &self.path
  }
}

#[axum::debug_handler(state = DBConnection)]
pub async fn delete_folder(
  StorageExtractor(dto, local_path): StorageExtractor<DeleteFolderDto>,
) -> Result<(), AppError> {
  let name = dto.name;
  let local_path = local_path.safe_join(&name)?;

  if !local_path.exists() {
    return Err(AppError::new("目录不存在"));
  }

  fs::remove_dir_all(&local_path).await?;
  Ok(())
}
