<template>
  <div class="hello">
    <va-file-upload
      v-model="basic"
      @input="upload"
    />

    <va-button
      color="info"
      gradient
      class="mr-4"
    >
      SAVE
    </va-button>

    <va-popover
      message="Popover text"
    >
      <va-button>SAVE</va-button>
    </va-popover>

    <WijmoChart />
  </div>
</template>

<script>
import WijmoChart from './WijmoChart'

export default {
  name: 'HelloWorld',
  components: {
    WijmoChart
  },
  data () {
    return {
      basic: [],
      items: [],
      columns: [
        { key: 'title', sortable: false, width: 100 },
        // { key: 'image', sortable: false },
        { key: 'price', sortable: false },
        { key: 'href', sortable: false },
        { key: 'asin', sortable: false },
        { key: 'rating', sortable: false },
        { key: 'brand', sortable: false },
        { key: 'item_weight', sortable: false },
        { key: 'size', sortable: false },
        { key: 'customer_reviews', sortable: false },
        { key: 'best_sellers_rank', sortable: false },
        { key: 'BSR', sortable: false },
        { key: 'actions', width: 80 }
      ]
    }
  },

  methods: {
    upload (event) {
      const file = event.target.files[0]

      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.items = this.tsvToJson(reader.result)
        console.log(this.items)
      }, false)

      if (file) {
        reader.readAsText(file)
      }
    },

    tsvToJson (tsv) {
      const rows = tsv.split('\r\n')
      const jsonArray = []
      const header = rows[0].split('\t')

      for (let i = 1; i < rows.length; i++) {
        const obj = {}
        const row = rows[i].split('\t')
        for (let j = 0; j < header.length; j++) {
          obj[header[j]] = row[j]
        }

        jsonArray.push(obj)
      }

      return jsonArray
    },

    deleteItemById (id) {
      this.items = [
        ...this.items.slice(0, id),
        ...this.items.slice(id + 1)
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
