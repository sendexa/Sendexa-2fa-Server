
## **Sendexa 2FA Server**

The **Sendexa 2FA Server** (`2fa.sendexa.co`) provides secure and scalable One-Time Password (OTP) functionality for businesses across Africa. It supports **SMS** and **Email** delivery channels and uses **in-memory storage** for speed and cost-efficiency.

---

### **Goals**

* Provide a fast, reliable OTP generation and verification system.
* Support both **email** and **SMS** as delivery channels.
* Allow businesses to configure custom **Sender IDs** per channel.
* Enforce rate limiting and expiry validation without external storage (no Redis).
* Secure access via **API keys**.

---

## **Architecture Overview**

```
sendexa-2fa/
src/
├── v1/
│   ├── controllers/
│   │   └── otp.controller.ts
│   ├── routes/
│   │   └── otp.routes.ts
├── middleware/
│   ├── auth.ts
│   ├── logger.ts
│   ├── rateLimiter.ts
│   └── validators.ts
├── services/
│   ├── emailSender.ts
│   └── smsSender.ts
├── store/
│   └── otpStore.ts
├── utils/
│   └── otp.ts
├── types/
│   └── index.ts
├── config/
│   └── index.ts
├── app.ts
└── server.ts


---

## **Configuration**

* **API Key Auth**: Every business must register an API key.
* **Sender ID**: Required in requests to control branding per client.
* **TTL**: Default OTP expiry is 5 minutes.
* **Rate Limit**: 1 OTP per minute per destination.

---

## **Supported Delivery Channels**

* `sms` → Routed to HTTP or SMPP via `smsSender.ts`
* `email` → Sent using NodeMailer via `emailSender.ts`

---

## **Endpoints**

### 1. **`POST /v1/otp/request`**

Generate and send an OTP.

**Headers:**

```
x-api-key: <your-api-key>
```

**Body:**

```json
{
  "destination": "0541234567",      // Or email
  "channel": "sms",                 // "sms" or "email"
  "sender_id": "MyAppVerify"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### 2. **`POST /v1/otp/verify`**

Verify an OTP previously sent.

**Headers:**

```
x-api-key: <your-api-key>
```

**Body:**

```json
{
  "destination": "0541234567",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified"
}
```

---

### 3. **`POST /v1/otp/resend`**

Resend the same OTP if still valid or generate a new one.

**Headers:**

```
x-api-key: <your-api-key>
```

**Body:**

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
  "message": "OTP resent"
}
```

---

## **Security**

* Every request requires a valid `x-api-key`.
* Sender ID must match the one registered under the business API key.
* Rate limiting and OTP expiry are enforced in-memory.

---

## **Future Improvements**

* Add country-based TTL or rate configurations (if needed)
* Integrate optional Redis store for distributed deployments
* Support TOTP/Authenticator-style flows for advanced users


