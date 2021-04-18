<template>
  <q-page padding>
    <tb-title-page title="Edit travel" icon="travel_explore" />

    <tb-travel-edit  :travelId="travelId"></tb-travel-edit>
  </q-page>
</template>

<script>
export default {
  name: 'MyTravelEdit',
  props: ['travelId']
}
</script>
