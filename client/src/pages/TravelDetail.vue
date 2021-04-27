<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="Travel Detail" />
    <hr class="q-my-md"/>
    <tb-travel-view :travel="travel" :limit="-1">
        <q-btn :disable="!isLogged" color="primary" icon="thumb_up" @click="like(true)" :loading="loading" class="q-mx-sm q-px-sm">
          <q-badge v-if="liked!==null && liked.like" outline color="default" label="voted"/>
        </q-btn>
        <q-btn :disable="!isLogged" icon="thumb_down" @click="like(false)" :loading="loading" class="q-mx-sm q-px-sm">
          <q-badge v-if="liked!==null && !liked.like" outline color="primary" label="voted"/>
        </q-btn>
    </tb-travel-view>
  </q-page>
</template>

<script>
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
      liked: null
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
      this.isLiked(this.travelId)
    }
    this.client = this.$axios.build()
    this.fetch(this.travelId)
  },
  watch: {
    travelId: {
      handler: function (nv) {
        this.fetch(nv)
        if (this.isLogged){
          this.isLiked(nv)
        }
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
      if (this.liked && this.liked.like===value){
        await this.deleteLike()
        return
      }
      this.loading = true
      try {
        const res = await this.clientAuth.put(`auth/travels/${this.travelId}/likes`, {like: value})
        this.travel = res.data
        this.liked = {
          like: value,
          travelId: this.travel.travelId
        }
      } catch (e){
        this.$notifier.error('Error putting like to travel')
      } finally {
        this.loading = false
      }
    },
    async isLiked(tid) {
      try {
        const res = await this.clientAuth.get(`auth/travels/${tid}/likes`)
        this.liked = res.data
      } catch (e){
        // noop not like
      }
    },
    async deleteLike () {
      this.loading = true
      try {
        const res = await this.clientAuth.delete(`auth/travels/${this.travelId}/likes`)
        this.travel = res.data
        this.liked = null
      } catch (e){
        this.$notifier.error('Error removing like to travel')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
