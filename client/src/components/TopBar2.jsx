import React from 'react';
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";

const TopBar2 = () => {
    const { theme } = useSelector((state) => state.theme);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors }
     } = useForm();

     const handleTheme = () => {
        const themeValue = theme === "light" ? "dark" : "light";
        dispatch(SetTheme(themeValue));
     };

    return (
        <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
            <div className='flex gap-2 items-center'>
                <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
                    <TbSocial />
                </div>
                <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
                    Telephone Picasso
                </span>
            </div>

            {/* ICONS */}
            <div className='flex gap-4 items-center text-ascent-1 texd-md md:text-xl'>
                <button onClick={()=> handleTheme()}>{theme ? <BsMoon /> : <BsSunFill />}</button>
            </div>
        </div>
    );
};

export default TopBar2;