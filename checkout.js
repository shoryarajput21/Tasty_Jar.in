const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderSummary = document.getElementById("orderSummary");

if(cart.length){
  orderSummary.innerHTML = cart.map(i=>`
    <p>${i.name} × ${i.qty} — ₹${i.price*i.qty}</p>
  `).join("")+`<hr><p><strong>Total: ₹${cart.reduce((s,i)=>s+i.price*i.qty,0)}</strong></p>`;
}else{
  orderSummary.innerHTML="<p>Your cart is empty.</p>";
}

document.getElementById("checkoutForm").addEventListener("submit",function(e){
  e.preventDefault();
  const formData = new FormData(this);
  const customer = Object.fromEntries(formData.entries());
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  var options = {
    "key": "rzp_test_xxxxxxxx", // 🔑 replace with your Razorpay key
    "amount": total*100,
    "currency": "INR",
    "name": "Tasty Jar",
    "description": "Order Payment",
    "handler": function (response){
      alert("✅ Payment Successful! ID: " + response.razorpay_payment_id);
      localStorage.removeItem("cart");
      window.location.href="thankyou.html";
    },
    "prefill": {"name":customer.name,"email":customer.email,"contact":customer.phone},
    "theme": {"color":"#2e7d32"}
  };
  var rzp1=new Razorpay(options);
  rzp1.open();
});
