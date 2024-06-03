import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form"
import { TbSocial } from "react-icons/tb";
import { TextInput, Loading, CustomButton} from "../components";
import { BgImage } from "../assets";

const Login = () => {
    const navigate = useNavigate();

    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset: reset,
    } = useForm({
        mode: "onChange",
    });


    const onSubmit = async(data) => { 
        console.log("Attempting to navigate to home...");
        navigate('/home');
    };

    const [errMsg, setErrMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    return (
        <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
            <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
                {/* LEFT */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
                    <div className='w-full flex gap-2 items-center mb-6'>
                        <span className='text-2xl text-[#065ad8] font-semibold'>
                            Telephone Picasso
                        </span>
                    </div>

                    <p className='text-ascent-1 text-base font-semibold'>
                        Log in to your account
                    </p>
                    <form 
                        className='py-8 flex flex-col gap-5'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <TextInput 
                            name='email' 
                            placeholder='Username'
                            label= 'Username'
                            type='text'
                            register={register("username", {
                                required: "Username is required"
                            })}
                            styles="w-full rounded-full"
                            labelStyle='ml-2'
                            error= {errors.username ? errors.username.message : ""}
                            //make sure to validate email address + password
                        />

                        <TextInput 
                            name='password' 
                            placeholder='Password'
                            label= 'Password'
                            type='password'
                            styles='w-full rounded-full'
                            labelStyle='ml-2'
                            register={register("password", {
                                required: "Password is required!",
                            })}
                            error= {errors.password ? errors.password?.message : ""}
                        />

                        

                        {
                            errMsg?.message && (
                                <span 
                                    className={`text-sm ${
                                        errMsg?.status =="failed" 
                                            ? "text-[#f64949fe]"
                                            : "text-[#2ba150fe]"
                                    }   mt-0.5`}
                                >
                                    {errMsg?.message}
                                </span>
                            )
                        }

                        {
                            isSubmitting ? (
                                <Loading/> 
                            ) : ( 
                                <CustomButton 
                                    type='submit'
                                    containerStyles={'inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none'}
                                    title='Login'
                                />
                            )
                        }
                    </form>
                        
                    <p className='text-ascent-2 text-sm text-center'>
                        <Link
                            to='/register'
                            className='text-[#065ad8] font-semibold ml-2 cursor-pointer'    
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
                {/* RIGHT */}
                <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
                    <div className='relative w-full flex item-center justify-center'>
                        <img
                            src={BgImage}
                            alt='Bg Image'
                            className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
                        />
                    </div>

                    <div className='mt-16 text-center'>
                        <p className='text-white text-base'>
                            Connect with friends & draw some bullshit!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;