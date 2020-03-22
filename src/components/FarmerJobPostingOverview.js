import React from "react";
import {FarmerApplicationCard} from "./FarmerApplicationCard";

export const JobPosting = ( {jobPosting,jwt,reloadData}) => {

    const jobDetailFields = jobPosting && jobPosting.jobDetails.data.map(detail => {
        return (<span
            key={detail._id}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {detail.amountNeeded} {detail.positionNeeded}
      </span>)
    });

    const openApplications = jobPosting.applicants.data.filter((application) => application.status === "APPLIED").map(applicant => {
        return <FarmerApplicationCard {...applicant} reloadData={reloadData} jwt={jwt} key={applicant._id}/>
    });

    const declinedApplications = jobPosting.applicants.data.filter((application) => application.status === "DECLINED").map(applicant => {
        return <FarmerApplicationCard {...applicant}  reloadData={reloadData} jwt={jwt} key={applicant._id}/>
    });

    const acceptedApplications = jobPosting.applicants.data.filter((application) => application.status === "ACCEPTED").map(applicant => {
        return <FarmerApplicationCard {...applicant}  reloadData={reloadData} jwt={jwt} key={applicant._id}/>
    });
    return (
        <div className="ml-10">
            <h1 className="text-2xl ">Deine Stellenauschreibung</h1>
            <div className="mx-auto mr-10 bg-white p-4 rounded shadow flex flex-row-reverse ">
                <div className="w-1/2 p-2">
                    <img src={`https://maps.googleapis.com/maps/api/staticmap?zoom=8&size=600x300&maptype=roadmap
&markers=color:blue%7Clabel:Job%7C${jobPosting.jobContact.lat},${jobPosting.jobContact.lon}&key=AIzaSyB9lVI5qfcBinEFzOpwgm3QDIYu0TquZPE&v`} />
                </div>
                <div className="w-1/2 p-2">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="job-title">
                        Titel
                    </label>
                    <p id="job-title" className="text-gray-700 text-base my-2">
                        {jobPosting.title}
                    </p>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                           htmlFor="job-description">
                        Beschreibung
                    </label>
                    <p id="job-description" className="text-gray-700 text-base my-2">
                        {jobPosting.description}
                    </p>
                    <div className="text-sm mb-2 text-gray-800">
                        <i className="fas fa-map-marked-alt my-2 mr-2"/>
                        <span>{jobPosting.jobContact.address} </span>
                    </div>
                    {jobDetailFields}
                </div>
            </div>

            <h1 className="text-2xl mt-10 ">Bewerbungen auf Dein Gesuch</h1>
            <div className="mx-auto mr-10 bg-white p-4 rounded shadow flex">

                {((openApplications.length === 0) && (acceptedApplications.length === 0) && (declinedApplications.length === 0)) &&
                <div className="w-full">
                    <img className="w-1/12 m-auto" src="felden-werner-hero-v1.png"/>
                    <div className="w-1/2 m-auto text-center text-gray-600 text-sm mt-10">
                        Leider gibt es noch keine Bewerbungen auf deine Helden Position :( Aber bald werden sich schon die ersten Feldhelden melden
                    </div>
                </div>}
                <div className="w-full">
                    {openApplications.length > 0 && (<div className="ml-10">
                        <h2>Potentielle Feldhelden ({openApplications.length})</h2>
                        <div className="flex">
                            {openApplications}
                        </div>
                    </div>)}
                    {acceptedApplications.length > 0 && (<div className="ml-10">
                        <h2>Deine Feldhelden ({acceptedApplications.length})</h2>
                        <div className="flex">
                            {acceptedApplications}
                        </div>
                    </div>)}

                    {declinedApplications.length > 0 && (<div className="ml-10">
                        <h2>Abglehnte Bewerber ({declinedApplications.length})</h2><div className="flex">
                        {declinedApplications}</div>
                    </div>)}
                </div>
            </div>
        </div>

    );


}
