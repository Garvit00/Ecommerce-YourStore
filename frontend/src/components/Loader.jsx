import { Spinner } from "react-bootstrap";

import React from 'react'

const Loader = () => {
  return (
    <Spinner 
    animation="border"
    role="status"
    style={{
        width:"3vw",
        height:"3vw",
        margin:"auto",
        display:"block",
    }}
    ></Spinner>
  );
};

export default Loader;