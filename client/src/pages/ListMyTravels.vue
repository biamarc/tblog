<template>
  <q-page padding>
    <tb-title-page icon="travel_explore" title="My Travels">
      <q-btn icon="add" color="primary" class="q-mx-md" :to="newTravel" :loading="loading" flat>New travel</q-btn>
      <q-btn icon="refresh" color="primary" class="q-mx-md" :loading="loading" @click="list()" flat>Refresh content
      </q-btn>
    </tb-title-page>
    <hr class="q-my-md"/>
    <div class="row items-start q-gutter-md">
      <tb-travel-view v-for="tr in travels" :key="tr.travelId" :travel="tr" style="width: 100%" img-class="mytravels-img-class">
        <q-btn flat :icon="tr.published ? 'unpublished' : 'publish'" @click="togglePublish(tr)"
               :loading="waitingAction">{{ tr.published ? 'Unpublish' : 'Publish' }}
        </q-btn>
        <q-btn flat icon="edit" @click="editItem(tr)" :loading="waitingAction">Edit</q-btn>
        <q-btn flat icon="delete" @click="confirm(tr)" :loading="waitingAction">Delete</q-btn>
      </tb-travel-view>
    </div>
    <br/>
    <div class="text-center q-mt-lg" v-if="nextKey">
      <q-btn label="More" @click="more()" :loading="loading" align="center" style="width: 150px" color="green"/>
    </div>

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
  created() {
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
    async list() {
      this.loading = true
      try {
        const res = await this.client.get('/auth/travels')
        this.travels = res.data.items
        this.nextKey = res.data.nextKey
      } catch (e) {
        this.$notifier.error('Error retrieving data')
      } finally {
        this.loading = false
      }
    },
    async more() {
      this.loading = true
      try {
        const res = await this.client.get(`/auth/travels?nextKey=${this.nextKey}`)
        for (const item of res.data.items)
          this.travels.push(item)
        this.nextKey = res.data['nextKey']
      } catch (e) {
        this.$notifier.error('Error retrieving data')
      } finally {
        this.loading = false
      }
    },
    confirm(tr) {
      this.travelToDelete = tr
      this.showDialog = true
    },
    async deleteItem(travel) {
      this.showDialog = false
      this.waitingAction = true
      try {
        await this.client.delete(`/auth/travels/${travel.travelId}`)
        this.travels = _.filter(this.travels, (item) => item.travelId !== travel.travelId)
      } catch (e) {
        this.$notifier.error('An error occurred performing operation')
      } finally {
        this.waitingAction = false
      }
    },
    editItem(travel) {
      this.$router.push(AppRoutes.MY_TRAVELS.path + `/${travel.travelId}`)
    },
    async togglePublish(travel) {
      this.waitingAction = true
      try {
        const res = await this.client.patch(`/auth/travels/${travel.travelId}/publish`, {published: (travel.published === 1 ? 0 : 1)})
        const index = _.findIndex(this.travels, (item) => item.travelId === travel.travelId)
        if (index >= 0) {
          this.travels[index] = res.data
        }
      } catch (e) {
        this.$notifier.error('An error occurred performing operation')
      } finally {
        this.waitingAction = false
      }
    }
  }

}
</script>
