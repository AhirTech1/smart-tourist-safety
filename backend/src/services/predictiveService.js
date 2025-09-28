const { spawn } = require('child_process');

const getPredictedHighRiskZones = (lat, lon) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['-u', './src/services/risk_prediction_model/predict.py', lat, lon]);

    let dataToSend = '';
    pythonProcess.stdout.on('data', (data) => {
      dataToSend += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script exited with code ${code}`));
      }
      try {
        const zones = JSON.parse(dataToSend);
        resolve(zones);
      } catch (error) {
        reject(new Error('Failed to parse prediction result'));
      }
    });
  });
};

module.exports = { getPredictedHighRiskZones };