import React from "react";
import './ApplicationList.css';
import ApplicationItem from "./ApplicationItem.jsx";
import Card from "../../shared/components/UIElements/Card";

function ApplicationList({ items }) {  
    if (!items || items.length === 0) {
        return (
            <div className="center">
                <Card><h2>No applications found.</h2></Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {items.map(app => (  
                <ApplicationItem 
                    key={app._id} 
                    id={app._id} 
                    fieldId={app.fieldId}
                    owner={app.owner}
                    address={app.address}
                    crop={app.crop}
                    status={app.status}
                />
            ))}
        </ul>
    );
}

export default ApplicationList;
