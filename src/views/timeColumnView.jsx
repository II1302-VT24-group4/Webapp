import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default function TimeColumnView(props) {
    const calendarRef = useRef(null);
  
    useEffect(() => {
      const calendarEl = calendarRef.current;
      const newCalendar = new Calendar(calendarEl, {
          plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
          initialView: "timeGridDay",
          allDaySlot: false,
          dayHeaders: false,
          slotMinTime: "06:00:00", // Show slots starting from 6 AM
          slotMaxTime: "21:00:00", // Show slots until 9 PM
          aspectRatio: 0.5,
          eventDisplay: "none",
          slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false // Ensure 24-hour time format
          },
          headerToolbar: {
          left: "",
          center: "title",
          right: ""
          },
          viewDidMount: function(view) {
              const titleElement = calendarEl.querySelector('.fc-toolbar-title');
              if (titleElement) {
                  titleElement.textContent = "time";
              }
          }
      });
      newCalendar.setOption('height', 833);
      newCalendar.render();
  
      // Cleanup function to destroy the calendar when the component unmounts
      return () => {
        newCalendar.destroy();
      };
    }, []); // Empty dependency array to ensure the effect runs only once after component mounting
  
    return (
      <div style={{width: '100%'}}>
        <div ref={calendarRef} />
      </div>
    );
}
    