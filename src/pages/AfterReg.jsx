import React from "react";
import { Link } from 'react-router-dom';

const AfterReg = () => {
    return (
    <div>
      <h2>תודה שנרשמת! בבקשה אשר את המייל שנשלח אלייך ועבור לעמוד התחברות</h2>
      <p><Link to='/login'>מעבר לעמוד התחברות</Link></p>
    </div>
  );
};

export default AfterReg;