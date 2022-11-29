import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export function RangepickerComponent({ datesChanged }) {

  function onOpenChange(open) {
    // console.log("onOpenChange", open);
  }

  function onCalendarChange(dates) {
    datesChanged(dates);
  }

  return (
    <div>
      <RangePicker
        onOpenChange={onOpenChange}
        onCalendarChange={onCalendarChange}
      />
    </div>
  );
};