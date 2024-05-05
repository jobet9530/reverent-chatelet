<template>
  <div class="container">
    <div class="center-container">
      <div class="card-box">
        <div class="card card-width">
          <div class="card-content">
            <span class="card-title">Change Password</span>
            <i class="login fa fa-user-circle"></i>
            <form method="post" @submit.prevent="changePassword()">
              <div class="row">
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
                  <label for="user_account_password2">Confirm password</label>
                  <input
                    data-match="user_account_password"
                    id="user_account_password2"
                    name="password2"
                    type="password"
                    required
                    maxlength="100"
                  />
                </div>
                <div class="col s12">
                  <button class="btn-small grey fit">Change Password</button>
                </div>
              </div>
            </form>
            <span v-if="result.success" class="green-text">Change password done</span>
            <span v-if="result.error" class="red-text">Token not found!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from '../../http'
import Util from '../../util'

export default {
  name: 'ChangePassword',
  data() {
    return {
      user: {},
      result: {}
    }
  },
  mounted() {
    http.get('/changePassword/' + this.$route.params.token, this.user).catch((e) => {
      alert('Token not found!')
      this.$router.push('/login')
    })
  },
  methods: {
    ...Util,
    changePassword(e) {
      if (!this.validateForm()) {
        return
      }
      http
        .post('/changePassword/' + this.$route.params.token, this.user)
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
