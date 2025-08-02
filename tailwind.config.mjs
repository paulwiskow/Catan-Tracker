// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     // ...
//     'node_modules/flowbite-react/lib/esm/**/*.js',
//   ],
//   plugins: [
//     // ...
//     require('flowbite/plugin'),
//   ],
// };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     'node_modules/flowbite-react/lib/esm/**/*.js',
//   ],
//   plugins: [
//     require('flowbite/plugin'),
//   ],
// };

/** @type {import('tailwindcss').Config} */
const flowbitePlugin = (await import('flowbite/plugin')).default;

export default {
  content: [
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  plugins: [
    flowbitePlugin,
  ],
};