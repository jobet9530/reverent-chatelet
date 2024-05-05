<template>
  <div class="container">
    <div class="center-container">
      <div class="card-box">
        <div class="card card-width">
          <div class="card-content">
            <span class="card-title">Reset Password</span>
            <i class="login fa fa-user-circle"></i>
            <form method="post" @submit.prevent="resetPassword()">
              <div class="row">
                <div class="col s12">
                  <label for="user_account_email">Email</label>
                  <input
                    id="user_account_email"
                    name="email"
                    v-model="user.email"
                    type="email"
                    required
                    maxlength="50"
                  />
                </div>
                <div class="col s12">
                  <button class="btn-small grey fit">Reset Password</button>
                </div>
              </div>
            </form>
            <span v-if="result.success" class="green-text"
              >A reset password link has been sent to your email</span
            >
            <span v-if="result.error" class="red-text">Email not found!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from '../../http'

export default {
  name: 'ResetPassword',
  data() {
    return {
      user: {},
      result: {}
    }
  },
  methods: {
    resetPassword() {
      http
        .post('/resetPassword', this.user)
        .then((response) => {
          this.result = { success: true }
        })
        .catch((e) => {
          this.result = { error: true }
        })
    }
  }
}
</script>
