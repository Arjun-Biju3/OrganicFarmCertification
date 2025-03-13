import React, { useEffect, useState, useContext } from 'react';
import ApplicationList from '../components/ApplicationList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/AuthContext';
import SearchBar from '../../shared/components/FormElements/SearchBar';

function Applications() {
    const { isLoading, sendRequest, error, clearError } = useHttpClient();
    const [loadedApplications, setLoadedApplications] = useState([]); 
    const [searchResult, setSearchResult] = useState(null);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/inspector/applications/all",
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

    const handleSearch = async (searchTerm) => {
        console.log("Searched Farm ID:", searchTerm);
        if (!searchTerm) {
            setSearchResult(null); 
            return;
        }
        try {
            const responseData = await sendRequest(
                `http://localhost:5000/api/inspector/searchResult/${searchTerm}`,
                'GET',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            setSearchResult(responseData.application);
            console.log("Search Result:", responseData.application);
        } catch (error) {
            console.error('Error fetching search result:', error);
            setSearchResult(null);
        }
    };

    return (
        <React.Fragment>
            {/* <ErrorModal error={error} onClear={clearError} /> */}
            <SearchBar onSearch={handleSearch} />

            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}

            {!isLoading && searchResult ? (
                <ApplicationList items={[searchResult]} />
            ) : (
                !isLoading && loadedApplications.length > 0 ? (
                    <ApplicationList items={loadedApplications} />
                ) : (
                    !isLoading && <p>No applications found.</p>
                )
            )}
        </React.Fragment>
    );
}

export default Applications;
