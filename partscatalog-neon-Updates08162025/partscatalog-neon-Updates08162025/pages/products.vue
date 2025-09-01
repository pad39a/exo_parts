<script setup>

    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'nuxt/app';
	// fuzzy search bar code for filter
	import Fuse from 'fuse.js'
  
  const { data, error } = await useFetch('/api/all_products')
  const products = computed(() => data.value?.products || [])
    const productTypes = useProductTypes(products);
    // const productApplications = useProductApplications(products);

    const route = useRoute();
    const router = useRouter();
	
	const searchQuery = route.query.search || ''

		
    // Store selected filters in a reactive state
    const selectedType = ref();
    const selectedParametricFeatures = ref([]);
    const selectedApplications = ref([]);
    const selectedCountries = ref([])


    // When the page loads, set the initial filter from the query

    onMounted(() => {
        selectedType.value = route.query.type || productTypes.value?.[0];
    });

    router.replace({ path: '/products' });


    watch(error, (err) => {
        if (err) {
            console.error('Error loading products:', err);
        }
    });



    const typeFilteredProducts = computed(() => {
        if (products.value) {
		//  if (searchQuery.value) return products.value // skip filtering when search is active

            return products.value.filter(product => product.type === selectedType.value)
        }
    });

    function labelFromFeatureKey(key) {
        return key
            .replace(/^ft_/, '')       // remove "ft_" prefix
            .replace(/_/g, ' ')        // replace remaining underscores with spaces
            .replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
    }
    

    const { transform } = useTransformProducts();
    const transformedData = computed(() => {
        return transform(typeFilteredProducts.value);
    });

	// All unique countries from ALL products
	const uniqueCountries = computed(() => {
	  return [...new Set(products.value.map(p => p.country_of_origin))]
	})

	// select all countries by default when products are ready
	watchEffect(() => {
	  if (uniqueCountries.value.length && selectedCountries.value.length === 0) {
		selectedCountries.value = [...uniqueCountries.value]  // select all
	  }
	})
		
    const finalFilteredProducts = computed(() => {
	  if (!transformedData.value) return []
		  // If there's a search query  match by model, key, or manufacturer
		  if (searchQuery) {

			const filtered = transformedData.value.filter(product => {
			  return (
				product.model?.toLowerCase().includes(searchQuery) ||
				product.key?.toLowerCase().includes(searchQuery) ||
				product.manufacturer?.toLowerCase().includes(searchQuery)
			  )
			})
			
			return filtered
		  }else{
		
		  // Else  filter using selected applications & countries
		  
		  return transformedData.value.filter(product => {
			const matchesApplications =
			  selectedApplications.value.length === 0 ||
			  selectedApplications.value.some(app =>
				product.applications?.includes(app)
			  )
		
			const matchesCountry =
			  selectedCountries.value.length === 0 ||
			  selectedCountries.value.includes(product.country_of_origin)
		
			return matchesApplications && matchesCountry
		  })
		  }
		})


    const parametricFeatures = computed(() => {

        const first = transformedData.value?.[0];
        if (!first) return [];
            return Object.keys(first).filter(key => key.startsWith('ft_'));
    });

    function selectDefaultParametricFeatures() {
        selectedParametricFeatures.value = parametricFeatures.value.slice(0, 5);
    }

	
    onMounted(() => {
		
        selectDefaultParametricFeatures();
    });

    watch(selectedType, () => {
        selectDefaultParametricFeatures();
    })

    const uniqueApplications = computed(() => {
        const appSet = new Set()
		console.log(transformedData)
		console.log(transformedData.value)
        transformedData.value.forEach(product => {
            product.applications?.forEach(app => appSet.add(app))
        })

        return Array.from(appSet)
    })
	watchEffect(() => {
	  if (uniqueApplications.value.length && selectedApplications.value.length === 0) {
		selectedApplications.value = [...uniqueApplications.value]  // select all apps
	  }
	})

   /* const uniqueCountries = computed(() => {
        const countrySet = new Set()

        transformedData.value.forEach(product => {
            if (product.country_of_origin) {
            countrySet.add(product.country_of_origin)
            }
        })

        return Array.from(countrySet)
    })*/

    const visible = ref(false);

	// Search input
	const search = ref('')
	
	const matchedProducts = computed(() => {
	  const term = search.value.trim().toLowerCase();
	  if (!term) return finalFilteredProducts.value;
	
	  return finalFilteredProducts.value.filter(product => {
		return (
		  (product.product?.toLowerCase().includes(term)) ||
		  (product.sku?.toLowerCase().includes(term)) ||
		  (product.description?.toLowerCase().includes(term))
		);
	  });
	});

