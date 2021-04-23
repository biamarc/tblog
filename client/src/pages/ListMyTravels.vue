<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="My Travels">
      <q-btn icon="add" color="primary" class="q-mx-md" :to="newTravel" :loading="loading" flat>New travel</q-btn>
      <q-btn icon="refresh" color="primary" class="q-mx-md" :loading="loading" @click="list()" flat>Refresh content</q-btn>
    </tb-title-page>
    <hr class="q-my-md"/>
    <div class="row items-start q-gutter-md">
      <tb-travel-view v-for="tr in travels" :key="tr.travelId" :travel="tr" style="width: 100%">
        <q-btn flat :icon="tr.published ? 'unpublished' : 'publish'" @click="togglePublish(tr)"
               :loading="waitingAction">{{ tr.published ? 'Unpublish' : 'Publish' }}
        </q-btn>
        <q-btn flat icon="edit" @click="editItem(tr)" :loading="waitingAction">Edit</q-btn>
        <q-btn flat icon="delete" @click="confirm(tr)" :loading="waitingAction">Delete</q-btn>
      </tb-travel-view>
    </div>
    <br/>
    <q-btn v-if="nextKey" label="More" @click="more()" :loading="loading"/>

    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section>
          <q-avatar icon="help" color="primary" text-color="white"/>
          <span class="q-ml-sm">Confirm to delete your travel?</span>
        </q-card-section>
        <q-card-section class="q-pt-none text-center">
          {{ travelToDelete.name }}
        </q-card-section>
        <q-separator/>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="default" v-close-popup/>
          <q-btn flat label="Delete the travel" color="red" @click="deleteItem(travelToDelete)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {AppRoutes} from '../models/path_constants'
import _ from 'lodash'

export default {
  name: 'ListMyTravels',
  data() {
    return {
      token: null,
      client: null,
      travels: [],
      nextKey: null,
      loading: false,
      waitingAction: false,
      showDialog: false,
      travelToDelete: {
        name: null
      }
    }
  },
  async created() {
    this.token = this.$store.state.auth.token
    this.client = this.$axios.buildAuth(this.token);
    this.list()
  },
  computed: {
    newTravel() {
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
    confirm(tr) {
      this.travelToDelete = tr
      this.showDialog = true
    },
    deleteItem(travel) {
      this.showDialog = false
      this.waitingAction = true
      this.client.delete(`/auth/travels/${travel.travelId}`)
        .then(() => {
          this.travels = _.filter(this.travels, (item) => item.travelId !== travel.travelId)
        })
        .catch(() => this.$notifier.error('An error occurred performing operation'))
        .finally(() => this.waitingAction = false)
    },
    editItem(travel) {
      this.$router.push(AppRoutes.MY_TRAVELS.path + `/${travel.travelId}`)
    },
    togglePublish(travel) {
      this.waitingAction = true
      this.client.patch(`/auth/travels/${travel.travelId}/publish`, {published: (travel.published === 1 ? 0 : 1)})
        .then(res => {
          const index = _.findIndex(this.travels, (item) => item.travelId === travel.travelId)
          if (index >= 0) {
            this.travels[index] = res.data
          }
        })
        .catch(() => this.$notifier.error('An error occurred performing operation'))
        .finally(() => this.waitingAction = false)
    }
  }

}
</script>
