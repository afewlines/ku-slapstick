<template>
<div id="header"
  @click="home">
  <div id="title">
    {{ title }}
    <div id="subtitle"
      v-if="subtitle">
      {{ subtitle }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      title: 'S l a p S t i c k',
      subtitle: null
    }
  },
  methods: {
    home() {
      this.$router.push('/');
      return;
    },
  }
}
</script>


<style scoped>
#header {
  width: 100%;
  max-width: 550px;
  height: 4em;
  margin: auto;
  background-color: #c69999;
  text-align: center;
  font-size: 2em;
  transition: box-shadow 0.75s ease-out;
}

#title {
  position: relative;
  height: auto;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 100;
  color: #3a3c38;
  transition: transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

#title #subtitle {
  font-size: 0.5em;
  font-style: italic;
  margin-top: 0.5em;
  transition: transform 1.25s cubic-bezier(0.6, -2, 0.2, 1.65);
}

#header:hover {
  box-shadow: 0 0 3.5em -1.75em #fff;
}

#header:hover #title {
  transform: scale(1.25) translateY(-40%);
}

#header:hover #subtitle {
  transform: scale(1.2);
}
</style>