// toggle refine result section

const showFilters = ref(false);

function toggleApplication(app) {
  const index = selectedApplications.value.indexOf(app);
  if (index > -1) {
    selectedApplications.value.splice(index, 1); // remove
  } else {
    selectedApplications.value.push(app); // add
  }
}

function toggleParametric(feature) {
  const index = selectedParametricFeatures.value.indexOf(feature);
  if (index === -1) {
    selectedParametricFeatures.value.push(feature);
  } else {
    selectedParametricFeatures.value.splice(index, 1);
  }
}

function toggleCountry(country) {
  if (selectedCountries.value.includes(country)) {
    selectedCountries.value = selectedCountries.value.filter(c => c !== country)
  } else {
    selectedCountries.value.push(country)
  }
}

// click on row go to product details
function goToProduct(event) {
  const productKey = event.data.key   // use product key
  router.push(`/${productKey}`)
}
</script>

<template class="!bg-white">
    <section class="w-full max-w-7xl">
		 <hgroup class="w-full p-4 sticky  top-0 left-0 main-background headerpro">
        	<span  @click="$router.push('/')" class="cursor-pointer large text-white text-[26px] left-[39px] ">exo<span class="exo font-bold text-[30px]">search</span></span>
		   <!-- <p>The technical search engine for industry.</p>-->
		   <div class=" mt-4 float-right text-white">
			<ul class="flex flex-wrap gap-2 ">
			  <li class="inline-block"><a href="#">All products</a></li>
			  <li class="inline-block"><a href="#">About</a></li>
			  <li class="inline-block"><a href="#">Vendor sign-in</a></li>
			</ul>
		   </div>
		</hgroup>
		</section>
		<section class="relative mt-[3rem] left-[39px]">
        <h3 class="font-bold text-[24px] mb-[1.5rem]">Explore products</h3>
        <form>
            <template v-if="products">
                <fieldset>
                    <legend class="font-semibold">Showing components for</legend>
                    <div class="flex flex-wrap gap-3 mt-5">
					  <div v-for="productType in productTypes" :key="productType">
						<!-- hidden radio -->
						<input
						  type="radio"
						  :id="productType"
						  name="productType"
						  :value="productType"
						  v-model="selectedType"
						  class="hidden peer"
						/>
					
						<!-- custom label -->
						<label
						  :for="productType"
						  class="cursor-pointer text-[#1728e5] bg-[#e2eafa] border-0 no-underline text-[17px]] pr-[11px] pl-[8px] 
								 flex items-center transition"
						>
						  <!-- icon (shows when selected) -->
						  <i class="fas fa-check text-sm" v-if="selectedType === productType"></i>
						  {{ productType }}
						</label>
					  </div>
					</div>

                </fieldset>
				<Button @click="visible = true" label="Refine results" class="bg-[#1728e5]"></Button>
                <Drawer v-model:visible="visible" header="Refine results">
				
              <!-- <div class="flex items-center gap-2 mb-4">
							   <svg  @click="showFilters = !showFilters" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-token-text-tertiary"><path d="M12.1338 5.94433C12.3919 5.77382 12.7434 5.80202 12.9707 6.02929C13.1979 6.25656 13.2261 6.60807 13.0556 6.8662L12.9707 6.9707L8.47067 11.4707C8.21097 11.7304 7.78896 11.7304 7.52926 11.4707L3.02926 6.9707L2.9443 6.8662C2.77379 6.60807 2.80199 6.25656 3.02926 6.02929C3.25653 5.80202 3.60804 5.77382 3.86617 5.94433L3.97067 6.02929L7.99996 10.0586L12.0293 6.02929L12.1338 5.94433Z"></path></svg>
				  <span class="font-semibold text-lg">Refine Results</span>
				 
				</div>-->
				
					<fieldset v-if="uniqueCountries.length > 1">
                        <p class="font-medium mb-2">Filter by countries of origin</p>
                        <div v-if="uniqueCountries.length" class="mb-4">
							<div class="flex flex-wrap gap-2">
							  <button
							  type="button"
							  v-for="country in uniqueCountries"
							  :key="country"
							  @click="toggleCountry(country)"
							  :class="[
								'flex items-center gap-2 px-[10px] py-[2px] border-0 text-sm transition',
								selectedCountries.includes(country)
								  ? 'text-[#1728e5] bg-[#e2eafa]'
								  : '!bg-[#cfcfcf] text-black-700 border-0'
							  ]"
							>
							  <FontAwesomeIcon v-if="selectedCountries.includes(country)" :icon="['fas', 'check']" class="h-4"/>
							  <FontAwesomeIcon v-else :icon="['fas', 'plus']" class="h-4"/>
							  <span>{{ country }}</span>
							</button>
							</div>
						  </div>
                    </fieldset>
					
                   <div v-if="uniqueApplications.length">
					  <p class="font-medium mb-2">Filter by application</p>
					  <div class="flex flex-wrap gap-2">
						<button type="button"
						  v-for="app in uniqueApplications"
						  :key="app"
						  @click="toggleApplication(app)"
						  :class="[
							'flex items-center gap-2 px-[10px] py-[2px] border-0 text-sm transition',
							selectedApplications.includes(app)
							  ? 'text-[#1728e5] bg-[#e2eafa]'
								  : '!bg-[#cfcfcf] text-black-700 border-0'
						  ]"
						>
						<FontAwesomeIcon v-if="selectedApplications.includes(app)" :icon="['fas', 'check']" class="h-4"/>
						<FontAwesomeIcon v-else :icon="['fas', 'plus']" class="h-4"/>
						  <span>{{ app }}</span>&nbsp;&nbsp;
						   
						</button>
					  </div>
					</div>
                    
                    <fieldset class="mt-4">
                        <p class="font-medium mb-2">Show/hide parametric columns</p>
                         <div class="flex flex-wrap gap-2">
						<button
						  type="button"
						  v-for="parametricFeature in parametricFeatures"
						  :key="parametricFeature"
						  @click="toggleParametric(parametricFeature)"
						  :class="[
							'flex items-center gap-1 px-[10px] py-[2px] border-0 text-sm transition',
							selectedParametricFeatures.includes(parametricFeature)
							  ? 'text-[#1728e5] bg-[#e2eafa]'
								  : '!bg-[#cfcfcf] text-black-700 border-0'
						  ]"
						>
						  <span>{{ labelFromFeatureKey(parametricFeature) }}</span> &nbsp;&nbsp;
						 <FontAwesomeIcon v-if="selectedParametricFeatures.includes(parametricFeature)" :icon="['fas', 'close']" class="h-4"/>
						 <FontAwesomeIcon v-else :icon="['fas', 'plus']" class="h-4"/>
						</button>
					  </div>
                    </fieldset>
					
					<div class="mt-5">
					<p class="font-medium mb-2">Search within</p>
					<input
					  v-model="search"
					  placeholder="Enter term"
					  class="border px-4 py-2 rounded mb-4 w-full"
					/>
					</div>
               </Drawer>
            </template>
        </form>
        <main>
            <DataTable
                class="cursor-pointer my-table w-full"
                columnResizeMode="expand"
                v-if="products"
               :value="searchQuery ? finalFilteredProducts : matchedProducts"
			    @row-click="goToProduct"
            >
                <Column sortable key="product" field="product" header="Product"/>
                <Column sortable  key="applications" field="applications" header="Applications">
                    <template #body="{ data }">
                        <div class="tags-cell">
                            <Tag v-for="(application, index) in data.applications" :key="index" :value="application" class="text-[#1728e5] bg-[#e2eafa] border-0 no-underline text-[17px]] pr-[11px] pl-[8px] font-[400]"></Tag>
                        </div>
                    </template>
                </Column>
                <Column sortable key="country_of_origin" field="country_of_origin" header="Country of origin" />
                <template v-for="selectedParametricFeature in selectedParametricFeatures">
                    <Column sortable :field="selectedParametricFeature" :header="labelFromFeatureKey(selectedParametricFeature)" />
                </template>
				
            </DataTable>
        </main>
    </section>
</template>

<style scoped>

h1 {
    grid-column: 1 / span 12;
    grid-row: 1;
}

form {
    grid-column: 1 / span 12;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: start;
}

main {
    grid-column: 1 / span 12;
    grid-row: 3;
}

.cards-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.my-table :deep(.p-datatable-table) {
  table-layout: auto !important;
  width: auto;
  white-space: nowrap;
  td, th {
    padding: 4px 12px 4px 12px;
  }
}

.tags-cell {
    display: flex;
    gap: 2px;
}

</style>