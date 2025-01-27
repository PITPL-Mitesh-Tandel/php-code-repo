<?php

namespace Pseudocode\VariousScripts\Lib\Controllers;

use Exception;
use Pseudocode\VariousScripts\Lib\Controller;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    public function index()
    {
        $this->view->display('index');
    }

    public function makePayment()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');

        $data = json_decode(file_get_contents('php://input'), true);

        $name = $data['name'];
        $phone = $data['phone'];
        $email = $data['email'];
        $amount = $data['amount']; // Amount in paise

        // Razorpay credentials
        $key_id = env("RAZORPAY_KEY");
        $key_secret = env("RAZORPAY_SECRET");

        $api = new Api($key_id, $key_secret);

        try {
            $customer = $api->customer->create([
                'name' => $name,
                'email' => $email,
                'contact' => $phone,
                'notes' => [
                    'purpose' => 'Donation',
                ]
            ]);

            $order = $api->order->create([
                'receipt' => 'donation_rcpt_' . time(),
                'amount' => $amount,
                'currency' => 'INR',
                'payment_capture' => 1, // Auto-capture payment
                'notes' => [
                    'customer_id' => $customer->id // Associate the customer
                ]
            ]);

            $response = [
                'order_id' => $order['id'],
                'amount' => $order['amount'],
                'currency' => $order['currency'],
                'customer_id' => $customer->id // Send the customer ID back for reference
            ];

            echo json_encode($response);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
