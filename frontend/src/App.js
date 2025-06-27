import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import LoginSignup from './Pages/LoginSignup';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Wishlist from './Pages/Wishlist';
import Checkout from './Components/Checkout/Checkout';
import OrderSuccess from './Pages/OrderSuccess';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import ApiStatus from './Components/ApiStatus/ApiStatus';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import { useContext } from 'react';
import { ShopContext } from './Context/EnhancedShopContext';
import SearchResults from './Pages/SearchResults';
import UserProfile from './Pages/UserProfile';

const AppContent = () => {
  const { isApiOnline } = useContext(ShopContext);
  
  return (
    <div>
      <ErrorBoundary>
      <ApiStatus isOnline={isApiOnline} />
      {/* the navbar will be visible in all the pages */}
      <Navbar/>
      {/* all the routes(specific pages) will be here */}
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
        <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
        <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
        
        {/* route for the product */}
        <Route path='/product' element= {<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>

        {/* route for the cart, wishlist and loginpage */}
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/order-success' element={<OrderSuccess/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/search' element={<SearchResults/>}/>
        <Route path='/profile' element={<UserProfile/>}/>

      </Routes>
      <Footer/>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
