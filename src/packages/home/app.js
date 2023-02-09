import React from "react";

import image from './assets/images/banner_bg_1.png'
import './assets/styles/styles.scss'
import './assets/styles/test.css'

import test from "../../utils/test";

export default () => (
  <div>
    <h1 className="title">this is page1!!!</h1>
    <img src={image} />
    <div><button onClick={test}>test</button></div>
  </div>
)