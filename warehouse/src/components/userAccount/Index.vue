<template>
  <div class="container">
    <div class="col s12">
      <input id="searchbar_toggle" type="checkbox" />
      <div id="searchbar" class="row">
        <div class="col s12 l2">
          <select id="search_col" @change="searchChange()">
            <option value="UserAccount.id" data-type="number">User Account Id</option>
            <option value="UserAccount.name">User Account Name</option>
            <option value="UserAccount.email">User Account Email</option>
            <option value="UserAccount.active">User Account Active</option>
          </select>
        </div>
        <div class="col s12 l2">
          <select id="search_oper">
            <option value="c">Contains</option>
            <option value="e">Equals</option>
            <option value="g">&gt;</option>
            <option value="ge">&gt;&#x3D;</option>
            <option value="l">&lt;</option>
            <option value="le">&lt;&#x3D;</option>
          </select>
        </div>
        <div class="col s12 l2">
          <input id="search_word" autocomplete="off" @keyup="search($event)" />
        </div>
        <div class="col s12 l6">
          <button class="btn-small" @click="search()">Search</button>
          <button class="grey btn-small" @click="clearSearch()">Clear</button>
        </div>
      </div>
      <table class="striped highlight">
        <thead>
          <tr>
            <th :class="getSortClass('UserAccount.id', 'asc')">
              <router-link :to="getLink('sort', 'UserAccount.id', 'asc')">Id</router-link>
            </th>
            <th :class="getSortClass('UserAccount.name')">
              <router-link :to="getLink('sort', 'UserAccount.name')">Name</router-link>
            </th>
            <th :class="getSortClass('UserAccount.email') + ' hide-on-small-only'">
              <router-link :to="getLink('sort', 'UserAccount.email')">Email</router-link>
            </th>
            <th :class="getSortClass('UserAccount.active')">
              <router-link :to="getLink('sort', 'UserAccount.active')">Active</router-link>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="userAccount in userAccounts" :key="userAccount">
            <td class="center-align">{{ userAccount.id }}</td>
            <td>{{ userAccount.name }}</td>
            <td class="hide-on-small-only">{{ userAccount.email }}</td>
            <td class="center-align">{{ userAccount.active ? '✓' : '✗' }}</td>
            <td class="center-align">
              <router-link
                class="btn-small grey"
                :to="`/userAccount/${userAccount.id}`"
                title="View"
                ><i class="fa fa-eye"></i
              ></router-link>
              <router-link
                class="btn-small"
                :to="`/userAccount/edit/${userAccount.id}`"
                title="Edit"
                ><i class="fa fa-pencil"></i
              ></router-link>
              <router-link
                class="btn-small red"
                :to="`/userAccount/delete/${userAccount.id}`"
                title="Delete"
                ><i class="fa fa-times"></i
              ></router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col m3 s6">
          <label
            >Show
            <select id="page_size" @change="$router.push($event.target.value)">
              <option :value="getLink('size', 10)" :selected="paging.size == 10">10</option>
              <option :value="getLink('size', 20)" :selected="paging.size == 20">20</option>
              <option :value="getLink('size', 30)" :selected="paging.size == 30">30</option>
            </select>
            entries
          </label>
        </div>
        <div class="col m9 s6">
          <div class="right hide-on-small-only">
            <ul class="pagination">
              <li :class="`${paging.current <= 1 ? ' disabled' : ''}`">
                <router-link :to="getLink('page', paging.current - 1)">Prev</router-link>
              </li>
              <li
                v-for="page in paging.last"
                :key="page"
                :class="`${paging.current == page ? ' active' : ''}`"
              >
                <router-link :to="getLink('page', page)">{{ page }}</router-link>
              </li>
              <li :class="`${paging.current >= paging.last ? ' disabled' : ''}`">
                <router-link :to="getLink('page', paging.current + 1)">Next</router-link>
              </li>
            </ul>
          </div>
          <div class="right hide-on-med-and-up">
            <label>
              Page
              <select id="page_index" @change="$router.push($event.target.value)">
                <option
                  v-for="page in paging.last"
                  :key="page"
                  :value="getLink('page', page)"
                  :selected="paging.current == page"
                >
                  {{ page }}
                </option>
              </select>
            </label>
            of <span>{{ paging.last }}</span>
            <div class="btn-group">
              <router-link
                :class="` btn-small${paging.current <= 1 ? ' disabled' : ''}`"
                :to="getLink('page', paging.current - 1)"
                ><i class="fa fa-chevron-left"></i
              ></router-link>
              <router-link
                :class="` btn-small${paging.current >= paging.last ? ' disabled' : ''}`"
                :to="getLink('page', paging.current + 1)"
                ><i class="fa fa-chevron-right"></i
              ></router-link>
            </div>
          </div>
        </div>
      </div>
      <router-link class="btn-small" to="/userAccount/create">Create</router-link>
    </div>
    <component :is="'style'">#searchbar_toggle_menu { display: inline-flex!important }</component>
  </div>
</template>
<script>
import Service from './Service'
import Util from '../../util'

export default {
  name: 'UserAccountIndex',
  data() {
    return {
      userAccounts: [],
      paging: {}
    }
  },
  watch: {
    $route(to) {
      if (to.name == 'userAccount') {
        this.get()
      }
    }
  },
  mounted() {
    this.initView()
    this.get()
  },
  methods: {
    ...Util,
    get() {
      Service.get()
        .then((response) => {
          this.userAccounts = response.data.userAccounts
          this.paging = {
            current: parseInt(this.$route.query.page) || 1,
            size: parseInt(this.$route.query.size) || 10,
            last: response.data.last
          }
        })
        .catch((e) => {
          alert(e.response.data.message)
        })
    }
  }
}
</script>
