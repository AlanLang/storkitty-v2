mod delete;
mod list;
use axum::{
  Router,
  routing::{delete, get},
};

use crate::backend::db::DBConnection;

pub fn create_file_router() -> Router<DBConnection> {
  Router::<DBConnection>::new()
    .route("/{*path}", delete(delete::delete_file))
    .route("/list/{*path}", get(list::list_files))
}
