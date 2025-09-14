import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiService {
  // GCP App Engine URL - No hibernation, always fast!
  static const String _baseUrl = 'https://sih-2025-471306.el.r.appspot.com/api';
  
  // HTTP client with connection pooling and timeout configuration
  static final http.Client _client = http.Client();
  
  // Optimized timeout for better performance
  static const Duration _timeout = Duration(seconds: 20);
  static const Duration _shortTimeout = Duration(seconds: 10);
  
  // Connection retry configuration
  static const int _maxRetries = 3;
  static const Duration _retryDelay = Duration(seconds: 2);
  
  // Login method - simplified for GCP (no wake-up needed)
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final fullUrl = '$_baseUrl/auth/login';
      print('Attempting login to: $fullUrl');
      
      final response = await _client.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(_timeout);
      
      print('Login response status: ${response.statusCode}');
      return _handleResponse(response);
    } on SocketException catch (e) {
      print('Network Error (SocketException): $e');
      return {'error': true, 'message': 'No internet connection. Please check your network.'};
    } on HttpException catch (e) {
      print('HTTP Error: $e');
      return {'error': true, 'message': 'Server connection failed. Please try again.'};
    } on FormatException catch (e) {
      print('Format Error: $e');
      return {'error': true, 'message': 'Invalid server response format.'};
    } catch (e) {
      print('Unexpected Error on login: $e');
      return {'error': true, 'message': 'Could not connect to the server. Please try again later.'};
    }
  }

  // Register method - simplified for GCP (no wake-up needed)
  Future<Map<String, dynamic>> register(String name, String email, String password, String phoneNumber) async {
    try {
      final fullUrl = '$_baseUrl/auth/register';
      print('Attempting registration to: $fullUrl');
      
      final response = await _client.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'phoneNumber': phoneNumber,
        }),
      ).timeout(_timeout);
      
      print('Registration response status: ${response.statusCode}');
      return _handleResponse(response);
    } on SocketException catch (e) {
      print('Network Error (SocketException): $e');
      return {'error': true, 'message': 'No internet connection. Please check your network.'};
    } on HttpException catch (e) {
      print('HTTP Error: $e');
      return {'error': true, 'message': 'Server connection failed. Please try again.'};
    } on FormatException catch (e) {
      print('Format Error: $e');
      return {'error': true, 'message': 'Invalid server response format.'};
    } catch (e) {
      print('Unexpected Error on registration: $e');
      return {'error': true, 'message': 'Could not connect to the server. Please try again later.'};
    }
  }

  // Register Tourist method with named parameters for detailed registration
  Future<Map<String, dynamic>> registerTourist({
    required String name,
    required String email,
    required String phoneNumber,
    required String password,
    required int tripDuration,
    required String tripItinerary,
    required String idNumber,
    required List<Map<String, String>> emergencyContacts,
  }) async {
    try {
      final fullUrl = '$_baseUrl/auth/register';
      print('Attempting tourist registration to: $fullUrl');
      
      final response = await _client.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'phoneNumber': phoneNumber,
          'tripDuration': tripDuration,
          'tripItinerary': tripItinerary,
          'idNumber': idNumber,
          'emergencyContacts': emergencyContacts,
        }),
      ).timeout(_timeout);
      
      print('Tourist registration response status: ${response.statusCode}');
      return _handleResponse(response);
    } on SocketException catch (e) {
      print('Network Error (SocketException): $e');
      return {'error': true, 'message': 'No internet connection. Please check your network.'};
    } on HttpException catch (e) {
      print('HTTP Error: $e');
      return {'error': true, 'message': 'Server connection failed. Please try again.'};
    } on FormatException catch (e) {
      print('Format Error: $e');
      return {'error': true, 'message': 'Invalid server response format.'};
    } catch (e) {
      print('Unexpected Error on tourist registration: $e');
      return {'error': true, 'message': 'Could not connect to the server. Please try again later.'};
    }
  }

  // Updates the tourist's location
  Future<Map<String, dynamic>> updateLocation(
      String touristId, double latitude, double longitude) async {
    try {
      final response = await _client.post(
        Uri.parse('$_baseUrl/tourist/location/$touristId'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({'latitude': latitude, 'longitude': longitude}),
      ).timeout(_timeout);
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on updateLocation: $e');
      if (e.toString().contains('TimeoutException')) {
        return {'error': true, 'message': 'Location update timeout. Please try again.'};
      }
      return {'error': true, 'message': 'Could not update location.'};
    }
  }

  // Triggers a panic alert for a device with optional live location
  Future<Map<String, dynamic>> triggerPanic(String touristId, {double? latitude, double? longitude}) async {
    try {
      Map<String, dynamic> body = {};
      
      // Include location if available
      if (latitude != null && longitude != null) {
        body['location'] = {
          'latitude': latitude,
          'longitude': longitude,
          'timestamp': DateTime.now().toIso8601String(),
        };
        print('Sending panic alert with live location: $latitude, $longitude');
      } else {
        print('Sending panic alert without live location');
      }
      
      final response = await _client.post(
        Uri.parse('$_baseUrl/tourist/panic/$touristId'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body.isNotEmpty ? jsonEncode(body) : null,
      ).timeout(_timeout);
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on triggerPanic: $e');
      if (e.toString().contains('TimeoutException')) {
        return {'error': true, 'message': 'Panic alert timeout. Please try again.'};
      }
      return {'error': true, 'message': 'Could not send panic alert.'};
    }
  }

  // Fetches high-risk zones
  Future<List<dynamic>> getHighRiskZones() async {
    try {
      final response = await _client.get(
        Uri.parse('$_baseUrl/dashboard/high-risk-zones'),
        headers: {'Accept': 'application/json'},
      ).timeout(_timeout);
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      print('Network Error on getHighRiskZones: $e');
      return [];
    }
  }

  // Test connection method - simplified
  Future<Map<String, dynamic>> testConnection() async {
    try {
      // Test the health check endpoint first
      print('Testing basic connection to: https://smart-tourist-safety.onrender.com/');
      
      final healthResponse = await _client.get(
        Uri.parse('https://smart-tourist-safety.onrender.com/'),
        headers: {'Accept': 'application/json'},
      ).timeout(_timeout);
      
      print('Health check response status: ${healthResponse.statusCode}');
      print('Health check response body: ${healthResponse.body}');
      
      if (healthResponse.statusCode == 200) {
        // Now test the API status endpoint
        print('Testing API status endpoint: https://smart-tourist-safety.onrender.com/api/status');
        
        final statusResponse = await _client.get(
          Uri.parse('https://smart-tourist-safety.onrender.com/api/status'),
          headers: {'Accept': 'application/json'},
        ).timeout(_timeout);
        
        print('API status response status: ${statusResponse.statusCode}');
        print('API status response body: ${statusResponse.body}');
        
        if (statusResponse.statusCode == 200) {
          return {'success': true, 'data': jsonDecode(statusResponse.body)};
        } else {
          return {'error': true, 'message': 'API status endpoint failed with status ${statusResponse.statusCode}'};
        }
      } else {
        return {'error': true, 'message': 'Health check failed with status ${healthResponse.statusCode}'};
      }
    } catch (e) {
      print('Test connection error: $e');
      return {'error': true, 'message': 'Connection test failed: $e'};
    }
  }

  // Helper to decode response and handle errors
  Map<String, dynamic> _handleResponse(http.Response response) {
    try {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final decoded = jsonDecode(response.body);
        return decoded;
      } else {
        print('API Error: ${response.statusCode} - ${response.body}');
        try {
          final errorBody = jsonDecode(response.body);
          return {
            'error': true,
            'message': errorBody['message'] ?? 'API Error: ${response.statusCode}',
            'details': errorBody
          };
        } catch (e) {
          return {
            'error': true,
            'message': 'Server Error: ${response.statusCode}',
            'details': response.body
          };
        }
      }
    } catch (e) {
      print('Response parsing error: $e');
      return {
        'error': true,
        'message': 'Invalid response format',
        'details': response.body
      };
    }
  }
  
  // Get tourist profile data
  Future<Map<String, dynamic>> getTouristProfile(String touristId) async {
    try {
      final response = await _client.get(
        Uri.parse('$_baseUrl/tourist/profile/$touristId'),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
      ).timeout(_timeout);
      return _handleResponse(response);
    } catch (e) {
      print('Network Error on getTouristProfile: $e');
      if (e.toString().contains('TimeoutException')) {
        return {'error': true, 'message': 'Profile fetch timeout. Please try again.'};
      }
      return {'error': true, 'message': 'Could not fetch profile data.'};
    }
  }

  // Report incident method
  Future<Map<String, dynamic>> reportIncident({
    required String type,
    required String description,
    required String priority,
    Map<String, dynamic>? location,
    bool isAnonymous = false,
    String? touristId,
    List<String>? mediaUrls,
  }) async {
    try {
      final fullUrl = '$_baseUrl/incidents/report';
      print('Reporting incident to: $fullUrl');
      
      final requestBody = {
        'type': type,
        'description': description,
        'priority': priority,
        'isAnonymous': isAnonymous,
        'timestamp': DateTime.now().toIso8601String(),
        'status': 'reported',
      };

      // Add location if available
      if (location != null) {
        requestBody['location'] = location;
      }

      // Add tourist ID if not anonymous and available
      if (!isAnonymous && touristId != null && touristId.isNotEmpty) {
        requestBody['reportedBy'] = touristId;
      }

      // Add media URLs if available
      if (mediaUrls != null && mediaUrls.isNotEmpty) {
        requestBody['mediaUrls'] = mediaUrls;
      }

      final response = await _client.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
        body: jsonEncode(requestBody),
      ).timeout(_timeout);

      print('Incident report response status: ${response.statusCode}');
      return _handleResponse(response);
    } on SocketException catch (e) {
      print('Network Error (SocketException): $e');
      return {'error': true, 'message': 'No internet connection. Please check your network.'};
    } on HttpException catch (e) {
      print('HTTP Error: $e');
      return {'error': true, 'message': 'Server connection failed. Please try again.'};
    } on FormatException catch (e) {
      print('Format Error: $e');
      return {'error': true, 'message': 'Invalid server response format.'};
    } catch (e) {
      print('Unexpected Error on incident report: $e');
      return {'error': true, 'message': 'Could not submit incident report. Please try again later.'};
    }
  }

  // Get incident reports (for tracking purposes)
  Future<List<dynamic>> getIncidentReports({String? touristId, String? status}) async {
    try {
      String url = '$_baseUrl/incidents';
      
      // Build query parameters
      List<String> queryParams = [];
      if (touristId != null && touristId.isNotEmpty) {
        queryParams.add('reportedBy=$touristId');
      }
      if (status != null && status.isNotEmpty) {
        queryParams.add('status=$status');
      }
      
      if (queryParams.isNotEmpty) {
        url += '?${queryParams.join('&')}';
      }

      final response = await _client.get(
        Uri.parse(url),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
      ).timeout(_timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data is List ? data : [];
      }
      return [];
    } catch (e) {
      print('Network Error on getIncidentReports: $e');
      return [];
    }
  }

  // Update Tourist KYC information
  Future<Map<String, dynamic>> updateTouristKyc({
    required String touristId,
    required String name,
    required String phoneNumber,
    required int tripDuration,
    required String tripItinerary,
    required String idNumber,
    required List<Map<String, String>> emergencyContacts,
  }) async {
    try {
      final fullUrl = '$_baseUrl/tourist/kyc/$touristId';
      print('Updating tourist KYC to: $fullUrl');
      
      final response = await _client.put(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
        body: jsonEncode({
          'name': name,
          'phoneNumber': phoneNumber,
          'tripDuration': tripDuration,
          'tripItinerary': tripItinerary,
          'idNumber': idNumber,
          'emergencyContacts': emergencyContacts,
          'kycRenewalDate': DateTime.now().toIso8601String(),
        }),
      ).timeout(_timeout);
      
      print('KYC update response status: ${response.statusCode}');
      return _handleResponse(response);
    } on SocketException catch (e) {
      print('Network Error (SocketException): $e');
      return {'error': true, 'message': 'No internet connection. Please check your network.'};
    } on HttpException catch (e) {
      print('HTTP Error: $e');
      return {'error': true, 'message': 'Server connection failed. Please try again.'};
    } on FormatException catch (e) {
      print('Format Error: $e');
      return {'error': true, 'message': 'Invalid server response format.'};
    } catch (e) {
      print('Unexpected Error on KYC update: $e');
      return {'error': true, 'message': 'Could not update KYC information. Please try again later.'};
    }
  }

  // Trigger SOS/Panic alert with enhanced data
  Future<Map<String, dynamic>> triggerSOS({
    required String touristId,
    Map<String, dynamic>? location,
    String? message,
    List<String>? emergencyContacts,
  }) async {
    try {
      final fullUrl = '$_baseUrl/tourist/panic/$touristId';
      print('Triggering SOS to: $fullUrl');

      final requestBody = <String, dynamic>{
        'timestamp': DateTime.now().toIso8601String(),
      };

      // Add location if available
      if (location != null) {
        requestBody['location'] = location;
      }

      // Add custom message if provided
      if (message != null && message.isNotEmpty) {
        requestBody['message'] = message;
      }

      // Add emergency contacts if provided
      if (emergencyContacts != null && emergencyContacts.isNotEmpty) {
        requestBody['emergencyContacts'] = emergencyContacts;
      }

      final response = await _client.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'SmartTouristApp/1.0',
        },
        body: jsonEncode(requestBody),
      ).timeout(_timeout);

      print('SOS response status: ${response.statusCode}');
      return _handleResponse(response);
    } on SocketException catch (e) {
      print('Network Error (SocketException): $e');
      return {'error': true, 'message': 'No internet connection. Please check your network.'};
    } on HttpException catch (e) {
      print('HTTP Error: $e');
      return {'error': true, 'message': 'Server connection failed. Please try again.'};
    } catch (e) {
      print('Unexpected Error on SOS trigger: $e');
      return {'error': true, 'message': 'Could not send SOS alert. Please try again or call emergency services directly.'};
    }
  }

  // Cleanup method
  static void dispose() {
    _client.close();
  }
}