import { IDConverter } from '../source/classes/IDConverter.js'

// Declare variables to use for tests
let id;
let date;
let dayIndex;
let monthIndex;
let suffix;
let testNum;
let testEntries = ['D 210601', 'D 210603', 'D 210604', 'D 210605'];
let testIndex;

// gets the current date and deconstructs it
let currDate = new Date();
let day = currDate.getDate();
day = (day < 10 ? '0' : '') + day;
let month = currDate.getMonth() + 1;
month = (month < 10 ? '0' : '') + month;
const year = currDate.getFullYear() % 100;

describe('Testing getDateFromID', () => {
    test('Testing day case', () => {
        date = IDConverter.getDateFromID( 'D 210602', 'day');
        expect(date.toString().includes('Wed Jun 02')).toBe(true);
    });
    test('Testing month case', () => {
        date = IDConverter.getDateFromID('M 2106', 'month');
        expect(date.toString().includes('Jun')).toBe(true);
    });
    test('Testing year case', () => {
        date = IDConverter.getDateFromID('Y 21', 'year');
        expect(date.toString().includes('2021')).toBe(true);
    });
});

describe('Testing getDayFromDate', () => {
    test('Testing Sunday case', () => {
        let testDate = new Date('May 30, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Sunday');
    });
    test('Testing Monday case', () => {
        let testDate = new Date('May 31, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Monday');
    });
    test('Testing Tuesday case', () => {
        let testDate = new Date('June 1, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Tuesday');
    });
    test('Testing Wednesday case', () => {
        let testDate = new Date('June 2, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Wednesday');
    });
    test('Testing Thursday case', () => {
        let testDate = new Date('June 3, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Thursday');
    });
    test('Testing Friday case', () => {
        let testDate = new Date('June 4, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Friday');
    });
    test('Testing Saturday case', () => {
        let testDate = new Date('June 5, 2021');
        dayIndex = IDConverter.getDayFromDate(testDate);
        expect(dayIndex).toBe('Saturday');
    });
});

describe('Testing getMonthFromDate', () => {
    test('Testing January case', () => {
        let testDate = new Date('January 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('January');
    });
    test('Testing February case', () => {
        let testDate = new Date('February 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('February');
    });
    test('Testing March case', () => {
        let testDate = new Date('March 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('March');
    });
    test('Testing April case', () => {
        let testDate = new Date('April 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('April');
    });
    test('Testing May case', () => {
        let testDate = new Date('May 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('May');
    });
    test('Testing June case', () => {
        let testDate = new Date('June 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('June');
    });
    test('Testing July case', () => {
        let testDate = new Date('July 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('July');
    });
    test('Testing August case', () => {
        let testDate = new Date('August 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('August');
    });
    test('Testing September case', () => {
        let testDate = new Date('September 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('September');
    });
    test('Testing October case', () => {
        let testDate = new Date('October 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('October');
    });
    test('Testing November case', () => {
        let testDate = new Date('November 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('November');
    });
    test('Testing December case', () => {
        let testDate = new Date('December 1, 2021');
        monthIndex = IDConverter.getMonthFromDate(testDate);
        expect(monthIndex).toBe('December');
    });
});

describe('Testing getSuffixOfDate', () => {
    test('Testing 11/12/13 case', () => {
        let testDate = new Date('June 11, 2021');
        suffix = IDConverter.getSuffixOfDate(testDate);
        expect(suffix).toBe('th');
    });
    test('Testing modulo 1 case', () => {
        let testDate = new Date('June 1, 2021');
        suffix = IDConverter.getSuffixOfDate(testDate);
        expect(suffix).toBe('st');
    });
    test('Testing modulo 2 case', () => {
        let testDate = new Date('June 2, 2021');
        suffix = IDConverter.getSuffixOfDate(testDate);
        expect(suffix).toBe('nd');
    });
    test('Testing modulo 3 case', () => {
        let testDate = new Date('June 3, 2021');
        suffix = IDConverter.getSuffixOfDate(testDate);
        expect(suffix).toBe('rd');
    });
    test('Testing else case', () => {
        let testDate = new Date('June 4, 2021');
        suffix = IDConverter.getSuffixOfDate(testDate);
        expect(suffix).toBe('th');
    });
});

describe('Testing stringifyNum', () => {
    test('Testing Single Digit case', () => {
        testNum = IDConverter.stringifyNum(7);
        let absoluteEquality = (testNum === '07');
        expect(absoluteEquality).toBe(true);
    });
    test('Testing Multiple Digit case', () => {
        testNum = IDConverter.stringifyNum(27);
        let absoluteEquality = (testNum === '27');
        expect(absoluteEquality).toBe(true);
    });
});


describe('Testing generateID', () => {
    test('Testing day case', () => {
        id = IDConverter.generateID('day', currDate);
        expect(id).toBe(`D ${year}${month}${day}`);
    });
    test('Testing month case', () => {
        id = IDConverter.generateID('month', currDate);
        expect(id).toBe(`M ${year}${month}`);
    });
    test('Testing year case', () => {
        id = IDConverter.generateID('year', currDate);
        expect(id).toBe(`Y ${year}`);
    });
    test('Testing error case', () => {
        id = IDConverter.generateID('error', currDate);
        expect(id).toBe(undefined);
    });
    test('Testing different branch for the date', () => {
        let branchDate = new Date("December 11, 2021");
        id = IDConverter.generateID('day', branchDate);
        expect(id).toBe('D 211211');
    });
});

describe('Testing generateIndex', () => {
    test('Testing return value', () => {
        testIndex = IDConverter.generateIndex(testEntries, 'D 210602');
        expect(testIndex).toBe(1);
    });
});