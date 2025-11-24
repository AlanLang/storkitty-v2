use serde::Deserialize;
use tokio::fs;

use crate::backend::{
  db::DBConnection,
  error::AppError,
  extractor::storage::{StorageExtractor, WithStorage},
};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteFileDto {
  name: String,
  path: String,
}

impl WithStorage for DeleteFileDto {
  fn get_path(&self) -> &str {
    &self.path
  }
}

#[axum::debug_handler(state = DBConnection)]
pub async fn delete_file(
  StorageExtractor(dto, local_path): StorageExtractor<DeleteFileDto>,
) -> Result<(), AppError> {
  let name = dto.name;
  let local_path = local_path.safe_join(&name)?;
  log::info!("delete_file: {}", local_path.display());

  if !local_path.exists() {
    return Err(AppError::new("文件不存在"));
  }

  fs::remove_file(&local_path).await?;
  Ok(())
}
