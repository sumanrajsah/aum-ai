// components/SpaceBackground.jsx
import React from 'react';
import './bgspace.css';
const SpaceBackground = () => {
    return (
        <div className="space-container">
            {/* Stars */}
            <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="star"></div>
                ))}
            </div>

            {/* Shooting Stars */}
            {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="shooting-star"></div>
            ))}

            {/* Floating Particles - Increased from 5 to 12 */}
            {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="particle"></div>
            ))}
            {/* Moving White Particles */}
            {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className="moving-particle"></div>
            ))}
        </div>
    );
};

export default SpaceBackground;