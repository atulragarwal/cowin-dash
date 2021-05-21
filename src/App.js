import './App.css';
import React from 'react';

const d = new Date();

const dist_endpoint = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/';

const cen_endpoint = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=';

function App() {

  const [stateName, setStates] = React.useState([]);

  const [selState, setState] = React.useState('');

  const [selDist, setSelDist] = React.useState('0');

  const [distUrl, setDistUrl] = React.useState(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/0`);

  const [cenUrl, setCenUrl] = React.useState(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=0&date=21-05-2021`);

  const [distName, setDist] = React.useState([]);

  const [cenName, setCen] = React.useState([]);

  const [getDist, setGetDist] = React.useState(true);

  const [getCen, setGetCen] = React.useState(true);

  const handleState = event =>{
    setState(event.target.value);
  };

  const handleDist = event =>{
    setSelDist(event.target.value);
  }

  React.useEffect(() => {
    setDistUrl(`${dist_endpoint}${selState}`);
  },[selState]);

  React.useEffect(() =>{
    console.log(`${cen_endpoint}${selDist}&date=${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`);
    setCenUrl(`${cen_endpoint}${selDist}&date=${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`);
  },[selDist]);

  React.useEffect(() =>{
    fetch(cenUrl)
    .then(response => response.json())
    .then(result =>
      {
        console.log(result.sessions);
        setCen(result.sessions);
        setGetCen(false);
      })
    .catch(() => console.log('Error'));
  },[cenUrl]);

  React.useEffect(() => {
    setGetDist(true);
    fetch(distUrl)
    .then(response => response.json())
    .then(result =>
      {
        setDist(result.districts);
        setGetDist(false);
      });
  },[distUrl]);

  React.useEffect(() => {
    fetch('https://cdn-api.co-vin.in/api/v2/admin/location/states')
    .then(response => response.json())
    .then(result =>
      {
        setStates(result.states);
      });
  },[]);
  return (
    <div>
      <div className="home-nav">
        <h3>CoWin Slot Checker</h3>
        <a href="https://www.cowin.gov.in/home">CoWin Home</a>
      </div>
      <div className="sel-body">
        <h4>Search For Vaccine Availability in Districts</h4>
        <div className="sel-tag">
        <StateList statesLoc = {stateName} onStateChange = {handleState}/>
        {getDist ? (
          <p>Waiting For State</p>
          ) : (
          <Districts distLoc = {distName} onDistChange = {handleDist}/>
        )}
        </div>
      </div>
      <div className="table-bod">
        {getCen ? (
          <p>Getting Centers...</p>
        ) : (
          <Center cenLoc = {cenName}/>
        )}
      </div>
    </div>
  );
};

const Center = ({cenLoc}) =>{
  return(
    <div>
      <table>
        <thead>
        <tr>
          <th className="tab-col-1">Name</th>
          <th className="tab-col-2">Capacity</th>
          <th className="tab-col-3">Age Group</th>
          <th className="tab-col-4">Vaccine</th>
          <th className="tab-col-5">Fee</th>
          <th className="tab-col-6">Address</th>
          <th className="tab-col-7">PinCode</th>
        </tr>
        </thead>
        <tbody>
          {cenLoc.map(centre =>
            (
              <tr>
                {centre.available_capacity>0 ? (
                  <>
                <td className="tab-col-1">{centre.name}</td>
                <td className="tab-col-2">{centre.available_capacity}</td>
                <td className="tab-col-3">{centre.min_age_limit}</td>
                <td className="tab-col-4">{centre.vaccine}</td>
                <td className="tab-col-5">{centre.fee}</td>
                <td className="tab-col-6">{centre.address}</td>
                <td className="tab-col-7">{centre.pincode}</td> </>): ("")}
              </tr>
            ))}
        </tbody>

      </table>
    </div>
  )
};

const Districts = ({distLoc, onDistChange}) =>{
  return(
    <div>
      <select onChange = {onDistChange}>
        <option>Select District</option>
        {distLoc.map(dName =>
          (
            <option key = {dName.district_id} value = {dName.district_id}>{dName.district_name}</option>
          ))}
      </select>
    </div>
  );
};

const StateList = ({statesLoc, onStateChange}) => {

  return(
    <div>
      <select onChange ={onStateChange} >
        <option>Select State</option>
        {statesLoc.map(sName =>
          (
            <option key={sName.state_id} value={sName.state_id}>{sName.state_name}</option>
          ))}
      </select>
    </div>
  );
};

export default App;