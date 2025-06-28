import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ShoppingBag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { ShopContext } from '../Context/EnhancedShopContext'
import { Button } from '../Components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card'

const LoginSignup = () => {
  const [state, setState] = useState("Login")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, x: state === "Login" ? -20 : 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,65,65,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ShoppingBag className="w-8 h-8" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              {state === "Login" ? "Welcome Back!" : "Join SHOPPER"}
            </CardTitle>
            <CardDescription className="text-white/80">
              {state === "Login" 
                ? "Sign in to your account to continue shopping" 
                : "Create your account to start your shopping journey"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Display general errors */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{errors.general}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              key={state}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Username field for signup */}
              <AnimatePresence>
                {state === "Sign Up" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="username"
                        value={formData.username}
                        onChange={changeHandler}
                        type="text"
                        placeholder="Your Name"
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.username 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    {errors.username && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.username}
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email field */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    type="email"
                    placeholder="Your Email"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {errors.email && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </motion.span>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    disabled={loading}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </motion.span>
                )}
              </div>

              {/* Terms and conditions for signup */}
              <AnimatePresence>
                {state === "Sign Up" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          disabled={loading}
                          className="sr-only"
                          id="terms"
                        />
                        <label
                          htmlFor="terms"
                          className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 ${
                            agreeToTerms
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'border-gray-300 hover:border-red-500'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {agreeToTerms && <CheckCircle className="w-3 h-3" />}
                        </label>
                      </div>
                      <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                        I agree to the{' '}
                        <span className="text-red-500 hover:text-red-600 font-medium">
                          Terms and Conditions
                        </span>{' '}
                        and{' '}
                        <span className="text-red-500 hover:text-red-600 font-medium">
                          Privacy Policy
                        </span>
                      </label>
                    </div>
                    {errors.terms && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.terms}
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {state === "Login" ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {state === "Login" ? "Sign In" : "Create Account"}
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {'→'}
                    </motion.div>
                  </div>
                )}
              </Button>
            </motion.form>

            {/* Toggle between login and signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button
                onClick={() => !loading && setState(state === "Login" ? "Sign Up" : "Login")}
                disabled={loading}
                className="mt-1 text-red-500 hover:text-red-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === "Sign Up" ? "Sign in here" : "Create one here"}
              </button>
            </div>

            {/* Additional features for login */}
            {state === "Login" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center"
              >
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  onClick={() => {/* Add forgot password functionality if needed */}}
                >
                  Forgot your password?
                </button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>© 2024 SHOPPER. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginSignup