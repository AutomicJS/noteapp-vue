<template>

</template>

<script>
  export default {
    name: 'sidebar',
    data () {
      return {
        noteslist: this.$localStorage.get('notes')
      }
    }
  }
</script>

<style scoped>
</style>
