import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export const RangepickerComponent = function (props) {

  function onOpenChange(open) {
    console.log("onOpenChange", open);
  }

  function onCalendarChange(dates) {
    console.log("onCalendarChange", dates);
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