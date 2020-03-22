import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';

export const ApplicationCard = (props) => {
    console.log(props);
    return (
        <div className="w-1/2 p-2">
            <div className="rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="font-bold text-2xl mb-2 mr-2">  {props.status}</div>
                    <div className="font-bold text-2xl mb-2 mr-2">Bewerbung für "{props.position}"</div>
                    <p className="text-gray-700 text-base my-2">
                        {props.info}
                    </p>
                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-map-marked-alt my-2 mr-2"/>
                        <span>TODO </span>
                    </div>

                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-mail-bulk my-2 mr-2"/>
                        <span>TODO </span>
                    </div>
                    <div className="text-xl mb-2 font-semibold">
                        TODO
                    </div>
                    <div className="text-sm">
                        TODO
                    </div>
                </div>
            </div>
        </div>
    )
}
