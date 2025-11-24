use std::path::PathBuf;

use anyhow::Context;
use axum::{
  body::Body,
  extract::{FromRef, FromRequestParts, Path},
  http::{StatusCode, request::Parts},
  response::Response,
};

use crate::backend::{
  db::{self, DBConnection},
  error::AppError,
  utils::{self, path::split_path},
};

pub struct SafePath(pub PathBuf);

impl SafePath {
  pub fn new(path: PathBuf) -> Self {
    Self(path)
  }
  pub fn safe_join(&self, input: &str) -> Result<PathBuf, AppError> {
    if !utils::validate::validate_path(input) {
      return Err(AppError::new("路径不合法"));
    }
    Ok(self.0.join(input))
  }
}

pub struct Storage(pub SafePath);

impl<S> FromRequestParts<S> for Storage
where
  DBConnection: FromRef<S>,
  S: Send + Sync,
{
  type Rejection = Response;

  async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
    // 获取 url 上 {*path} 的 path 值
    let Path(path) = Path::<String>::from_request_parts(parts, state)
      .await
      .map_err(|err| {
        Response::builder()
          .status(StatusCode::BAD_REQUEST)
          .body(Body::from(err.to_string()))
          .unwrap_or_default()
      })?;

    if !utils::validate::validate_path(&path) {
      return Err(
        Response::builder()
          .status(StatusCode::BAD_REQUEST)
          .body(Body::from("存储路径不合法"))
          .unwrap_or_default(),
      );
    }

    let conn = DBConnection::from_ref(state);
    let conn = conn.lock().await;
    let (storage_path, path) = split_path(&path);

    let storage = db::storage::get_storage_by_path(&conn, &storage_path)
      .context("存储不存在")
      .map_err(|_| {
        Response::builder()
          .status(StatusCode::NOT_FOUND)
          .body(Body::from("存储不存在"))
          .unwrap_or_default()
      })?;

    if storage.disabled {
      return Err(
        Response::builder()
          .status(StatusCode::FORBIDDEN)
          .body(Body::from("存储已禁用"))
          .unwrap_or_default(),
      );
    }

    let local_path =
      SafePath::new(PathBuf::from(&storage.local_path).join(path.unwrap_or_default()));

    Ok(Self(local_path))
  }
}
