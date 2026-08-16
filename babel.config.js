require('dotenv').config();

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'],
      },
    ],
  ],
};
