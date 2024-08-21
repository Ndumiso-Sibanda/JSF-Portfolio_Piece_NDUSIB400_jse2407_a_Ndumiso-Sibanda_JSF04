<template>
  <div class="form">
    <ul class="tab-group">
      <li :class="{ tab: true, active: !isSignupActive }">
        <a href="#login" @click="toggleTab('login')">Log In</a>
      </li>
    </ul>

    <div class="tab-content">
      <div v-show="!isSignupActive" id="login">
        <h1>Welcome Back!</h1>
        <form @submit.prevent="handleLogin">
          <div class="field-wrap">
            <label
              :class="{
                active: login.usernameActive,
                highlight: login.usernameHighlight,
              }"
            >
              Username<span class="req">*</span>
            </label>
            <input
              v-model="login.username"
              @keyup="toggleLabel('username', false)"
              @blur="toggleLabel('username', false)"
              @focus="toggleLabel('username', false)"
              type="text"
              required
              autocomplete="off"
            />
          </div>

          <div class="field-wrap">
            <label
              :class="{
                active: login.passwordActive,
                highlight: login.passwordHighlight,
              }"
            >
              Password<span class="req">*</span>
            </label>
            <input
              v-model="login.password"
              @keyup="toggleLabel('password', false)"
              @blur="toggleLabel('password', false)"
              @focus="toggleLabel('password', false)"
              :type="passwordVisible ? 'text' : 'password'"
              required
              autocomplete="off"
            />
            <div class="toggle-password">
              <button
                type="button"
                @click="passwordVisible = !passwordVisible"
                class="toggle-password-button"
              >
                {{ passwordVisible ? 'Hide Password' : 'Show Password' }}
              </button>
            </div>
          </div>

          <p class="forgot"><a href="#">Forgot Password?</a></p>

          <button class="button button-block" :disabled="loading">Log In</button>
          <div v-if="loading" class="loading">Logging in...</div>
          <div v-if="loginError" class="error">{{ loginError }}</div>
        </form>
        <div class="signup-link">
          Don't have an account yet?
          <router-link to="/signup">Create one</router-link>
        </div>
      </div>
    </div>

    <div v-if="isLoggedIn" class="logout-section">
      <button @click="handleLogout" class="button button-block">Log Out</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSignupActive: false,
      login: {
        username: "",
        password: "",
        usernameActive: false,
        passwordActive: false,
        usernameHighlight: false,
        passwordHighlight: false,
      },
      loading: false,
      loginError: "",
      passwordVisible: false,
      isLoggedIn: this.$store.getters.isLoggedIn,
      redirectPath: this.$route.query.redirect || "/", // Capture redirect path or set default
    };
  },
  methods: {
    toggleTab(tab) {
      this.isSignupActive = tab === "signup";
    },
    toggleLabel(field, isSignup = false) {
      const form = isSignup ? this.signup : this.login;
      form[`${field}Active`] = form[field].length > 0;
      form[`${field}Highlight`] = form[field].length > 0;
    },
    async handleLogin() {
      this.loading = true;
      this.loginError = "";
      try {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.login.username,
            password: this.login.password,
          }),
        });
        const json = await response.json();

        if (response.ok && json.token) {
          localStorage.setItem("jwt", json.token);
          this.$store.dispatch('setLoggedIn', true); // Update Vuex state
          this.$router.push({ path: this.redirectPath }); // Redirect after login
        } else {
          this.loginError = "Invalid username or password";
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.loginError = "Login failed. Invalid username or password";
      } finally {
        this.loading = false;
      }
    },
    handleLogout() {
      localStorage.removeItem("jwt");
      this.$store.dispatch('logout'); // Clear Vuex state
      this.$router.push({ name: "Home" });
    },
  },
};
</script>






<style scoped>
.form {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 height: 100vh;
 background-color: #f4f9fa;
 padding: 2rem;
}

.tab-group {
 list-style: none;
 padding: 0;
 margin: 0;
 display: flex;
 justify-content: center;
 margin-bottom: 1rem;
}

.tab {
 margin: 0 0.5rem;
 padding: 0.5rem 1rem;
 cursor: pointer;
 border: 1px solid #ddd;
 border-radius: 4px;
 background-color: #fff;
 transition: background-color 0.3s ease;
}

.tab.active {
 background-color: #007bff;
 color: #fff;
 border-color: #007bff;
}

.tab a {
 text-decoration: none;
 color: inherit;
 font-size: 1rem;
}

.tab-content {
 max-width: 400px;
 width: 100%;
 background: #fff;
 padding: 1.5rem;
 border-radius: 8px;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-content h1 {
 text-align: center;
 margin-bottom: 1rem;
 font-size: 1.5rem;
 color: #333;
}

.field-wrap {
 margin-bottom: 1rem;
}

.field-wrap label {
 display: block;
 font-size: 0.875rem;
 color: #333;
}

.field-wrap label.active {
 color: #007bff;
}

.field-wrap label.highlight {
 font-weight: bold;
}

.field-wrap input {
 width: 100%;
 padding: 0.5rem;
 border: 1px solid #ddd;
 border-radius: 4px;
 font-size: 0.875rem;
 margin-top: 0.25rem;
}

.button {
 display: block;
 width: 100%;
 padding: 0.75rem;
 border: none;
 border-radius: 4px;
 font-size: 0.875rem;
 color: #fff;
 background-color: #007bff;
 cursor: pointer;
 transition: background-color 0.3s ease;
}

.button:hover {
 background-color: #0056b3;
}

.button.button-block {
 margin-top: 1rem;
}

.forgot {
 text-align: center;
 margin-top: 1rem;
}

.forgot a {
 color: #007bff;
 text-decoration: none;
 font-weight: bold;
}

.forgot a:hover {
 text-decoration: underline;
}

.loading,
.error {
 text-align: center;
 margin-top: 0.75rem;
 color: #007bff;
}

.error {
 color: red;
}
</style>