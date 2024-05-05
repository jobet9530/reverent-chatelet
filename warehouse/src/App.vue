<template>
  <div v-if="isReady">
    <div v-if="user">
      <div class="wrapper">
        <input id="sidebar_toggle" type="checkbox" />
        <nav id="sidebar">
          <router-link to="/">
            <h4>Project1</h4>
          </router-link>
          <ul class="collection">
            <li class="collection-item">
              <router-link
                to="/home"
                :class="this.$route.path.endsWith('/home') ? 'active bg-primary' : ''"
                >Home</router-link
              >
            </li>
            <li class="collection-item" v-for="menu in user.menu" :key="menu.path">
              <router-link
                :to="`/${menu.path}`"
                :class="
                  this.$route.path.substr(1).split('/')[0] == menu.path ? 'active bg-primary' : ''
                "
                >{{ menu.title }}</router-link
              >
            </li>
          </ul>
        </nav>
        <div id="body">
          <nav>
            <div class="nav-wrapper">
              <label for="sidebar_toggle" class="btn-small"><i class="fa fa-bars"></i></label>
              <ul class="right">
                <li id="searchbar_toggle_menu" class="hide">
                  <a class="nav-link text-secondary" href="#"
                    ><label for="searchbar_toggle" class="hide-on-large-only"
                      ><i class="fa fa-search"></i></label
                  ></a>
                </li>
                <li>
                  <a class="dropdown" data-target="dropdown-menu" href="#"
                    ><i class="fa fa-user"></i>
                    <span class="hide-on-med-and-down"> {{ user.name }}</span></a
                  >
                </li>
              </ul>
              <ul id="dropdown-menu" class="dropdown-content">
                <li>
                  <router-link to="/profile" class="dropdown-item"
                    ><i class="fa fa-user"></i> Profile</router-link
                  >
                </li>
                <li>
                  <router-link to="/logout" class="dropdown-item"
                    ><i class="fa fa-sign-out"></i> Logout</router-link
                  >
                </li>
              </ul>
            </div>
          </nav>
          <div class="content">
            <router-view />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import http from './http'

export default {
  name: 'App',
  data() {
    return {
      isReady: false,
      user: null
    }
  },
  beforeCreate() {
    http
      .get('/user')
      .then((response) => {
        this.$root.user = this.user = response.data
        this.isReady = true
      })
      .catch(() => {
        this.isReady = true
      })
  },
  beforeUpdate() {
    setTimeout(() => {
      if (window.M) {
        window.M.Dropdown.init(document.querySelectorAll('.dropdown'))
      } else {
        console.error('Materialize not loaded')
      }
    })
  }
}
</script>
