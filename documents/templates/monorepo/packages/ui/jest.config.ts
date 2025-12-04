import preset from '@sba/jest-preset'
export default { ...preset, testEnvironment: 'jsdom', setupFilesAfterEnv: ['@testing-library/jest-dom'] }
