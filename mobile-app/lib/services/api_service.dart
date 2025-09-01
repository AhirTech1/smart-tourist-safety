import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use 10.0.2.2 for Android emulator to connect to localhost on your computer
  static const String _baseUrl = 'http://192.168.1.69:5000/api';

  // Login method
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/login'), // Corrected endpoint
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
      // Determine if the ID is Aadhar or Passport (simple length check)
      final bool isAadhar = idNumber != null && idNumber.replaceAll(' ', '').length == 12;

      final response = await http.post(
        Uri.parse('$_baseUrl/auth/register'), // 1. CORRECTED ENDPOINT
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'phoneNumber': phoneNumber,
          'password': password,
          'tripDuration': tripDuration,
          'tripItinerary': tripItinerary ?? '',
          // 2. CORRECTED KEYS to match backend model
          if (isAadhar) 'aadharNumber': idNumber,
          if (!isAadhar) 'passportNumber': idNumber,
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
      String touristId, double latitude, double longitude) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/location/$touristId'), // Use touristId, not deviceId
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
  Future<Map<String, dynamic>> triggerPanic(String touristId) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/tourist/panic/$touristId'), // Use touristId
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
      final errorBody = jsonDecode(response.body);
      return {
        'error': true,
        'message': 'login error: ${response.statusCode}',
        'details': errorBody
      };
    }
  }
}
