import React, { useState, useEffect, useRef, useCallback } from "react";

const AUDIO_PATHS = {
  nextSpeaker: "src/audio/next-speaker.mp3",
  tick: "src/audio/tick.mp3",
  welcome: "src/audio/welcome.mp3",
  start: "src/audio/start-and-begin.mp3",
  paused: "src/audio/timer-paused.mp3",
  resumed: "src/audio/timer-resumed.mp3",
  MinLeft10: "src/audio/time-left/10-min-left.mp3",
  MinLeft5: "src/audio/time-left/5-min-left.mp3",
  MinLeft1: "src/audio/time-left/1-min-left.mp3",
  SecLeft30: "src/audio/time-left/30-sec-left.mp3",
  MeetingHourLeft1: "src/audio/time-left/meeting-ends-in-1-hour.mp3",
  MeetingMinLeft30: "src/audio/time-left/meeting-ends-in-30-min.mp3",
  MeetingMinLeft20: "src/audio/time-left/meeting-ends-in-20-min.mp3",
  MeetingMinLeft10: "src/audio/time-left/meeting-ends-in-10-min.mp3",
  MeetingMinLeft5: "src/audio/time-left/meeting-ends-in-5-min.mp3",
  MeetingMinLeft1: "src/audio/time-left/meeting-ends-in-1-min.mp3",
  MeetingSecLeft30: "src/audio/time-left/meeting-ends-in-30-sec.mp3",
  SpeakingTimeDepletedFor: "src/audio/speaking-time-depleted-for.mp3",
  intro1: "src/audio/tutorial/intro-1.mp3",
  intro2: "src/audio/tutorial/intro-2.mp3",
  meetingType1: "src/audio/tutorial/meeting-type-1.mp3",
  meetingType2: "src/audio/tutorial/meeting-type-2.mp3",
  meetingType3: "src/audio/tutorial/meeting-type-3.mp3",
  MeetingOver: "src/audio/meeting-over.mp3",
};

