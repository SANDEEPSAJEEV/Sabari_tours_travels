import { Routes, Route, Navigate } from 'react-router-dom';
import { PackageProvider } from './context/PackageContext';
import { AuthProvider } from './context/AuthContext';
import { ReviewProvider } from './context/ReviewContext';
import { SettingsProvider } from './context/SettingsContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PackagesSection from './components/PackagesSection';
import StatsSection from './components/StatsSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <PackagesSection />
            <StatsSection />
            <AboutSection />
            <TestimonialsSection />
            <ContactSection />
            <Footer />
            <WhatsAppButton />
        </>
    );
}

function AdminGuard() {
    const { isAdmin } = useAuth();
    return isAdmin ? <AdminDashboard /> : <Navigate to="/admin" replace />;
}

function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <ReviewProvider>
                    <PackageProvider>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/admin" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminGuard />} />
                        </Routes>
                    </PackageProvider>
                </ReviewProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}

export default App;
