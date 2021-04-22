<template>
  <div style="width: 100%">
  <q-card >
    <q-img
      v-if="travel.imageUrl"
      :src="travel.imageUrl"
      style="width:100%; max-width: 600px"
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
     <q-card-actions align="right" v-if="editable">
        <q-btn flat :icon="iconPublish" @click="togglePublish()" :loading="waitingAction">{{ labelPublish }}</q-btn>
        <q-btn flat icon="edit" @click="editItem()" :loading="waitingAction">Edit</q-btn>
        <q-btn flat icon="delete" @click="confirm()" :loading="waitingAction">Delete</q-btn>
     </q-card-actions>
  </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section>
          <q-avatar icon="help" color="primary" text-color="white" />
          <span class="q-ml-sm">Confirm to delete your travel?</span>
        </q-card-section>
        <q-card-section class="q-pt-none text-center">
          {{travel.name}}
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="default" v-close-popup />
          <q-btn flat label="Delete the travel" color="red" @click="deleteItem()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>
<script>
import {AppRoutes} from "src/models/path_constants";

export default {
  name: 'TravelView',
  props: {
    travel: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      waitingAction: false,
      showDialog: false,
    }
  },
  async created() {
    if (this.editable){
      this.token = await this.$store.state.auth.token
      this.client = this.$axios.buildAuth(this.token);
    }
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
    confirm() {
      this.showDialog = true
    },
    deleteItem() {
      this.showDialog = false
      this.waitingAction=true
      this.client.delete(`/auth/travels/${this.travel.travelId}`)
      .then(() => this.$emit('deleted',this.travel))
      .catch(() => this.$notifier.error('An error occurred performing operation'))
      .finally(()=>this.waitingAction=false)
    },
    editItem() {
      this.$router.push(AppRoutes.MY_TRAVELS.path + `/${this.travel.travelId}`)
    },
    togglePublish() {
      this.waitingAction=true
      this.client.patch(`/auth/travels/${this.travel.travelId}/publish`, {published: (this.travel.published===1 ? 0 : 1)})
        .then(res => this.$emit('change',res.data))
      .catch(() => this.$notifier.error('An error occurred performing operation'))
      .finally(()=>this.waitingAction=false)
    }
  }
}
</script>
