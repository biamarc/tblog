<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Traveler Blog
        </q-toolbar-title>
        <q-space />

        <q-btn stretch flat label="Home" :to="routes.HOME.path" />
        <q-btn stretch flat label="Board" />
        <div v-if="!$auth.loading">
          <!-- show login when not authenticated -->
          <q-btn v-if="!$auth.isAuthenticated"  stretch flat label="Login" icon="login" @click="login"/>
          <!-- show logout when authenticated -->
            <q-btn-dropdown  v-if="$auth.isAuthenticated"
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
<!--              <q-btn stretch flat label="Profile" icon="account_circle" :to="routes.PROFILE.path"/>-->
<!--              <q-btn stretch flat label="Logout" icon="logout" @click="logout"/>-->
<!--              <q-btn stretch flat label="My Travels" icon="world" :to="routes.MY_TRAVELS.path"/>-->

            </q-btn-dropdown>

        </div>

        <q-separator dark vertical />


      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

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
import EssentialLink from 'components/EssentialLink.vue'
import {AppRoutes} from '../models/path_constants'
const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    routes (){
      return AppRoutes;
    }
  },
  methods: {
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
  }
}
</script>
