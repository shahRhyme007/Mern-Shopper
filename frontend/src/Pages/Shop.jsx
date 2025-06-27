// This is our main page

import React, { useContext } from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import Loading from '../Components/Loading/Loading'
import { ShopContext } from '../Context/EnhancedShopContext'

const Shop = () => {
  const { loading, error, all_product } = useContext(ShopContext)

  if (loading) {
    return <Loading message="Loading products..." />
  }

  // Only show error if we don't have any products at all
  if (error && (!all_product || all_product.length === 0)) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px 20px', 
        color: '#666' 
      }}>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <p>Please try refreshing the page or check back later.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff4141',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div>
        <Hero/>
        <Popular/>
        <Offers/>
        <NewCollections/>
        <NewsLetter/>
    </div>
  )
}

export default Shop