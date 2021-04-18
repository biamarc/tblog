import TravelEdit from 'components/TravelEdit.vue'
import TravelView from 'components/TravelView.vue'
import TitlePage from "components/TitlePage";
export default ({  Vue  }) => {
  Vue.component('tb-travel-edit', TravelEdit)
  Vue.component('tb-travel-view', TravelView)
  Vue.component('tb-title-page', TitlePage)
}
