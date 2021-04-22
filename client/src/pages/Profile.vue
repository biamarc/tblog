<template>
  <q-page padding>

    <q-card flat>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="user.picture" alt="Profile picture">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="email" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section horizontal>
<!--        <pre>{{ JSON.stringify($auth.user, null, 2) }}</pre>-->
        <pre>{{ JSON.stringify(user, null, 2) }}</pre>
      </q-card-section>
    </q-card>


  </q-page>
</template>

<script>
import {  mapGetters } from 'vuex'
export default {
  name: 'Profile',
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    })
  }
}
</script>
