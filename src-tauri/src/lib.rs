#[cfg_attr(mobile, tauri::mobile_entry_point)]
mod server;
use tokio::runtime::Runtime;

pub fn run() {
  // Create a Tokio runtime
  let runtime = Runtime::new().expect("Failed to create Tokio runtime");

  // Spawn the Warp server within the Tokio runtime
  runtime.spawn(async {
      server::start_server().await;
  });

  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
