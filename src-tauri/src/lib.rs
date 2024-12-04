#[cfg_attr(mobile, tauri::mobile_entry_point)]
// use std::process::{Command, Stdio};
// use tauri::Manager;
// use tauri::Listener;

pub fn run() {
  // Start the Node.js proxy server
  // let _server = Command::new("node")
  //   .arg("./server/server.js")
  //   .stdout(Stdio::null())
  //   .spawn()
  //   .expect("Failed to start the Node.js server");
  // "resources": [
  //  "./server/*"
  //  ],

  tauri::Builder::default()
    .setup(|app| {
      // set up to create an event listener from the server
      // let main_window = app.get_webview_window("main").unwrap();
      // let id = main_window.listen("kill-server", move |_| {
      //   println!("Server is being killed");
      //   std::process::exit(0);
      // });
      // unlisten to the event using the `id` returned on the `listen` function
      // an `once` API is also exposed on the `Window` struct
      // main_window.unlisten(id);

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
