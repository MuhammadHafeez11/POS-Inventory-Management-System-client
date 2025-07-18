import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

// parent Card

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');

  const handleDropdownSelect = (value) => {
    console.log(value)
    setSelectedDropdownValue(value);
  };
  return (
    // <AnimateSharedLayout>
    <>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)}  onSelectDropdown={handleDropdownSelect}/>
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
      </>
    // </AnimateSharedLayout>
    
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className={`CompactCard param.color.background`}
      // style={{
      //   background: param.color.backGround,
      //   boxShadow: param.color.boxShadow,
      // }}
      // layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>Rs.&nbsp;{param.value}</span>
        <span>{param.duration}</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded  }) {

  console.log(param.date)
  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },

      dropShadow: {
        enabled: false,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.35,
      },

      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["white"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: param.date
      },
    },
  };

  return (
    <motion.div
      className={`ExpandedCard ${param.title}`}
      // style={{
      //   background: param.color.backGround,
      //   boxShadow: param.color.boxShadow,
      // }}
      // layoutId="expandableCard"
    >
        
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      
        <span>{param.title}</span>
      <div className="chartContainer">
    
        <Chart options={data.options} series={param.series} type="area" />
      </div>
      <span>{param.duration}</span>
    </motion.div>
  );
}

export default Card;
