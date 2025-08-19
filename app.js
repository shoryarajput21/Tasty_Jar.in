// --- Sample Catalog ---
const products = [
  {id:1,name:"Mango Achar (Kairi) — 500g",img:"yt1.jpg",rating:4.8,reviews:127,oldPrice:399,price:299,sale:true},
  {id:2,name:"Lemon Achar — 450g",img:"yt2.jpg",rating:4.7,reviews:88,oldPrice:349,price:289,sale:true},
  {id:3,name:"Mixed Veg Achar — 500g",img:"yt8.jpg",rating:4.6,reviews:64,oldPrice:379,price:329,sale:false},
  {id:4,name:"Chilli Achar — 400g",img:"yt9.jpg",rating:4.5,reviews:41,oldPrice:329,price:279,sale:true},
  {id:5,name:"Garlic Achar — 450g",img:"yt10.jpg",rating:4.7,reviews:53,oldPrice:359,price:309,sale:false},
  {id:6,name:"Methi Achar — 400g",img:"yt11.jpg",rating:4.4,reviews:29,oldPrice:329,price:279,sale:true}
];

const cart = [];
const rupee = n => `₹${n.toFixed(0)}`;

const grid = document.getElementById("productGrid");
function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="card">
      <div class="card__media">
        ${p.sale ? '<span class="sale">Sale</span>' : ''}
        <img src="${p.img}" alt="${p.name}">
      </div>
      <h3>${p.name}</h3>
      <div class="rating">
        <div class="stars">${"⭐".repeat(Math.round(p.rating))}</div>
        <small>${p.rating.toFixed(1)} • ${p.reviews} reviews</small>
      </div>
      <div class="price">
        <span class="old">${rupee(p.oldPrice)}</span>
        <span class="new">${rupee(p.price)}</span>
      </div>
      <button class="btn" data-id="${p.id}">Add to Cart</button>
    </article>
  `).join("");
}
renderProducts();

// Cart Logic
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");

cartBtn.addEventListener("click",()=>cartDrawer.classList.add("open"));
closeCart.addEventListener("click",()=>cartDrawer.classList.remove("open"));

document.addEventListener("click",(e)=>{
  if(e.target.matches(".btn[data-id]")){
    const id = Number(e.target.getAttribute("data-id"));
    addToCart(id);
  }
  if(e.target.matches(".qty .inc")) changeQty(Number(e.target.dataset.id),1);
  if(e.target.matches(".qty .dec")) changeQty(Number(e.target.dataset.id),-1);
  if(e.target.matches(".remove-item")) removeFromCart(Number(e.target.dataset.id));
});

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const row = cart.find(x=>x.id===id);
  if(row) row.qty++;
  else cart.push({id:p.id,name:p.name,price:p.price,img:p.img,qty:1});
  updateCart(); cartDrawer.classList.add("open");
}
function changeQty(id,delta){
  const row = cart.find(x=>x.id===id); if(!row) return;
  row.qty+=delta; if(row.qty<=0) removeFromCart(id); updateCart();
}
function removeFromCart(id){ const i=cart.findIndex(x=>x.id===id); if(i>-1) cart.splice(i,1); updateCart();}
function updateCart(){
  cartItemsEl.innerHTML = cart.length ? cart.map(item=>`
    <div class="cart-row">
      <img src="${item.img}">
      <div>
        <strong>${item.name}</strong>
        <div class="price"><span class="new">${rupee(item.price)}</span></div>
        <button class="remove-item iconbtn" data-id="${item.id}" style="margin-top:6px">Remove</button>
      </div>
      <div class="qty">
        <button class="dec" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button class="inc" data-id="${item.id}">＋</button>
      </div>
    </div>
  `).join("") : `<p>Your cart is empty.</p>`;
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  cartTotalEl.textContent=rupee(total);
  cartCountEl.textContent=cart.reduce((s,i)=>s+i.qty,0);
}
document.getElementById("year").textContent=new Date().getFullYear();

// Checkout redirect
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href="checkout.html";
});
