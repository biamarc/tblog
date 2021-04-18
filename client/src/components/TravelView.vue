<template>
  <q-card>
    <q-img
      v-if="travel.image"
      :src="travel.image"
      style="width:100%"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Cannot load image
        </div>
      </template>
    </q-img>
    <q-card-section>
      <div class="text-h6">{{ travel.name }}</div>
      <div class="text-subtitle2">
        <q-icon name="date_range" size="md" class="q-mr-sm"/>
        {{ travel.startDate }} - {{ travel.endDate }}
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ travel.description }}
    </q-card-section>
    <q-separator/>
     <q-card-actions align="right">
        <q-btn flat :icon="iconPublish" @click="togglePublish()" :loading="waitingAction">{{ labelPublish }}</q-btn>
        <q-btn flat icon="edit" @click="editItem()">Edit</q-btn>
        <q-btn flat icon="delete" @click="deleteItem()" :loading="waitingAction">Delete</q-btn>
     </q-card-actions>
  </q-card>

</template>
<script>
import {AppRoutes} from "src/models/path_constants";

export default {
  name: 'TravelView',
  props: {
    travel: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      waitingAction: false
    }
  },
  async created() {
    this.token = await this.$auth.getJWTToken()
    this.client = this.$axios.buildAuth(this.token);
  },
  computed: {
    labelPublish() {
      return this.travel.published ? 'Unpublish' : 'Publish'
    },
    iconPublish() {
      return this.travel.published ? 'unpublished' : 'publish'
    }
  },
  methods: {
    deleteItem() {
      this.waitingAction=true
      this.client.delete(`/auth/travels/${this.travel.travelId}`)
      .then(res => this.$emit('deleted',this.travel))
      .catch(err => this.$notifier.error('An error occurred performing operation'))
      .finally(()=>this.waitingAction=false)
    },
    editItem() {
      this.$router.push(AppRoutes.MY_TRAVELS.path + `/${this.travel.travelId}`)
    },
    togglePublish() {
      this.waitingAction=true
      this.client.patch(`/auth/travels/${this.travel.travelId}/publish`, {published: !this.travel.published})
        .then(res => this.$emit('change',res.data))
      .catch(err => this.$notifier.error('An error occurred performing operation'))
      .finally(()=>this.waitingAction=false)
    }
  }
}
</script>
