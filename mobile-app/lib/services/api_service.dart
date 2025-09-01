// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // IMPORTANT: Replace this with your computer's actual IP address from Step 2.
  // Your phone and computer MUST be on the same Wi-Fi network.
  // Example: 'http://192.168.1.10:5000/api'
  static const String _baseUrl = 'http://192.168.1.69:5000/api';

  // Registers a new tourist
  Future<Map<String, dynamic>> registerTourist(String name, String deviceId) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'deviceId': deviceId,
          'contactInfo': {'phone': '555-123-4567', 'email': 'tourist@app.com'}
        }),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on registerTourist: $e');
      return {'error': true, 'message': 'Could not connect to the server.'};
    }
  }

  // Updates the tourist's location
  Future<Map<String, dynamic>> updateLocation(String deviceId, double latitude, double longitude) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/location/$deviceId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'latitude': latitude, 'longitude': longitude}),
      );
      return _handleResponse(response);
    } catch (e) {
       print('Network Error on updateLocation: $e');
      return {'error': true, 'message': 'Could not connect to the server.'};
    }
  }

  // Triggers a panic alert for a device
  Future<Map<String, dynamic>> triggerPanic(String deviceId) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/panic/$deviceId'),
        headers: {'Content-Type': 'application/json'},
      );
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on triggerPanic: $e');
      return {'error': true, 'message': 'Could not connect to the server.'};
    }
  }

  // Helper to decode response and handle errors
  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      print('API Error: ${response.statusCode} - ${response.body}');
      return {'error': true, 'message': 'API Error: ${response.statusCode}'};
    }
  }
}

