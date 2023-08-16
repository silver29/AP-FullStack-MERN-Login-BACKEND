import app from './app.js';
import {connectDB} from './db.js';

const PORT = process.env.PORT || 4000

connectDB();
app.listen(PORT);
//console.log('Server on port',4000);
console.log(`Server on port ${PORT}`);

