<template>
  <div class="container">
    <div class="card">
      <p>Signing in...</p>
    </div>
  </div>
</template>

<script>
export default {};
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
</style>
