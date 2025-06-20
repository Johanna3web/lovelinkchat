// Grab elements
const notifToggle = document.getElementById('notifToggle');
const privacyToggle = document.getElementById('privacyToggle');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordSection = document.getElementById('changePasswordSection');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const passwordMsg = document.getElementById('passwordMsg');

const deactivateBtn = document.getElementById('deactivateAccountBtn');
const deleteBtn = document.getElementById('deleteAccountBtn');

const confirmModal = document.getElementById('confirmModal');
const modalText = document.getElementById('modalText');
const btnCancel = confirmModal.querySelector('.btn-cancel');
const btnConfirm = confirmModal.querySelector('.btn-confirm');

let confirmAction = null;

// Initialize toggles from localStorage
notifToggle.checked = localStorage.getItem('notificationsEnabled') === 'true';
privacyToggle.checked = localStorage.getItem('profilePrivate') === 'true';

notifToggle.addEventListener('change', () => {
  localStorage.setItem('notificationsEnabled', notifToggle.checked);
});

privacyToggle.addEventListener('change', () => {
  localStorage.setItem('profilePrivate', privacyToggle.checked);
});

changePasswordBtn.addEventListener('click', () => {
  if (changePasswordSection.style.display === 'flex') {
    changePasswordSection.style.display = 'none';
    passwordMsg.textContent = '';
  } else {
    changePasswordSection.style.display = 'flex';
  }
});

savePasswordBtn.addEventListener('click', () => {
  const oldPass = document.getElementById('oldPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;

  // Dummy old password check (replace with real validation)
  const storedPass = localStorage.getItem('userPassword') || 'password123';

  if (oldPass !== storedPass) {
    passwordMsg.style.color = 'red';
    passwordMsg.textContent = 'Old password is incorrect.';
    return;
  }
  if (newPass.length < 6) {
    passwordMsg.style.color = 'red';
    passwordMsg.textContent = 'New password must be at least 6 characters.';
    return;
  }
  if (newPass !== confirmPass) {
    passwordMsg.style.color = 'red';
    passwordMsg.textContent = 'Passwords do not match.';
    return;
  }

  localStorage.setItem('userPassword', newPass);
  passwordMsg.style.color = 'lightgreen';
  passwordMsg.textContent = 'Password changed successfully!';
  setTimeout(() => {
    passwordMsg.textContent = '';
    changePasswordSection.style.display = 'none';
  }, 2000);
});

// Confirmation modal logic
function showConfirm(action) {
  confirmAction = action;
  modalText.textContent =
    action === 'deactivate'
      ? 'Are you sure you want to deactivate your account? You can reactivate later by logging in.'
      : 'Are you sure you want to permanently delete your account? This action cannot be undone.';
  confirmModal.style.display = 'flex';
}

btnCancel.addEventListener('click', () => {
  confirmModal.style.display = 'none';
  confirmAction = null;
});

btnConfirm.addEventListener('click', () => {
  if (confirmAction === 'deactivate') {
    localStorage.setItem('accountStatus', 'deactivated');
    alert('Your account has been deactivated.');
  } else if (confirmAction === 'delete') {
    localStorage.clear();
    alert('Your account has been deleted permanently.');
    window.location.href = 'index.html';
  }
  confirmModal.style.display = 'none';
  confirmAction = null;
});

deactivateBtn.addEventListener('click', () => showConfirm('deactivate'));
deleteBtn.addEventListener('click', () => showConfirm('delete'));
