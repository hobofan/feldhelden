import React from "react";
import {FarmerApplicationCard} from "./FarmerApplicationCard";

export const JobPosting = ({jobPosting}) => {
    const jobDetailFields = jobPosting && jobPosting.jobDetails.data.map(detail => {
        return (<span
            key={detail._id}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          {detail.amountNeeded} {detail.positionNeeded}
      </span>)
    });

    console.log(jobPosting);
    const openApplications = jobPosting.applicants.data.map(applicant => {
        return <FarmerApplicationCard {...applicant} key={applicant._id}/>
    })

    return (
        <div class="mx-auto ml-10">
            <h2>Deine Ausschreibung</h2>
            <div className="ml-10">
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
            <h2>Offene Bewerbungen ({jobPosting.applicants.data.length})</h2>
            <div className="ml-10">
                {openApplications}
            </div>
        </div>
    );


}
