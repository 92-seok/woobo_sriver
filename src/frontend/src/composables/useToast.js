import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const show = (msg, duration = 1500) => {
    const id = ++toastId
    toasts.value.push({ id, msg })

    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.value.splice(index, 1)
      }
    }, duration)
  }

  return {
    toasts,
    show
  }
}
