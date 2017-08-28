//global variables
var productsContainer = document.getElementById("products-container");
var selectArea = document.getElementById("category-select");
var combinedProductArr = [];


//XHR
var productsRequest = new XMLHttpRequest();
	productsRequest.addEventListener("load", importProducts)
	productsRequest.addEventListener("error", logFailedRequest)
	productsRequest.open("GET", "products.json")
	productsRequest.send();


var categoriesRequest = new XMLHttpRequest();
	categoriesRequest.addEventListener("load", importCategories)
	categoriesRequest.addEventListener("error", logFailedRequest)
	categoriesRequest.open("GET", "categories.json")
	categoriesRequest.send();


//XHR load functions
function importProducts(){
	productsData = JSON.parse(this.responseText);
	products = productsData.products; 
}

function importCategories(){
	categoriesData = JSON.parse(this.responseText);
	categories = categoriesData.categories;
	createCombinedProductArr(); 
	buildDropdownList(categories);
	buildProductsList(combinedProductArr);
}

function logFailedRequest(){
	console.log("shit broke")
}


//Joins the products and categories arrays on category ID and builds a new array
function createCombinedProductArr() {
	for (let product of products) {
		var productCategory = product.category_id; 
		for (let category of categories) {
			if (category.id === productCategory) {
				var newObject = {
				id: product.id,
				name: product.name,
				price: product.price,
				discount: category.discount,
				discounted_price: function() { 
					return this.price - (this.discount * this.price);
				},
				category_id: product.category_id,
				category_name: category.name,
				season: category.season_discount
				}
			}	
		} 
		newObject.discounted_price = Number(newObject.discounted_price().toFixed(2));
		combinedProductArr.push(newObject);
	}
}

//Creates the product list in the DOM
function buildProductsList(arr) {
	var domString = ""
	if (arr !== []) {
		for (let [i, item] of arr.entries()) {
			if (item.season === selectArea.value) {
				var price = item.discounted_price;
				var status = "sale-item"; 
			} else {
				var price = item.price;
				var status = "regular-item"; 
			}
			domString +=	`<div class="card category-id-${item.category_id} ${status}" id="card-${i}">
								<h1 class="product-name">${item.name}</h1>
								<h3 class="product-price">${price}</h3>
								<h3 class="product-category">${item.category_name}</h3>
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
			domString += `<option id="${item.id}" value="${item.season_discount}">${item.season_discount}</option>`
		} 
		selectArea.innerHTML = domString;
	}
}

//Event listener on the dropdown that rebilds the product list when the selected option is changed
selectArea.addEventListener("change", function () {
	buildProductsList(combinedProductArr);
	});
