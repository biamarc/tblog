<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="Detail">
    </tb-title-page>
    <tb-travel-view :travel="travel" :limit="new Number(-1)">
      <div v-if="isLogged">
        <q-btn icon="thumb_up" @click="like(true)" :loading="loading">
          <q-badge v-if="travel.like" outline color="primary" :label="travel.like"/>
        </q-btn>
        <q-btn flat icon="thumb_down" @click="like(false)" :loading="loading" class="q-px-sm">
          <q-badge v-if="travel.unlike" outline color="primary" :label="travel.unlike"/>
        </q-btn>
      </div>
    </tb-travel-view>
  </q-page>
</template>

<script>
import {Travel} from "src/models/travel"
import {mapGetters} from 'vuex'
export default {
  name: 'TravelDetails',
  props: ['travelId'],
  data(){
    return {
      travel: {
        name: null
      },
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      isLogged: 'auth/isLogged',
      token: 'auth/getToken'
    })
  },
  created() {
    if (this.isLogged){
      this.clientAuth = this.$axios.buildAuth(this.token)
    }
    this.client = this.$axios.build()
    this.fetch(this.travelId)
  },
  watch: {
    travelId: {
      handler: function (nv) {
        this.fetch(nv)
      }
    }
  },
  methods: {
    async fetch(tid) {
      if (tid){
        this.loading = true
        try {
          const res = await  this.client.get(`/travels/${this.travelId}`)
          this.travel = res.data
        } catch (e){
          this.$notifier.error('Error reading travel')
        } finally {
          this.loading = false
        }
      }
    },
    async like(value) {
      this.loading = true
      try {
        const res = await this.clientAuth.put(`auth/travels/${this.travelId}/likes`, {like: value})
        this.travel = res.data
      } catch (e){
        this.$notifier.error('Error putting like to travel')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
