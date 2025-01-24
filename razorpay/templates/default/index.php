<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donate</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
    <h1>Donate Now</h1>
    <form id="donateForm">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" required><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>
        
        <label for="amount">Donation Amount:</label>
        <input type="number" id="amount" name="amount" required><br><br>
        
        <button type="button" onclick="makePayment()">Donate</button>
    </form>
    
    <script>
        function makePayment() {
            const form = document.getElementById("donateForm");
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const email = document.getElementById("email").value;
            const amount = document.getElementById("amount").value * 100; // Convert to paise
            
            fetch("./make-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, phone, email, amount }),
            })
            .then((response) => response.json())
            .then((data) => {
                const options = {
                    key: "<?php echo env("RAZORPAY_KEY");?>", // Replace with your Razorpay key
                    amount: data.amount,
                    currency: "INR",
                    name: "Donation",
                    description: "Donation Payment",
                    order_id: data.order_id,
                    handler: function (response) {
                        alert("Payment Successful!");
                        console.log(response);
                    },
                    prefill: {
                        name: name,
                        email: email,
                        contact: phone,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };
                const rzp = new Razorpay(options);
                rzp.open();
            })
            .catch((error) => console.error("Error:", error));
        }
    </script>
</body>
</html>
