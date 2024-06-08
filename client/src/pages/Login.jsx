import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextInput, Loading, CustomButton } from "../components";
import { BgImage } from "../assets";
import { apiUrl } from "../config.js";

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        // console.log("Attempting to navigate to home...");

        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        localStorage.setItem('current_user', data.username);

        setIsSubmitting(true);

        fetch(`${apiUrl}/api/user/login/`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    localStorage.removeItem('current_user');
                    throw new Error('Username and/or password is incorrect');
                }
            })
            .then((data) => {
                // console.log('access: ' + data.access);
                // console.log('refresh: ' + data.refresh);
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                // console.log(data);
                alert('Login complete, navigating to home page.');
                navigate("/home");
            })
            .catch((error) => {
                localStorage.removeItem('current_user');
                console.error('There was a problem with the fetch operation:', error);
                setError("password", {
                    type: "manual",
                    message: "Username and/or password is incorrect",
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
            <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
                {/* LEFT */}
                <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
                    <div className='w-full flex gap-2 items-center mb-2'>
                        <span className='application-title-text pt-5'>
                            Welcome to Garlic Phone
                        </span>
                    </div>

                    <p className='text-ascent-1 text-base font-semibold'>Log in to your account</p>
                    <form 
                        className='py-8 flex flex-col gap-5'
                        onSubmit={handleSubmit(onSubmit)}>
                        <TextInput 
                            name='email' 
                            placeholder='Username'
                            label='Username'
                            type='text'
                            register={register("username", {
                                required: "Username is required"
                            })}
                            styles="w-full rounded-full"
                            error={errors.username ? errors.username.message : ""}/>

                        <TextInput 
                            name='password' 
                            placeholder='Password'
                            label='Password'
                            type='password'
                            styles='w-full rounded-full'
                            register={register("password", {
                                required: "Password is required!",
                            })}
                            error={errors.password ? errors.password.message : ""}/>                       
                        {
                            isSubmitting ? (<Loading/> ) : ( 
                                <CustomButton 
                                    type='submit'
                                    containerStyles={'colored-button-style'}
                                    title='Login'/>
                            )
                        }
                    </form>
                        
                    <p className='text-ascent-2 text-sm text-center'>
                        <Link to='/register' className='text-[#065ad8] font-semibold cursor-pointer'>
                            Create Account
                        </Link>
                    </p>
                </div>
                {/* RIGHT */}
                <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
                    <div className='relative w-full flex item-center justify-center'>
                        <img
                            src={BgImage}
                            className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
                        />
                    </div>

                    <div className='mt-16 text-center'>
                        <p className='text-white text-base'>
                            Connect with friends & draw some pictures!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
