<template>
  <div>
  <mt-navbar v-model="selected" style="background-color: rgb(249, 249, 249);">
    <mt-tab-item id="1">直播</mt-tab-item>
    <mt-tab-item id="2">回放</mt-tab-item>
  </mt-navbar>
  <!-- tab-container -->
  <mt-tab-container v-model="selected">
    <mt-tab-container-item id="1">
      <list-template type="1"></list-template>
    </mt-tab-container-item>
    <mt-tab-container-item id="2">
      <list-template type="2"></list-template>
    </mt-tab-container-item>
  </mt-tab-container>
</div>
</template>

<script>
import listTemplate from '@/components/commons/listTemplate'
export default {
  name: 'List',
  data () {
    return {
      selected: '1'
    }
  },
  components: {
    listTemplate: listTemplate
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
