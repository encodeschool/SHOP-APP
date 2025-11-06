import { TbTruckDelivery } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";

import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMailBulk, FaRegUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FaPhone } from "react-icons/fa6";
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import axios from 'axios';
import { useTranslation } from "react-i18next";

export default function AppBar() {
    const [languageOpen, setLanguageOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { isLoggedIn, logout } = useContext(AuthContext);
    const { language, setLanguage } = useContext(LanguageContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [user, setUser] = useState({
        fullName: "Admin",
        profileImage: "https://via.placeholder.com/40",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        return;
        }

        axios
        .get(`${BASE_URL}/api/users/${userId}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
            console.error("Failed to fetch user", err);
        });
    }, [isLoggedIn]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setLanguageOpen(false);
    };
    return (
        <div className='pinkish hidden md:block text-sm border-b shadow-sm'>
            <div className='container mx-auto md:px-10 md:py-5 flex justify-between items-center'>
                <div className=''>
                    <div className='hidden md:flex gap-4 items-center'>
                        <Link to='tel:+123456789' className='font-medium text-[24px]'>+123 4567 89</Link>
                        <p className='text-gray-500'>9:00-19:30</p>
                        <button className='hover:bg-red-600 transition delay-50 duration-100 hover:text-white text-red-600 border border-red-600 rounded-full color-red px-4 py-1'>{t("Order a call")}</button>
                    </div>
                    <div className='hidden md:flex gap-4 items-center mt-5'>
                        <Link to='/delivery' className='flex uppercase transition delay-50 duration-100 hover:text-red-500 text-[14px] items-center'><TbTruckDelivery className='mr-2 text-gray-500' />{t('deliveryheading')}</Link>
                        <Link to='/quality' className='uppercase transition delay-50 duration-100 hover:text-red-500 text-[14px]'>{t('qualityheading')}</Link>
                        <Link to='/contact' className='uppercase transition delay-50 duration-100 hover:text-red-500 text-[14px]'>{t('Contacts')}</Link>
                        <Link to='/about' className='uppercase transition delay-50 duration-100 hover:text-red-500 text-[14px]'>{t('About Us')}</Link>
                    </div>
                </div>
                <div>
                    <Link to='/'>
                        <img src="https://primemeat.ru/local/templates/primemeat/static/images/logo.svg" alt="" />
                    </Link>
                </div>
                <div>
                    <div>
                        <Link to="/track" className="w-full uppercase text-center justify-center text-red-600 flex items-center border rounded-full px-5 py-2 border-white bg-white">
                            <TbTruckDelivery className="mr-1" />{t('Track Your Order')}
                        </Link>
                        {/* <button className="w-full text-center justify-center text-red-600 flex items-center border rounded-full px-5 py-2 border-white bg-white"><FaLocationDot className='mr-2' />Tashkent</button> */}
                    </div>
                    <div className=' mt-5'>
                        <Link className='text-right hover:underline text-red-600 hover:bold'> 
                            <p>{t('deliverytommorow')}</p>
                            <p>{t('earlyDelivery')}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}