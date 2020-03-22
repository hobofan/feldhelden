import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import * as api from "../api";

const APPLICATION_STATUS_TRANSLATIONS = {
    "APPLIED": "Neu",
    "DECLINED": "Abgelehnt",
    "ACCEPTED": "Angenommen"
}

export const FarmerApplicationCard = (props) => {

    console.log(props)
    const handle = (bla, evt) => {
        evt.preventDefault();
        const content = {
            newApplication: {
                status: "TODO",
                position: props.position,
                info: props.info}
        };

        api.updateJobApplicationFarmer(props.jwt, content).then((responseData) => {
            console.log("Job posting geupdated");
        }).catch((test) => {
            console.log("failed to update the job posting")
        });
    };

    const handleDecline = (evt) => handle("DECLINED", evt);
    const handleAccept = (evt) => handle("ACCEPTED", evt);

    return (
        <div className="w-1/3 p-2">
            <div className="rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="flex justify-between flex-row">
                        <div className="font-bold text-xl m-2 ">
                            Bewerbung für "{props.position}"
                        </div>
                        {props.status === "APPLIED" && <div
                            className="font-bold text-sm bg-yellow-400 rounded py-2 px-2 self-start"> {APPLICATION_STATUS_TRANSLATIONS[props.status]}</div>}
                        {props.status === "DECLINED" && <div
                            className="font-bold text-sm bg-red-400 rounded py-2 px-2 self-start"> {APPLICATION_STATUS_TRANSLATIONS[props.status]}</div>}
                        {props.status === "ACCEPTED" && <div
                            className="font-bold text-sm bg-green-400 rounded py-2 px-2 self-start"> {APPLICATION_STATUS_TRANSLATIONS[props.status]}</div>}
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

                    <div className="flex">
                        <div className="w-1/2 p-2">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                                onClick={handleAccept}
                            >
                                Bewerber annehmen
                            </button>
                        </div>
                        <div className="w-1/2 p-2">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                                onClick={handleDecline}
                            >
                                Bewerber ablehnen
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm my-2">
                        Bitte kontaktieren Sie den Feldhelden direkt nachdem Sie den Feldhelden akzeptiert haben.
                    </p>
                </div>
            </div>
        </div>
    )
}
