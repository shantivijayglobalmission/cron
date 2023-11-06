import cron from 'node-cron';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let taskCount = 0; // Initialize a counter

// Define your task
const myTask = async () => {
  taskCount++; // Increment the counter on each execution
  try {
    // Crawl the website (www.google.com)
    const response = await axios.get('https://dhanvarshaclub.shop/wtcron-02929280.php');

    // Parse the HTML content
    const $ = cheerio.load(response.data);

    // You can now manipulate and extract data from the web page using Cheerio
    // For example, let's extract the title
    const h1 = $('h1').text();
    console.log(`Title (${taskCount} times):`, h1);

  } catch (error) {
    console.error('Error while crawling:', error);
  }
};

// Schedule the task to run every 1 minute
const scheduledTask = cron.schedule('*/3 * * * *', myTask, {
  scheduled: true,
  timezone: 'Asia/Kolkata', // Replace 'Your_Timezone' with your desired timezone (e.g., 'America/New_York')
});

// You can stop the scheduled task if needed
// scheduledTask.stop();

// Optionally, you can handle errors
scheduledTask.on('error', (error) => {
  console.error('Cron job error:', error);
});

// Optionally, you can handle task completion
scheduledTask.on('end', () => {
  console.log('Cron job has ended.');
});

app.get('/', (req, res) => {
  res.json({ Status: 'Up' });
});

app.get('/count', (req, res) => {
  res.json({ TaskCount: taskCount });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});