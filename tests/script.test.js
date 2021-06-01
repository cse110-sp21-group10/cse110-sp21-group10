/*
**
 * @jest-environment jsdom
 */
/**
 * Functions to Test:
 *      generateID(); Check to make sure the correct ID is generated
 */

 import { generateID } from '../source/scripts/script.js'

 let id;

describe('Testing generateID', () => {
    test('Testing day case', () => {
        id = generateID('day');
        expect(id).toBe('D 210531');
    });
});
