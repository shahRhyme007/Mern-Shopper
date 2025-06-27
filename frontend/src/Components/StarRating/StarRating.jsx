import React, { useState } from 'react'
import './StarRating.css'

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  size = 'medium', 
  readonly = false, 
  showNumber = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  const handleClick = (selectedRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating)
    }
  }

  const handleMouseEnter = (selectedRating) => {
    if (!readonly) {
      setHoverRating(selectedRating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const getStarClass = (starIndex) => {
    const currentRating = hoverRating || rating
    let className = 'star'
    
    if (currentRating >= starIndex) {
      className += ' filled'
    } else if (currentRating > starIndex - 1) {
      className += ' half-filled'
    }
    
    if (!readonly) {
      className += ' interactive'
    }
    
    return className
  }

  return (
    <div className={`star-rating ${size} ${readonly ? 'readonly' : ''}`}>
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <span
            key={starIndex}
            className={getStarClass(starIndex)}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
          >
            ★
          </span>
        ))}
      </div>
      {showNumber && (
        <span className="rating-number">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating 