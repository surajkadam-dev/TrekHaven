import mongoose from "mongoose";
import Booking from "../models/Booking.model.js";
import Accommodation from "../models/Admin.model.js";

import moment from 'moment-timezone';

export async function getBookedSeatsForDate(stayDateInput) {
  console.log("Calculating booked seats for date:", stayDateInput);

  const startUTC = moment.tz(stayDateInput, 'YYYY-MM-DD', 'Asia/Kolkata').startOf('day').utc().toDate();
  const endUTC = moment.tz(stayDateInput, 'YYYY-MM-DD', 'Asia/Kolkata').endOf('day').utc().toDate();

  console.log("Query range:", {
    startUTC: startUTC.toISOString(),
    endUTC: endUTC.toISOString(),
    input: stayDateInput
  });

  try {
    const agg = await Booking.aggregate([
      {
        $match: {
          stayDate: { $gte: startUTC, $lte: endUTC },
          status: { $nin: ["cancelled", "completed"] }
        }
      },
      {
        $group: {
          _id: null,
          totalBooked: { $sum: "$groupSize" }
        }
      }
    ]);

    console.log("Aggregate result:", agg);
    return agg[0]?.totalBooked ?? 0;
  } catch (error) {
    console.error("Aggregation error:", error);
    return 0;
  }
}


// Default summary (current month with week breakdown)
export async function getDefaultSummary() {
  const now = moment().utc();

  // Start & End of Month
  const monthStart = now.clone().startOf('month').toDate();
  const monthEnd = now.clone().endOf('month').toDate();

  // Start & End of Week
  const weekStart = now.clone().startOf('week').toDate();
  const weekEnd = now.clone().endOf('week').toDate();

  const agg = await Booking.aggregate([
    {
      $match: {
        stayDate: { $gte: monthStart, $lt: monthEnd },
        status: { $nin: ["cancelled", "completed"] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$stayDate" } },
        totalBooked: { $sum: "$groupSize" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const byDay = agg.map(r => ({
    date: r._id,
    totalBooked: r.totalBooked
  }));

  const monthTotal = byDay.reduce((sum, d) => sum + d.totalBooked, 0);
  
  const weekTotal = byDay
    .filter(d => {
      const date = moment.utc(d.date);
      return date.isBetween(weekStart, weekEnd, null, '[]');
    })
    .reduce((sum, d) => sum + d.totalBooked, 0);

  return {
    thisWeek: weekTotal,
    thisMonth: monthTotal,
    byDay
  };
}

// Weekly summary
export async function getWeeklySummary(targetDate = null) {
  const now = targetDate ? moment.utc(targetDate) : moment().utc();
  
  const weekStart = now.clone().startOf('week').toDate();
  const weekEnd = now.clone().endOf('week').toDate();

  const agg = await Booking.aggregate([
    {
      $match: {
        stayDate: { $gte: weekStart, $lte: weekEnd },
        status: { $nin: ["cancelled", "completed"] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$stayDate" } },
        totalBooked: { $sum: "$groupSize" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const byDay = agg.map(r => ({
    date: r._id,
    totalBooked: r.totalBooked
  }));

  const weekTotal = byDay.reduce((sum, d) => sum + d.totalBooked, 0);

  return {
    total: weekTotal,
    period: 'week',
    startDate: moment(weekStart).format('YYYY-MM-DD'),
    endDate: moment(weekEnd).format('YYYY-MM-DD'),
    byDay
  };
}

// Monthly summary
export async function getMonthlySummary(targetDate = null) {
  const now = targetDate ? moment.utc(targetDate) : moment().utc();
  
  const monthStart = now.clone().startOf('month').toDate();
  const monthEnd = now.clone().endOf('month').toDate();

  const agg = await Booking.aggregate([
    {
      $match: {
        stayDate: { $gte: monthStart, $lte: monthEnd },
        status: { $nin: ["cancelled", "completed"] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$stayDate" } },
        totalBooked: { $sum: "$groupSize" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const byDay = agg.map(r => ({
    date: r._id,
    totalBooked: r.totalBooked
  }));

  const monthTotal = byDay.reduce((sum, d) => sum + d.totalBooked, 0);

  return {
    total: monthTotal,
    period: 'month',
    month: now.format('YYYY-MM'),
    startDate: moment(monthStart).format('YYYY-MM-DD'),
    endDate: moment(monthEnd).format('YYYY-MM-DD'),
    byDay
  };
}

// Daily summary for specific date
export async function getDailySummary(date) {
  const startUTC = moment.utc(date).startOf('day').toDate();
  const endUTC = moment.utc(date).endOf('day').toDate();

  const agg = await Booking.aggregate([
    {
      $match: {
        stayDate: { $gte: startUTC, $lte: endUTC },
        status: { $nin: ["cancelled", "completed"] }
      }
    },
    {
      $group: {
        _id: null,
        totalBooked: { $sum: "$groupSize" }
      }
    }
  ]);

  const totalBooked = agg[0]?.totalBooked ?? 0;

  return {
    total: totalBooked,
    period: 'day',
    date: moment.utc(date).format('YYYY-MM-DD'),
    byDay: [{ date: moment.utc(date).format('YYYY-MM-DD'), totalBooked }]
  };
}

// Custom date range summary
export async function getDateRangeSummary(startDate, endDate) {
  const startUTC = moment.utc(startDate).startOf('day').toDate();
  const endUTC = moment.utc(endDate).endOf('day').toDate();

  const agg = await Booking.aggregate([
    {
      $match: {
        stayDate: { $gte: startUTC, $lte: endUTC },
        status: { $nin: ["cancelled", "completed"] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$stayDate" } },
        totalBooked: { $sum: "$groupSize" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const byDay = agg.map(r => ({
    date: r._id,
    totalBooked: r.totalBooked
  }));

  const rangeTotal = byDay.reduce((sum, d) => sum + d.totalBooked, 0);

  return {
    total: rangeTotal,
    period: 'custom',
    startDate: moment.utc(startDate).format('YYYY-MM-DD'),
    endDate: moment.utc(endDate).format('YYYY-MM-DD'),
    byDay
  };
}