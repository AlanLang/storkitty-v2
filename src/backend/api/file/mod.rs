mod delete;
mod list;
mod rename;
mod upload;
use axum::{
  Router,
  routing::{delete, get, patch, post},
};

use crate::backend::db::DBConnection;

pub fn create_file_router() -> Router<DBConnection> {
  Router::<DBConnection>::new()
    .route("/{*path}", delete(delete::delete_file))
    .route("/{*path}", patch(rename::rename))
    .route("/upload/{*path}", post(upload::upload_file))
    .route("/abort/{*path}", post(upload::abort_file))
    .route("/list/{*path}", get(list::list_files))
}
