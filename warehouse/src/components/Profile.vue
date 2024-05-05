<template>
  <div class="container">
    <form method="post" @submit.prevent="edit()">
      <div class="row">
        <div class="col m6 l4">
          <label for="user_account_name">Name</label>
          <input
            id="user_account_name"
            name="name"
            v-model="userAccount.name"
            required
            maxlength="50"
          />
          <span v-if="errors.name" class="red-text">{{ errors.name }}</span>
        </div>
        <div class="col m6 l4">
          <label for="user_account_email">Email</label>
          <input
            id="user_account_email"
            name="email"
            v-model="userAccount.email"
            type="email"
            required
            maxlength="50"
          />
          <span v-if="errors.email" class="red-text">{{ errors.email }}</span>
        </div>
        <div class="col m6 l4">
          <label for="user_account_password">Password</label>
          <input
            id="user_account_password"
            name="password"
            v-model="userAccount.password"
            type="password"
            placeholder="New password"
            maxlength="100"
          />
          <span v-if="errors.password" class="red-text">{{ errors.password }}</span>
        </div>
        <div class="col m6 l4">
          <label for="user_account_password2">Confirm password</label>
          <input
            data-match="user_account_password"
            id="user_account_password2"
            name="password2"
            type="password"
            placeholder="New password"
            maxlength="100"
          />
          <span v-if="errors.password" class="red-text">{{ errors.password }}</span>
        </div>
        <div class="col s12">
          <button class="btn-small">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import http from '../http'
import Util from '../util'

export default {
  name: 'Profile',
  data() {
    return {
      userAccount: {},
      errors: {}
    }
  },
  mounted() {
    this.get().finally(() => {
      this.initView(true)
    })
  },
  methods: {
    ...Util,
    get() {
      return http.get('/profile').then((response) => {
        this.userAccount = response.data.userAccount
      })
    },
    edit() {
      if (!this.validateForm()) {
        return
      }
      http
        .post('/updateProfile', this.userAccount)
        .then(() => {
          this.$router.push('/home')
        })
        .catch((e) => {
          if (e.response.data.errors) {
            this.errors = e.response.data.errors
          } else {
            alert(e.response.data.message)
          }
        })
    }
  }
}
</script>
