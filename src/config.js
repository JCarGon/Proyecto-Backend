import 'dotenv/config';

const config = {
  port: process.env.PORT || 8080,
  app: {
    secretKey: process.env.SECRET_KEY
  },
  database: {
    url: process.env.DATABASE_URL
  }
}

export default config;
