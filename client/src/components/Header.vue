<template>
<div id="header">
  {{ title }}
</div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: 'S l a p S t i c k'
    }
  }
}
</script>


<style scoped>
div {
  width: 100%;
  max-width: 550px;
  height: 4em;
  margin: auto;
  padding-top: 1.5em;
  text-align: center;
  font-size: 2em;
  font-weight: 100;
  background-color: #c69999;
  color: #3a3c38;
}
</style>
