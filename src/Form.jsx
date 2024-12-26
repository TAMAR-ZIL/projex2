import * as React from 'react';
import { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'
import { useState } from "react"
import { MapContainer, TileLayer, useMap,Popup ,Marker} from 'react-leaflet'
function SetViewOnChange({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);

  return null;
}
export default function Form() {
  let [data, setData] = useState([]);
  let [val, setVal] = useState("")
  let [lat, setLat] = useState(51.505);
  let [lon, setLone] = useState(-0.09)
    const findAddress = async (value) => {

  
    if (!value) {
      setData([])
      return;
    }
    const finalValue = value.replace(/\d+/g, "").trim();
    try {
      let respon = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${finalValue}&limit=5`)

      const result = await respon.json()
      setData(result);
    }
    catch (error) { console.log(error) }
  }
  return (
    <div className='form-container'>
    <Autocomplete
      disablePortal
      options={data}
      getOptionLabel={(option) => option.display_name || ""} 
      onInputChange={(event, newValue) => {
        setVal(newValue);
        findAddress(newValue); 
      }}
      onChange={(e,value)=>{
        if(value){
        setLat(parseFloat(value.lat));
        setLone(parseFloat(value.lon));
        }
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="הכנס כתובת" />}
    />
    <div className='map-wrapper'>
    <MapContainer className='map'  center={[lat, lon]} zoom={13} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <SetViewOnChange coords={[lat, lon]} />
  <Marker position={[lat,lon]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
</div>
    </div>
  );
}

