import { createApp } from "./app";
import logger from "./infrastructure/logging/Logger";

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});