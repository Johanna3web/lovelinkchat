const usersList = document.getElementById('users');
const messagesDiv = document.getElementById('messages');
const chatWithTitle = document.getElementById('chat-with');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Example users - in real app, fetched from backend or auth
const users = [
  { id: 'user1', name: 'Alex' },
  { id: 'user2', name: 'Thandi' },
  { id: 'user3', name: 'Lerato' },
];

// The currently selected user id
let activeChatUserId = null;

// Load users in sidebar
function loadUsers() {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.name;
    li.dataset.userid = user.id;
    li.addEventListener('click', () => setActiveChat(user.id));
    if (user.id === activeChatUserId) li.classList.add('active');
    usersList.appendChild(li);
  });
}

// Load messages from localStorage (or empty array)
function getMessages(userId) {
  const msgs = localStorage.getItem('chat_' + userId);
  return msgs ? JSON.parse(msgs) : [];
}

// Save messages to localStorage
function saveMessages(userId, messages) {
  localStorage.setItem('chat_' + userId, JSON.stringify(messages));
}

// Display messages in chat area
function displayMessages() {
  messagesDiv.innerHTML = '';
  if (!activeChatUserId) {
    messagesDiv.innerHTML = '<p style="margin:auto;color:#ccc;">Select a user to start chatting</p>';
    return;
  }

  const messages = getMessages(activeChatUserId);

  messages.forEach((msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(msg.fromMe ? 'sent' : 'received');
    div.textContent = msg.text;
    messagesDiv.appendChild(div);
  });

  // Scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Switch active chat user
function setActiveChat(userId) {
  activeChatUserId = userId;
  const user = users.find(u => u.id === userId);
  chatWithTitle.textContent = `Chat with ${user ? user.name : 'Unknown'}`;
  loadUsers();
  displayMessages();
}

// Send new message handler
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !activeChatUserId) return;

  const messages = getMessages(activeChatUserId);
  // Add message from "me"
  messages.push({ text, fromMe: true });

  // Simulate reply after 1 second for demo
  setTimeout(() => {
    messages.push({ text: 'Thanks for your message!', fromMe: false });
    saveMessages(activeChatUserId, messages);
    displayMessages();
  }, 1000);

  saveMessages(activeChatUserId, messages);
  displayMessages();
  messageInput.value = '';
  messageInput.focus();
});

// Initial load
loadUsers();
displayMessages();

// Voice Recording Setup
let mediaRecorder;
let recordedChunks = [];

const startRecordBtn = document.getElementById('start-record-btn');
const stopRecordBtn = document.getElementById('stop-record-btn');
const audioPlayback = document.getElementById('audio-playback');

startRecordBtn.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Your browser does not support audio recording.');
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      recordedChunks = [];
      const audioURL = URL.createObjectURL(blob);
      audioPlayback.src = audioURL;
      audioPlayback.style.display = 'inline-block';
    };

    mediaRecorder.start();
    startRecordBtn.disabled = true;
    stopRecordBtn.disabled = false;
    audioPlayback.style.display = 'none';
  } catch (err) {
    alert('Could not start recording: ' + err.message);
  }
});

stopRecordBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
  }
});

// Video Call UI Setup (simple preview only)
const localVideo = document.getElementById('local-video');
const startCallBtn = document.getElementById('start-call-btn');
const endCallBtn = document.getElementById('end-call-btn');
let localStream;

startCallBtn.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Your browser does not support video calls.');
    return;
  }
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    startCallBtn.disabled = true;
    endCallBtn.disabled = false;
  } catch (err) {
    alert('Could not access camera/microphone: ' + err.message);
  }
});

endCallBtn.addEventListener('click', () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    startCallBtn.disabled = false;
    endCallBtn.disabled = true;
  }
});
