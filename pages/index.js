import axios from 'axios';
import Head from 'next/head'
import {useState, useEffect} from 'react'

export default function Home() {
  const [location, setLocation] = useState('')
  const [gasStations, setGasStations] = useState([])

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.get('http://localhost:3000/api/get', {
      params: {
        "location": location,
      }
    }).then(res => {
      console.log(res.data.results)
      setGasStations(res.data.results)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleChange = e => {
    setLocation(e.target.value)
  }

  const setCurrentLocation = pos => {
    var crd = pos.coords
    setLocation(crd.latitude + "," + crd.longitude)
  }

  function errors(err) { }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(setCurrentLocation);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(setCurrentLocation, errors, options);
          } else if (result.state === "denied") { }
        });
    }
  }, [])

  function distance(lat1,
    lat2, lon1, lon2)
  {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
  }

  return (
    <div>
      <Head>
        <title>GasFinder</title>
        <meta name="description" content="Find a gas station near you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-center">GasFinder</h1>
      <hr />
      <form className="form-inline row" onSubmit={handleSubmit}>
        <label htmlFor="locationInput" className="col-2 text-center my-2 display-6"><b>Location</b></label>
        <input type="text" className="col-8" id="locationInput" value={location} onChange={handleChange} />
        <button type="submit" className="btn btn-primary col-2"><b>Submit</b></button>
      </form>
      <hr />
      {
        gasStations.map(gasStation =>
          <div className="text-center">
            <div><b>{gasStation.name}</b></div>
            <div>{distance(location.split(',')[0], gasStation.geometry.location.lat, location.split(',')[1], gasStation.geometry.location.lng).toFixed(3)} km away</div>
            <div>{gasStation.vicinity}</div>
            <div>Ratings: {gasStation.rating}</div>
            <hr />
          </div>
        )
      }
    </div>
  )
}
