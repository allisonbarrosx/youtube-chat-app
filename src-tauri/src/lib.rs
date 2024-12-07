use tauri::Manager;
use tauri::{webview::WebviewWindowBuilder, WebviewUrl};

pub fn run() {
    let _port: u16 = 9527;

    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(_port).build())
        .setup(move |app| {
            // Optionally close the main window, if created
            let main_window = app.get_webview_window("main").unwrap();
            main_window.close().unwrap();

            let url = format!("http://localhost:{}", _port).parse().unwrap();
            WebviewWindowBuilder::new(app, "main_new".to_string(), WebviewUrl::External(url))
                .title("Live Chats")
                .inner_size(800.0, 800.0)
                .center()
                .resizable(true)
                .fullscreen(false)
                .zoom_hotkeys_enabled(true)
                .build()?;

            #[cfg(debug_assertions)]
            app.get_webview_window("main_new").unwrap().open_devtools();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
