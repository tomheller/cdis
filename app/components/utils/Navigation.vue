<template>
  <div class="header">
    <div class="nav">
      <nuxt-link to="/" class="nav-link">CDIS home</nuxt-link>
      <nuxt-link to="/story" class="nav-link">Story select</nuxt-link>
    </div>
    <div class="auth">
      <img v-if="$auth.loggedIn" :src="$auth.user.picture" />
      <button v-if="$auth.loggedIn" @click="$auth.logout()">Sign out</button>
      <button v-else @click="$auth.loginWith('auth0')">Sign In</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {},
};
</script>

<style>
.header {
  @apply py-2 bg-gray-300 shadow;
}

.header {
  @apply flex justify-between;
}

.nav-link {
  @apply text-blue-600 mx-4;
}

.auth {
  @apply flex;
}

.auth img {
  @apply w-8 h-8 rounded-full border border-gray-400 shadow-sm;
}
.auth button {
  @apply mx-4 py-1 px-2 bg-blue-500 rounded text-white shadow;
}
</style>
