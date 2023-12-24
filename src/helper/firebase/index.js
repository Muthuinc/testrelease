import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const generateRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "capchabox", {
    size: "invisible",
    callback: () => {
      
    },
  });
};

export const sendOTP = async (number) => {
  try {
    generateRecaptcha();
    let result = await signInWithPhoneNumber(
      auth,
      `+${number}`,
      window.recaptchaVerifier
    );
    window.confirmationResult = result;
    return true;
  } catch (err) {
    if (err.message === "reCAPTCHA has already been rendered in this element") {
      return "already sended";
    }
    return false;
  }
};

export const verifyOTP = async (code) => {
  try {
    let confirmationResult = window.confirmationResult;
    await confirmationResult.confirm(code);
    return {
      status: true,
    };
  } catch (err) {
    if (err.code === "auth/code-expired") {
      console.log(err);
      return {
        status: false,
        message:
          "The OTP has expired. Please refresh the page and generate a new OTP",
      };
    } else if (err.code === "auth/invalid-verification-code") {
      return {
        status: false,
        message: "The verification code entered is not valid.",
      };
    } else {
      return {
        status: false,
        message: "Something went wrong",
      };
    }
  }
};
