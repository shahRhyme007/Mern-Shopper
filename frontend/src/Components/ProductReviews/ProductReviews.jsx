import React, { useState, useContext, useEffect, useCallback } from 'react'
import { ShopContext } from '../../Context/EnhancedShopContext'
import StarRating from '../StarRating/StarRating'
import './ProductReviews.css'

const ProductReviews = ({ productId }) => {
  const { isAuthenticated, makeAPICall } = useContext(ShopContext)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    recommend: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0]
  })

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const response = await makeAPICall(`/reviews/${productId}`)
      
      if (response.success) {
        setReviews(response.reviews || [])
        calculateReviewStats(response.reviews || [])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [makeAPICall, productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const calculateReviewStats = (reviewsData) => {
    if (reviewsData.length === 0) {
      setReviewStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0]
      })
      return
    }

    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviewsData.length

    const distribution = [0, 0, 0, 0, 0]
    reviewsData.forEach(review => {
      distribution[review.rating - 1]++
    })

    setReviewStats({
      averageRating: averageRating,
      totalReviews: reviewsData.length,
      ratingDistribution: distribution
    })
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please login to submit a review')
      return
    }

    if (reviewForm.rating === 0) {
      alert('Please select a rating')
      return
    }

    setSubmitting(true)

    try {
      const response = await makeAPICall('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          recommend: reviewForm.recommend
        })
      })

      if (response.success) {
        setReviewForm({
          rating: 0,
          title: '',
          comment: '',
          recommend: true
        })
        setShowReviewForm(false)
        fetchReviews() // Refresh reviews
      } else {
        alert('Failed to submit review. Please try again.')
      }
    } catch (error) {
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setReviewForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRatingPercentage = (starCount) => {
    if (reviewStats.totalReviews === 0) return 0
    return (reviewStats.ratingDistribution[starCount - 1] / reviewStats.totalReviews) * 100
  }

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="product-reviews">
      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="summary-header">
          <h3>Customer Reviews</h3>
          {isAuthenticated && !showReviewForm && (
            <button 
              className="write-review-btn"
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </button>
          )}
        </div>

        <div className="rating-overview">
          <div className="overall-rating">
            <div className="rating-number">{reviewStats.averageRating.toFixed(1)}</div>
            <div className="rating-stars">
              <StarRating rating={reviewStats.averageRating} size="large" readonly />
            </div>
            <div className="rating-count">
              Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-bar">
                <span className="star-label">{star} star</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${getRatingPercentage(star)}%` }}
                  ></div>
                </div>
                <span className="star-count">
                  {reviewStats.ratingDistribution[star - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h4>Write Your Review</h4>
            
            <div className="form-group">
              <label>Rating *</label>
              <StarRating 
                rating={reviewForm.rating} 
                onRatingChange={handleRatingChange}
                size="large"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Review Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={reviewForm.title}
                onChange={handleInputChange}
                placeholder="Summarize your experience"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review *</label>
              <textarea
                id="comment"
                name="comment"
                value={reviewForm.comment}
                onChange={handleInputChange}
                placeholder="Tell others about your experience with this product"
                rows={4}
                maxLength={1000}
                required
              />
              <div className="char-count">
                {reviewForm.comment.length}/1000 characters
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="recommend"
                  checked={reviewForm.recommend}
                  onChange={handleInputChange}
                />
                I would recommend this product to others
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting || reviewForm.rating === 0 || !reviewForm.comment.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">📝</div>
            <h4>No reviews yet</h4>
            <p>Be the first to share your thoughts about this product!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.userName?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="reviewer-details">
                    <span className="reviewer-name">{review.userName || 'Anonymous'}</span>
                    <span className="review-date">{formatDate(review.date)}</span>
                  </div>
                </div>
                <div className="review-rating">
                  <StarRating rating={review.rating} size="small" readonly />
                </div>
              </div>

              {review.title && (
                <h5 className="review-title">{review.title}</h5>
              )}

              <p className="review-comment">{review.comment}</p>

              {review.recommend && (
                <div className="review-recommend">
                  <span className="recommend-icon">✓</span>
                  Recommends this product
                </div>
              )}

              <div className="review-actions">
                <button className="helpful-btn">
                  👍 Helpful ({review.helpfulCount || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductReviews 