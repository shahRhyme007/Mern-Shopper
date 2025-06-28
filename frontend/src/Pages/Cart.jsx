import React, { useEffect } from 'react'
import CartItems from '../Components/CartItems/CartItems'

const Cart = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Shopping Cart - SHOPPER'
  }, [])

  return (
    <div>
      <CartItems />
    </div>
  )
}

export default Cart