import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TextInput, Loading, CustomButton } from "../components";

const TimerComponent = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); // Initialize countdown (5 seconds)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer); // Stop the interval when countdown is 0
                    navigate('/login'); // Navigate when countdown is finished
                    return 0;
                }
                return prevCountdown - 1; // Decrement the countdown by 1
            });
        }, 1000); // Update every second

        return () => clearInterval(timer); // Cleanup the interval on component unmount
    }, [navigate]);

    return (
        <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
            <p>Timer will redirect the page in {countdown} seconds...</p>
            <Link
                to="/reset-password"
                className='text-sm text-right text-blue font-semibold'
            >
                Forgot Password ?
            </Link>
        </div>
    );
};


export default TimerComponent;



// import React from "react";
// import { useSelector } from "react-redux";
// import { TopBar, ProfileCard} from "../components";

// const TimerComponent = () => {
//     const { user } = useSelector((state) => state.user);

//     return (
//         <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
//             <TopBar/>

//             <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
//                  {/* LEFT */}
//                 <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
//                     <ProfileCard user={ user } />
//                 </div>

//                 {/* CENTER */}
//                 <div></div>
//                 {/* RIGHT */}
//                 <div></div>
//             </div>
//         </div>
//     );
// };

// export default TimerComponent;