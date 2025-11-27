mod delete;
mod list;
mod rename;
use axum::{
  Router,
  routing::{delete, get, patch},
};

use crate::backend::db::DBConnection;

pub fn create_file_router() -> Router<DBConnection> {
  Router::<DBConnection>::new()
    .route("/{*path}", delete(delete::delete_file))
    .route("/{*path}", patch(rename::rename))
    .route("/list/{*path}", get(list::list_files))
}
