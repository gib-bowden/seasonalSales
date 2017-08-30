//global variables
var selectArea = document.getElementById("category-select");
var products = [];


//XHR
var productsRequest = new XMLHttpRequest();
	productsRequest.addEventListener("load", importProducts)
	productsRequest.addEventListener("error", logFailedRequest)
	productsRequest.open("GET", "products.json")
	productsRequest.send();

//XHR load functions
function importProducts(){
	products = JSON.parse(this.responseText).products;
	importCategories(products)
}

function importCategories(products) {
	var categoriesRequest = new XMLHttpRequest();
		categoriesRequest.addEventListener("load", buildPage)
		categoriesRequest.addEventListener("error", logFailedRequest)
		categoriesRequest.open("GET", "categories.json")
		categoriesRequest.send();

	function buildPage(){
	var	categories = JSON.parse(this.responseText).categories;
		createCombinedProductArr(products, categories); 
		buildDropdownList(categories);
		buildProductsList(products);
	}
}

function logFailedRequest(){
	console.log("dis broke")
}


//Joins the products and categories arrays on category ID adds categories info to each product
function createCombinedProductArr(products, categories) {
	for (let product of products) {
		var productCategory = product.category_id; 
		for (let category of categories) {
			if (category.id === productCategory) {
				product.discount = category.discount,
				product.discountedPrice = Number((product.price - (product.price * category.discount)).toFixed(2))
				product.categoryName = category.name,
				product.season = category.season_discount
			}	
		} 
	}
}

//Creates the product list in the DOM
function buildProductsList(arr) {
	var productsContainer = document.getElementById("products-container");
	var domString = ""
	if (arr !== []) {
		for (let [i, item] of arr.entries()) {
			if (item.category_id === Number(selectArea.value)) {
				var price = item.discountedPrice;
				var status = "sale-item"; 
			} 
			else {
				var price = item.price;
				var status = "regular-item"; 
			}
			domString +=	`<div class="card category-id-${item.categoryId} ${status}" id="card-${i}">
								<h1 class="product-name">${item.name}</h1>
								<h3 class="product-price">${price}</h3>
								<h3 class="product-category">${item.categoryName}</h3>
							</div>`;
		} 
		productsContainer.innerHTML = domString;
	}
}

//Populates the dropdown options in the DOM
function buildDropdownList(arr) {
var domString = `<option disabled selected value> -- select a season -- </option>`
	if (arr !== []) {
		for (let item of arr) {
			domString += `<option value="${item.id}">${item.season_discount}</option>`
		} 
		selectArea.innerHTML = domString;
	}
}

//Event listener on the dropdown that rebilds the product list when the selected option is changed
selectArea.addEventListener("change", function () {
	buildProductsList(products);
});
