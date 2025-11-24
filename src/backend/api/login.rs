use anyhow::Context;
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};

use crate::backend::{
  db::{self, DBConnection},
  error::AppError,
  utils::auth,
};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginResponseDto {
  user: UserDto,
  token: String,
  storages: Vec<StorageDto>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserDto {
  pub id: i64,
  pub name: String,
  pub avatar: String,
  pub username: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginDto {
  pub username: String,
  pub password: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StorageDto {
  pub id: i64,
  pub name: String,
  pub path: String,
  pub sort_index: i64,
}

pub async fn login(
  State(conn): State<DBConnection>,
  Json(user): Json<LoginDto>,
) -> Result<Json<LoginResponseDto>, AppError> {
  let conn = conn.lock().await;
  let user_info = db::user::get_user_by_username(&conn, &user.username).context("用户不存在")?;

  let is_valid = bcrypt::verify(&user.password, &user_info.password).unwrap_or(false);

  if !is_valid {
    return Err(AppError::new("用户名或密码错误"));
  }

  let token = auth::generate_token(user_info.id)?;
  let storages = db::storage::get_all_enabled_storage(&conn).context("获取存储失败")?;

  Ok(Json(LoginResponseDto {
    user: UserDto {
      id: user_info.id,
      name: user_info.name,
      avatar: user_info.avatar,
      username: user_info.username,
    },
    token,
    storages: storages
      .into_iter()
      .map(|storage| StorageDto {
        id: storage.id,
        name: storage.name,
        path: storage.path,
        sort_index: storage.sort_index,
      })
      .collect(),
  }))
}
