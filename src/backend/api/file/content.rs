use crate::backend::{error::AppError, extractor::storage::StoragePath};
use axum::Json;
use serde::Deserialize;
use tokio::fs;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveFileContentDto {
  pub content: String,
}

pub async fn get_content(StoragePath(local_path): StoragePath) -> Result<String, AppError> {
  let local_path = local_path.get_path();
  if !local_path.exists() {
    return Err(AppError::new("文件不存在"));
  }
  if local_path.is_dir() {
    return Err(AppError::new("目标是文件夹"));
  }
  let content = fs::read_to_string(&local_path).await?;
  Ok(content)
}

pub async fn save_content(
  StoragePath(local_path): StoragePath,
  Json(dto): Json<SaveFileContentDto>,
) -> Result<(), AppError> {
  let local_path = local_path.get_path();
  if !local_path.exists() {
    return Err(AppError::new("文件不存在"));
  }
  if local_path.is_dir() {
    return Err(AppError::new("目标是文件夹"));
  }
  fs::write(&local_path, dto.content).await?;
  Ok(())
}
