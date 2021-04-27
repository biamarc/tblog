<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="Recently Liked Travels">
      <q-btn icon="refresh" color="primary" class="q-mx-md" :loading="loading" @click="list()" flat>Refresh content
    </q-btn>
    </tb-title-page>
    <hr class="q-my-md"/>
    <div class="row items-start q-gutter-md">
      <tb-travel-view v-for="tr in travels" :key="tr.travelId" :travel="tr" style="width: 100%" :limit="-1" />
    </div>
    <br/>
  </q-page>
</template>

<script>
import {AppRoutes} from '../models/path_constants'
import _ from 'lodash'

export default {
  name: 'LikedTravels',
  data() {
    return {
      token: null,
      client: null,
      travels: [],
      loading: false,
    }
  },
  created() {
    this.token = this.$store.state.auth.token
    this.client = this.$axios.buildAuth(this.token);
    this.list()
  },
  computed: {
    newTravel() {
      return AppRoutes.NEW_TRAVEL.path
    }
  },
  methods: {
    async list() {
      this.loading = true
      try {
        this.travels=[]
        for (const msg of this.$store.state.auth.messages){
          try{
            const res = await this.client.get(`/auth/travels/${msg.travelId}`)
            this.travels.push(res.data)
          } catch (e) {
            this.$notifier.error(`Error retrieving data for travel:${msg.travelId}`)
          }
        }
      } catch (e) {
        // noop
      } finally {
        this.loading = false
      }
    },
  }

}
</script>
