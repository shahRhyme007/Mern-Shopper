import React, { useContext } from 'react';
import { ShopContext } from '../Context/EnhancedShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import ProductReviews from '../Components/ProductReviews/ProductReviews';

const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  
  // Debugging logs
  console.log('Product ID:', productId);
  console.log('All Products:', all_product);
  
  const product = all_product.find((e) => e.id === Number(productId));

  console.log('Product:', product);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrum product={product} />
      {/* displaying the product that the user selected from the list of products */}
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <ProductReviews productId={product.id} />
      <RelatedProducts/>
    </div>
  );
}

export default Product;
