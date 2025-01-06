<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donate</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f9f9f9;
        }

        .donate-form {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }

        .donate-form h2 {
            margin-bottom: 15px;
        }

        .donate-form label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .donate-form input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .donate-form button {
            width: 100%;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .donate-form button:hover {
            background-color: #218838;
        }
    </style>
</head>

<body>
    <form class="donate-form" id="donateForm">
        <h2>Donate Now</h2>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>

        <label for="phone">Phone</label>
        <input type="tel" id="phone" name="phone" required>

        <label for="amount">Amount (INR)</label>
        <input type="number" id="amount" name="amount" min="1" required>

        <div id="pan_field">
            <label for="pan_number">PAN</label>
            <input type="text" maxlength="10" id="pan_number" name="pan_number" min="10">
        </div>

        <button type="button" id="donateButton">Donate</button>
    </form>

    <script>
        document.getElementById('donateButton').addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const amount = document.getElementById('amount').value;
            const pan_number = document.getElementById('pan_number').value;

            if (!name || !email || !phone || !amount) {
                alert('Please fill all the fields.');
                return;
            }

            if (amount > 2000 && !pan_number) {
                alert('Please fill all the fields.');
                return;
            }

            const options = {
                key: "rzp_live_rOnixpfzAldfGv", // Replace with your Razorpay Key ID
                amount: amount * 100, // Convert amount to paise
                currency: "INR",
                name: "Donation",
                description: "Thank you for your generosity!",
                handler: function(response) {
                    alert("Payment successful. Payment ID: " + response.razorpay_payment_id);
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: phone
                },
                notes: {
                    pan: pan_number
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new Razorpay(options);
            paymentObject.open();
        });
    </script>
</body>

</html>