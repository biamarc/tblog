<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Traveler Blog
        </q-toolbar-title>
        <q-space />

        <q-btn stretch flat label="Home" :to="routes.HOME.path" />
        <!-- show login when not authenticated -->
        <q-btn v-if="!isLogged"  stretch flat label="Login" icon="login" @click="login"/>
        <!-- show logout when authenticated -->
        <q-btn-dropdown  v-else
            stretch flat
            label="Account"
            icon="account_circle"
          >
            <q-list>
              <q-item clickable  :to="routes.MY_TRAVELS.path">
                <q-item-section>
                  <q-avatar icon="travel_explore"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Travels</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable  :to="routes.PROFILE.path">
                <q-item-section>
                  <q-avatar icon="account_circle"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Profile</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable  @click="logout">
                <q-item-section>
                  <q-avatar icon="logout"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
          </q-btn-dropdown>
        <q-separator dark vertical />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Photo from Unsplash
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import {AppRoutes} from '../models/path_constants'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'MainLayout',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      isLogged: 'auth/isLogged'
    }),
    routes (){
      return AppRoutes;
    }
  },
  methods: {
    ...mapActions({
      login:  'auth/login',
      logout: 'auth/logout'
    }),
    /*
    login() {
      console.log('login')
      this.$auth.loginWithRedirect();
    },
    logout () {
      console.log('logout')
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
    */
  }
}
</script>
