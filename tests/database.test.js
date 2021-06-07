/**
 * TODO:
 * getStoreFromID
*/
import { Database } from '../source/classes/database.js';

let store;

describe('Testing getStoreFromID', () => {
  test('Testing day case', () => {
    store = Database.getStoreFromID('D 210602');
    expect(store).toBe('daily');
  });
  test('Testing month case', () => {
    store = Database.getStoreFromID('M 2106');
    expect(store).toBe('monthly');
  });
  test('Testing year case', () => {
    store = Database.getStoreFromID('Y 21');
    expect(store).toBe('yearly');
  });
  test('Testing bullet case', () => {
    store = Database.getStoreFromID('B 210602 00 00');
    expect(store).toBe('bullets');
  });
  test('Testing lable case', () => {
    store = Database.getStoreFromID('L001');
    expect(store).toBe('labels');
  });
});
