use std::path::PathBuf;

use anyhow::Context;
use axum::{
  body::Body,
  extract::{FromRef, FromRequest, Request, rejection::JsonRejection},
  http::StatusCode,
  response::Response,
};

use crate::backend::{
  db::{self, DBConnection},
  error::AppError,
  utils::{self, path::split_path},
};

pub trait WithStorage {
  fn get_path(&self) -> &str;
}

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

pub struct StorageExtractor<T>(pub T, pub SafePath);

impl<S, T> FromRequest<S> for StorageExtractor<T>
where
  axum::Json<T>: FromRequest<S, Rejection = JsonRejection>,
  T: WithStorage + Send,
  DBConnection: FromRef<S>,
  S: Send + Sync,
{
  type Rejection = Response;

  async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
    let body_json = match axum::Json::<T>::from_request(req, state).await {
      Ok(value) => value.0,
      Err(rejection) => {
        return Err(
          Response::builder()
            .status(rejection.status())
            .body(Body::from(rejection.body_text()))
            .unwrap_or_default(),
        );
      }
    };

    let path = body_json.get_path().to_string();

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

    Ok(Self(body_json, local_path))
  }
}
