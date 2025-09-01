export const useProductTypes = (products) => {
    const types = ref([]);
  
    watchEffect(() => {
      if (products.value?.length) {
       types.value = [...new Set(products.value.map((product) => product.type))];
      }
    });
  
    return types;
  };
  