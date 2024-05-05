<template>
  <div class="container">
    <form method="post" @submit.prevent="this.delete()">
      <div class="row">
        <div class="col m6 l4">
          <label for="user_account_id">Id</label>
          <input
            readonly
            id="user_account_id"
            name="id"
            :value="userAccount.id"
            type="number"
            required
          />
        </div>
        <div class="col m6 l4">
          <label for="user_account_name">Name</label>
          <input
            readonly
            id="user_account_name"
            name="name"
            :value="userAccount.name"
            required
            maxlength="50"
          />
        </div>
        <div class="col m6 l4">
          <label for="user_account_email">Email</label>
          <input
            readonly
            id="user_account_email"
            name="email"
            :value="userAccount.email"
            type="email"
            required
            maxlength="50"
          />
        </div>
        <div class="col m6 l4">
          <label>
            <input
              readonly
              id="user_account_active"
              name="active"
              class="filled-in"
              type="checkbox"
              :value="userAccount.active"
              :checked="userAccount.active"
            />
            <span>Active</span>
          </label>
        </div>
        <div class="col s12">
          <h5>Roles</h5>
          <table class="striped highlight">
            <thead>
              <tr>
                <th>Role Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="userAccountUserRole in userAccountUserRoles" :key="userAccountUserRole">
                <td>{{ userAccountUserRole.role_name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col s12">
          <router-link class="btn-small grey" :to="getRef('/userAccount')">Cancel</router-link>
          <button class="btn-small red">Delete</button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import Service from './Service'
import Util from '../../util'

export default {
  name: 'UserAccountDelete',
  data() {
    return {
      userAccount: {},
      userAccountUserRoles: []
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
      return Service.delete(this.$route.params.id).then((response) => {
        this.userAccount = response.data.userAccount
        this.userAccountUserRoles = response.data.userAccountUserRoles
      })
    },
    delete() {
      Service.delete(this.$route.params.id, this.userAccount)
        .then(() => {
          this.$router.push(this.getRef('/userAccount'))
        })
        .catch((e) => {
          alert(e.response.data.message)
        })
    }
  }
}
</script>
