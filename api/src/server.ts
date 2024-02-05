import { env } from './env';
import { app } from './app';

const port = env.PORT;

app.listen({ host: '0.0.0.0', port }, () => {
  console.log(`Server is running on port ${port}`);
});
