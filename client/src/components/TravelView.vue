<template>
  <q-card>
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
      <div class="text-subtitle2 q-mt-md">
        <q-chip outline color="primary" text-color="white" icon="thumb_up">
          {{travel.like }}
        </q-chip>
        <q-chip outline color="red"  icon="thumb_down">
          {{travel.unlike }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ travel.description|truncate(limit) }}
    </q-card-section>
    <q-separator/>

     <q-card-actions align="right">
       <slot>
       </slot>
     </q-card-actions>
  </q-card>

</template>
<script>
export default {
  name: 'TravelView',
  props: {
    travel: {
      type: Object,
      required: true,
    },
    limit: {
      type: Number,
      required: false,
      default: 200
    }
  },
  data() {
    return {}
  }
}
</script>
