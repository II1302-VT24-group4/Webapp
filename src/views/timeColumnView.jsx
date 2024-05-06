import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export default function TimeColumnView(props) {
    const calendarRef = useRef(null);
    const [calendar, setCalendar] = useState(null);
    const [currentDate, setCurrentDate] = useState(0);

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
        slotDuration: '01:00:00',
        headerToolbar: {
        left: "",
        center: "title",
        right: ""
        },
        viewDidMount: function(view) {
            const titleElement = calendarEl.querySelector('.fc-toolbar-title');
            if (titleElement) {
              titleElement.style.fontSize = "30px";
              titleElement.style.height = "124px";
              titleElement.style.lineHeight = "30px";
            }
            const slotElements = calendarEl.querySelectorAll('tr');
            slotElements.forEach(slot => {
              slot.style.height = '50px'; // Adjust the height as needed
            });
        }
      });
      newCalendar.setOption('height', 917);
      setCalendar(newCalendar);
      newCalendar.render();
  
      // Cleanup function to destroy the calendar when the component unmounts
      return () => {
        newCalendar.destroy();
      };
    }, []); // Empty dependency array to ensure the effect runs only once after component mounting
  
    // Change day
    useEffect(() => {
      if(calendar){
        const newDate = new Date(calendar.getDate());
        if (props.date > currentDate) {
          newDate.setDate(newDate.getDate() + 1);
          calendar.gotoDate(newDate);
        }
        else if(props.date < currentDate){
          newDate.setDate(newDate.getDate() - 1);
          calendar.gotoDate(newDate);
        }
        setCurrentDate(props.date);
      }
    }, [props.date]);

    return (
      <div style={{width: '47px'}}>
        <div ref={calendarRef} />
      </div>
    );
}
    