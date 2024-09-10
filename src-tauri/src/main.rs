// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::BufReader;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(async)]
async fn play_alarm(handle: tauri::AppHandle) {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("sounds/alarm1.wav")
        .expect("failed to resolve resource");
    let file = std::fs::File::open(&resource_path).unwrap();

    let (_stream, handle) = rodio::OutputStream::try_default().unwrap();
    let sink = rodio::Sink::try_new(&handle).unwrap();

    sink.append(rodio::Decoder::new(BufReader::new(file)).unwrap());

    sink.set_volume(0.5);

    sink.sleep_until_end();
}

fn main() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, play_alarm])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
