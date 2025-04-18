import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Restaurants service running on port ${PORT}`);
    });
});
