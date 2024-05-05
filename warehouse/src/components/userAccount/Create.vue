<template>
  <div class="container">
    <form method="post" @submit.prevent="create()">
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
          <label>
            <input
              id="user_account_active"
              name="active"
              class="filled-in"
              type="checkbox"
              v-model="userAccount.active"
              :checked="userAccount.active"
            />
            <span>Active</span>
          </label>
          <span v-if="errors.active" class="red-text">{{ errors.active }}</span>
        </div>
        <div class="col s12">
          <h5></h5>
          <label>Roles</label>
          <div v-for="role in roles" :key="role">
            <label>
              <input
                :id="`user_role_role_id${role.id}`"
                name="role_id"
                type="checkbox"
                class="filled-in"
                :value="role.id"
              />
              <span>{{ role.name }}</span>
            </label>
          </div>
        </div>
        <div class="col s12">
          <router-link class="btn-small grey" :to="getRef('/userAccount')">Cancel</router-link>
          <button class="btn-small">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import Service from './Service'
import Util from '../../util'

export default {
  name: 'UserAccountCreate',
  data() {
    return {
      userAccount: {},
      roles: [],
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
      return Service.create().then((response) => {
        this.roles = response.data.roles
      })
    },
    create() {
      this.userAccount.role_id = Array.from(
        document.querySelectorAll('[name="role_id"]:checked')
      ).map((e) => e.value)
      Service.create(this.userAccount)
        .then(() => {
          this.$router.push(this.getRef('/userAccount'))
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
