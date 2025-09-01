import Fuse from 'fuse.js'
import { ref, computed } from 'vue'

export function useProductSearch(allProducts, searchQuery) {
  const fuse = new Fuse(allProducts.value, {
    keys: ['title'],
    threshold: 0.4,
    includeScore: true,
  })

  const matchedProducts = computed(() => {
    if (!searchQuery.value) return []
    return fuse.search(searchQuery.value).map(result => result.item)
  })

  return { matchedProducts }
}