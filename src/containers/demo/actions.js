'use strict';

/*
 * action types
 */
export const INIT_DEMO = 'INIT_DEMO';
export const UPDATE_DEMO = 'UPDATE_DEMO';

/*
 * action creators
 */
export function initDemo(data) {
  return { type: INIT_DEMO, data };
}

export function updateDemo() {
  return { type: UPDATE_DEMO };
}
