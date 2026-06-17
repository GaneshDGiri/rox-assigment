import React, { useState, useEffect } from 'react';

const StarRating = ({ initialRating = 0, onRate }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    // Sync state if the backend data refreshes
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleClick = (index) => {
        setRating(index);
        if (onRate) onRate(index);
    };

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        type="button"
                        key={starValue}
                        className={`text-2xl transition-transform duration-200 focus:outline-none hover:scale-125 ${
                            starValue <= (hover || rating) ? 'text-amber-400' : 'text-slate-300'
                        }`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                        title={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;