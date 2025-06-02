<script setup>
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>
<template>
  <button
    @click="isDark = !isDark"
    id="theme-toggle"
    class="h-[2em] w-[2em] md:h-[2.5em] md:w-[2.5em]"
    aria-label="Switch color mode"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 472.39 472.39"
    >
      <g class="toggle-sun" fill="currentColor">
        <path
          d="M403.21,167V69.18H305.38L236.2,0,167,69.18H69.18V167L0,236.2l69.18,69.18v97.83H167l69.18,69.18,69.18-69.18h97.83V305.38l69.18-69.18Zm-167,198.17a129,129,0,1,1,129-129A129,129,0,0,1,236.2,365.19Z"
        />
      </g>
      <g class="toggle-circle" fill="currentColor">
        <circle class="cls-1" cx="236.2" cy="236.2" r="103.78" />
      </g>
    </svg>
  </button>
</template>
<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

#theme-toggle {
  cursor: pointer;
  background: 0;
  border: 0;
  opacity: 0.8;
  padding: 0.5rem;
  border-radius: 50%;
  position: relative;
  isolation: isolate;
}

/* #theme-toggle svg {
  fill: theme(colors.gray.800);
}
.dark #theme-toggle svg {
  fill: theme(colors.gray.100);
} */

#theme-toggle::before {
  content: "";
  position: absolute;
  inset: 0;
  background: hsl(0 0% 50% / 0.2);
  border-radius: inherit;
  transform: scale(0);
  opacity: 0;
  z-index: -1;
}

#theme-toggle:hover,
#theme-toggle:focus {
  outline: 0;
  opacity: 1;
  background: hsl(0 0% 50% / 0.15);
}

.toggle-circle {
  transition: transform 500ms ease-out;
}

.light .toggle-circle {
  transform: translateX(-15%);
}

.toggle-sun {
  transform-origin: center center;
  transition: transform 750ms cubic-bezier(0.11, 0.14, 0.29, 1.32);
}

.light .toggle-sun {
  transform: rotate(0.5turn);
}
</style>
