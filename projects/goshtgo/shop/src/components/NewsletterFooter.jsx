import React, { useState } from "react";
import axios from "../api/axios"; // use your configured axios instance
import { LiaTelegramPlane } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function NewsletterFooter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await axios.post("/users/subscribe", { email });

      setMessage({ type: "success", text: "Subscription successful! Check your email." });
      setEmail("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Subscription failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bloody md:px-10 shadow-md text-white px-4 py-3">
      <div className="flex flex-wrap justify-between container mx-auto items-center">
        <div className="my-2">
          <p className="flex items-center">
            <LiaTelegramPlane size={45} className="mr-2" />
            {t("Sign up to Newsletter")}
          </p>
        </div>
        <div className="my-2">
          <p>{t("... and Be aware of all promotions and events!")}</p>
        </div>
        <div className="my-2">
          <div className="md:flex flex-1 max-w-3xl">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Subscribe for more...")}
              className="flex-1 px-4 py-2 md:rounded-l-full border w-webkit-fill-available border-white focus:outline-none text-black"
              disabled={loading}
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`bg-red-900 py-2 w-full px-4 md:rounded-r-full text-white ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? t("signingUp") : t("signUp")}
            </button>
          </div>
          {message && (
            <p
              className={`mt-2 text-sm ${
                message.type === "error" ? "text-red-200" : "text-green-200"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}