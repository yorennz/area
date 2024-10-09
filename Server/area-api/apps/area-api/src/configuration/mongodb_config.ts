const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || '27017';

const MONGO_URI = `mongodb://${host}:${port}`;
const MONGO_USER = process.env.MONGO_USER || 'hein';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'ilnesarreteplus';
const MONGO_DB_NAME = process.env.MONGO_DEFAULT || 'area-dev';


export default () => ({
    port: parseInt(process.env.PORT, 10) || 8080,
    database:{
        URI: MONGO_URI,
        USER: MONGO_USER,
        PASS:MONGO_PASSWORD,
        DB_NAME:MONGO_DB_NAME,
    }
})