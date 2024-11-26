// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {BiShow} from 'react-icons/bi'
import {MdOutlineVisibilityOff} from 'react-icons/md'
import {useLogin} from '../hooks/useLogin';
import {useAuthContext} from '../hooks/useAuthContext';
import toast from 'react-hot-toast'

const LoginPage = () => {
    const {dispatch} = useAuthContext()

    const {user} = useAuthContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(true)
    const {login, error, isLoading} = useLogin()
    const Navigate = useNavigate();
    const [emailOtp, setEmailOtp] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {response, json} = await login(email, password);
        if (response.ok) {
            Navigate("/dashboard");
        } else toast.error(json['message']);
    }
    const handleSendEmailOTP = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/chef/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email}),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setIsEmailOtpSent(true);
                toast.success("OTP sent to email successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to send OTP");
        }
    };
    const handleVerifyEmailOTP = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/chef/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, otp: emailOtp}),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setIsEmailVerified(true);
                toast.success("Email verified");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to verify OTP");
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userDataStr = urlParams.get('data');
        if (userDataStr) {
            const userData = JSON.parse(decodeURIComponent(userDataStr));

            localStorage.setItem('user', JSON.stringify(userData));

            dispatch({type: 'LOGIN', payload: userData});

            toast.success("Logged in Successfully");

            navigate(window.location.pathname, {replace: true});
        }
    }, []);

    return (
        <div className='px-4 sm:px-4 pt-12 '>
            <form className='py-8 flex flex-col justify-center z-10 items-center  font-primary' onSubmit={handleSubmit}>
                <h3 className='custom-text text-4xl font-semibold text-center py-2'>Welcome, log in to you account</h3>
                <p className='custom-text-secondary text-center mb-8 font-semibold'>Enter the fields below to
                    continue</p>

                <div className=' bg-gradient-to-b rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                    <div
                        className='custom-bg backdrop-filter backdrop-blur-xl h-full w-full items-center p-4  back md:p-16 rounded-lg flex flex-col justify-center'>
                        <div className='flex md:gap-4 flex-col md:flex-row min-w-full'>
                            <div className='my-4 min-w-full'>
                                <label className='custom-text font-medium mb-1'>Username</label>
                                <div className='mt-2'>
                                    <div className="flex">
                                        <input
                                            type="email"
                                            className="custom-input custom-text flex-grow py-2 px-3 border border-zinc-600 rounded-l-lg"
                                            placeholder="User123"
                                            name="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            disabled={isEmailVerified}
                                        />
                                        <button
                                            type="button"
                                            className="bg-zinc-600 text-white px-3 rounded-r-lg"
                                            onClick={handleSendEmailOTP}
                                            disabled={isEmailVerified || isEmailOtpSent}
                                        >
                                            Send OTP
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEmailOtpSent && !isEmailVerified && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Email OTP</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="custom-input custom-text flex-grow py-2 px-3 border border-zinc-600 rounded-l-lg"
                                        placeholder="Enter Email OTP"
                                        name="emailOtp"
                                        onChange={(e) => setEmailOtp(e.target.value)}
                                        value={emailOtp}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="bg-zinc-600 text-white px-3 rounded-r-lg"
                                        onClick={handleVerifyEmailOTP}
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className='flex md:gap-4 flex-col md:flex-row min-w-full'>
                            <div className=''>
                                <label className='custom-text font-medium'>Password</label>
                                <div className='relative'>
                                    <input type={!showPw ? 'text' : 'password'}
                                           className='custom-input custom-text block w-[300px] py-2 px-4 placeholder:italic my-2 border border-zinc-900 rounded-lg '
                                           placeholder='Password'
                                           onChange={(e) => setPassword(e.target.value)}
                                           value={password}
                                           required={true}
                                    />
                                    <BiShow
                                        className={` ${showPw ? 'hidden' : 'flex'} absolute top-3 right-9 md:right-4 cursor-pointer`}
                                        onClick={() => {
                                            setShowPw(!showPw)
                                        }}/>
                                    <MdOutlineVisibilityOff
                                        className={` ${showPw ? 'flex' : 'hidden'} absolute top-3 right-9 md:right-4 cursor-pointer`}
                                        onClick={() => {
                                            setShowPw(!showPw)
                                        }}/>
                                </div>
                            </div>
                        </div>

                        {error && <div
                            className='text-rose-600 border-l-2 border-r-2 w-full text-sm rounded border-rose-800 text-center  bg-[#ab2c2c2a] to-transparent  px-4 py-2'>{error}</div>}
                        {user && <div
                            className='text-emerald-600 border-l-2 border-r-2 w-full text-sm rounded border-emerald-800 text-center  bg-[#2cab392a] to-transparent  px-4 py-2'>You
                            are currently logged in</div>}
                        <div className='mt-1 mb-6  -ml-[8rem] relative text-red-700  px-[4.5rem] left-0 '>
                            <button>Forgot Your Password?</button>
                        </div>
                        <button disabled={isLoading}
                                className="bg-zinc-950 hover:bg-zinc-800 md:w-1/2 px-8 py-2 overflow-hidden font-medium rounded-xl border   text-xl  shadow-xl s my-2">
                            <span className=" text-white">Log In</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginPage








