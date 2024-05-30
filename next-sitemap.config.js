module.exports = {
    siteUrl: 'https://expressentry.ca',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    },
  };