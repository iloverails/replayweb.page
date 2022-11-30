import React, {useEffect, useState} from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

// eslint-disable-next-line react/prop-types
export function RangepickerComponent({ datesChanged }) {

  const [dates, setDates] = useState([]);

  function onOpenChange(open) {
  }

  useEffect(()=> {
    datesChanged(dates);
  }, [dates]);

  function onCalendarChange(values) {
    setDates(values ? values : []);
  }

  return (
    <div>
      <RangePicker
        onOpenChange={onOpenChange}
        onCalendarChange={onCalendarChange}
        value={dates}
      />
    </div>
  );
}