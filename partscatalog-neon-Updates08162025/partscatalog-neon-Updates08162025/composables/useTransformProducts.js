// composables/useTransformProducts.ts

export function useTransformProducts() {
  function transform(data) {
	 // console.log(data)
    if (!Array.isArray(data)) return [];    return data.map(item => {
      const value = item._custom?.value || item;

      const {
        key,
        type,
        model,
        manufacturer,
        country_of_origin,
        manufacturer_part_number,
        features = {},
        application = {},
      } = value;

       let rawFeatures = features;

		// If it's a string (e.g., JSON from DB), parse it
		if (typeof features === 'string') {
		  try {
			rawFeatures = JSON.parse(features);
		  } catch (e) {
			console.error('Failed to parse features JSON:', features);
			rawFeatures = {};
		  }
		}
		
		//  Now safely flatten only ft_ keys
		const flattenedFeatures = Object.fromEntries(
		  Object.entries(rawFeatures)
			.filter(([k, v]) => k.startsWith('ft_') && v != null && v !== '')
		);
		let rawApplication = application;
		
		if (typeof application === 'string') {
		  try {
			rawApplication = JSON.parse(application);
		  } catch (e) {
			console.error('Failed to parse application JSON:', application);
			rawApplication = {};
		  }
		}
		
			  const applicationArray = Object.entries(rawApplication)
		  .filter(([_, v]) => v === true || v === "TRUE" || v === "true") // accept all valid truthy
		  .map(([k]) => k.replace(/^app_/, ''));

      return {
        key,
        type,
		model,
		manufacturer,
        product: `${manufacturer} ${model}`,
        country_of_origin,
        manufacturer_part_number,
        ...flattenedFeatures,
        applications: applicationArray
      };
    });
  }

  return { transform };
}
