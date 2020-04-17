<template>
  <svg class="spinner" viewBox="-12 -12 24 24">
    <g class="spinning">
      <circle fill="#ffffff" opacity="0.75" cx="7" cy="-4" r="1" />
      <circle fill="#ffffff" opacity="0.75" cx="8" cy="1" r="1.1" />
      <circle fill="#ffffff" opacity="0.75" cx="6" cy="6" r="1.25" />
      <circle fill="#ffffff" opacity="0.75" cx=".5" cy="8.5" r="1.5" />
      <circle fill="#ffffff" opacity="0.75" cx="-6" cy="6" r="1.75" />
      <circle fill="#ffffff" opacity="0.75" cx="-8.5" cy=".25" r="2" />
      <circle fill="#ffffff" opacity="0.75" cx="-6" cy="-6" r="2.5" />
    </g>
  </svg>
</template>

<style>
@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.spinner {
  width: 1em;
  height: 1em;
  display: inline-block;
}
.spinning {
  animation: spinning 1.5s infinite linear;
}
</style>
