import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';

export const FarmerApplicationCard = (props,jwt) => {
    console.log(jwt)
    return (
        <div className="w-1/3 p-2">
            <div className="rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="flex justify-between flex-row">
                        <div className="font-bold text-xl m-2 ">
                          Bewerbung für "{props.position}"
                        </div>
                        {props.status === "APPLIED" && <div className="font-bold text-sm bg-yellow-400 rounded py-2 px-2 self-start"> {props.status}</div>}
                        {props.status === "DECLINED" && <div className="font-bold text-sm bg-red-400 rounded py-2 px-2 self-start"> {props.status}</div>}
                        {props.status === "ACCEPTED" && <div className="font-bold text-sm bg-green-400 rounded py-2 px-2 self-start"> {props.status}</div>}
                    </div>
                    <p className="text-gray-700 text-base my-2">
                        {props.info}
                    </p>

                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-person-booth my-2 mr-2"/>
                        <span> {props.applicant.firstName && `${props.applicant.firstName} ${props.applicant.lastName}`} </span>
                    </div>

                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-mail-bulk my-2 mr-2"/>
                        <span> {props.applicant.email && props.applicant.email} </span>
                    </div>
                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-phone-alt my-2 mr-2"/>
                        <span> {props.applicant.phone && props.applicant.phone} </span>
                    </div>

                    <div>
                        TODO Accept decline button
                    </div>

                    <p className="text-gray-700 text-sm my-2">
                        Bitte kontaktieren Sie den Feldhelden direkt nachdem Sie den Feldhelden akzeptiert haben.
                    </p>
                </div>
            </div>
        </div>
    )
}
