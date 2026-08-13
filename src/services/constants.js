// constants.js

export const SaveStatus = Object.freeze({
  SUCCESS: 'SUCCESS',
  DUPLICATE: 'DUPLICATE',
  ERROR: 'ERROR'
});

// Lookup table mapping status to visual metadata
export const StatusVisuals = Object.freeze({
  [SaveStatus.SUCCESS]: {
    color: '#1F7A45',
    symbol: 'CHECKMARK',
    badgeText: '✓'
  },
  [SaveStatus.DUPLICATE]: {
    color: '#928545',
    symbol: 'DOT',
    badgeText: '•'
  },
  [SaveStatus.ERROR]: {
    color: '#B2402F',
    symbol: 'CROSS',
    badgeText: '!'
  }
});