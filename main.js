var productsContainer = document.getElementById("products-container");
var selectArea = document.getElementById("category-select");

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


var combinedProductArr = []
function createCombinedProductArr() {
	var newObject = {}
	var productCategory; 
	for (let product of products) {
		productCategory = product.category_id; 
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



function buildProductsList(arr) {
	var domString = ""
	var price = 0; 
	if (arr !== []) {
		for (let [i, item] of arr.entries()) {
			(item.season === selectArea.value) ? (price = item.discounted_price) : (price = item.price)
			domString +=	`<div class="card category-id-${item.category_id}" id="card-${i}">
								<h1>${item.name}</h1>
								<h3 class="price">${price}</h3>
								<h3>${item.category_name}</h3>
							</div>`;
		} 
		productsContainer.innerHTML = domString;
	}
}

function buildDropdownList(arr) {
var domString = ""
	if (arr !== []) {
		for (let item of arr) {
			domString += `<option id="${item.id}" value="${item.season_discount}">${item.season_discount}</option>`
		} 
		selectArea.innerHTML = domString;
	}
}

selectArea.addEventListener("change", function () {
	buildProductsList(combinedProductArr);
});
