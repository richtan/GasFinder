import axios from "axios";

export default async function handler(req, res) {
  let location = req.query.location
  axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
    params: {
      location: location,
      radius: 1500,
      type: "gas_station",
      opennow: true,
      key: process.env.MAPS_API_KEY
    }
  }).then(r => {
    res.status(200).send(r.data)
  }).catch(e => {
    console.log(e);
  })
}
