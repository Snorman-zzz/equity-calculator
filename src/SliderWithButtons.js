// SliderWithButtons.js
import React from "react";
import "./SliderWithButtons.css";

/**
 * Props:
 *  - value: number
 *  - min: number
 *  - max: number
 *  - step: number
 *  - onChange: function(newValue)
 */
function SliderWithButtons({ value, min, max, step, onChange }) {
    const handleIncrement = () => {
        const newValue = Math.min(value + step, max);
        onChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(value - step, min);
        onChange(newValue);
    };

    return (
        <div className="slider-with-buttons">
            <button onClick={handleDecrement} className="slider-button">
                &minus;
            </button>
            <input
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(e) => onChange(Number(e.target.value))}
                className="slider"
            />
            <button onClick={handleIncrement} className="slider-button">
                &#43;
            </button>
            <span className="slider-value">{value}%</span>
        </div>
    );
}

export default SliderWithButtons;
