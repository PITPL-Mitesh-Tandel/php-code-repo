<?php
require('razorpay-php/Razorpay.php');

use Razorpay\Api\Api;

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$phone = $data['phone'];
$email = $data['email'];
$amount = $data['amount']; // Amount in paise

// Razorpay credentials
$key_id = "YOUR_RAZORPAY_KEY";
$key_secret = "YOUR_RAZORPAY_SECRET";

$api = new Api($key_id, $key_secret);

try {
    $order = $api->order->create([
        'receipt' => 'donation_rcpt_' . time(),
        'amount' => $amount,
        'currency' => 'INR',
        'payment_capture' => 1, // Auto-capture payment
    ]);

    $response = [
        'order_id' => $order['id'],
        'amount' => $order['amount'],
        'currency' => $order['currency']
    ];

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
