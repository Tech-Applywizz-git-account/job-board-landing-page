import { useState } from 'react';
import PropTypes from 'prop-types';

const PaymentForm = ({ plan, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        countryCode: '+971', // Default to UAE
        mobileNumber: '',
        promoCode: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // OTP related states
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [otpSuccess, setOtpSuccess] = useState('');

    const countryCodes = [
        { code: '+971', country: 'UAE (Dubai)', flag: '🇦🇪' },
        { code: '+91', country: 'India', flag: '🇮🇳' },
        { code: '+1', country: 'USA', flag: '🇺🇸' },
        { code: '+44', country: 'UK', flag: '🇬🇧' },
        { code: '+61', country: 'Australia', flag: '🇦🇺' },
        { code: '+65', country: 'Singapore', flag: '🇸🇬' },
        { code: '+81', country: 'Japan', flag: '🇯🇵' },
        { code: '+86', country: 'China', flag: '🇨🇳' }
    ];

    // Send OTP function
    const handleSendOtp = async () => {
        // Validate email first
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            setOtpError('Please enter your email address first');
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setOtpError('Please enter a valid email address');
            return;
        }

        setIsSendingOtp(true);
        setOtpError('');
        setOtpSuccess('');

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        action: 'send',
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setOtpSent(true);
            setOtpSuccess('OTP sent successfully! Please check your email.');
        } catch (error) {
            console.error('Error sending OTP:', error);
            setOtpError(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    // Verify OTP function
    const handleVerifyOtp = async () => {
        if (!otpValue.trim()) {
            setOtpError('Please enter the OTP');
            return;
        }

        if (otpValue.length !== 6) {
            setOtpError('OTP must be 6 digits');
            return;
        }

        setIsVerifyingOtp(true);
        setOtpError('');
        setOtpSuccess('');

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        action: 'verify',
                        otp: otpValue,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }

            setIsEmailVerified(true);
            setOtpSuccess('✓ Email verified successfully!');
            setOtpError('');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Full name must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        } else if (!isEmailVerified) {
            newErrors.email = 'Please verify your email with OTP';
        }

        // Mobile number validation
        const phoneRegex = /^[0-9]{7,15}$/;
        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!phoneRegex.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid mobile number (7-15 digits)';
        }

        // Terms and conditions validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
            setErrors({ submit: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-blue-950 to-black rounded-2xl border border-gray-700/50 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="p-8 pb-6 border-b border-gray-700/50">
                    <h2 className="text-3xl font-bold text-white mb-2">Complete Your Purchase</h2>
                    <p className="text-gray-400">
                        You&apos;re subscribing to the <span className="text-blue-400 font-semibold">{plan.title}</span> plan
                    </p>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${errors.fullName ? 'border-red-500' : 'border-gray-700'
                                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                            placeholder="John Doe"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email with OTP Verification */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isEmailVerified}
                                className={`flex-1 px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : isEmailVerified ? 'border-green-500' : 'border-gray-700'
                                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEmailVerified ? 'opacity-75' : ''}`}
                                placeholder="john.doe@example.com"
                            />
                            {!isEmailVerified && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp || !formData.email}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all whitespace-nowrap"
                                >
                                    {isSendingOtp ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    ) : otpSent ? (
                                        'Resend OTP'
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            )}
                            {isEmailVerified && (
                                <div className="px-6 py-3 bg-green-600/20 border border-green-500 text-green-400 font-medium rounded-lg flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Verified
                                </div>
                            )}
                        </div>

                        {/* OTP Input and Verify Button - Show after OTP is sent */}
                        {otpSent && !isEmailVerified && (
                            <div className="mt-3 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={otpValue}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtpValue(value);
                                            setOtpError('');
                                        }}
                                        maxLength={6}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-lg tracking-widest"
                                        placeholder="000000"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={isVerifyingOtp || otpValue.length !== 6}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all whitespace-nowrap"
                                    >
                                        {isVerifyingOtp ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {otpSuccess && (
                            <p className="mt-2 text-sm text-green-400 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {otpSuccess}
                            </p>
                        )}

                        {/* Error Messages */}
                        {otpError && (
                            <p className="mt-2 text-sm text-red-500">{otpError}</p>
                        )}
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Mobile Number with Country Code */}
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleInputChange}
                                className="px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                {countryCodes.map((item) => (
                                    <option key={item.code} value={item.code} className="bg-gray-900">
                                        {item.flag} {item.code}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                className={`flex-1 px-4 py-3 bg-white/5 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-700'
                                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="1234567890"
                            />
                        </div>
                        {errors.mobileNumber && (
                            <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
                        )}
                    </div>

                    {/* Promo Code (Optional) */}
                    <div>
                        <label htmlFor="promoCode" className="block text-sm font-medium text-gray-300 mb-2">
                            Promo Code <span className="text-gray-500">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="promoCode"
                            name="promoCode"
                            value={formData.promoCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase"
                            placeholder="SAVE10"
                        />
                    </div>

                    {/* Terms and Conditions */}
                    <div>
                        <label className="flex items-start cursor-pointer group">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                className="mt-1 w-5 h-5 rounded border-gray-700 bg-white/5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">
                                I agree to the{' '}
                                <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                                    Terms and Conditions
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                                    Privacy Policy
                                </a>
                                <span className="text-red-500 ml-1">*</span>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-sm text-red-500">{errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-2xl"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Proceed to Payment'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

PaymentForm.propTypes = {
    plan: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        period: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default PaymentForm;
