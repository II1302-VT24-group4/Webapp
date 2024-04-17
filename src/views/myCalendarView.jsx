import React, { useRef, useEffect } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

export default function MyCalendarView(props) {
  const calendarRef = useRef(null);

  function createEvent(calendar, title, fullDay, startDate, endDate, date){
    if(fullDay){
      calendar.addEvent({
        title: title,
        allDay: fullDay, // Ensure the event is treated as a timed event
        start: date
      });
    }
    else{
      calendar.addEvent({
        title: title,
        start: startDate,
        end: endDate,
        allDay: fullDay // Ensure the event is treated as a timed event
      });
    }

    // Rerender the calendar to display the new event
    calendar.render();
  }

  function convertTime(info, time){
    var date = new Date(info.startStr);
    var [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes);
    return date;
  }

  useEffect(() => {
    const calendarEl = calendarRef.current;
    const calendar = new Calendar(calendarEl, {  
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      selectable: true, // Enable selection
      select: function(info) {
        var title = prompt('Enter event title:');
        const fullDayInput = prompt('Enter true if it goes on all day or false otherwise');
        const fullDay = fullDayInput.toLowerCase() === 'true';
        var startDate, endDate = null;
        if(fullDay != true){
          var startTime = prompt('Enter start time (e.g., 13:00):');
          var endTime = prompt('Enter end time (e.g., 15:00):');
          startDate = convertTime(info, startTime);
          endDate = convertTime(info, endTime);
        }
        else{
          var date = prompt('Enter date for the full day event (e.g., 2024-04-16):')
        }

        console.log("title " + title + ", start " + startTime + ", end " + endTime + ", allDay " + fullDay + ", date" + date)

        if (title && ((startTime && endTime) || (fullDay && date))) {
          createEvent(calendar, title, fullDay, startDate, endDate, date);
        }
      },
      forceEventDuration: true, // Ensure events are displayed even without an end time
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      }
    });
    calendar.render();

    // Cleanup function to destroy the calendar when the component unmounts
    return () => {
      calendar.destroy();
    };
  }, []); // Empty dependency array to ensure the effect runs only once after component mounting

  return <div ref={calendarRef} />;
}
