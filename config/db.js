import mongoose from "mongoose";

const connect = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI

        const connection = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const url = `${ connection.connection.host }:${ connection.connection.port }`;

        console.log(`Database is connected on ${url}`);
    } catch (err) {
        console.log('Error from Data Base', err)
        process.exit(1)
    }
}

export default connect