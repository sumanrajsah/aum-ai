"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import './styles.css'
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

type FeedbackFormInputs = {
    name: string;
    email: string;
    use: string;
    find: string;
    feature: string;
    improvement: string;
    recommend: string;
    feedback?: string;
};

export default function FeedbackForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FeedbackFormInputs>();
    const router = useRouter();
    const [alert, setAlert] = useState<String>('');

    const onSubmit = async (data: FeedbackFormInputs) => {
        const response = await axios.post('/api/feedback', data)
        if (response.data.message === 'success') {
            setAlert("✅ Thank you for your feedback")
            reset(); // Reset form after submission
            router.push('/')
        }
    };

    return (
        <div className="feedback-body">
            <div className="docs-nav">
                <Image src="/0xai.png" className="logo" alt="Logo" width={100} height={100} /><h3>0xXplorer Ai</h3>
            </div>
            <br />
            {alert && <h2>{alert}</h2>}
            <br />
            {!alert && <form onSubmit={handleSubmit(onSubmit)} className="feedback-body-cont">
                {/* Name Field */}
                <div className="field">
                    <label className="">Name</label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className=""
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div className="field">
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                        })}
                        className="w-full p-2 border rounded mt-1"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Feedback Field */}
                <div className="field">
                    <label className="block font-medium">1. How easy was it to use 0xXplorer AI?</label>
                    <div className="radio-group">
                        {[" 1 (Very Easy)", " 2 (Easy)", " 3 (Medium)", " 4 (Hard)", " 5 (Very Hard)"].map((value) => (
                            <label key={value} className="radio-label">
                                <input
                                    type="radio"
                                    value={value}
                                    {...register("use", { required: "Please select a rating" })}
                                    className="custom-radio"
                                />
                                <span className="radio-circle">{value}</span>
                            </label>
                        ))}
                    </div>
                    {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
                </div>
                <div className="field">
                    <label className="block font-medium">2. Did you find the blockchain data you were looking for?</label>
                    <div className="radio-group">
                        {[" Yes", " No"].map((value) => (
                            <label key={value} className="radio-label">
                                <input
                                    type="radio"
                                    value={value}
                                    {...register("find", { required: "Please select a yes or no" })}
                                    className="custom-radio"
                                />
                                <span className="radio-circle">{value}</span>
                            </label>
                        ))}
                    </div>
                    {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
                </div>


                <div className="field">
                    <label className="block font-medium">3. What feature do you like the most in 0xXplorer?</label>
                    <textarea
                        {...register("feature", { required: "Feedback is required" })}
                        className="w-full p-2 border rounded mt-1"
                        rows={4}
                    ></textarea>
                    {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
                </div>
                <div className="field">
                    <label className="block font-medium">4. What improvements or new features would you like to see? </label>
                    <textarea
                        {...register("improvement", { required: "Feedback is required" })}
                        className="w-full p-2 border rounded mt-1"
                        rows={4}
                    ></textarea>
                    {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
                </div>
                <div className="field">
                    <label className="block font-medium">5. Would you recommend 0xXplorer to others? </label>
                    <div className="radio-group">
                        {[" Yes", " No"].map((value) => (
                            <label key={value} className="radio-label">
                                <input
                                    type="radio"
                                    value={value}
                                    {...register("recommend", { required: "Please select a yes or no" })}
                                    className="custom-radio"
                                />
                                <span className="radio-circle">{value}</span>
                            </label>
                        ))}
                    </div>
                    {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
                </div>
                <div className="field">
                    <label className="block font-medium">Feedback</label>
                    <textarea
                        {...register("feedback")}
                        className="w-full p-2 border rounded mt-1"
                        rows={4}
                    ></textarea>
                    {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="btn-cont">
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                        className="submit-btn"
                        disabled={isSubmitting}
                        onClick={() => router.push('/')}
                    >
                        Back
                    </button>
                </div>
            </form>}
        </div>
    );
}
