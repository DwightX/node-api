module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 4000,
    URL: process.env.BASE_URL || 'http://localhost:4000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://carter91jr:howichill18@customerapi.wunlb.mongodb.net/?retryWrites=true&w=majority&appName=CustomerApi',
    JWT_SECRET: process.env.JWT_SECRET || 'secret1'
  }