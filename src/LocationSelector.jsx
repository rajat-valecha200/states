import React, { useState, useEffect } from 'react';
import './LocationSelector.css';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [message, setMessage] = useState('');
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch all countries on component mount
  useEffect(() => {
    fetch('https://crio-location-selector.onrender.com/countries')
      .then(response => response.json())
      .then(data => {
        setCountries(data || []);
        setIsLoadingCountries(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setIsLoadingCountries(false);
      });
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      setIsLoadingStates(true);
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then(response => response.json())
        .then(data => {
          setStates(data || []);
          setIsLoadingStates(false);
        })
        .catch(error => {
          console.error('Error fetching states:', error);
          setIsLoadingStates(false);
        });
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setIsLoadingCities(true);
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then(response => response.json())
        .then(data => {
          setCities(data || []);
          setIsLoadingCities(false);
        })
        .catch(error => {
          console.error('Error fetching cities:', error);
          setIsLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    setMessage('');
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity('');
    setCities([]);
    setMessage('');
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setMessage(`You selected ${event.target.value}, ${selectedState}, ${selectedCountry}`);
  };

  return (
    <div className="location-selector">
      <h1>Select Location</h1>
      <div className="selectors">
        <select className="big-selector" value={selectedCountry} onChange={handleCountryChange}>
          <option value="" disabled>Select Country</option>
          {isLoadingCountries ? (
            <option>Loading...</option>
          ) : (
            countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))
          )}
        </select>
        <select className="small-selector" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="" disabled>Select State</option>
          {isLoadingStates ? (
            <option>Loading...</option>
          ) : (
            states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))
          )}
        </select>
        <select className="small-selector" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="" disabled>Select City</option>
          {isLoadingCities ? (
            <option>Loading...</option>
          ) : (
            cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))
          )}
        </select>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LocationSelector;
