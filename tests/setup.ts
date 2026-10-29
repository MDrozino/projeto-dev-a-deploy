// Loads .env locally. In CI there is no .env file, the variables come from the workflow.
try {
  process.loadEnvFile();
} catch {
  // no .env file, ignore
}
