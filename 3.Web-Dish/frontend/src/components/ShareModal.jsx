import React, { useEffect, useState } from 'react';
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaCopy } from "react-icons/fa6";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareModal = ({ location, setIsShareOpen, isShareOpen }) => {
    location = 'https://web.aichefmaster.com' + location;
    const [showDiv, setShowDiv] = useState(false);
    
    const handleChangeDiv = () => {
        setShowDiv(!showDiv);
    }

    useEffect(()=>{
        if(showDiv){
        setTimeout(()=>{
            setShowDiv(!showDiv);
        }, 2000)
        }
    }, [handleChangeDiv])

    return (
        <div id="medium-modal" tabindex="-1" class="absolute flex justify-center items-center h-screen z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
            <div class="relative w-full max-w-lg max-h-full">
                {/* <!-- Modal content --> */}
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* <!-- Modal header --> */}
                    <div class="flex items-center justify-around p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                            Share with
                        </h3>
                        <button onClick={() => setIsShareOpen(!isShareOpen)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="medium-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div class="p-4 md:p-5 space-y-4 flex flex-col justify-center items-center">
                        <div className="flex items-center justify-between w-full gap-10 bg-white rounded-3xl px-3 py-2 text-sm font-semibold">
                            <input className="outline-none w-full" value={location} type="url" />
                            <CopyToClipboard text={location}>
                                <div className={`p-1 ${showDiv && 'bg-gray-300 text-blue-400 w-fit rounded-full'}`}>
                                    <FaCopy onClick={()=>handleChangeDiv()} title='copy link' 
                                    className={`h-5 hover:text-gray-500 ${showDiv && 'hover:text-blue-400'} cursor-pointer w-fit`} />
                                </div>
                            </CopyToClipboard>
                            {
                                showDiv && <div className='absolute text-gray-600 right-0 bg-gray-300 rounded-lg px-1 top-20'>Copied</div>
                            }
                        </div>

                        <div className="flex w-full gap-5 mt-5 items-center justify-center">
                            <CopyToClipboard text={location}>
                                <Link to={`https://www.facebook.com/sharer/sharer.php?u=${location}`} target="_blank">
                                    <FaFacebook size={30} className="text-blue-400 hover:scale-105 transition-all hover:text-blue-700 cursor-pointer" />
                                </Link>
                            </CopyToClipboard>
                            <CopyToClipboard text={location}>
                                <Link to={`whatsapp://send?text=${location}`} target="_blank">
                                    <FaWhatsapp size={32} className="text-green-500 hover:scale-105 transition-all hover:text-green-700 cursor-pointer" />
                                </Link>
                            </CopyToClipboard>
                            <CopyToClipboard text={location}>
                                <Link to={'https://instagram.com'} target="_blank">
                                    <FaInstagram size={30} className="text-pink-500 hover:scale-105 transition-all hover:text-pink-700 cursor-pointer" />
                                </Link>
                            </CopyToClipboard>
                            <CopyToClipboard text={location}>
                                <Link to={'https://x.com'} target="_blank">
                                    <BsTwitterX size={30} className="text-gray-400 hover:scale-105 transition-all hover:text-gray-500 cursor-pointer" />
                                </Link>
                            </CopyToClipboard>
                            <CopyToClipboard text={location}>
                                <Link to={'https://www.linkedin.com/messaging'} target="_blank">
                                    <FaLinkedin size={30} className=" text-blue-400 hover:scale-105 transition-all hover:text-blue-600 cursor-pointer" />
                                </Link>
                            </CopyToClipboard>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareModal;