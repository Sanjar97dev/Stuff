    const list = document.querySelector('.list');
    const trending = document.querySelector('.trending');
    const less = document.querySelector('.less_list');
    const cartCount = document.querySelector('#null');
    const korzinka = document.querySelector('#korzinka');
    const productBlock=document.querySelector('.productsBlock');
    const searchBlock=document.querySelector('searchBlock');
    const searchInput = document.querySelector('#searchInput');




    function toggleMobileMenu() {
        const navBar = document.querySelector('.nav-bar');
        navBar.classList.toggle('active');
    }

    const urlStuf=  'https://fakestoreapi.com/products/1';
    const urlStuff = 'https://fakestoreapi.com/products';

    async function getProducts() {
        const res = await fetch(urlStuff);
        const data = await res.json();
        console.log(data);
        renderCategory(data);
        renderProduct(data.slice(0, 4))
        
    }

    let cartData = [];

    async function ProductsByCategory(categoryName) {
        const c = categoryName.target.innerText;
        const res = await fetch(urlStuff);
        const data = await res.json();
        const filterData = data.filter((el) => el.category === c);
        console.log(filterData);
        renderProduct(filterData.slice(0, 4));

        const priceFilterFunction = (el) => el.price < 100;
        renderLess(filterData.slice(0, 4), priceFilterFunction);
        renderBlockProductData(filterData, filter(priceFilterFunction));
    }

    async function inCard(id) {
        const carLs = localStorage.getItem('cart');
        cartData = JSON.parse(carLs) || [];

        const res = await fetch(urlStuff + '/' + id);
        const data = await res.json();
        console.log(data);
        cartData.push(data);
        console.log(cartData);
        cartCount.innerHTML = cartData.length;

        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    function renderCategory(arr) {
        const newcategory = [];
        arr.forEach((el) => {
            if (!newcategory.includes(el.category)) {
                newcategory.push(el.category);
            }
        });

        list.innerHTML = newcategory
            .map((obj) => `<li onclick="ProductsByCategory(event)"><h3>${obj}</h3></li>`)
            .join('');
    }

    function renderProduct(arr) {
        trending.innerHTML = '';
    
        arr.forEach((obj) => {
            trending.innerHTML += `
                <div class='trend-img' width='16rem' onclick='renderBlockProductData(${obj.id});'>
                    <img src="${obj.image}" class="card-img-top" alt="Card image cap"/>
                    <div class='trend-card'>
                        <h5 class='trend-title'>${obj.title}</h5>
                        <p class="trend-text">${obj.category}</p>
                        <button class="btn btn-primary" onclick="inCard(${obj.id})">${obj.price}</button>
                    </div>
                </div>`;
        });
    }

    function renderLess(arr, filterFunction) {
        less.innerHTML = '';
        const filteredData = arr.filter(filterFunction);

        filteredData.forEach((obj) => {
            less.innerHTML += `
            <div class='trend-img'>
                <img width='150px' height='110px' src="${obj.image}" class="card-img-top" alt="Card image cap">
                <div class='trend-card'>
                    <h5 class='trend-title'>${obj.title}</h5>
                    <p class="trend-text">${obj.category}</p>
                    <button class="btn btn-primary" onclick="inCard(${obj.id})">${obj.price}</button>
                </div>
            </div>`;
        });

        less.style.display = 'flex';
    }



    function removeFromCart(id) {
        cartData = cartData.filter((item) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cartData));
        cartCount.innerHTML = cartData.length;
        renderKorzinka(cartData);
    } 

    function renderKorzinka(cartItems) {
        korzinka.innerHTML = '';
        korzinka.innerHTML+=`
        <h1>Your cart</h1>
        <button id='procedBtn'>Proceed to checkout</button>
        <h5 id='total'>TOTAL PRICE: <span id='totalPrice'></span></h5>
        `;
        cartItems.forEach((obj) => {
            korzinka.innerHTML += `
            <div class='korzinka-item'>
            <div class='korzinka-block'>    
                <div class="korzin-img">
                    <img class='imgkorzin' src="${obj.image}" alt="${obj.title}">
                <div class='korzin-text'>
                    <h6>${obj.title}</h6>
                    <p>${obj.category}</p>
                </div>
                </div>
                
                <h3>${obj.price}$</h3>

                <div class="kor-shot">
                    <i class="bi bi-dash-square" onclick="countShotMinus(${obj.id})"></i>
                    <span class='nol'>${obj.quantity || 0}</span>
                    <i class="bi bi-plus-square" onclick="countShotPlus(${obj.id})"></i>
                </div>

                <div class="kor-del">
                    <h3>${obj.price * (obj.quantity || 1)}$</h3>
                    <i onclick='removeFromCart(${obj.id})' class="bi bi-x-lg"></i>
                </div>
                </div>
            </div>
            `;
        });
        updateCartTotal(cartItems);
    }



    function countShotMinus(id) {
        const cartItem = cartData.find((item) => item.id === id);

        if (cartItem && cartItem.quantity > 0) {
            cartItem.quantity--;
            renderKorzinka(cartData);
            updateCartTotal(cartData);
            localStorage.setItem('cart', JSON.stringify(cartData));
        }
    }

    function countShotPlus(id) {
        const cartItem = cartData.find((item) => item.id === id);

        if (cartItem) {
            cartItem.quantity = Math.floor(cartItem.quantity || 0) + 1;
            renderKorzinka(cartData);
            updateCartTotal(cartData);
            localStorage.setItem('cart', JSON.stringify(cartData));
        }
    }

    function updateCartTotal(cartItems){
            const totalPriceElement = document.querySelector('#totalPrice');
            const totalQuantityElement = document.querySelector('#totalQuantity');

            const {totalPrice, totalQuantity } =cartItems.reduce((el, obj)=> {
                const price = obj.price * (obj.quantity || 1);
                el.totalPrice += price;
                el.totalQuantity += obj.quantity || 0;
                return el;
            }, {totalPrice: 0, totalQuantity: 0 });

            const roundedTotalPrice= Math.floor(totalPrice);

            totalPriceElement.textContent=`${roundedTotalPrice}`;
            totalQuantityElement.textContent=totalQuantity
    }


    async function getTrendingProducts(){
        const res = await fetch(urlStuf);
        const data = await res.json();
        renderProduct(data)
    }

    async function renderBlockProductData(productId){
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const productData = await res.json();

        productBlock.innerHTML=''
        productBlock.innerHTML +=`
            <div class='block-category'>
                <div class='block-img'>
                    <img width='100px' height="100px" class='imgBlock' src="${productData.image}" alt="${productData.title}">
                </div>
                <div class='block-text'>
                    <h2>${productData.title}</h2>
                    <h3>${productData.price}$</h3>
                    <p>${productData.description}</p>
                    <button onclick="addToCart(${productData.id})">Add to cart</button>
                    <button>Add to favorites</button>
                </div>
            </div>`;
    }

    getTrendingProducts();


    getProducts();
