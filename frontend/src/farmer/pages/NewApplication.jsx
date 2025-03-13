import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewApplication.css';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/FormHook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/AuthContext';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Map from '../../shared/components/UIElements/Map';

function NewApplication() {
  const auth = useContext(AuthContext);
  const { sendRequest, error, clearError, isLoading } = useHttpClient();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [formState, inputHandler] = useForm(
    {
      fieldId: { value: '', isValid: false },
      owner: { value: '', isValid: false },
      address: { value: '', isValid: false },
      requirement: { value: '', isValid: false },
      standard: { value: '', isValid: false },
      crop: { value: '', isValid: false },
      extent: { value: '', isValid: false },
      previousCropMeasures: { value: '', isValid: false },
      seed: { value: '', isValid: false },
      protect: { value: '', isValid: false },
      soilType: { value: '', isValid: false },
      manure: { value: '', isValid: false }
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!selectedLocation) {
      alert("Please select a location on the map.");
      return;
    }

    const applicationData = {
      fieldId: formState.inputs.fieldId.value,
      owner: formState.inputs.owner.value,
      address: formState.inputs.address.value,
      requirement: formState.inputs.requirement.value,
      standard: formState.inputs.standard.value,
      crop: formState.inputs.crop.value,
      extent: formState.inputs.extent.value,
      previousCropMeasures: formState.inputs.previousCropMeasures.value,
      seed: formState.inputs.seed.value,
      protect: formState.inputs.protect.value,
      soilType: formState.inputs.soilType.value,
      manure: formState.inputs.manure.value,
      place: selectedLocation,  
    };

    console.log("Submitting Application:", applicationData);

    try {
      await sendRequest(
        'http://localhost:5000/api/users/application/new', 
        'POST',
        JSON.stringify(applicationData),
        { 
          'Content-Type': 'application/json', 
          Authorization: 'Bearer ' + auth.token 
        }
      );
      navigate('/');
    } catch (error) {
      console.error("Application submission failed:", error);
    }
  };

  const mapClickHandler = (coords) => {
    setSelectedLocation(coords);
    console.log('Selected Coordinates:', coords);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form onSubmit={submitHandler} className="place-form">
        {isLoading && <LoadingSpinner asOverlay />}

        <Input id="fieldId" element="input" label="Field ID" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter a valid Field ID." />
        <Input id="owner" element="input" label="Owner Name" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter owner name." />
        <Input id="address" label="Address" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter address." />
        <Input id="requirement" element="input" label="Purpose of Certification" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter purpose." />
        <Input id="standard" element="input" label="Certification Standard" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter certification standard." />
        <Input id="crop" label="Crop Type" element="input" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter crop type." />
        <Input id="extent" element="input" label="Extent of Growth" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter extent of growth." />
        <Input id="previousCropMeasures" element="input" label="Previous Crop Measures" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter previous crop measures." />
        <Input id="seed" label="Seed Source" element="input" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter seed source." />
        <Input id="protect" label="Protection Methods" element="input" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter protection methods." />
        <Input id="soilType" element="input" label="Soil Type" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter soil type." />
        <Input id="manure" label="Manure Source" element="input" validators={[VALIDATOR_REQUIRE()]} onInput={inputHandler} errorText="Enter manure source." />

        <div  className="map-container">
          <h3>Click on the map to select a location</h3>
          <Map onClick={mapClickHandler} center={{ lat: 8.5241, lng: 76.9366 }} zoom={16} style={{ width: '100%', height: '100%' }} />
          {selectedLocation && <p>Selected Coordinates: {selectedLocation.lat}, {selectedLocation.lng}</p>}
        </div>
        <br />
        <Button type="submit" disabled={!formState.isValid}>Submit Application</Button>
      </form>
    </React.Fragment>
  );
}

export default NewApplication;
