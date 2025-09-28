import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'package:smart_tourist_safety_app/screens/chatbot_screen.dart';
import 'package:smart_tourist_safety_app/screens/recommendations_screen.dart';

class SafetyDashboardWidget extends StatefulWidget {
  const SafetyDashboardWidget({super.key});

  @override
  State<SafetyDashboardWidget> createState() => _SafetyDashboardWidgetState();
}

class _SafetyDashboardWidgetState extends State<SafetyDashboardWidget> {
  final ApiService _apiService = ApiService();
  int _recentIncidents = 0;
  int _myReports = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      // Load recent incidents in area (you might need location data)
      final incidents = await _apiService.getIncidentReports();
      
      // TODO: Filter by user's reports vs all incidents
      setState(() {
        _recentIncidents = incidents.length;
        _myReports = incidents.length; // This should be filtered by user
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Icon(
                  Icons.security,
                  color: Theme.of(context).primaryColor,
                  size: 28,
                ),
                const SizedBox(width: 12),
                const Text(
                  'Safety Center',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                if (_isLoading)
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Quick Actions Row
            Row(
              children: [
                Expanded(
                  child: _buildQuickAction(
                    icon: Icons.emergency,
                    label: 'Emergency SOS',
                    color: Colors.red,
                    onTap: () => _showEmergencyDialog(context),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildQuickAction(
                    icon: Icons.report,
                    label: 'Report Incident',
                    color: Colors.orange,
                    onTap: () => Navigator.pushNamed(context, '/report-incident'),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Statistics Row
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Recent Incidents',
                    _recentIncidents.toString(),
                    Icons.warning,
                    Colors.amber,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'My Reports',
                    _myReports.toString(),
                    Icons.assignment,
                    Colors.blue,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Quick Tips
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.green.shade200),
              ),
              child: Row(
                children: [
                  Icon(Icons.lightbulb, color: Colors.green.shade600),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Stay alert in crowded areas and keep emergency contacts updated.',
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const Divider(), // Optional: for visual separation
            ListTile(
              leading: const Icon(Icons.assistant),
              title: const Text('AI Safety Assistant'),
              onTap: () {
                Navigator.pop(context); // Close the drawer first
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ChatbotScreen()),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.thumb_up),
              title: const Text('Safe Recommendations'),
              onTap: () {
                Navigator.pop(context); // Close the drawer first
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const RecommendationsScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 16),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    color: color,
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  void _showEmergencyDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.emergency, color: Colors.red, size: 28),
            const SizedBox(width: 8),
            const Text('Emergency SOS'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Are you in immediate danger?'),
            SizedBox(height: 16),
            Text(
              'This will:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text('• Send your location to emergency contacts'),
            Text('• Alert local authorities'),
            Text('• Create an emergency incident report'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _triggerEmergency();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('SEND SOS'),
          ),
        ],
      ),
    );
  }

  Future<void> _triggerEmergency() async {
    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(color: Colors.red),
            const SizedBox(height: 16),
            const Text('Sending Emergency Alert...'),
          ],
        ),
      ),
    );

    try {
      // Trigger SOS through API
      final response = await _apiService.triggerSOS(
        touristId: 'current_user_id', // TODO: Get from user session
        message: 'Emergency SOS triggered from mobile app',
      );

      Navigator.pop(context); // Close loading dialog

      if (response['error'] == true) {
        _showErrorDialog('Failed to send emergency alert: ${response['message']}');
      } else {
        _showSuccessDialog();
      }
    } catch (e) {
      Navigator.pop(context); // Close loading dialog
      _showErrorDialog('Failed to send emergency alert. Please call emergency services directly.');
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 28),
            const SizedBox(width: 8),
            const Text('SOS Sent'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Emergency alert has been sent successfully.'),
            SizedBox(height: 16),
            Text(
              'Help is on the way:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text('✓ Authorities have been notified'),
            Text('✓ Your location has been shared'),
            Text('✓ Emergency contacts alerted'),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.error, color: Colors.red, size: 28),
            const SizedBox(width: 8),
            const Text('Alert Failed'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red.shade200),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'If you are in immediate danger:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text('• Call 112 (Emergency - Europe)'),
                  Text('• Call 911 (Emergency - US/Canada)'),
                  Text('• Call your local emergency number'),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // Open phone dialer to emergency number
              // You might want to use url_launcher for this
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Call Emergency'),
          ),
        ],
      ),
    );
  }
}
