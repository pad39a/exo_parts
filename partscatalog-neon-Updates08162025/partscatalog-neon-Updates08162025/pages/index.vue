<script setup>
//const { products, error } = await useFetch('composables/useProducts');
const { data, error } = await useFetch('/api/all_products', {
  lazy: false,
  server: true
})

const products = computed(() => data.value?.products || [])
const productTypes = useProductTypes(products);
// const productApplications = useProductApplications(products);

// const productCategories = productTypes.value.concat(productApplications.value)

watch(error, (err) => {
  if (err) {
    console.error('Error loading products:', err);
  }
});

// Search logic
const search = ref('')
const router = useRouter()

// search logic
const handleSearch = () => {
	if (search.value.trim()) {
  	  router.push({ path: '/products', query: { search: search.value.trim() } })
 	 }}
</script>

<template>
  <div class="w-full max-w-9xl main-background min-h-screen flex items-center justify-center">
    <section class="w-full max-w-7xl">
    <hgroup class="w-full p-4 fixed top-0 left-0 main-background sm:p-6 md:p-8 headerpro">
        <span @click="$router.push('/')" class="cursor-pointer large text-white text-[26px]">exo<span class="exo font-bold text-[30px]">search</span></span>
       <!-- <p>The technical search engine for industry.</p>-->
	   <div class=" mt-4 float-right text-white">
	   	<ul class="flex flex-wrap gap-2 ">
		  <li class="inline-block"><a href="#">All products</a></li>
		  <li class="inline-block"><a href="#">About</a></li>
		  <li class="inline-block"><a href="#">Vendor sign-in</a></li>
		</ul>
	   </div>
    </hgroup>
  <div class="grid gap-x-6 gap-y-4  flex items-center justify-center mt-1 card-box">
    <!-- Each child div -->
    <div class="flex gap-2 card-flex">
	
      <div class="card basis-auto p-4">
        <span><span class="intro text-white font-bold text-[39px] leading-[30px]">The technical <br/>search platform <br/>for aerospace</span><br/><br/><span class="surfacetext text-white">Exosearch surfaces high-performance systems,<br/>vetted for mission critical applications.</span></span>
						
      </div>
	  
      <div class="card basis-auto p-9 bg-[#f4f4f4] flex items-center justify-start">
       <div class="w-[481px] card-box-bot">
					<div class="search_input">
					<InputText name="email" class="search_products w-[300px]" type="text" placeholder="Enter keywords"  v-model="search"/>
					<Button @click="handleSearch" class="find_component bg-[#3838b4] text-white font-light ml-3" type="submit" severity="secondary" label="Find Components"  /> 
					</div>
					<div class="browse_cat">
						<p class="pt-5 text-[#989696] text-[14px]">Or browse components by applications</p>
						<div class="wrap pt-3 flex flex-wrap gap-2">
							<Button class="product_types" asChild v-for="productType in productTypes" v-slot="slotProps">
								<NuxtLink class="text-[#1728e5] bg-[#e2eafa] border-0 no-underline text-[17px]] pr-[11px] pl-[8px] gap-4 " :to="{path: '/products', query: { type: productType }}">{{ productType }}</NuxtLink>
							</Button>
						</div>
					</div>
					</div>
      </div>
    </div>
  </div>
    
   
    </section>
	</div>
</template>

<style lang="scss" scoped>

/*hgroup {
    grid-column: 1 / span 12;
    text-align: left;
	margin:22px
}

.wrap { flex-wrap: wrap; }

.text-center { text-align: center; }
.heading-content {
  
}

.search-wrapper {
    grid-column: 5 / span 4;
    display: flex;
    flex-wrap: w-child(1) {
        flex: 1 0 75%;
    }
    :nth-child(2) {
       flex: 0 1 auto;
    }
	 justify-content: flex-start;
    background: #f4f4f4;
    padding: 46px 0 28px 30px;
    flex-direction: column;
    width: 45vw;
}
.intro{
color:white;
font-size:42px;
font-weight:800;
line-height: 33px;
}
*/
</style>