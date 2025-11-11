const os = require("os");

/**
 * Jalankan server Express dan tampilkan IP lokal.
 * @param {object} app - instance dari Express
 * @param {number} PORT - port server
 */
function startServer(app, PORT) {
  const nets = os.networkInterfaces();
  let localIP = "localhost";

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running at:`);
    console.log(`- Local:   http://localhost:${PORT}`);
    console.log(`- Network: http://${localIP}:${PORT}`);
  });
}

module.exports = startServer;
