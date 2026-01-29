// Initialize IndexedDB
let db;
const request = indexedDB.open('offline-chat', 1);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = (e) => {
  db = e.target.result;
  loadMessages();
};

request.onerror = (e) => console.error('DB error', e);

const messagesDiv = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Load messages from IndexedDB
function loadMessages() {
  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');
  const all = store.getAll();
  all.onsuccess = () => {
    messagesDiv.innerHTML = '';
    all.result.forEach(msg => addMessageToDOM(msg.text));
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };
}

// Add message to DOM
function addMessageToDOM(text) {
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = text;
  messagesDiv.appendChild(div);
}

// Send message
sendBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  // Save in DB
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  store.add({ text });

  addMessageToDOM(text);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Press Enter to send
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});
