import { useEffect, useState } from "react"; // ייבוא React hooks לשימוש במצבים ותופעות לוואי
import { useForm } from "react-hook-form"; // ייבוא ספרייה לניהול טפסים
import TextField from "@mui/material/TextField"; // רכיב של MUI לטקסט אינטראקטיבי
import Autocomplete from "@mui/material/Autocomplete"; // רכיב של MUI לחיפוש עם השלמה אוטומטית
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet"; // רכיבים של React Leaflet למפות
import "./index.css"; // ייבוא קובץ CSS לעיצוב

// רכיב שמעדכן את המיקום של המפה בהתאם לקואורדינטות חדשות
function SetViewOnChange({ coords }) {
  const map = useMap(); // גישה לאובייקט המפה

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom()); // עדכון התצוגה למיקום חדש
      setTimeout(() => {
        map.invalidateSize(); // רענון גודל המפה כדי לוודא שהיא מוצגת כראוי
      }, 0);
    }
  }, [coords, map]); // עדכון רק אם המיקום או המפה משתנים

  return null; // רכיב זה אינו מציג דבר
}

export default function Form() {
  const {
    register, // פונקציה לרישום שדות הטופס
    handleSubmit, // פונקציה לטיפול בשליחה
    formState: { errors }, // גישה לשגיאות בטופס
  } = useForm(); // שימוש ב-react-hook-form

  const [data, setData] = useState([]); // מצב לשמירת תוצאות החיפוש
  const [val, setVal] = useState(""); // מצב לשמירת הערך של שדה החיפוש
  const [lat, setLat] = useState(null); // מצב לשמירת קו הרוחב
  const [lon, setLone] = useState(null); // מצב לשמירת קו האורך

  // פונקציה לחיפוש כתובות באמצעות Nominatim API
  const findAddress = async (value) => {
    if (!value) {
      setData([]); // אם הערך ריק, לא מציגים תוצאות
      return;
    }
    try {
      const respon = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}&limit=5`
      ); // שליחה ל-API לחיפוש כתובת
      const result = await respon.json(); // קבלת התוצאות כ-JSON
      setData(result); // עדכון מצב התוצאות
    } catch (error) {
      console.error(error); // טיפול בשגיאות במידה וישנן
    }
  };

  return (
    <div className="form-container"> {/* עטיפת הרכיב הראשי בעיצוב מותאם */}
      <form> {/* טופס להזנת פרטים */}
        <TextField
          label="Name" // תווית השדה
          variant="outlined" // סגנון המסגרת
          {...register("name", { required: "Name is required" })} // רישום השדה עם חוקי אימות
          error={!!errors.name} // הצגת שגיאה אם ישנה
          helperText={errors.name?.message} // טקסט עזרה לשדה אם יש שגיאה
        />
        <TextField
          label="Phone"
          type="number" // שדה מספר
          variant="outlined"
          {...register("phone", { required: "Phone is required" })}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        <TextField
          label="Email"
          type="email" // שדה אימייל
          variant="outlined"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* שדות סימון לאפשרויות שונות */}
        <div>
          <label>
            <input type="checkbox" {...register("internet")} /> Internet
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...register("kitchen")} /> Kitchen
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...register("coffeeBar")} /> Coffee Bar
          </label>
        </div>

        {/* שדה להזנת מספר חדרים */}
        <TextField
          label="Rooms"
          type="number"
          variant="outlined"
          {...register("room", { required: "Room is required" })}
          error={!!errors.room}
          helperText={errors.room?.message}
        />
        {/* שדה להזנת מספר מעברים */}
        <TextField
          label="Moving"
          type="number"
          variant="outlined"
          {...register("mooving", { required: "Moving is required" })}
          error={!!errors.mooving}
          helperText={errors.mooving?.message}
        />
      </form>

      {/* רכיב השלמה אוטומטית */}
      <div className="autocomplete-container">
        <Autocomplete
          disablePortal
          options={data} // אפשרויות החיפוש
          getOptionLabel={(option) => option.display_name || ""} // מה להציג בכל אפשרות
          onInputChange={(event, newValue) => {
            setVal(newValue); // עדכון הערך של שדה החיפוש
            findAddress(newValue); // חיפוש הכתובת
          }}
          onChange={(e, value) => {
            if (value) {
              setLat(parseFloat(value.lat)); // עדכון קו רוחב
              setLone(parseFloat(value.lon)); // עדכון קו אורך
            } else {
              setLat(null); // איפוס אם אין ערך
              setLone(null);
            }
          }}
          renderInput={(params) => <TextField {...params} label="Search Address" />}
        />
      </div>

      {/* הצגת מפה אם קיימים קו רוחב וקו אורך */}
      {lat && lon && (
        <div className="map-wrapper">
          <MapContainer className="map" center={[lat, lon]} zoom={15} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SetViewOnChange coords={[lat, lon]} /> {/* עדכון התצוגה במפה */}
            <Marker position={[lat, lon]} /> {/* הצבת סמן במיקום שנבחר */}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
