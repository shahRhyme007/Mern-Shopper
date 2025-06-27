import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/EnhancedShopContext'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  const [state, setState] = useState("Login")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  
  const navigate = useNavigate()
  const { login, signup, isAuthenticated } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    
    if (state === "Sign Up" && !formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (state === "Sign Up" && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (state === "Sign Up" && !agreeToTerms) {
      newErrors.terms = "Please agree to terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }
  
  const handleSignup = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      const result = await signup(formData.username, formData.email, formData.password)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }
  
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear specific field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (state === "Login") {
      handleLogin()
    } else {
      handleSignup()
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        
        {/* Display general errors */}
        {errors.general && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* input boxes for login signup */}
          <div className="loginsignup-fields">
            {state === "Sign Up" && (
              <>
                <input 
                  name='username' 
                  value={formData.username} 
                  onChange={changeHandler} 
                  type="text" 
                  placeholder='Your Name'
                  disabled={loading}
                  style={errors.username ? { borderColor: 'red' } : {}}
                />
                {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username}</span>}
              </>
            )}
            
            <input 
              name='email' 
              value={formData.email} 
              onChange={changeHandler} 
              type="email" 
              placeholder='Your Email'
              disabled={loading}
              style={errors.email ? { borderColor: 'red' } : {}}
            />
            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
            
            <input 
              name='password' 
              value={formData.password} 
              onChange={changeHandler} 
              type="password" 
              placeholder='Password'
              disabled={loading}
              style={errors.password ? { borderColor: 'red' } : {}}
            />
            {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (state === "Login" ? "Logging in..." : "Creating account...") : "Continue"}
          </button>
        </form>
        
        {state === "Sign Up" ? 
          <p className='loginsignup-login'>
            Already have an account? 
            <span onClick={() => !loading && setState("Login")} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
              Login here
            </span>
          </p> :
          <p className='loginsignup-login'>
            Create an account? 
            <span onClick={() => !loading && setState("Sign Up")} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
              Click here
            </span>
          </p>
        }

        {/* agree to terms and conditions */}
        {state === "Sign Up" && (
          <div className="loginsignup-agree">
            <input 
              type="checkbox" 
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              disabled={loading}
            />
            <p>I agree to terms and conditions</p>
            {errors.terms && <span style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.terms}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignup