# Focus-Time-Extension
# 🎯 Focus Time - Chrome Extension

**Focus Time** is a Pomodoro-style productivity Chrome extension that helps you stay focused and avoid distractions with customizable timers, ambient sounds, dark mode, and website blocking.

---

## ✨ Features

- ⏱️ Pomodoro Timer with **custom Focus and Break durations**
- 🔇 Ambient Sounds: **Rain** and **Forest** with volume control
- 🌙 Light/Dark Theme toggle
- 🚫 Website Blocker:
  - Enter website names (e.g. `facebook`, `youtube`) to block them dynamically
  - Uses Chrome’s `declarativeNetRequest` API
- 🔁 Automatic transition between **Focus** and **Break** sessions
- 🔔 Chrome notifications and optional sounds on session end
- 🕒 Session History tracking
- 🎨 Animated UI with stylish dark/light themes
- 🧩 Opens `work.html` or `break.html` in a **new tab** after each session

---

## 📦 Installation

1. Clone or download this repository.

2. Open Chrome and go to:  
   `chrome://extensions/`

3. Enable **Developer Mode** (top-right toggle).

4. Click **Load unpacked** and select the project folder.

---

## ⚙️ Customization

- 🕒 Change default session times in `popup.js`
- 🔊 Add new ambient sounds in `/sounds` and modify the JS logic
- 🌐 Update blocked sites in real-time using the extension popup

---

## 🛡️ Permissions Used

- `storage` – to store session data and settings
- `declarativeNetRequest` – to block distracting websites
- `notifications` – for Chrome notifications at session completion
- `tabs` – to open break/work tabs

---

## 💡 How it Works

- When the focus timer starts, distracting websites get blocked.
- When the timer ends, you are notified and a break tab opens.
- You can configure durations, sounds, and theme easily from the popup.

---

## 📷 Screenshots

![Popup Screenshot](./screenshots/popup-dark.png)  
*A clean, responsive UI with ambient sound and dark mode controls*

---

## 🧑‍💻 Author

- **Mithilesh Reddy**
- GitHub: [@White-Wolf-18](https://github.com/White-Wolf-18)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
