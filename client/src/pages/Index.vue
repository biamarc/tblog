<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="Welcome to Traveler Blog">
      <q-btn icon="refresh" color="primary" class="q-mx-md" :loading="loading" @click="list()"></q-btn>
    </tb-title-page>

    <hr class="q-my-md"/>
    <div class="row items-start q-gutter-md">
      <tb-travel-view v-for="tr in travels" :key="tr.travelId" :travel="tr" :editable="false"/>
    </div>
    <br/>
    <q-btn v-if="nextKey" label="More" @click="more()" :loading="loading"/>
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
    async list() {
      this.loading = true
      try {
        const res = await this.client.get('/travels')
        this.travels = res.data.items;
      } catch (e) {
        this.$notifier('Sorry but something goes wrong... retry later')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
