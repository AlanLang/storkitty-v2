mod create;
mod delete;
use axum::{
  Router,
  routing::{delete, post},
};

use crate::backend::db::DBConnection;

pub fn create_folder_router() -> Router<DBConnection> {
  Router::<DBConnection>::new()
    .route("/{*path}", post(create::create_folder))
    .route("/", delete(delete::delete_folder))
}
