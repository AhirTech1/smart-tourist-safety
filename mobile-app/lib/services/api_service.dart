import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String _baseUrl = 'http://192.168.1.69:5000/api';

  // Login method
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on login: $e');
      return {'error': true, 'message': 'Could not connect to the server.'};
    }
  }

  // Registers a new tourist with all required fields
  Future<Map<String, dynamic>> registerTourist({
    required String name,
    required String email,
    required String phoneNumber,
    required String password,
    required int tripDuration,
    String? tripItinerary,
    String? idNumber,
    required List<Map<String, dynamic>> emergencyContacts,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'phoneNumber': phoneNumber,
          'password': password,
          'tripDuration': tripDuration,
          'tripItinerary': tripItinerary ?? '',
          'idNumber': idNumber ?? '',
          'emergencyContacts': emergencyContacts,
        }),
      );
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on registerTourist: $e');
      return {'error': true, 'message': 'Could not connect to the server.'};
    }
  }

  // Updates the tourist's location
  Future<Map<String, dynamic>> updateLocation(
      String deviceId, double latitude, double longitude) async {
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
