<template>
  <q-page padding>
    <h1>My Travels</h1>
    <h3>List</h3>
    <q-btn @click="list()" label="List"/>
    <br/>
  </q-page>
</template>

<script>
export default {
  name: 'MyTravels',
  data () {
    return {
      token: null,
      client:  null
    }
  },
  async created() {
    this.token = await this.$auth.getJWTToken()
    this.client = this.$axios.buildAuth(this.token);
  },
  methods: {
    list() {
      this.client.get('/auth/travels')
        .then(res => console.info(`Result: ${res}`))
        .catch(err => console.error(`Error: ${err}`))
        .finally(() => console.info('End'))
    }

  }

}
</script>
