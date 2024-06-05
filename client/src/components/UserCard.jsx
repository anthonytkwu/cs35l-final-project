import React from "react";
import emptyPFP from "../assets/userprofile.png"

const UserCard = ({ _username }) => {
    const username = _username ? _username : "NO NAME";
    return (
        <div className="user-card-style bg-bgColor mb-1"> 
            <img 
                src={emptyPFP} 
                alt="emptyPFP" 
                className="p-[2.5%] h-full rounded-full"/>
            <div className="flex items-center h-full">
                <div className="font-medium text-[rgb(var(--color-ascent1))]">{username}</div>
            </div>
        </div>
    );
}

export default UserCard;