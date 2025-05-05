import axios from "axios";

// Function to send OTP via SMS (HTTP API example)
export const sendSMS = async (phoneNumber: string, otp: string): Promise<void> => {
  try {
    // Placeholder URL for your SMS API endpoint
    const smsApiUrl = "https://sms-service-provider.com/send";

    // Replace with actual API parameters
    const response = await axios.post(smsApiUrl, {
      phoneNumber: phoneNumber,
      message: `Your OTP is: ${otp}`,
      senderId: "Sendexa",
    });

    if (response.status === 200) {
      console.log("OTP sent via SMS successfully.");
    } else {
      console.error("Failed to send OTP via SMS:", response.data);
    }
  } catch (error) {
    console.error("Error sending OTP via SMS:", error);
    throw new Error("Failed to send OTP via SMS");
  }
};
