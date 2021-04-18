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

    <div class="q-pt-lg q-gutter-x-md">
      <q-btn label="Save" icon="save" color="primary" @click="save" :loading="loading"/>
      <q-btn label="Undo" icon="undo" :to="undo" :loading="loading"/>
    </div>

    <div>{{ travel }}</div>
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
      loading: false
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
    this.token = await this.$auth.getJWTToken()
    this.client = this.$axios.buildAuth(this.token);
    this.getTravel(this.travelId)
  },
  watch: {
    travelId: {
      handler: function (nv, ov) {
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
    getTravel(tid) {
      console.log(`travelId: ${tid}`)
      if (tid) {
        console.log('invoke client')
        this.client.get(`/auth/travels/${tid}`)
          .then(res => {
            this.travel = res.data
          })
          .catch(err => this.$notifier.error('Unable to find your travel'))
      }
    },
    save() {
      this.$v.travel.$touch()
      if (this.$v.travel.$error) {
        this.$notifier.error('Please review fields before save.')
        return
      }
      this.loading = true
      const obj = {
        name: this.travel.name,
        description: this.travel.description,
        startDate: this.travel.startDate,
        endDate: this.travel.endDate,
        published: this.travel.published,
      }
      this.client.post('/auth/travels', obj)
        .then(res => this.$router.push(AppRoutes.MY_TRAVELS.path))
        .catch(err => this.$notifier.error('Error saving data'))
        .finally(() => this.loading = false)
    }
  }
}
</script>
