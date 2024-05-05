<template>
  <div class="container">
    <div class="center-container">
      <div class="card-box">
        <div class="card card-width">
          <div class="card-content">
            <span class="card-title">Login</span>
            <i class="login fa fa-user-circle"></i>
            <form method="post" @submit.prevent="login()">
              <div class="row">
                <div class="col s12">
                  <label for="user_account_name">User Name</label>
                  <input
                    id="user_account_name"
                    name="name"
                    v-model="user.name"
                    required
                    maxlength="50"
                  />
                </div>
                <div class="col s12">
                  <label for="user_account_password">Password</label>
                  <input
                    id="user_account_password"
                    name="password"
                    v-model="user.password"
                    type="password"
                    required
                    maxlength="100"
                  />
                </div>
                <div class="col s12">
                  <button class="btn-small grey fit">Login</button>
                  <router-link to="/resetPassword">Forgot Password?</router-link>
                </div>
              </div>
            </form>
            <span v-if="error" class="red-text">{{ error.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from '../../http'

export default {
  name: 'Login',
  data() {
    return {
      user: {},
      error: null
    }
  },
  beforeMount() {
    if (this.$root.user) {
      this.$router.push(this.$router.options.history.redirect || '/home')
    }
  },
  methods: {
    login() {
      http
        .post('/login', this.user)
        .then((response) => {
          this.$root.user = response.data.user
          localStorage.setItem('express_token', response.data.token)
        })
        .catch((e) => {
          this.error = e.response.data
        })
    }
  }
}
</script>
