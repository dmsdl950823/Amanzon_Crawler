<template>
  <div class="hello">
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

    <va-data-table
      :items="items"
      :columns="columns"
      striped
    >
      <template #cell(actions)>
        <va-button
          flat
          icon="delete"
        />
      </template>
    </va-data-table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      items: [
        {
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz'
        },
        {
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv'
        },
        {
          name: 'Clementine Bauch',
          username: 'Samantha',
          email: 'Nathan@yesenia.net'
        },
        {
          name: 'Patricia Lebsack',
          username: 'Karianne',
          email: 'Julianne.OConner@kory.org'
        }
      ],
      columns: [
        { key: 'name', sortable: true },
        { key: 'username', sortable: true },
        { key: 'email', sortable: true },
        { key: 'actions', width: 80 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
