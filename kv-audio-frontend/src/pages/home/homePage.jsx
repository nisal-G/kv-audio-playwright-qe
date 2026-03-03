import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/Footer/Footer";
import Contact from "./contactUs";
import Home from "./home";
import Gallery from "./gallery";
import Items from "./items";
import AboutUs from "./aboutUs";
import ErrorNotFound from "./error";
import ProductOverview from "./productOverview";
import BookingPage from "./bookingPage";

export default function HomePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                const user = response.data;
                if (user.role === 'Admin') {
                    navigate('/admin');
                } else {
                    setIsLoading(false);
                }
            }).catch(error => {
                console.error('Error validating user:', error);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }


    return (
        <div className="w-full min-h-screen flex flex-col">
            <Header />
            <div className="w-full flex-1 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/product/:key" element={<ProductOverview />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/*" element={<ErrorNotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    )
}