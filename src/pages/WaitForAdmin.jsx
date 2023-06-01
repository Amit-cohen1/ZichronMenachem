import React from "react";
import { Link } from 'react-router-dom';

const WaitForAdmin = () => {
    return (
    <div className="container1">
      <h2>ההרשמה בוצעה בהצלחה! המתן לאישור מנהל</h2>
      <p><Link to='/login'>מעבר לעמוד התחברות</Link></p>
    </div>
  );
};

export default WaitForAdmin;