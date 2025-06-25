import React, { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [name, setCustomerName] = useState("");

  
  useEffect(() => {
   
    const token = sessionStorage.getItem("token");
    
    if (token) {
      setIsLoggedIn(true);
      
      try {
        
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken && decodedToken.name) {
          setCustomerName(decodedToken.name);
          
          sessionStorage.setItem("name", decodedToken.name);
        } else {
          
          const storedName = sessionStorage.getItem("name");
          if (storedName) {
            setCustomerName(storedName);
          } else {
            setCustomerName("Customer"); 
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        
        const storedName = sessionStorage.getItem("name");
        if (storedName) {
          setCustomerName(storedName);
        } else {
          setCustomerName("Customer");
        }
      }
    }
  }, []);

  
  const handleLogout = () => {
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    
    setIsLoggedIn(false);
    setCustomerName("");
    
    window.location.href = "/";
  };

  return (
    <div>
      <section>
        <nav className="relative px-6 py-2 flex justify-between items-center bg-green-900">
          <a className="text-3xl font-bold leading-none" href="#">
            <img
              className="h-20"
              src="logoo.png"
              alt="Logo"
            />
          </a>
      
          <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
            <li>
              <a className="text-sm text-gray-400 hover:text-gray-500" href="/customer-dashboard">
                Dashboard
              </a>
            </li>
            <li>
              <a className="text-sm text-gray-400 hover:text-gray-500" href="/#">
                About Us
              </a>
            </li>
            <li>
              <a className="text-sm text-gray-400 hover:text-gray-500" href="/services">
                Services
              </a>
            </li>
            <li>
              <a className="text-sm text-gray-400 hover:text-gray-500" href="#">
                Profile
              </a>
            </li>
          </ul>
          
          {isLoggedIn ? (
            <>
              
              <div className="hidden lg:inline-flex lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 items-center text-sm text-gray-900 font-bold rounded-l-xl rounded-t-xl">
                <User size={16} className="mr-2" />
                <span>{name}</span>
              </div>
              
              
              <button
                className="hidden lg:inline-flex items-center py-2 px-6 bg-red-500 hover:bg-red-600 text-sm text-white font-bold rounded-l-xl rounded-t-xl transition duration-200"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              
              <a
                className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-l-xl rounded-t-xl transition duration-200"
                href="/signin"
              >
                Sign In
              </a>
              <a
                className="hidden lg:inline-block py-2 px-6 bg-green-500 hover:bg-green-600 text-sm text-white font-bold rounded-l-xl rounded-t-xl transition duration-200"
                href="/signup"
              >
                Sign up
              </a>
            </>
          )}
        </nav>
      </section>
    </div>
  );
};

export default Navbar;