import React, { useRef, useEffect, useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from 'reactjs-popup';

export default function MyCalendarView(props) {
  const calendarRef = useRef(null);
  const [calendar, setCalendar] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);

  function createEvent(calendar, title, allDay, startDate, endDate){
    //console.log(calendar, title, allDay, startDate, endDate);
    if(allDay){
      calendar.addEvent({
        title: title,
        allDay: allDay,
        start: startDate
      });
    }
    else{
      calendar.addEvent({
        title: title,
        allDay: allDay,
        start: startDate,
        end: endDate
      });
    }
    // Rerender the calendar to display the new event
    calendar.render();
  }

  const handleSaveEvent = () => {
    createEvent(
      calendar,
      eventTitle,
      allDay,
      convertTime(selectedInfo, startTime),
      convertTime(selectedInfo, endTime)
    );
    setSelectedInfo(null); // Close the popup after saving the event
  };

  function convertTime(info, time){
    var date = new Date(info.startStr);
    var [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours, minutes);
    return date;
  }

  useEffect(() => {
    const calendarEl = calendarRef.current;
    const newCalendar = new Calendar(calendarEl, {  
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      selectable: true, // Enable selection
      select: function(info) {
        setSelectedInfo(info);
      },
      forceEventDuration: true, // Ensure events are displayed even without an end time
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      }
    });
    newCalendar.render();
    setCalendar(newCalendar); // Set the calendar instance in the state

    // Cleanup function to destroy the calendar when the component unmounts
    return () => {
      newCalendar.destroy();
    };
  }, []); // Empty dependency array to ensure the effect runs only once after component mounting

  // Initialize startTime and endTime with the times from selectedInfo, if available
  useEffect(() => {
    if (selectedInfo) {
      const startTimeStr = selectedInfo.startStr.split('T')[1].substring(0, 5); // Extracting time part from ISO string
      setStartTime(startTimeStr);
  
      // Calculate default end time as start time + 1 hour
      const endTimeStr = new Date(selectedInfo.startStr);
      endTimeStr.setHours(endTimeStr.getHours() + 1);
      setEndTime(`${endTimeStr.getHours().toString().padStart(2, '0')}:${endTimeStr.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [selectedInfo]);

  return (
    <div>
      <div ref={calendarRef} />
      {selectedInfo && (
        <Popup
          open={selectedInfo !== null}
          onClose={() => {
            setSelectedInfo(null);
            setEventTitle(''); // Reset event title input
            setAllDay(false); // Reset all day checkbox
          }}
          modal
          closeOnDocumentClick
        >
          <div style={{ padding: '20px', background: 'white', borderRadius: '5px' }}>
            <h2 style={{ marginBottom: '10px' }}>Create Event</h2>
            <input 
              type="text" 
              placeholder="Event Title" 
              style={{ marginBottom: '10px', width: '100%' }}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="startTime">Start Time:</label>
              <input 
                type="time" 
                id="startTime" 
                style={{ marginLeft: '10px' }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={allDay} // Disable input when allDay is true
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="endTime">End Time:</label>
              <input 
                type="time" 
                id="endTime" 
                style={{ marginLeft: '14px' }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={allDay} // Disable input when allDay is true
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input 
                type="checkbox" 
                id="allDay" 
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
              <label htmlFor="allDay" style={{ marginLeft: '5px' }}>All Day</label>
            </div>
            <button style={{ marginRight: '10px', backgroundColor: 'white' }} onClick={() => setSelectedInfo(null)}>Cancel</button>
            <button style={{ backgroundColor: 'white'}} onClick={handleSaveEvent}>Save Event</button>
          </div>
        </Popup>
      )}
    </div>
  );
}
