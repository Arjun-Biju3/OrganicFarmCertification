import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/AuthContext';
import './ApplicationItem.css';

const ApplicationItem = (props) => {
  const auth = useContext(AuthContext); 

  console.log(props);
  
  const userRoute = `/inspector/${props.id}/applicationDetails`;

  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={userRoute}>
          <div className={`user-item__status ${props.status.toLowerCase()}`}>
            {props.status[0]}
          </div>

          <div className="user-item__info">
            <h2>Field ID: {props.fieldId}</h2>
            <h3>Owner: {props.owner}</h3>
            <h3>Crop: {props.crop}</h3>
            <h3>Address: {props.address}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default ApplicationItem;
