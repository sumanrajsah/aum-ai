"use client"
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import './style.css'

export default function ExplorerPage() {
    const { status, isAuthLoading } = useAuth();

    const targetDate = new Date("2025-09-10T00:00:00"); // change launch date

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="explorer">
            <h2>Coming Soon</h2>
            <div className="countdown">
                <div className="time-box">
                    <span>{timeLeft.days}</span>
                    <small>Days</small>
                </div>
                <div className="time-box">
                    <span>{timeLeft.hours}</span>
                    <small>Hours</small>
                </div>
                <div className="time-box">
                    <span>{timeLeft.minutes}</span>
                    <small>Minutes</small>
                </div>
                <div className="time-box">
                    <span>{timeLeft.seconds}</span>
                    <small>Seconds</small>
                </div>
            </div>
        </div>
    );
}
