import { onMounted, onUnmounted, ref } from 'vue'

/** Reactive match for a CSS media query (e.g. `(max-width: 767px)`). */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mediaQuery: MediaQueryList | undefined

  function sync() {
    matches.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    sync()
    mediaQuery.addEventListener('change', sync)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', sync)
  })

  return matches
}
