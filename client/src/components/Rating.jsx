import React from 'react'
import { PiStarFill, PiStarHalfFill, PiStar } from "react-icons/pi";

export default function Rating({ rating, w = 5, h = 5 }) {
  // calculate star counts
  const fullStars = Math.floor(rating); // e.g., 2 for 2.5
  const hasHalfStar = rating % 1 >= 0.5; // true if rating is x.5 or higher
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);




  return (
    <div className="flex items-center">
      {/* full stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <PiStarFill
            key={`full-${i}`}
            className={`text-yellow-500 w-${w} h-${h} hover:text-yellow-600`}
          />
        ))}

      {/* half star */}
      {hasHalfStar && (
        <PiStarHalfFill
          className={`text-yellow-500 w-${w} h-${h} hover:text-yellow-600`}
        />
      )}

      {/* empty stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <PiStar
            key={`empty-${i}`}
            className={`text-gray-500 w-${w} h-${h} hover:text-yellow-600`}
          />
        ))}
    </div>
  );
}
