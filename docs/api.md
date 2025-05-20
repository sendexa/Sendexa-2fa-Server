# Sendexa 2FA API Documentation

Base URL: **https://2fa.sendexa.co/v1/otp**

---

## Authentication
All requests require an API key in the header:
```
x-api-key: <your-api-key>
```

---

## Endpoints

### 1. Request OTP
**POST** `/v1/otp/request`

**Request Body:**
```json
{
  "destination": "0541234567",      // Or email
  "channel": "sms",                 // "sms" or "email"
  "sender_id": "MyAppVerify",
  "otp_length": 4,                   // Optional: 4 or 6 (default: 6)
  "ttl": 120                         // Optional: expiry in seconds (default: 300)
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expires_in": 120                  // Expiry in seconds
}
```

**Notes:**
- The OTP will be sent with a unique 4-letter prefix (e.g., ASAG3333).
- The user should enter only the digits (e.g., 3333).
- The expiry time is customizable per request.

---

### 2. Verify OTP
**POST** `/v1/otp/verify`

**Request Body:**
```json
{
  "destination": "0541234567",
  "otp": "3333"                     // Only the digits part
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

### 3. Resend OTP
**POST** `/v1/otp/resend`

**Request Body:**
```json
{
  "destination": "0541234567",
  "channel": "sms",
  "sender_id": "MyAppVerify"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

---

## Features
- **Custom OTP Length:** 4 or 6 digits, with a unique 4-letter prefix.
- **Custom Expiry:** Set OTP expiry per request (in seconds).
- **Rate Limiting:** 1 OTP per minute per destination (default, configurable).
- **Sender ID:** Required for branding and routing.
- **Secure:** All endpoints require a valid API key.

---

## Example: Requesting a 4-digit OTP for 2 minutes
```json
{
  "destination": "user@email.com",
  "channel": "email",
  "sender_id": "MyAppVerify",
  "otp_length": 4,
  "ttl": 120
}
```

---

## Error Responses
- Invalid API key, sender ID, or request body will return a 4xx error with a descriptive message.
- Exceeding rate limits or using expired OTPs will return appropriate error messages.

---



## Sample Code

### Requesting a 4-digit OTP for 2 minutes

#### cURL
```bash
curl -X POST https://2fa.sendexa.co/v1/otp/request \
  -H "Content-Type: application/json" \
  -H "x-api-key: <your-api-key>" \
  -d '{
    "destination": "user@email.com",
    "channel": "email",
    "sender_id": "MyAppVerify",
    "otp_length": 4,
    "ttl": 120
  }'
```

#### PHP (using cURL)
```php
<?php
$ch = curl_init('https://2fa.sendexa.co/v1/otp/request');
$data = [
  'destination' => 'user@email.com',
  'channel' => 'email',
  'sender_id' => 'MyAppVerify',
  'otp_length' => 4,
  'ttl' => 120
];
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'x-api-key: <your-api-key>'
]);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

#### Python (requests)
```python
import requests

url = 'https://2fa.sendexa.co/v1/otp/request'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': '<your-api-key>'
}
data = {
    'destination': 'user@email.com',
    'channel': 'email',
    'sender_id': 'MyAppVerify',
    'otp_length': 4,
    'ttl': 120
}
response = requests.post(url, json=data, headers=headers)
print(response.json())
```

#### Node.js (axios)
```js
const axios = require('axios');

(async () => {
  const response = await axios.post(
    'https://2fa.sendexa.co/v1/otp/request',
    {
      destination: 'user@email.com',
      channel: 'email',
      sender_id: 'MyAppVerify',
      otp_length: 4,
      ttl: 120
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '<your-api-key>'
      }
    }
  );
  console.log(response.data);
})();
```



## Contact & Support
For API key registration or support, contact: **support@sendexa.co**

---