<template>
  <div id="app">
    <AppLayout />
  </div>
</template>

<script>
import AppLayout from './layouts/AppLayout.vue'

export default {
  name: 'App',
  components: {
    AppLayout,
  },
}
</script>

<style src="./assets/css/app.css">
/* Dans App.vue ou votre fichier CSS global */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  overflow-x: hidden !important;
  position: relative !important;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  position: relative !important;
  left: 0 !important;
}

/* Supprimer tous les décalages potentiels */
* {
  margin-left: 0 !important;
}

/* Si vous avez une sidebar cachée quelque part */
.sidebar, .menu-lateral, .drawer {
  display: none !important;
}
</style>
