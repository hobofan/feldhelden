import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import {useInput} from "../hooks/input-hook";
import * as api from "../api";
import {useAuth0} from "../react-auth0-spa";

const customStyles = {
    content : {
        top                   : '40%',
        left                  : '40%',
        right                 : '40%',
        bottom                : 'auto',
        marginRight           : '-20%',
        transform             : 'translate(-40%, -40%)',
        overflow              : 'scroll'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export const JobsCard = (props) => {
    const {isAuthenticated, getIdTokenClaims,user,loading} = useAuth0();
    const [modalIsOpen,setIsOpen] = useState(false);

    const [jwt, setJwt] = useState();
    const [successModalIsOpen,setSuccessModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const [appliedPosition, setAppliedPosition] = useState();

    const {value: info, bind: bindInfo} = useInput('');

    function openModal() {
        setIsOpen(true);
    }
    function closeModal(){
        setIsOpen(false);
    }

    function openSuccessModal() {
        setSuccessModalIsOpen(true);
    }
    function closeSuccessModal(){
        setSuccessModalIsOpen(false);
    }

    useEffect(() => {
        if (!isAuthenticated || jwt) {
            return;
        }
        async function fetch() {
            const newJwt = (await getIdTokenClaims()).__raw;
            if (jwt) {
                return;
            }
            setJwt(newJwt);
        }
        fetch();
    }, [isAuthenticated, getIdTokenClaims, setJwt, jwt]);

    const handleSubmit = (evt) => {
        evt.preventDefault();

        const requestData = {
            jobApplication: {
                position: appliedPosition,
                info: info
            },
            jobPosting: {
                _id: props._id
            }
        };
        console.log(requestData);
        api.postJobApplication(jwt,requestData).then((responseData)=> {
            closeModal();
            openSuccessModal()
        }).catch((error)=>{
            setError("Registrierung fehlgeschlagen bitte probiere es nochmal!");
        });

    };
    const jobDetailFields =  props && props.jobDetails.data.map(detail => {
        return (<span
            key={detail._id}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {detail.amountNeeded} {detail.positionNeeded}
        </span>)
    });

    if( props && props.jobDetails.data && !appliedPosition){
        setAppliedPosition( props && props.jobDetails.data[0].positionNeeded)
    }

    return (
        <div className="w-2/6 p-2">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Bewerbungs Modal"
            >
                <div className="container w-full">
                    <div className="font-bold text-2xl mb-2 ">Bewerbung für "{props.title}"</div>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="email">
                                Deine Qualifikationen
                            </label>
                            <textarea
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="email"
                                type="text"
                                placeholder="Deine Bewerbung hier"
                                {...bindInfo}/>
                        </div>

                        <div className="w-full">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="email">
                                Welche Art von Feldheld möchtest du werden?
                            </label>
                            <select
                                value={appliedPosition}
                                onChange={(event => {
                                setAppliedPosition(event.target.value)
                            })}>
                                { (props && props.jobDetails) && props.jobDetails.data.map(detail => {
                                    return(<option key={detail.positionNeeded} value={detail.positionNeeded}>
                                        {detail.positionNeeded}
                                    </option>)
                                })}
                            </select>
                        </div>
                        <div className="w-full mx-auto my-5">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Jetzt Feldheld werden!
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>


            <Modal
                isOpen={successModalIsOpen}
                onRequestClose={closeSuccessModal}
                style={customStyles}
                contentLabel="Success Modal"
            >
                <div className="container w-full">
                        <div className="font-bold text-2xl mb-2 ">Dank dir du bist unser Feldheld!</div>
                        <div className="font-bold text-sm mb-2 ">Der Landwirt hat deine Anfrage erhalten und wird dich kontaktieren!</div>
                        <div className="w-full mx-auto">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={closeSuccessModal}>
                                Dank dir!
                            </button>
                        </div>
                </div>
            </Modal>
            <div className="rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <div className="font-bold text-2xl mb-2 mr-2">{props.title}</div>
                    <p className="text-gray-700 text-base my-2">
                       {props.description}
                    </p>
                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-map-marked-alt my-2 mr-2"/>
                        <span>{props.jobContact.address} </span>
                    </div>

                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-mail-bulk my-2 mr-2"/>
                        <span>{props.jobOwner.email} </span>
                    </div>
                    <div className="text-xl mb-2 font-semibold">
                        Gesuchte Feldhelden
                    </div>
                    <div className="text-sm">
                        {jobDetailFields}
                    </div>
                </div>

                <div className="px-6 py-2 my-2 w-full">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={openModal}
                    >
                        Ja den will ich!
                    </button>
                </div>
            </div>
        </div>
    )
}