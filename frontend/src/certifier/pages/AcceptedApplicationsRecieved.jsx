import React, { useEffect, useState, useContext } from 'react';
import ApplicationList from '../components/ApplicationList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/AuthContext';

function Applications() {
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [loadedApplications, setLoadedApplications] = useState([]); 
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const responseData = await sendRequest(
                    "https://organicfarmcertification.onrender.com/api/certifier/applications/all",  
                    'GET', 
                    null, 
                    { 
                        'Content-Type': 'application/json', 
                        Authorization: 'Bearer ' + auth.token 
                    }
                );
                setLoadedApplications(responseData.applications || []);  
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        if (auth.token) {
            fetchApplications(); 
        }
    }, [sendRequest, auth.token]); 

    return (
        <React.Fragment>
            {/* <ErrorModal error={error} onClear={clearError} /> */}
            

            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            
            {!isLoading && loadedApplications.length > 0 ? (
                <ApplicationList items={loadedApplications} />
            ) : (
                !isLoading && <p>No applications found.</p>
            )}
        </React.Fragment>
    );
}

export default Applications;
