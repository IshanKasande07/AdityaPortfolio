"use client"

import React from 'react'
import { useState } from 'react';

const Contact = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");

    const [a, setA] = useState(true);

    const sendData = async (e : any) => {
        e.preventDefault();

        if(a){
            if(!name || !email || !company || !number || !message){
                alert("Please fill all the data.");
                return
            }

            const response = await fetch("https://monarchmediahousebackend.netlify.app/.netlify/functions/server/contactData", {
                method : "POST",
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify({ name, email, companyName : company, number, message })
            });

            console.log(response);

            if(response.status == 200){
                alert("Data sent");
                setName("");
                setEmail("");
                setNumber("");
                setCompany("");
                setMessage("");
            }else{
                alert("Backend Error");
            }

            setA(true)
        }
    }

  return (
    <div className='w-full page bg-white flex flex-col items-center justify-center z-60 gap-10 py-20 min-h-100vh'>
        <div className='w-[50vw] flex flex-col items-center justify-center text-center text-black mt-10'>
            <p className='text-[3.5vw] leading-tight'>Turn Your Expertise Into Influence</p>
            <p className='text-[1.3vw] text-gray-500'>Ready to build authority through education? Apply for a strategy call.</p>
        </div>
        <form className='w-[39vw] flex flex-col items-center justify-center gap-7 text-[1.1vw]'>
            <div className='flex flex-row gap-5 items-center justify-between w-full'>
                <div className='flex flex-col gap-2'>
                    <p className='text-black'>Name</p>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='John Doe' className='text-black px-2 py-2 border-gray-200 border-1'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='text-black'>Email</p>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='johndoe@gmail.com' className='text-black px-2 py-2 border-gray-200 border-1'/>
                </div>
            </div>
            <div className='flex flex-row gap-5 items-center justify-between w-full'>
                <div className='flex flex-col gap-2'>
                    <p className='text-black'>Company</p>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder='ABC' className='text-black px-2 py-2 border-gray-200 border-1'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='text-black'>Phone Number</p>
                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder='9999999999' className='text-black px-2 py-2 border-gray-200 border-1'/>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <p className='text-black'>Project Brief</p>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Tell us about your brand, audience and contenct goals ...' className='text-black px-2 py-2 border-gray-200 border-1 min-h-[15vh]'/>
            </div>
            <button type='submit' onClick={(e) => sendData(e)} className='group w-full py-5 px-9 text-[1.1vw] bg-black text-white hover:bg-black/80'>Apply For a Strategic Call <span className='ml-2 font-light transition-transform duration-300 inline-block group-hover:translate-x-3'>🡪</span></button>
            <p className='text-[1vw] text-gray-500'>We reply to all applications within 48 hours.</p>
        </form>
    </div>
  )
}

export default Contact
