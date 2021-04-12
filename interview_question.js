function dueDateCalculator(submitTime, turnaround) {

  const submitDay = submitTime.getDay();
  const submitHour = submitTime.getHours();
  const submitMinutes = submitTime.getMinutes();
  let timeTodayLeftHour = 17 - submitHour - 1;
  const timeTodayLeftMinutes = 60 - submitMinutes;
  const timeTodayLeft = timeTodayLeftHour + timeTodayLeftMinutes / 60;

  const hoursTillWeekend = {
    0: 0,
    1: 32,
    2: 24,
    3: 16,
    4: 8,
    5: 0,
    6: 0,
  };

  const hoursFromWeekend = {
    0: 0,
    1: 0,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    0: 0,
  };

  const exactHoursTillWeekend = hoursTillWeekend[submitDay];
  const exactHoursFromWeekend = hoursFromWeekend[submitDay];

  const turnarounDays = Math.floor(turnaround / 8);
  const turnaroundHours = turnaround % 8;

  const dataForCalc = {
    'submitTime': submitTime,
    'submitHour': submitHour,
    'turnaroundHours': turnaroundHours,
    'turnarounDays': turnarounDays,
    'exactHoursTillWeekend': exactHoursTillWeekend,
    'exactHoursFromWeekend': exactHoursFromWeekend,
    'timeTodayLeft': timeTodayLeft
  }

  if (submitHour < 9 || submitHour > 17) {
    return 'The service only available between 9AM-5PM';
  }

  if (turnaround > 40){
    return 'The maximum tournaround time to be handled is 40 hour or less.'
  }

  return getDueDate(dataForCalc, turnaround);
}

function getDueDate( dataForCalc, turnaround) {
  if (turnaround < dataForCalc.timeTodayLeft) {
    dataForCalc.submitTime.setHours(dataForCalc.submitHour + dataForCalc.turnaroundHours);
    return dataForCalc.submitTime;
  }
   else if (dataForCalc.timeTodayLeft < turnaround && turnaround < 8 + dataForCalc.timeTodayLeft) {
    const dueDate = new Date(dataForCalc.submitTime.setDate(dataForCalc.submitTime.getDate() + 1));
    dueDate.setHours(9);
    dueDate.setHours(dataForCalc.submitTime.getHours() + (turnaround - dataForCalc.timeTodayLeft - 1));
    return dueDate;
  }
   else if (
    8 +dataForCalc.timeTodayLeft < turnaround &&
    turnaround < dataForCalc.exactHoursTillWeekend + dataForCalc.timeTodayLeft
  ) {
    const dueDate = new Date(
      dataForCalc.submitTime.setDate(dataForCalc.submitTime.getDate() + dataForCalc.turnarounDays)
    );
    dueDate.setHours(9);
    dueDate.setHours(
      dataForCalc.submitTime.getHours() + (8 + dataForCalc.turnaroundHours - dataForCalc.timeTodayLeft - 1)
    );
    return dueDate;
  }
   else {
    const dueDate = new Date(
      dataForCalc.submitTime.setDate(dataForCalc.submitTime.getDate() + dataForCalc.turnarounDays + 2)
    );
    dueDate.setHours(9);
    dueDate.setHours(dataForCalc.submitTime.getHours() + (8 + dataForCalc.turnaroundHours - dataForCalc.timeTodayLeft - 1)
    );
    return dueDate;
  } 
}

// Test Area:
const assert = require('assert');

// Test Case 1: submitDate: 2021-03-23T10:21.000
//              turnaround: 5 hours
//              dueDate:  2021-03-23T15:21.000

let test_submit_date = new Date(2021, 2, 23, 10, 21, 0, 0);

const dueDate_1 = new Date(2021, 2, 23, 15, 21, 0, 0);
const result = dueDateCalculator(test_submit_date, 5);

console.log(assert.deepStrictEqual(result, dueDate_1) === undefined && 'ok');

// Test Case 2: submitDate: 2021-03-23T10:21.000
//              turnaround: 10 hours
//              dueDate:  2021-03-23T15:21.000

test_submit_date = new Date(2021, 2, 23, 10, 21, 0, 0);
const dueDate_2 = new Date(2021, 2, 24, 12, 21, 0, 0);
const result_2 = dueDateCalculator(test_submit_date, 10);

console.log(assert.deepStrictEqual(result_2, dueDate_2) === undefined && 'ok');

// Test Case 3: submitDate: 2021-03-23T10:21.000
//              turnaround: 16 hours
//              dueDate:  2021-03-23T15:21.000

test_submit_date = new Date(2021, 2, 23, 10, 21, 0, 0);
const dueDate_3 = new Date(2021, 2, 25, 10, 21, 0, 0);
const result_3 = dueDateCalculator(test_submit_date, 16);

console.log(assert.deepStrictEqual(result_3, dueDate_3) === undefined && 'ok');

// Test Case 4: submitDate: 2021-03-23T10:21.000
//              turnaround: 32 hours
//              dueDate:  2021-03-23T15:21.000

test_submit_date = new Date(2021, 2, 23, 10, 21, 0, 0);
const dueDate_4 = new Date(2021, 2, 29, 10, 21, 0, 0);
const result_4 = dueDateCalculator(test_submit_date, 32);

console.log(assert.deepStrictEqual(result_4, dueDate_4) === undefined && 'ok');

// Test Case 5: submitDate: 2021-03-23T8:21.000
//              turnaround: 10 hours
//              dueDate:  'The service only available between 9AM-5PM'

test_submit_date = new Date(2021, 2, 23, 8, 21, 0, 0);
const dueDate_5 = 'The service only available between 9AM-5PM';
const result_5 = dueDateCalculator(test_submit_date, 10);

console.log(assert.deepStrictEqual(result_5, dueDate_5) === undefined && 'ok');

// Test Case 6: submitDate: 2021-03-23T10:21.000
//              turnaround: 60 hours
//              dueDate:  'The maximum tournaround time to be handled is 40 hour or less.'

test_submit_date = new Date(2021, 2, 23, 10, 21, 0, 0);
const dueDate_6 =
  'The maximum tournaround time to be handled is 40 hour or less.';
const result_6 = dueDateCalculator(test_submit_date, 60);

console.log(assert.deepStrictEqual(result_6, dueDate_6) === undefined && 'ok');

// Test Case 7: submitDate: 2021-03-23T10:21.000
//              turnaround: 40 hours
//              dueDate:  2021, 2, 30, 10, 21, 0, 0

test_submit_date = new Date(2021, 2, 23, 10, 21, 0, 0);
const dueDate_7 = new Date(2021, 2, 30, 10, 21, 0, 0);
const result_7 = dueDateCalculator(test_submit_date, 40);

console.log(assert.deepStrictEqual(result_7, dueDate_7) === undefined && 'ok');
