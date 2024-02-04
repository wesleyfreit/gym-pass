import { app } from './app';

app.listen(
  {
    host: '0.0.0.0',
    port: 3333,
  },
  () => {
    console.log('Server is running on port 3333');
  },
);
