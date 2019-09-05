const whitelist = [
    'http://localhost',
    'http://localhost:3003',
    'http://localhost:3000',
    'http://ec2-3-16-106-158.us-east-2.compute.amazonaws.com',
    'http://ec2-3-16-106-158.us-east-2.compute.amazonaws.com/react',
    'http://dataproject-env.u2t3prjsea.us-east-2.elasticbeanstalk.com',
    'http://dataproject-env.u2t3prjsea.us-east-2.elasticbeanstalk.com/react'
];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true)
      } else {
          callback(new Error('Not allowed by CORS'))
      }
  }
};