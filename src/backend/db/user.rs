use rusqlite::Connection;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserDto {
  pub name: String,
  pub username: String,
  pub password: String,
}

pub struct User {
  pub id: i64,
  pub name: String,
  pub username: String,
  pub password: String,
  pub avatar: String,
  pub disabled: bool,
  pub created_at: String,
  pub updated_at: String,
}

pub fn create_user_database(conn: &Connection) -> anyhow::Result<()> {
  conn.execute(
    "CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT NOT NULL DEFAULT '',
      disabled BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )",
    (),
  )?;
  Ok(())
}

pub fn is_no_user(conn: &Connection) -> anyhow::Result<bool> {
  let user = conn
    .query_row("SELECT COUNT(*) FROM user", (), |row| row.get(0))
    .map(|count: i64| count == 0)
    .unwrap_or(true);
  Ok(user)
}

pub fn create_user(conn: &Connection, user: CreateUserDto) -> anyhow::Result<()> {
  let password_hash = bcrypt::hash(user.password, bcrypt::DEFAULT_COST)?;

  conn.execute(
    "INSERT INTO user (name, username, password) VALUES (?, ?, ?)",
    (user.name, user.username, password_hash),
  )?;
  Ok(())
}

pub fn get_user_by_username(conn: &Connection, username: &str) -> anyhow::Result<User> {
  let user = conn.query_row(
    "SELECT * FROM user WHERE username = ?",
    (username,),
    |row| {
      Ok(User {
        id: row.get("id")?,
        name: row.get("name")?,
        username: row.get("username")?,
        password: row.get("password")?,
        avatar: row.get("avatar")?,
        disabled: row.get("disabled")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
      })
    },
  )?;
  Ok(user)
}

pub fn get_user_by_id(conn: &Connection, user_id: i64) -> anyhow::Result<User> {
  let user = conn.query_row("SELECT * FROM user WHERE id = ?", (user_id,), |row| {
    Ok(User {
      id: row.get("id")?,
      name: row.get("name")?,
      username: row.get("username")?,
      password: row.get("password")?,
      avatar: row.get("avatar")?,
      disabled: row.get("disabled")?,
      created_at: row.get("created_at")?,
      updated_at: row.get("updated_at")?,
    })
  })?;
  Ok(user)
}
