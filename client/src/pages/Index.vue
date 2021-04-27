<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="Welcome to Traveler Blog">
      <q-btn icon="refresh" color="primary" class="q-mx-md" :loading="loading" @click="list()" flat>Refresh</q-btn>
    </tb-title-page>

    <hr class="q-my-md"/>
    <div class="row items-start q-gutter-md">
      <tb-travel-view v-for="tr in travels" :key="tr.travelId" :travel="tr" style="width: 100%">
        <q-btn icon="launch" @click="goTo(tr.travelId)">Detail</q-btn>
      </tb-travel-view>
    </div>
    <br/>
    <div class="text-center q-mt-lg" v-if="nextKey" >
      <q-btn label="More" @click="more()" :loading="loading" align="center" style="width: 150px" color="green"/>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      travels: [],
      loading: false,
      nextKey: null
    }
  },
  created() {
    this.client = this.$axios.build(this.token);
    this.list()
  },
  methods: {
    goTo(trid) {
      this.$router.push(`/${trid}`)
    },
    async list() {
      this.loading = true
      try {
        const res = await this.client.get('/travels')
        this.travels = res.data.items
        this.nextKey = res.data.nextKey
      } catch (e) {
        this.$notifier('Sorry but something goes wrong... retry later')
      } finally {
        this.loading = false
      }
    },
    async more() {
      this.loading = true
      try {
        const res = await this.client.get(`/travels?nextKey=${this.nextKey}`)
        for (const item of res.data.items)
          this.travels.push(item)
        this.nextKey = res.data['nextKey']
      } catch (e) {
        this.$notifier.error('Error retrieving data')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
