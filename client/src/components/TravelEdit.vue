<template>
  <div class="q-pt-md q-gutter-y-md">

    <q-input v-model="travel.name" clearable counter label="Title" hint="Write the title of your travel"
             :maxlength="$v.travel.name.$params.maxLength.max"
             @blur="$v.travel.name.$touch"
             :error="$v.travel.name.$error"
             :error-message="`Field must be not empty greater than ${$v.travel.name.$params.minLength.min} and lower than ${$v.travel.name.$params.maxLength.max} chars`"
    />

    <div class="row">
      <div class="col-3">
        <q-input v-model="travel.startDate" label="Start date" hint="The start date of your travel" clearable
                 @blur="$v.travel.startDate.$touch"
                 :error="$v.travel.startDate.$error"
                 error-message="Field must not be empty"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="travel.startDate" mask="YYYY-MM-DD" title="Start date" subtitle="Your travel">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="offset-1 col-3">
        <q-input v-model="travel.endDate" label="End date" hint="The end date of your travel" clearable
                 @blur="$v.travel.endDate.$touch"
                 :error="$v.travel.endDate.$error"
                 error-message="Field must not be empty">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="travel.endDate" mask="YYYY-MM-DD" title="End date" subtitle="Your travel">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <q-input v-model="travel.description" label="Description" hint="Describe your travel" counter clearable
             type="textarea"
             :maxlength="$v.travel.description.$params.maxLength.max"
             @blur="$v.travel.description.$touch"
             :error="$v.travel.description.$error"
             :error-message="`Field must be not empty greater than ${$v.travel.description.$params.minLength.min} and lower than ${$v.travel.description.$params.maxLength.max} chars`"
    />

    <q-img v-if="travel.imageUrl" :src="travel.imageUrl"  style="width: 100%; max-width: 800px">
      <template v-slot:loading>
        <q-spinner-gears color="white" />
      </template>
    </q-img>

    <q-file v-model="image" label="Image of your travel" accept=".jpg, image/*"  @rejected="onRejected">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>

    <div class="q-pt-lg q-gutter-x-md">
      <q-btn label="Save" icon="save" color="primary" @click="save" :loading="loading"/>
      <q-btn label="Undo" icon="undo" :to="undo" :loading="loading"/>
    </div>

<!--    <div>{{ travel }}</div>-->
  </div>
</template>

<script>
import {Travel} from "src/models/travel";
import {AppRoutes} from '../models/path_constants'
import {required, minLength, maxLength} from 'vuelidate/lib/validators'

export default {
  name: 'TravelEdit',
  props: ['travelId'],
  data() {
    return {
      travel: new Travel(),
      loading: false,
      image: null
    }
  },
  validations () {
    return {
      travel: {
        name: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(30)
        },
        description: {
          required,
          minLength: minLength(200),
          maxLength: maxLength(4096)
        },
        startDate: {
          required
        },
        endDate: {
          required
        }
      }
    }
  },
  async created() {
    this.token = await this.$store.state.auth.token
    this.client = this.$axios.buildAuth(this.token);
    this.getTravel(this.travelId)
  },
  watch: {
    travelId: {
      handler: function (nv) {
        this.getTravel(nv)
      }
    }
  },
  computed: {
    undo() {
      return AppRoutes.MY_TRAVELS.path;
    }
  },
  methods: {
    async getTravel(tid) {
      if (tid) {
        this.loading = true
        try {
          const res = await this.client.get(`/auth/travels/${tid}`)
          this.travel = res.data
        }catch (e) {
          this.$notifier.error('Unable to find your travel')
        } finally {
          this.loading = false
        }
      }
    },
    async save() {
      this.$v.travel.$touch()
      if (this.$v.travel.$error) {
        this.$notifier.error('Please review fields before save.')
        return
      }
      this.loading = true
      let execute = this.client.post;
      let url = AppRoutes.MY_TRAVELS.path
      if (this.travelId) {
        execute = this.client.patch
        url = `${url}/${this.travelId}`
      }
      try{
        const res = await execute(url, this.travel)
        // execute upload if image
        if (this.image) {
          try {
            // generate pre-signed URL for authenticated user
            const s3res = await this.client.post(`/auth/travels/${res.data.travelId}/attachment`)
            // put image to S3
            await this.$axios.build({timeout: 5000}).put(s3res.data.uploadUrl, this.image)
          } catch (e) {
            this.$notifier.error('Error uploading image')
          }
        }
        this.$notifier.success('Data saved')
        this.redirect()
      } catch (e){
        this.$notifier.error('Error saving data')
        this.loading = false
      } finally {
        // nop
      }
    },
    onRejected (rejectedEntries) {
      console.log('Rejected entries',JSON.stringify(rejectedEntries))
      this.$notifier.warning(`${rejectedEntries.length} file(s) did not pass validation constraints`)
    },
    redirect() {
      const self = this
      setTimeout(()=> {
        self.loading = false
        self.$router.push(AppRoutes.MY_TRAVELS.path)
      }, 2000)
    }
  }
}
</script>
