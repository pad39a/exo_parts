//this should be refactored upstream as a transformation. Easier if each product just has a json string of all relevant applications
export const useProductApplications = (products) => {
    const applications = ref([]);
  
    watchEffect(() => {
      if (products.value?.length) {
        const tempApplications = [];
        for (let product of products.value) {
            for (let key in product.application) {
                if (product.application[key] === "TRUE") {
                    tempApplications.push(key.replace("app_", ""));
                };
            }
        }
        applications.value = [...new Set(tempApplications)];
      }
    });
    return applications;
  };
  