export default function MeetingView(props) {
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [previousSpeakerIndex, setPreviousSpeakerIndex] = useState(null);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [individualTimes, setIndividualTimes] = useState({});
  const [speakingRounds, setSpeakingRounds] = useState({});
  const [tempSpeakerTimes, setTempSpeakerTimes] = useState({});
  const [timerActive, setTimerActive] = useState(false);
  const [clearTimeOnSwitch, setClearTimeOnSwitch] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [displayCurrentSpeaker, setDisplayCurrentSpeaker] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [meetingHasBegun, setMeetingHasBegun] = useState(false);
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [hasMeetingStarted, setHasMeetingStarted] = useState(false);
  const [bonusTime, setBonusTime] = useState(0);
  const defaultSpeakingTimes = {
    shorter: 30,
    default: 300,
    longer: 600,
  };
  const DELAY_TYPES = {
    ALL: "enabled_all",
    AUTO: "enabled_auto",
    DISABLED: "disabled",
  };
  const [speakingTimes, setSpeakingTimes] = useState(defaultSpeakingTimes);
  const [maxTotalTime, setMaxTotalTime] = useState(3600);
  const [inputTimeInMinutes, setInputTimeInMinutes] = useState(
    maxTotalTime / 60
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechQueue, setSpeechQueue] = useState([]);
  const [soundSettings, setSoundSettings] = useState({
    nextSpeaker: true,
    meetingTechniques: true,
    tick: true,
    welcome: true,
    start: true,
    paused: true,
    resumed: true,
    MinLeft10: true,
    MinLeft5: true,
    MinLeft1: true,
    SecLeft30: true,
    MeetingHourLeft1: false,
    MeetingMinLeft30: false,
    MeetingMinLeft20: false,
    MeetingMinLeft10: false,
    MeetingMinLeft5: false,
    MeetingMinLeft1: false,
    MeetingSecLeft30: false,
    SpeakingTimeDepletedFor: true,
    intro1: true,
    intro2: true,
    meetingType1: true,
    meetingType2: true,
    meetingType3: true,
    MeetingOver: true,
  });

  const AUDIO_LABELS = {
    nextSpeaker: "Announce Next Speaker",
    meetingTechniques: "Meeting Techniques",
    tick: "Audible Ticking Clock At Speaker Switch",
    welcome: "Welcome Message",
    start: "Start Meeting",
    paused: "Pause Timer",
    resumed: "Resume Timer",
    MinLeft10: "10 Minutes Remaining",
    MinLeft5: "5 Minutes Remaining",
    MinLeft1: "1 Minute Remaining",
    SecLeft30: "30 Seconds Remaining",
    MeetingHourLeft1: "1 Hour Left in Meeting",
    MeetingMinLeft30: "30 Minutes Left in Meeting",
    MeetingMinLeft20: "20 Minutes Left in Meeting",
    MeetingMinLeft10: "10 Minutes Left in Meeting",
    MeetingMinLeft5: "5 Minutes Left in Meeting",
    MeetingMinLeft1: "1 Minute Left in Meeting",
    MeetingSecLeft30: "30 Seconds Left in Meeting",
    SpeakingTimeDepletedFor:
      "Speaking Time Depleted Warning (recommended with manual speaker switching)",
    MeetingOver: "Meeting Over",
  };

  const AUDIO_CATEGORIES = {
    GeneralMeetingControlsAlerts: [
      "nextSpeaker",
      "tick",
      "welcome",
      "start",
      "paused",
      "resumed",
    ],
    SpeakerAlerts: [
      "MinLeft10",
      "MinLeft5",
      "MinLeft1",
      "SecLeft30",
      "SpeakingTimeDepletedFor",
    ],
    MeetingWideAlerts: [
      "MeetingHourLeft1",
      "MeetingMinLeft30",
      "MeetingMinLeft20",
      "MeetingMinLeft10",
      "MeetingMinLeft5",
      "MeetingMinLeft1",
      "MeetingSecLeft30",
    ],
  };
  const toggleSoundSetting = (key) => {
    setSoundSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };
  const [participants, setParticipants] = useState([]);
  const [speakerTimes, setSpeakerTimes] = useState({});
  const [showTimeTracker, setShowTimeTracker] = useState(false);
  const [manualSpeakerSwitching, setManualSpeakerSwitching] = useState(false);
  const [speakerSwitchDelay, setSpeakerSwitchDelay] = useState("ALL");
  const [groupNames, setGroupNames] = useState({});

  const meetingConfigurations = {
    regular: {
      title: "Regular meeting session with a team",
      speakerSwitchType: "Manual with time warnings",
      speakerTimeDistribution: "Equally distributed (customizable)",
      audioAlerts: [
        "nextSpeaker",
        "meetingTechniques",
        "tick",
        "welcome",
        "start",
        "paused",
        "resumed",
        "MinLeft10",
        "MinLeft5",
        "MinLeft1",
        "SecLeft30",

        "SpeakingTimeDepletedFor",
      ],
    },
    briefing: {
      title: "Briefing/presentation meeting",
      speakerTimeDistribution:
        "First (presenter) longer, all others shorter (customizable)",
      speakerSwitchType: "Manual with time warnings",
      audioAlerts: [
        "nextSpeaker",
        "meetingTechniques",
        "tick",
        "welcome",
        "start",
        "paused",
        "resumed",
        "MinLeft10",
        "MinLeft5",
        "MinLeft1",
        "SecLeft30",

        "SpeakingTimeDepletedFor",
      ],
    },
    negotiation: {
      title: "Negotiation between two parties",
      speakerSwitchType: "Automatic with speaker switch alerts",
      speakerTimeDistribution: "Equally distributed (customizable)",
      audioAlerts: [
        "nextSpeaker",
        "meetingTechniques",
        "tick",
        "welcome",
        "start",
        "paused",
        "resumed",
        "MinLeft10",
        "MinLeft5",
        "MinLeft1",
        "SecLeft30",

        "SpeakingTimeDepletedFor",
      ],
    },
  };
  const initialSettings = meetingConfigurations["negotiation"];
  const [meetingType, setMeetingType] = useState("negotiation");
  const [currentSettings, setCurrentSettings] = useState(initialSettings);
  const [currentMeetingType, setCurrentMeetingType] = useState("negotiation");
  const [trackByGroup, setTrackByGroup] = useState(false);

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking) {
      const nextText = speechQueue[0];
      speakNow(nextText);
      setSpeechQueue((queue) => queue.slice(1));
    }

    if (totalTime >= maxTotalTime) {
      setTimerActive(false);
      playAudio("MeetingOver");
    }

    let intervalId = null;
    if (
      timerActive &&
      participants.length >= 2 &&
      displayCurrentSpeaker &&
      !timerPaused
    ) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          const currentSpeaker = participants[currentSpeakerIndex].name;
          const currentSpeakerTime =
            tempSpeakerTimes[currentSpeaker] ||
            speakerTimes[currentSpeaker] ||
            15;
          const timeLeft = currentSpeakerTime - prevTimer;

          if (timeLeft === 10 * 60) playAudio("MinLeft10");
          else if (timeLeft === 5 * 60) playAudio("MinLeft5");
          else if (timeLeft === 60) playAudio("MinLeft1");
          else if (timeLeft === 30) playAudio("SecLeft30");

          if (prevTimer < currentSpeakerTime) {
            setTotalTime((prevTotal) => {
              const totalMeetingTimeLeft = maxTotalTime - prevTotal;
              handleMeetingTimeAlerts(totalMeetingTimeLeft);
              return prevTotal + 1;
            });
            setIndividualTimes((prevIndTimes) => ({
              ...prevIndTimes,
              [currentSpeaker]: (prevIndTimes[currentSpeaker] || 0) + 1,
            }));
            return prevTimer + 1;
          } else {
            nextSpeaker();
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [
    speechQueue,
    isSpeaking,
    timerActive,
    participants,
    currentSpeakerIndex,
    tempSpeakerTimes,
    speakerTimes,
    individualTimes,
    speakingRounds,
    clearTimeOnSwitch,
    countdown,
    displayCurrentSpeaker,
    timerPaused,
    totalTime,
    maxTotalTime,
    currentSettings,
  ]);

  const handleGroupNamesChange = (index, value) => {
    const newGroupNames = { ...groupNames, [index]: value };
    setGroupNames(newGroupNames);
  };

  const handleTrackByGroupChange = () => {
    setTrackByGroup(!trackByGroup);
  };
  const handleMeetingTimeAlerts = (timeLeft) => {
    if (timeLeft === 3600) playAudio("MeetingHourLeft1");
    else if (timeLeft === 30 * 60) playAudio("MeetingMinLeft30");
    else if (timeLeft === 20 * 60) playAudio("MeetingMinLeft20");
    else if (timeLeft === 10 * 60) playAudio("MeetingMinLeft10");
    else if (timeLeft === 5 * 60) playAudio("MeetingMinLeft5");
    else if (timeLeft === 60) playAudio("MeetingMinLeft1");
    else if (timeLeft === 30) playAudio("MeetingSecLeft30");
  };
  const applyMeetingSettings = useCallback((settings) => {
    setSoundSettings((prev) => ({
      ...prev,
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = settings.audioAlerts.includes(key);
        return acc;
      }, {}),
    }));
    setManualSpeakerSwitching(
      settings.speakerSwitchType === "Manual with time warnings"
    );
  }, []);

  const restartMeeting = () => {
    if (
      !confirm(
        "Are you sure you want to restart the meeting? All data will be lost."
      )
    ) {
      return; 
    }

    try {
      setParticipants([]);
      setCurrentSpeakerIndex(0);
      setPreviousSpeakerIndex(null);
      setTimer(0);
      setTotalTime(0);
      setIndividualTimes({});
      setSpeakingRounds({});
      setTempSpeakerTimes({});
      setTimerActive(false);
      setClearTimeOnSwitch(true);
      setCountdown(3);
      setDisplayCurrentSpeaker(false);
      setTimerPaused(false);
      setMeetingHasBegun(false);
      setHasMeetingStarted(false);
      setBonusTime(0);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      applyMeetingSettings(meetingConfigurations[meetingType]);

      setShowTimeTracker(false);
      setSoundSettings(initialSoundSettings);

      console.log("Meeting has been successfully restarted.");
    } catch (error) {
      console.error("Failed to restart the meeting due to an error:", error);
    }
  };

  const playAudio = (key, callback) => {
    if (audioRef.current && AUDIO_PATHS[key] && soundSettings[key]) {
      if (isSpeaking) {
        setTimeout(() => playAudio(key, callback), 1000);
        return;
      }

      audioRef.current.src = AUDIO_PATHS[key];
      audioRef.current
        .play()
        .then(() => {
          setAudioPlayed(true);
          audioRef.current.onended = () => {
            if (callback) {
              callback();
            }
          };
        })
        .catch((error) => console.error("Error playing audio:", error));
    }
  };

  const nextSpeaker = () => {
    console.log("Evaluating next speaker change");

    const nextIndex = (currentSpeakerIndex + 1) % participants.length;
    setPreviousSpeakerIndex(currentSpeakerIndex);
    setAudioPlayed(false);
    setTimerActive(false);

    if (manualSpeakerSwitching) {
      playAudio("SpeakingTimeDepletedFor", () => {
        const speakerName = participants[currentSpeakerIndex].name;
        console.log(`Announcing next speaker: ${speakerName}`);
        speak(speakerName);
        setTimerActive(true);
      });
    } else {
      if (
        speakerSwitchDelay === DELAY_TYPES.ALL ||
        speakerSwitchDelay === DELAY_TYPES.AUTO
      ) {
        setCountdown(3);
        let countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown > 0) {
              playAudio("tick");
              return prevCountdown - 1;
            } else {
              clearInterval(countdownInterval);
              handleSpeakerSwitch(nextIndex, false);
              return 0;
            }
          });
        }, 1000);
      } else {
        handleSpeakerSwitch(nextIndex, false);
      }
    }
  };

  const continueSpeakingWithTicking = () => {
    setTimer((prevTimer) => prevTimer + 1);
    setTotalTime((prevTotal) => prevTotal + 1);
    const currentSpeaker = participants[currentSpeakerIndex].name;
    setIndividualTimes((prevIndTimes) => ({
      ...prevIndTimes,
      [currentSpeaker]: (prevIndTimes[currentSpeaker] || 0) + 1,
    }));
    playAudio("tick");
  };

  const handleSpeakerSwitch = (index, isManual = false) => {
    console.log(`Switching speaker - isManual: ${isManual}, index: ${index}`);
    const speakerName = participants[index].name;

    const delayApplies =
      (isManual && speakerSwitchDelay === DELAY_TYPES.ALL) ||
      (!isManual && speakerSwitchDelay !== DELAY_TYPES.DISABLED);

    if (delayApplies) {
      setTimerActive(false);
      setCountdown(3);
      playAudio("nextSpeaker", () => {
        setTimeout(() => {
          console.log(`About to speak: ${speakerName}`);
        }, 500);
      });
      setTimeout(() => {
        speakNow(speakerName);
      }, 1000);

      let countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            playAudio("tick");
            return prevCountdown - 1;
          } else {
            clearInterval(countdownInterval);
            performSpeakerSwitch(index);
            return 0;
          }
        });
      }, 1000);
    } else {
      console.log(`Immediate switch and speak: ${speakerName}`);
      playAudio("nextSpeaker", () => {
        console.log(`About to speak: ${speakerName}`);
        speak(speakerName);
      });
      performSpeakerSwitch(index);
    }
  };

  const activateTimerIfValid = () => {
    const currentSpeaker = participants[currentSpeakerIndex];
    const currentSpeakerTime = speakerTimes[currentSpeaker.name];
    return currentSpeakerTime && currentSpeakerTime > 0;
  };

  const startMeeting = () => {
    if (participants.length >= 2) {
      setTimerActive(false);
      setCountdown(3);
      let countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(countdownInterval);
            if (activateTimerIfValid()) {
              setTimerActive(true);
              setDisplayCurrentSpeaker(true);
            } else {
              alert(
                "Current speaker does not have a valid time set. Please adjust time to start."
              );
            }
            return 0;
          }
        });
      }, 1000);
    }
  };

  const performSpeakerSwitch = (index) => {
    setCurrentSpeakerIndex(index);
    if (clearTimeOnSwitch) {
      setTimer(0);
    }
    setDisplayCurrentSpeaker(true);
    setTimerActive(true);
  };

  const switchBackToPreviousSpeaker = () => {
    if (previousSpeakerIndex !== null) {
      handleSpeakerSwitch(previousSpeakerIndex);
    }
  };

  const handleTimeAdjustment = (participantName, adjustment) => {
    setParticipants((prevParticipants) => {
      return prevParticipants.map((participant) => {
        if (participant.name === participantName) {
          if (participant.speakingTime > 6) {
            const newTime = Math.max(1, participant.speakingTime + adjustment);

            setTempSpeakerTimes((prevTimes) => ({
              ...prevTimes,
              [participantName]: newTime,
            }));
            setSpeakerTimes((prevTimes) => ({
              ...prevTimes,
              [participantName]: newTime,
            }));

            const matchingRole = Object.keys(speakingTimes).find(
              (key) => speakingTimes[key] === newTime
            );
            const newRole = matchingRole || "custom";

            return { ...participant, speakingTime: newTime, role: newRole };
          }
        }
        return participant;
      });
    });
  };

  const moveParticipant = (index, direction) => {
    const newPosition =
      (index + direction + participants.length) % participants.length;
    const newParticipants = [...participants];
    const element = newParticipants.splice(index, 1)[0];
    newParticipants.splice(newPosition, 0, element);
    setParticipants(newParticipants);
    if (currentSpeakerIndex === index) {
      setCurrentSpeakerIndex(newPosition);
    }
  };
  const handleAddParticipant = (event) => {
    event.preventDefault();
    const name = event.target.participantName.value.trim();
    if (name && !participants.some((p) => p.name === name)) {
      const isFirstParticipant = participants.length === 0;
      const newRole =
        meetingType === "briefing" && isFirstParticipant ? "longer" : "shorter";
      const newSpeakingTime =
        meetingType === "briefing" && isFirstParticipant
          ? speakingTimes.longer
          : speakingTimes.shorter;

      const newParticipant = {
        name: name,
        role: newRole,
        speakingTime: newSpeakingTime,
        groupNumber: participants.length + 1,
      };

      const newParticipants = [...participants, newParticipant];
      const newSpeakerTimes = {
        ...speakerTimes,
        [name]: newParticipant.speakingTime,
      };
      const newTempSpeakerTimes = {
        ...tempSpeakerTimes,
        [name]: newParticipant.speakingTime,
      };
      const newIndividualTimes = {
        ...individualTimes,
        [name]: 0,
      };

      setParticipants(newParticipants);
      setSpeakerTimes(newSpeakerTimes);
      setTempSpeakerTimes(newTempSpeakerTimes);
      setIndividualTimes(newIndividualTimes);
      event.target.reset();
    } else {
      alert("A participant with that name already exists.");
    }
  };

  const handleRoleChange = (index, newRole) => {
    const participantName = participants[index].name;
    const currentTempTime = tempSpeakerTimes[participantName];
    const timeForRole =
      newRole !== "custom" ? speakingTimes[newRole] : currentTempTime;

    const updatedParticipants = participants.map((participant, idx) => {
      if (idx === index) {
        return {
          ...participant,
          role: newRole,
          speakingTime: timeForRole,
        };
      }
      return participant;
    });

    setParticipants(updatedParticipants);
    setTempSpeakerTimes((prevTempTimes) => ({
      ...prevTempTimes,
      [participantName]: timeForRole,
    }));
    setSpeakerTimes((prevSpeakerTimes) => ({
      ...prevSpeakerTimes,
      [participantName]: timeForRole,
    }));
  };

  const handleTimeSetting = (role, time) => {
    const newTimes = { ...speakingTimes, [role]: Number(time) };
    setSpeakingTimes(newTimes);
    const updatedParticipants = participants.map((participant) => ({
      ...participant,
      speakingTime:
        participant.role === role ? Number(time) : participant.speakingTime,
    }));
    setParticipants(updatedParticipants);
  };

  const handleTimeChange = (participantName, value) => {
    let newTime;
    if (value === "") {
      newTime = "";
    } else {
      const parsed = parseInt(value, 10);
      newTime = isNaN(parsed) ? 0 : Math.max(1, parsed);
    }

    setTempSpeakerTimes((prevTimes) => ({
      ...prevTimes,
      [participantName]: newTime,
    }));
  };

  const handleMeetingTimeChange = (event) => {
    const newTime = Math.max(1, Number(event.target.value) * 60);
    setMaxTotalTime(newTime);
    setInputTimeInMinutes(newTime / 60);
  };

  const increaseTime = () => {
    const newTime = maxTotalTime + 300;
    setMaxTotalTime(newTime);
    setInputTimeInMinutes(newTime / 60);
  };

  const decreaseTime = () => {
    const newTime = Math.max(60, maxTotalTime - 60);
    setMaxTotalTime(newTime);
    setInputTimeInMinutes(newTime / 60);
  };

  const submitTimeChange = (participantName, e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const newTime =
        tempSpeakerTimes[participantName] === ""
          ? speakerTimes[participantName]
          : Math.max(10, parseInt(tempSpeakerTimes[participantName], 10));

      setSpeakerTimes((prevTimes) => ({
        ...prevTimes,
        [participantName]: newTime,
      }));
      setTempSpeakerTimes((prevTimes) => ({
        ...prevTimes,
        [participantName]: newTime,
      }));
      e.target.blur();

      const matchingRole = Object.keys(speakingTimes).find(
        (key) => speakingTimes[key] === newTime
      );
      const newRole = matchingRole || "custom";
      const updatedParticipants = participants.map((participant) => {
        if (participant.name === participantName) {
          return { ...participant, role: newRole };
        }
        return participant;
      });

      setParticipants(updatedParticipants);
    }
  };

  const resetTimes = () => {
    setTimer(0);

    setSpeakerTimes(
      Object.fromEntries(
        participants.map((participant) => [
          participant.name,
          tempSpeakerTimes[participant.name] ||
            speakerTimes[participant.name] ||
            speakingTimes[participant.role] ||
            15,
        ])
      )
    );

    setSpeakingRounds(
      Object.fromEntries(
        participants.map((participant) => [participant.name, 0])
      )
    );
  };

  const toggleTimerPause = () => {
    setTimerPaused((prevPaused) => {
      if (!prevPaused) {
        playAudio("paused");
      } else {
        playAudio("resumed");
        const updatedTime =
          speakerTimes[participants[currentSpeakerIndex].name] + bonusTime;
        setSpeakerTimes((prevTimes) => ({
          ...prevTimes,
          [participants[currentSpeakerIndex].name]: updatedTime,
        }));
      }
      return !prevPaused;
    });
  };

  const speak = (text) => {
    setSpeechQueue((queue) => [...queue, text]);
  };
  const speakNow = (text) => {
    if (!window.speechSynthesis) {
      console.error("Text-to-speech not supported in this browser.");
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === "sv-SE");
    utterance.onend = () => {
      setTimeout(() => {
        setIsSpeaking(false);
      }, 1000);
    };
    speechSynthesis.speak(utterance);
  };
  const onManualSwitchClick = (index) => {
    handleSpeakerSwitch(index, true);
  };

  const handleMeetingTypeChange = useCallback(
    (newType) => {
      if (newType !== meetingType) {
        setMeetingType(newType);
        const settings = meetingConfigurations[newType];
        setCurrentSettings(settings);

        setSoundSettings((prev) => ({
          ...prev,
          ...Object.keys(prev).reduce((acc, key) => {
            acc[key] = settings.audioAlerts.includes(key);
            return acc;
          }, {}),
        }));

        applyMeetingSettings(settings);

        if (newType === "briefing") {
          const updatedParticipants = participants.map(
            (participant, index) => ({
              ...participant,
              speakingTime:
                index === 0 ? speakingTimes.longer : speakingTimes.shorter,
              role: index === 0 ? "longer" : "shorter",
            })
          );
          setParticipants(updatedParticipants);
        }
      }
    },
    [meetingType, applyMeetingSettings, participants, speakingTimes]
  );

  return (
    <main className="meeting-facilitator main-welcome">
      <audio ref={audioRef} preload="all"></audio>

      {props.showAlert?.alert && (
        <div className="alert-box">
          <h2>{props.alertMessage.message}</h2>
        </div>
      )}
      <div className="start">
        <h2>Hold a meeting</h2>
        <div className="welcome-view">
          <h2>Welcome to the Meeting Helper!</h2>

          <h3 class="rubric">
            <b>Please select a meeting preset</b>
          </h3>

          <div className="meeting-description">
            <div>
              <h4>1. Regular meeting session with a team</h4>
              <p>
                These could be recurring meetings with a team, for example daily
                stand-ups, or weekly, monthly, or annual review sessions. By
                default, speaking time is equally distributed among all
                participants but can be adjusted as needed. Manual speaker
                switching with verbal time warnings is used by default.
              </p>
              <button
                class="read-aloud-button"
                onClick={() => playAudio("meetingType1")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                  alt=""
                />{" "}
              </button>
            </div>
            <div>
              <h4>2. Briefing/presentation meeting</h4>
              <p>
                These "meetings" may include technical demonstrations, company
                policy briefings, product launches, or client presentations.
                Presenters are allocated a standard amount of speaking time,
                which is separate and usually longer than that of the audience,
                who may be allowed speaking time to, for example, ask questions.
                Manual speaker switching with verbal time warnings is used by
                default.
              </p>
              <button
                class="read-aloud-button"
                onClick={() => playAudio("meetingType2")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                  alt=""
                />{" "}
              </button>
            </div>
            <div>
              <h4>3. Negotiation between two parties</h4>
              <p>
                This includes meetings such as business deal negotiations or
                partnership discussions involving teams or businesses. Here,
                speaking time is organized by groups of one to many individuals,
                facilitating structured dialogue between the negotiating
                parties. Automatic speaker switching is enabled by default to
                ensure a fair debate.
              </p>
              <button
                class="read-aloud-button"
                onClick={() => playAudio("meetingType3")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg"
                  alt=""
                />
              </button>
            </div>
          </div>
          <div className="meeting-setup">
            <div class="meeting-type-selection">
              <select
                onChange={(e) => handleMeetingTypeChange(e.target.value)}
                value={meetingType}
              >
                <option value="negotiation">
                  <p>Negotiation Meeting</p>
                </option>
                <option value="regular">
                  <p>Regular Meeting</p>
                </option>
                <option value="briefing">
                  <p>Briefing Meeting</p>
                </option>
              </select>
            </div>

            <div className="settings-preview">
              <h3>
                Speaker Time Distribution:{" "}
                <b> {currentSettings.speakerTimeDistribution}</b>
              </h3>
              <h3>
                Speaker Switch Type (automatic/enforced or manual):{" "}
                <b>{currentSettings.speakerSwitchType}</b>
              </h3>
              {}
            </div>
            <h3>
              Note: Meeting Helper settings are also customizable during
              meeting.
            </h3>
          </div>
          <div class="intro-toggles">
            <label className="label-toggle-setting">
              <h3>
                {" "}
                Time tracking by speaking group, <u>NOT</u> individual
              </h3>
              <input
                type="checkbox"
                checked={trackByGroup}
                onChange={handleTrackByGroupChange}
                style={{ margin: "0 10px" }}
              />
            </label>
          </div>

          <button onClick={() => setShowTimeTracker(!showTimeTracker)}>
            {showTimeTracker ? "Close Meeting helper" : "Open Meeting helper"}
          </button>
        </div>
      </div>

      {showTimeTracker && (
        <div className="time-tracker">
          <h2>Meeting helper</h2>

          <div className="total-time">
            {timerActive && displayCurrentSpeaker ? (
              <>
                <h3>
                  This meeting has taken: {Math.floor(totalTime / 60)} minutes
                  out of {Math.floor(maxTotalTime / 60)} minutes
                </h3>
                <h3>
                  Current Speaker: "
                  <b>{participants[currentSpeakerIndex].name}</b>" with{" "}
                  <b>
                    {Math.max(
                      0,
                      speakerTimes[participants[currentSpeakerIndex].name] -
                        timer
                    )}
                    s
                  </b>{" "}
                  (
                  {Math.floor(
                    (speakerTimes[participants[currentSpeakerIndex].name] -
                      timer || 0) / 60
                  )}{" "}
                  {" minutes) left."}
                </h3>

                <button onClick={toggleTimerPause}>
                  {timerPaused ? "Resume Timer" : "Pause Timer"}
                </button>
              </>
            ) : (
              <>
                <h3>
                  {countdown > 0
                    ? `Countdown for next speaker: ${countdown}s`
                    : "No time left."}
                </h3>
                <h4>
                  <b>
                    {!timerActive && countdown === 0 ? "" : "Meeting paused"}
                  </b>
                </h4>
              </>
            )}
          </div>

          {participants.length < 2 && (
            <p>At least 2 meeting participants are needed.</p>
          )}
          {participants.length > 1 && (
            <div className="dashboard-parent">
              <h3 className="rubric">
                {meetingConfigurations[currentMeetingType].title}
              </h3>

              <div className="dashboard">
                {participants.map((participant, index) => (
                  <div
                    className={`participant-card ${
                      index === currentSpeakerIndex ? "active-speaker" : ""
                    }`}
                    key={index}
                  >
                    <h3>{participant.name}</h3>

                    <p>
                      Total time spoken:{" "}
                      {Math.floor(
                        (individualTimes[participant.name] || 0) / 60
                      )}{" "}
                      minutes and {individualTimes[participant.name] % 60}{" "}
                      seconds
                    </p>
                    {}

                    {trackByGroup && (
                      <div className="set-speaking-time">
                        <p>Group names (comma-separated):</p>
                        <input
                          type="text"
                          value={groupNames[index] || ""}
                          onChange={(e) =>
                            handleGroupNamesChange(index, e.target.value)
                          }
                        />
                      </div>
                    )}

                    <div className="set-speaking-time">
                      <p>Speaking time (10 to ∞ seconds): </p>
                      <input
                        type="number"
                        value={tempSpeakerTimes[participant.name]}
                        onChange={(e) =>
                          handleTimeChange(participant.name, e.target.value)
                        }
                        onKeyDown={(e) => submitTimeChange(participant.name, e)}
                      />
                    </div>
                    <p>Note: Confirm new speaking times with "Enter"</p>
                    <button
                      className="increase-time-button"
                      onClick={() => handleTimeAdjustment(participant.name, 15)}
                    >
                      <p>+ 15s speaking time</p>
                    </button>
                    <button
                      className="decrease-time-button"
                      onClick={() => handleTimeAdjustment(participant.name, -5)}
                    >
                      <p>- 5s speaking time</p>
                    </button>
                    <button
                      className="switch-speaker-button"
                      onClick={() => onManualSwitchClick(index)}
                    >
                      <p>Switch to this speaker</p>
                    </button>
                    <select
                      value={participant.role}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                    >
                      <option value="shorter">Shorter speaking time</option>
                      <option value="default">Default speaking time</option>
                      <option value="longer">Longer speaking time</option>
                      <option value="custom">Custom speaking time</option>
                    </select>

                    <div className="move-buttons">
                      <button
                        className="move-left-button"
                        onClick={() => moveParticipant(index, -1)}
                      >
                        {"<"}
                      </button>
                      <button
                        className="move-right-button"
                        onClick={() => moveParticipant(index, 1)}
                      >
                        {">"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="reset-times-button" onClick={resetTimes}>
                <p>Restart this speaking round</p>
              </button>
              {!meetingHasBegun && (
                <>
                  <button
                    className="start-meeting-button"
                    onClick={() => {
                      setMeetingHasBegun(true);
                      startMeeting();
                      playAudio("start");
                      setHasMeetingStarted(true);
                    }}
                  >
                    <p>Start meeting!</p>
                  </button>
                </>
              )}
            </div>
          )}
          <div className="meeting-config">
            <h3 className="rubric">
              {" "}
              <b>Meeting configuration</b>{" "}
            </h3>
            {trackByGroup ? (
              <h4>
                Meeting is held in groups of one to many people. Please add
                group names below.
              </h4>
            ) : (
              <h4>Add participants</h4>
            )}

            <form
              className="add-participant-form"
              onSubmit={handleAddParticipant}
            >
              <input
                name="participantName"
                type="text"
                placeholder="Enter name"
                required
              />
              <button type="submit">
                <p>Add name</p>{" "}
              </button>
            </form>
            <h4>Remove specific participants</h4>
            <ul className="participant-list">
              {participants.map((participant, index) => (
                <li key={index}>
                  {participant.name}
                  <button
                    className="remove-participant-button"
                    onClick={() => removeParticipant(participant)}
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
            <label>
              <h3 class="rubric">
                <b>Set meeting time (minutes):</b>
              </h3>
              <input
                type="number"
                value={inputTimeInMinutes}
                onBlur={handleMeetingTimeChange}
                onChange={(e) => setInputTimeInMinutes(e.target.value)}
                min="1"
              />
            </label>
            <div class="set-meeting-time">
              <button onClick={increaseTime}>
                <p>+ 5 minutes</p>{" "}
              </button>
              <button onClick={decreaseTime}>
                <p>- 1 minute</p>{" "}
              </button>
              <button
                onClick={restartMeeting}
                className="restart-meeting-button"
              >
                <p>Restart Meeting </p>
              </button>
            </div>
            <h3 class="rubric">
              <b>Countdown on new speaker</b>
            </h3>
            <select
              class="countdown-on-new-speaker"
              value={speakerSwitchDelay}
              onChange={(e) => setSpeakerSwitchDelay(e.target.value)}
            >
              <option value={DELAY_TYPES.ALL}>
                <p>Enabled for automatic and manual switches</p>
              </option>
              <option value={DELAY_TYPES.AUTO}>
                <p> Enabled for automatic switches</p>
              </option>
              <option value={DELAY_TYPES.DISABLED}>
                <p>Disabled, switch speaker instantly</p>
              </option>
            </select>
            <h3 class="rubric">
              <b>Speaker switching and time tracking</b>
            </h3>
            <div class="toggles">
              <label class="label-toggle-setting">
                <h3>
                  Manual Speaker Switching, <u>NO</u> automatic switch
                </h3>

                <input
                  type="checkbox"
                  checked={manualSpeakerSwitching}
                  onChange={() =>
                    setManualSpeakerSwitching(!manualSpeakerSwitching)
                  }
                />
              </label>
              <label class="label-toggle-setting">
                <h3>
                  Time tracking by speaking group, <u>NOT</u> individual
                </h3>
                {}
                <input
                  type="checkbox"
                  checked={trackByGroup}
                  onChange={handleTrackByGroupChange}
                />
              </label>
            </div>

            {}

            <h3 class="rubric">
              <b>Custom default speaking times</b>{" "}
            </h3>
            <div class="custom-default-speaking-times">
              <label>
                <p>Shorter speaking time (seconds):</p>

                <input
                  type="number"
                  value={speakingTimes.shorter}
                  onChange={(e) => handleTimeSetting("shorter", e.target.value)}
                />
              </label>
              <label>
                <p>Default speaking time (seconds):</p>

                <input
                  type="number"
                  value={speakingTimes.default}
                  onChange={(e) => handleTimeSetting("default", e.target.value)}
                />
              </label>
              <label>
                <p>Longer speaking time (seconds):</p>

                <input
                  type="number"
                  value={speakingTimes.longer}
                  onChange={(e) => handleTimeSetting("longer", e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <h3 class="rubric">
                  <b>Time to add when resuming the timer (seconds):</b>
                </h3>
                <input
                  type="number"
                  value={bonusTime}
                  onChange={(e) => setBonusTime(Number(e.target.value))}
                  min="0"
                />
              </label>
            </div>
            <h3 class="toggle-audio-alerts-rubric">
              <b>Toggle audio alerts</b>{" "}
            </h3>

            <div className="audio-settings">
              {Object.entries(AUDIO_CATEGORIES).map(([category, sounds]) => (
                <div key={category} className="audio-category">
                  <h3 className="rubric">
                    <b>{category.replace(/([A-Z])/g, " $1").trim()}</b>
                  </h3>
                  {sounds.map((soundKey) => (
                    <div key={soundKey} className="audio-setting">
                      <label>
                        <h3>{AUDIO_LABELS[soundKey]}:</h3>
                        <input
                          type="checkbox"
                          checked={soundSettings[soundKey]}
                          onChange={() => toggleSoundSetting(soundKey)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
