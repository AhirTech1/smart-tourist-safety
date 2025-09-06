const Alert = require('../models/alert');
const Tourist = require('../models/tourist');
const User = require('../models/User');
const axios = require('axios');

class AlertService {
  constructor() {
    this.emergencyServices = {
      police: { number: '100', priority: 1 },
      ambulance: { number: '108', priority: 2 },
      fire: { number: '101', priority: 3 },
      touristHelpline: { number: '1363', priority: 4 }
    };
  }

  /**
   * Send smart alert with context and notifications
   * @param {object} alertData - Alert information
   * @returns {object} Created alert with notification status
   */
  async sendSmartAlert(alertData) {
    try {
      // Create alert in database
      const alert = await this.createAlert(alertData);
      
      // Get tourist and emergency contacts
      const tourist = await Tourist.findById(alertData.userId).populate('emergencyContacts');
      
      if (!tourist) {
        throw new Error('Tourist not found');
      }

      // Find nearest emergency services
      const nearestServices = await this.findNearestEmergencyServices(alertData.location);
      
      // Update alert with emergency services info
      alert.nearestEmergencyServices = nearestServices;
      await alert.save();

      // Send notifications to all relevant parties
      const notificationResults = await this.sendNotifications(alert, tourist);
      
      // Log notification results
      alert.notificationsSent = notificationResults;
      await alert.save();

      console.log(`Smart alert created: ${alert._id} for tourist: ${tourist.name}`);
      
      return {
        alert,
        notificationsSent: notificationResults.length,
        nearestServices: nearestServices.length
      };

    } catch (error) {
      console.error('Error sending smart alert:', error);
      throw error;
    }
  }

  /**
   * Create alert in database
   */
  async createAlert(alertData) {
    const alertDoc = new Alert({
      tourist: alertData.userId,
      type: alertData.type || 'HighRisk',
      location: {
        latitude: alertData.location.lat,
        longitude: alertData.location.lng,
        address: alertData.location.address,
        accuracy: alertData.location.accuracy
      },
      message: alertData.message || 'Risk level elevated - immediate attention required',
      severity: this.determineSeverity(alertData.riskScore),
      riskScore: alertData.riskScore,
      anomalies: alertData.anomalies || [],
      timestamp: new Date()
    });

    return await alertDoc.save();
  }

  /**
   * Send notifications to emergency contacts and admin
   */
  async sendNotifications(alert, tourist) {
    const notifications = [];
    
    try {
      // 1. Send notification log to tourist's device (placeholder)
      if (tourist.deviceId) {
        console.log(`Would send push notification to device: ${tourist.deviceId}`);
        console.log(`Title: Safety Alert`);
        console.log(`Message: ${alert.message}`);
        
        notifications.push({
          recipient: tourist.deviceId,
          type: 'push',
          status: 'logged',
          timestamp: new Date()
        });
      }

      // 2. Send SMS to emergency contacts
      for (const contact of tourist.emergencyContacts) {
        if (contact.phoneNumber) {
          const smsResult = await this.sendSMS(
            contact.phoneNumber,
            this.generateEmergencyMessage(tourist, alert, contact)
          );
          notifications.push({
            recipient: contact.phoneNumber,
            type: 'sms',
            status: smsResult.success ? 'sent' : 'failed',
            timestamp: new Date()
          });
        }
      }

      // 3. Send email notifications
      for (const contact of tourist.emergencyContacts) {
        if (contact.email) {
          const emailResult = await this.sendEmail(
            contact.email,
            `Emergency Alert: ${tourist.name}`,
            this.generateDetailedEmailMessage(tourist, alert, contact)
          );
          notifications.push({
            recipient: contact.email,
            type: 'email',
            status: emailResult.success ? 'sent' : 'failed',
            timestamp: new Date()
          });
        }
      }

      // 4. Notify admin dashboard (WebSocket or Server-Sent Events)
      await this.notifyAdminDashboard(alert, tourist);

    } catch (error) {
      console.error('Error sending notifications:', error);
    }

    return notifications;
  }

