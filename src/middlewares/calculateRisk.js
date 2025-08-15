const calculateRisk = (req) => {
  let risk = 0.1;

  if (req.path.includes("/users") || req.method === "DELETE") risk += 0.4;
  if (!req.ip.startsWith("192.168.")) risk += 0.2;
  const hour = new Date().getHours();
  if (hour < 8 || hour > 18) risk += 0.2;

  return Math.min(risk, 1.0);
};

const mapRiskToExpiry = (risk) => {
  if (risk < 0.3) return "1h";
  if (risk < 0.5) return "30m";
  return "5m";
};

module.exports = { calculateRisk, mapRiskToExpiry };
