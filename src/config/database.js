import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "weCareLebanon"
        });
        console.log(`Connected to the database ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        process.exit(1);
    }

}

export default connectToDatabase;