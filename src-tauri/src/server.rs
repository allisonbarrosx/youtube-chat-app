use warp::Filter;
use std::net::SocketAddr;
use std::path::Path;

pub async fn start_server() {
    let dist_dir = Path::new("../../build"); // Path to your SvelteKit build directory
    if !dist_dir.exists() {
        eprintln!("Error: Build directory does not exist. Run `npm run build`.");
        return;
    }

    let static_files = warp::fs::dir(dist_dir.to_path_buf());

    let routes = static_files
        .or(warp::fs::file(dist_dir.join("index.html")))
        .with(warp::log("warp_server"));

    let addr: SocketAddr = ([127, 0, 0, 1], 8080).into(); // Bind to localhost:8080
    println!("Serving on http://{}/", addr);

    warp::serve(routes).run(addr).await;
}