import React, {useState} from 'react';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '20%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export const JobsCard = (props) => {


    const [modalIsOpen,setIsOpen] = useState(false)

    function openModal() {
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }

    const jobDetailFields =  props && props.jobDetails.data.map(detail => {
        return (<span
            key={detail._id}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            {detail.amountNeeded} {detail.positionNeeded}
        </span>)
    });



    return (
        <div className="w-2/6 p-2">

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="container w-full">
                    <div className="font-bold text-2xl mb-2 mr-2">{props.title}</div>

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
                        <span>{props.jobContact.city}  {props.jobContact.street}  {props.jobContact.streetNumber} </span>
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