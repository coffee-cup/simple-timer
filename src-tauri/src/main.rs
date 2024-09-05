// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::BufReader;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(async)]
async fn play_alarm() {
    let (_stream, handle) = rodio::OutputStream::try_default().unwrap();
    let sink = rodio::Sink::try_new(&handle).unwrap();

    let file = std::fs::File::open("../assets/alarm1.wav").unwrap();
    sink.append(rodio::Decoder::new(BufReader::new(file)).unwrap());

    sink.set_volume(0.5);

    sink.sleep_until_end();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, play_alarm])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
