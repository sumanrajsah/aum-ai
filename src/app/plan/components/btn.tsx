"use client";
import React, { useEffect } from "react";

export default function RazorpayButton() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.razorpay.com/static/widget/subscription-button.js";
        script.async = true;
        script.setAttribute("data-subscription_button_id", "pl_RBoqZw776LqHN5");
        script.setAttribute("data-button_theme", "brand-color");

        const form = document.getElementById("razorpay-sub-form");
        if (form) form.appendChild(script);
    }, []);

    return <form id="razorpay-sub-form"></form>;
}
