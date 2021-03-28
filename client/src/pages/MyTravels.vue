<template>
  <q-page padding>
    <h1>My Travels</h1>
      <p>{{ token }}</p>
  </q-page>
</template>

<script>
export default {
  name: 'MyTravels',
  data () {
    return {
      token: null
    }
  },
  created() {
    this.getJWTToken();
  },
  methods: {
    getJWTToken() {
      this.$auth.getIdTokenClaims()
        .then((val) => this.token = val.__raw)
    }
  }

}
</script>
