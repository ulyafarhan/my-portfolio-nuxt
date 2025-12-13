import { useNavigator } from '@vueuse/core'

export const useHardwareCheck = () => {
  const isHighPerformance = useState<boolean>('isHighPerformance', () => true)
  
  if (import.meta.client) {
    const navigator = window.navigator as any
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    // Safe check: deviceMemory is not standard in all browsers yet
    const deviceMemory = (navigator as any).deviceMemory || 8 

    // Logic: Minimal 4 Cores CPU & 4GB RAM untuk "High Performance"
    if (hardwareConcurrency < 4 || deviceMemory < 4) {
      isHighPerformance.value = false
    }
  }

  return {
    isHighPerformance
  }
}