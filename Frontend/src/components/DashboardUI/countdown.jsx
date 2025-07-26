"use client";
import { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../CommonUI/card";
import { Badge } from "../CommonUI/badge";

export function CountdownTimer({ deadline, title, type = "default" }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const getTypeStyles = () => {
    return {
      gradient: "from-blue-500 to-indigo-500",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
      badgeClass: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
      timeUnitBg: "bg-white/80 backdrop-blur-sm",
      timeUnitBorder: "border-blue-100",
    };
  };

  const styles = getTypeStyles();

  if (timeLeft.isExpired) {
    return (
      <Card  className="hover:shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle
            className={`flex items-center gap-3 text-lg font-semibold ${styles.textColor}`}
          >
            <div
              className={`p-2 rounded-full bg-gradient-to-r ${styles.gradient} text-white shadow-md`}
            >
              <CheckCircle className="w-5 h-5" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center p-4">
            <Badge
              className={`${styles.badgeClass} text-sm font-medium px-4 py-2 rounded-full shadow-md`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Deadline Completed
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if deadline is urgent (less than 24 hours)
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;


  return (
    <Card  className="hover:shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle
          className={`flex items-center text-lg font-semibold ${styles.textColor}`}
        >
          <div
            className={`p-2 rounded-full text-indigo-600 ${
              styles.gradient
            } ${isUrgent ? "animate-bounce" : ""}`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Clock className="w-6 h-6 text-indigo-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">{title}</span>
            {isUrgent && (
              <span className="text-sm font-normal text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Urgent - Less than 24 hours!
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 gap-3">
          <div
            className={`${styles.timeUnitBg} ${styles.timeUnitBorder} border rounded-xl p-3 text-center shadow-sm transition-all duration-200 hover:scale-105`}
          >
            <div
              className={`text-xl font-bold ${styles.timeUnitText} leading-none`}
            >
              {timeLeft.days.toString().padStart(2, "0")}
            </div>
            <div
              className={`text-xs font-medium ${styles.timeUnitLabel} mt-1 uppercase tracking-wide`}
            >
              Days
            </div>
          </div>
          <div
            className={`${styles.timeUnitBg} ${styles.timeUnitBorder} border rounded-xl p-3 text-center shadow-sm transition-all duration-200 hover:scale-105`}
          >
            <div
              className={`text-xl font-bold ${styles.timeUnitText} leading-none`}
            >
              {timeLeft.hours.toString().padStart(2, "0")}
            </div>
            <div
              className={`text-xs font-medium ${styles.timeUnitLabel} mt-1 uppercase tracking-wide`}
            >
              Hours
            </div>
          </div>
          <div
            className={`${styles.timeUnitBg} ${styles.timeUnitBorder} border rounded-xl p-3 text-center shadow-sm transition-all duration-200 hover:scale-105`}
          >
            <div
              className={`text-xl font-bold ${styles.timeUnitText} leading-none`}
            >
              {timeLeft.minutes.toString().padStart(2, "0")}
            </div>
            <div
              className={`text-xs font-medium ${styles.timeUnitLabel} mt-1 uppercase tracking-wide`}
            >
              Min
            </div>
          </div>
          <div
            className={`${styles.timeUnitBg} ${styles.timeUnitBorder} border rounded-xl p-3 text-center shadow-sm transition-all duration-200 hover:scale-105`}
          >
            <div
              className={`text-xl font-bold ${styles.timeUnitText} leading-none`}
            >
              {timeLeft.seconds.toString().padStart(2, "0")}
            </div>
            <div
              className={`text-xs font-medium ${styles.timeUnitLabel} mt-1 uppercase tracking-wide`}
            >
              Sec
            </div>
          </div>
        </div>

        {/* Progress bar for urgency */}
        {isUrgent && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-red-600 mb-1">
              <span>Time Remaining</span>
              <span>
                {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      ((timeLeft.hours * 60 + timeLeft.minutes) / (24 * 60)) *
                        100
                    )
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CountdownSection({ hackathon }) {
  const now = new Date();
  const registrationDeadline = new Date(hackathon.registrationDeadline);
  const submissionDeadline = hackathon.submissionDeadline
    ? new Date(hackathon.submissionDeadline)
    : null;
  const rounds = hackathon.rounds || [];

  // Determine if registration is urgent (less than 24 hours)
  const isRegistrationUrgent =
    registrationDeadline - now < 24 * 60 * 60 * 1000 &&
    registrationDeadline > now;

  // Get active submission deadlines from rounds
  const activeRoundDeadlines = rounds
    .map((round, index) => ({
      ...round,
      index,
      deadline: new Date(round.endDate),
      isActive:
        new Date(round.startDate) <= now && new Date(round.endDate) > now,
    }))
    .filter((round) => round.isActive || round.deadline > now)
    .sort((a, b) => a.deadline - b.deadline);

  const hasActiveCountdowns =
    registrationDeadline > now ||
    (submissionDeadline && submissionDeadline > now && rounds.length === 0) ||
    activeRoundDeadlines.length > 0;

  if (!hasActiveCountdowns) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Countdown Timers</h3>
          <p className="text-sm text-gray-600">
            Track important deadlines in real-time
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {/* Registration Deadline */}
        {registrationDeadline > now && (
          <CountdownTimer
            deadline={hackathon.registrationDeadline}
            title="Registration Deadline"
            type={isRegistrationUrgent ? "urgent" : "registration"}
          />
        )}

        {/* Final Submission Deadline (if single round) */}
        {submissionDeadline &&
          submissionDeadline > now &&
          rounds.length === 0 && (
            <CountdownTimer
              deadline={hackathon.submissionDeadline}
              title="Final Submission Deadline"
              type="submission"
            />
          )}

        {/* Round Deadlines */}
        {activeRoundDeadlines.map((round) => (
          <CountdownTimer
            key={round.index}
            deadline={round.endDate}
            title={`${round.name || `Round ${round.index + 1}`} Deadline`}
            type={round.isActive ? "urgent" : "submission"}
          />
        ))}
      </div>
    </div>
  );
}

export function SmartCountdown({ hackathon }) {
  const [currentCountdown, setCurrentCountdown] = useState(null);

  const now = new Date();
  const registrationDeadline = new Date(hackathon.registrationDeadline);
  const submissionDeadline = hackathon.submissionDeadline
    ? new Date(hackathon.submissionDeadline)
    : null;
  const rounds = hackathon.rounds || [];

  // Get the most relevant countdown based on current time
  const getMostRelevantCountdown = () => {
    // 1. Check if registration is still active
    if (registrationDeadline > now) {
      const timeLeft = registrationDeadline - now;
      const isUrgent = timeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
      return {
        id: "registration",
        deadline: hackathon.registrationDeadline,
        title: "Registration Deadline",
        type: isUrgent ? "urgent" : "registration",
        timeLeft,
        isUrgent,
        description: "Register for the hackathon before this deadline",
      };
    }

    // 2. Check for currently active rounds
    const activeRound = rounds.find((round) => {
      const startDate = new Date(round.startDate);
      const endDate = new Date(round.endDate);
      return startDate <= now && endDate > now;
    });

    if (activeRound) {
      const roundIndex = rounds.findIndex((r) => r === activeRound);
      const timeLeft = new Date(activeRound.endDate) - now;
      const isUrgent = timeLeft < 24 * 60 * 60 * 1000;
      return {
        id: `round-${roundIndex}`,
        deadline: activeRound.endDate,
        title: `${activeRound.name || `Round ${roundIndex + 1}`} Deadline`,
        type: isUrgent ? "urgent" : "submission",
        timeLeft,
        isUrgent,
        roundIndex,
        isActive: true,
        description: `Submit your ${
          activeRound.type?.toLowerCase().includes("ppt") ? "PPT" : "project"
        } for this round`,
      };
    }

    // 3. Check for next upcoming round
    const upcomingRound = rounds
      .map((round, index) => ({
        ...round,
        index,
        startDate: new Date(round.startDate),
        endDate: new Date(round.endDate),
      }))
      .filter((round) => round.startDate > now)
      .sort((a, b) => a.startDate - b.startDate)[0];

    if (upcomingRound) {
      const timeLeft = upcomingRound.startDate - now;
      const isUrgent = timeLeft < 24 * 60 * 60 * 1000;
      return {
        id: `round-${upcomingRound.index}`,
        deadline: upcomingRound.startDate,
        title: `${
          upcomingRound.name || `Round ${upcomingRound.index + 1}`
        } Starts`,
        type: isUrgent ? "urgent" : "submission",
        timeLeft,
        isUrgent,
        roundIndex: upcomingRound.index,
        isActive: false,
        description: `Round ${upcomingRound.index + 1} will begin soon`,
      };
    }

    // 4. Check for final submission deadline (if single round)
    if (submissionDeadline && submissionDeadline > now && rounds.length === 0) {
      const timeLeft = submissionDeadline - now;
      const isUrgent = timeLeft < 24 * 60 * 60 * 1000;
      return {
        id: "final-submission",
        deadline: hackathon.submissionDeadline,
        title: "Final Submission Deadline",
        type: isUrgent ? "urgent" : "submission",
        timeLeft,
        isUrgent,
        description: "Submit your final project",
      };
    }

    // 5. No active countdowns
    return null;
  };

  // Update current countdown when hackathon data changes
  useEffect(() => {
    const relevantCountdown = getMostRelevantCountdown();
    setCurrentCountdown(relevantCountdown);
  }, []);

  // Update countdown every second to handle transitions
  useEffect(() => {
    const interval = setInterval(() => {
      const relevantCountdown = getMostRelevantCountdown();
      if (relevantCountdown?.id !== currentCountdown?.id) {
        setCurrentCountdown(relevantCountdown);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCountdown]);

  if (!currentCountdown) {
    return (
     <Card  className="hover:shadow-sm">
        <CardContent className="py-6 px-6">
          <div className="flex items-center justify-center text-gray-500">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="text-lg font-medium">All deadlines completed</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <CountdownTimer
        deadline={currentCountdown.deadline}
        title={currentCountdown.title}
        type={currentCountdown.type}
      />
    </div>
  );
}