  /**
   * Send notification log (Firebase push notification removed)
   */
  async logNotification(deviceToken, title, body, data = {}) {
    try {
      console.log('Notification log entry:');
      console.log(`Device Token: ${deviceToken}`);
      console.log(`Title: ${title}`);
      console.log(`Body: ${body}`);
      console.log(`Data: ${JSON.stringify(data)}`);
      
      return { success: true, messageId: 'log_' + Date.now() };
    } catch (error) {
      console.error('Error logging notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS (placeholder - integrate with SMS service like Twilio)
   */
  async sendSMS(phoneNumber, message) {
    try {
      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      console.log(`SMS to ${phoneNumber}: ${message}`);
      
      // Placeholder for actual SMS implementation
      return { success: true, messageId: 'sms_' + Date.now() };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email (placeholder - integrate with email service)
   */
  async sendEmail(email, subject, body) {
    try {
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      console.log(`Email to ${email}: ${subject}`);
      console.log(`Body: ${body}`);
      
      // Placeholder for actual email implementation
      return { success: true, messageId: 'email_' + Date.now() };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Find nearest emergency services using coordinates
   */
  async findNearestEmergencyServices(location) {
    const services = [];
    
    try {
      console.log(`Finding emergency services near ${location.lat}, ${location.lng}`);
      
      // TODO: Integrate with Google Places API or local emergency services database
      // For now, return placeholder data
      
      const placeholderServices = [
        {
          type: 'police',
          name: 'Local Police Station',
          distance: 1200,
          contact: '100',
          coordinates: {
            lat: location.lat + 0.01,
            lng: location.lng + 0.01
          }
        },
        {
          type: 'hospital',
          name: 'City Hospital',
          distance: 2500,
          contact: '108',
          coordinates: {
            lat: location.lat - 0.02,
            lng: location.lng + 0.015
          }
        }
      ];

      return placeholderServices;
    } catch (error) {
      console.error('Error finding emergency services:', error);
      return [];
    }
  }

  /**
   * Notify admin dashboard about new alert
   */
  async notifyAdminDashboard(alert, tourist) {
    try {
      // TODO: Implement WebSocket or Server-Sent Events for real-time dashboard updates
      console.log('Admin dashboard notified about alert:', alert._id);
      
      // Placeholder for dashboard notification
      return { success: true };
    } catch (error) {
      console.error('Error notifying admin dashboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate emergency message for SMS
   */
  generateEmergencyMessage(tourist, alert, contact) {
    const locationText = alert.location.address || 
      `${alert.location.latitude.toFixed(6)}, ${alert.location.longitude.toFixed(6)}`;
    
    return `🚨 EMERGENCY ALERT 🚨
${contact.name}, ${tourist.name} needs assistance.
Location: ${locationText}
Risk Level: ${alert.severity.toUpperCase()}
Time: ${alert.timestamp.toLocaleString()}
Message: ${alert.message}

Emergency Services:
Police: 100 | Ambulance: 108
Tourist Helpline: 1363

Google Maps: https://maps.google.com/?q=${alert.location.latitude},${alert.location.longitude}`;
  }

  /**
   * Generate detailed email message
   */
  generateDetailedEmailMessage(tourist, alert, contact) {
    const locationText = alert.location.address || 
      `${alert.location.latitude.toFixed(6)}, ${alert.location.longitude.toFixed(6)}`;
    
    return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="background-color: #ff4444; color: white; padding: 20px; text-align: center;">
          <h1>🚨 EMERGENCY ALERT 🚨</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${contact.name},</p>
          
          <p>This is an emergency alert regarding <strong>${tourist.name}</strong> who has been identified as needing immediate assistance.</p>
          
          <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-left: 4px solid #ff4444;">
            <h3>Alert Details:</h3>
            <ul>
              <li><strong>Tourist:</strong> ${tourist.name}</li>
              <li><strong>Phone:</strong> ${tourist.phoneNumber}</li>
              <li><strong>Location:</strong> ${locationText}</li>
              <li><strong>Risk Level:</strong> ${alert.severity.toUpperCase()}</li>
              <li><strong>Time:</strong> ${alert.timestamp.toLocaleString()}</li>
              <li><strong>Alert Type:</strong> ${alert.type}</li>
            </ul>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3>Message:</h3>
            <p>${alert.message}</p>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3>Emergency Contacts:</h3>
            <ul>
              <li>Police: 100</li>
              <li>Ambulance: 108</li>
              <li>Fire: 101</li>
              <li>Tourist Helpline: 1363</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://maps.google.com/?q=${alert.location.latitude},${alert.location.longitude}" 
               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              📍 View Location on Map
            </a>
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            This alert was generated automatically by the Smart Tourist Safety System.
            If this is a false alarm, please contact the system administrator.
          </p>
        </div>
      </body>
    </html>`;
  }

  /**
   * Determine alert severity based on risk score
   */
  determineSeverity(riskScore) {
    if (riskScore >= 0.8) return 'critical';
    if (riskScore >= 0.6) return 'high';
    if (riskScore >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Update alert status
   */
  async updateAlertStatus(alertId, status, resolvedBy = null, notes = '') {
    try {
      const updateData = { 
        status, 
        notes 
      };
      
      if (status === 'Resolved' || status === 'False_Alarm') {
        updateData.resolvedAt = new Date();
        if (resolvedBy) {
          updateData.resolvedBy = resolvedBy;
        }
      }

      const alert = await Alert.findByIdAndUpdate(
        alertId, 
        updateData, 
        { new: true }
      );

      console.log(`Alert ${alertId} status updated to ${status}`);
      return alert;
    } catch (error) {
      console.error('Error updating alert status:', error);
      throw error;
    }
  }

  /**
   * Get active alerts for dashboard
   */
  async getActiveAlerts(limit = 50) {
    try {
      return await Alert.find({ 
        status: { $in: ['Active', 'Acknowledged'] } 
      })
      .populate('tourist', 'name phoneNumber email')
      .sort({ timestamp: -1 })
      .limit(limit);
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  }
}

module.exports = new AlertService();
