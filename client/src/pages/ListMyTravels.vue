<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="My Travels">
      <q-btn icon="add" color="primary" class="q-mx-md" :to="newTravel" :loading="loading">New travel</q-btn>
    </tb-title-page>
    <hr class="q-my-md"/>
    <div class="row items-start q-gutter-md">
      <tb-travel-view v-for="tr in travels" :key="tr.travelId" :travel="tr" @change="changed" @deleted="deleted"/>
    </div>
    <br/>
    <q-btn v-if="nextKey" label="More" @click="more()" :loading="loading"/>
  </q-page>
</template>

<script>
import {AppRoutes} from '../models/path_constants'
import _ from 'lodash'
export default {
  name: 'ListMyTravels',
  data () {
    return {
      token: null,
      client:  null,
      travels: [],
      nextKey: null,
      loading: false
    }
  },
  async created() {
    this.token = this.$store.state.auth.token
    this.client = this.$axios.buildAuth(this.token);
    this.list()
  },
  computed: {
    newTravel()  {
      return AppRoutes.NEW_TRAVEL.path
    }
  },
  methods: {
    list() {
      this.loading = true
      this.client.get('/auth/travels')
        .then(res => {
          console.info(`Result: ${res}`)
            this.travels = res.data['items']
            this.hasMore = res.data['nextKey']
          })
        .catch(() => this.$notifier.error('Error retrieving data'))
        .finally(() => this.loading = false)
    },
    more() {
      this.loading = true
      this.client.get(`/auth/travels?nextKey=${this.nextKey}`)
        .then(res => {
          console.info(`Result: ${res}`)
          this.travels.push(res.data['items'])
          this.netxKey = res.data['nextKey']
        })
        .catch(() => this.$notifier.error('Error retrieving data'))
        .finally(() => this.loading = false)
    },
    changed(value) {
      if (value) {
        const ind = _.findIndex(this.travels, (item)=> item.travelId === value.travelId)
        if (ind >= 0) {
          this.travels[ind].published = value.published;
        }
      }
    },
    deleted(value) {
      console.log(`Deleted: `+ JSON.stringify(value))
      if (value) {
        this.travels = _.filter(this.travels, (item) => item.travelId !== value.travelId)
      }
    }
  }

}
</script>
