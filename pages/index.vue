<template>
  <div class="container">
    <div>
      <div class="card">
        <h1 class="title">cdis</h1>
        <p class="subtitle">
          A community driven, interactive story application.
        </p>

        <p class="step">1.</p>
        <p class="step-description">Read a chapter of the story.</p>

        <p class="step">2.</p>
        <p class="step-description">
          At the end of a chapter,
          <strong>choose one option to continue</strong>.
        </p>

        <p class="step">3.</p>
        <p class="step-description">
          Login to <strong>create your own choices</strong> for others to enjoy.
        </p>
        <p>
          <nuxt-link v-if="$auth.loggedIn" to="/story" class="get-started"
            >Get started</nuxt-link
          >
          <button v-else class="get-started" @click="$auth.loginWith('auth0')">
            Log in to get started
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: calc(100vh - 48px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card {
  @apply bg-white rounded shadow p-4;
}

.title {
  @apply font-sans text-4xl font-bold block text-gray-800;
}

.subtitle {
  @apply text-2xl max-w-lg text-gray-800 pb-2 mx-auto;
}

.step {
  @apply mt-4 text-center font-bold text-3xl text-gray-400;
}

.step-description {
  @apply max-w-md mx-auto text-center text-base text-gray-800;
}

.links {
  padding-top: 15px;
}

.get-started {
  @apply mt-4 font-bold text-white px-4 py-2 bg-green-500 inline-block shadow transition-colors rounded duration-200;
}
.get-started:hover {
  @apply bg-green-700;
}
</style>
