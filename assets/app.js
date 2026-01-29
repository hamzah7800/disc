const app = document.getElementById("app");

let messages = JSON.parse(localStorage.getItem("chat")) || [];

function render() {
  app.innerHTML = `
    <div class="layout">
      <div class="sidebar">Servers</div>
      <div class="chat">
        <div class="messages">
          ${messages.map(m => `<div class="msg"><b>${m.user}</b>: ${m.text}</div>`).join("")}
        </div>
        <div class="input">
          <input id="msg" placeholder="Message..." />
          <button onclick="send()">Send</button>
        </div>
      </div>
    </div>
  `;
}

function send() {
  const input = document.getElementById("msg");
  if (!input.value.trim()) return;

  messages.push({
    user: "You",
    text: input.value,
    time: Date.now()
  });

  localStorage.setItem("chat", JSON.stringify(messages));
  input.value = "";
  render();
}

render();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
