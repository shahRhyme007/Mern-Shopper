import React from 'react'
import './Footer.css'
import { motion } from 'framer-motion'
import { Instagram, MessageCircle, Mail, Phone, MapPin, Heart } from 'lucide-react'
import Marquee from 'react-fast-marquee'

import footer_logo from "../Assets/logo_big.png"

const Footer = () => {
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "News", "Media Kit"]
    },
    {
      title: "Products", 
      links: ["Men's Fashion", "Women's Fashion", "Kids Collection", "Accessories", "Sale"]
    },
    {
      title: "Support",
      links: ["Help Center", "Size Guide", "Returns", "Shipping Info", "Track Order"]
    },
    {
      title: "Connect",
      links: ["Newsletter", "Contact Us", "Store Locator", "Gift Cards", "Affiliate"]
    }
  ]

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: MessageCircle, href: "#", label: "WhatsApp" },
    { icon: Mail, href: "#", label: "Email" }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay in the Loop
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Get the latest updates on new arrivals, exclusive offers, and fashion trends
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-red-500 font-semibold rounded-r-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling Brands */}
      <div className="bg-gray-800 py-6">
        <Marquee speed={40} gradient={false}>
          <div className="flex items-center space-x-12 text-gray-400">
            <span className="text-2xl font-bold">NIKE</span>
            <span className="text-2xl font-bold">ADIDAS</span>
            <span className="text-2xl font-bold">PUMA</span>
            <span className="text-2xl font-bold">ZARA</span>
            <span className="text-2xl font-bold">H&M</span>
            <span className="text-2xl font-bold">UNIQLO</span>
            <span className="text-2xl font-bold">GUCCI</span>
            <span className="text-2xl font-bold">LOUIS VUITTON</span>
          </div>
        </Marquee>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <img src={footer_logo} alt="Shopper Logo" className="h-12 w-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                SHOPPER
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your ultimate destination for fashion-forward clothing. We bring you the latest trends 
              and timeless classics from around the world, all in one place.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>123 Fashion Street, Style City, SC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>hello@shopper.com</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div 
          className="flex justify-center space-x-6 mt-12 pt-8 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <social.icon className="h-6 w-6" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2024 Shopper. All rights reserved.
            </motion.p>
            <motion.div 
              className="flex items-center space-x-2 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for fashion lovers</span>
            </motion.div>
            <motion.div 
              className="flex space-x-6 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer