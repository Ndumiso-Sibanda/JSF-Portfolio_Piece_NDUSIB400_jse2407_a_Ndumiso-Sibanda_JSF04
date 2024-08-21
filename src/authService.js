// authService.js

const USER_KEY = 'user';

function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'user' && password === 'password') {
        const user = { username: 'user', token: '1234567890abcdef' };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        reject('Invalid username or password');
      }
    }, 1000);
  });
}

function logout() {
  localStorage.removeItem(USER_KEY);
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function isLoggedIn() {
  return !!localStorage.getItem(USER_KEY);
}

export default {
  login,
  logout,
  getUser,
  isLoggedIn,
};
