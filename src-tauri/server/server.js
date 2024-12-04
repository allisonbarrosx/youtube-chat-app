import express from "express";
import { emit } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
// import path from "path";

const app = express();

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`),
);

// Serve Twitch Chat Proxy
app.get("/twitch-chat", (req, res) => {
  const channelName = req.query.channel || "default_channel";
  console.log("channelName: ", channelName);
  res.send(`
        <iframe 
          src="https://www.twitch.tv/embed/${channelName}/chat?parent=localhost" 
          height="500" 
          width="350">
        </iframe>
    `);
});

const webview = await WebviewWindow.getByLabel("main");
await webview.listen("close-requested", async () => {
  emit("kill-server");
});
