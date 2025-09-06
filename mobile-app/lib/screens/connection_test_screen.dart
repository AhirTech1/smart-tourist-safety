import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ConnectionTestScreen extends StatefulWidget {
  const ConnectionTestScreen({Key? key}) : super(key: key);

  @override
  State<ConnectionTestScreen> createState() => _ConnectionTestScreenState();
}

class _ConnectionTestScreenState extends State<ConnectionTestScreen> {
  final ApiService _apiService = ApiService();
  bool _testing = false;
  String _result = '';

  Future<void> _testConnection() async {
    setState(() {
      _testing = true;
      _result = 'Testing connection...';
    });

    try {
      final result = await _apiService.testConnection();
      setState(() {
        _testing = false;
        if (result['error'] == true) {
          _result = 'Connection Failed: ${result['message']}';
        } else {
          _result = 'Connection Successful!\n${result['data'].toString()}';
        }
      });
    } catch (e) {
      setState(() {
        _testing = false;
        _result = 'Connection Error: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connection Test'),
        backgroundColor: Colors.blue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Test Backend Connection',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            const Text(
              'Backend URL: https://smart-tourist-safety.onrender.com',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: _testing ? null : _testConnection,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                padding: const EdgeInsets.symmetric(vertical: 15),
              ),
              child: _testing
                  ? const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        ),
                        SizedBox(width: 10),
                        Text('Testing...', style: TextStyle(color: Colors.white)),
                      ],
                    )
                  : const Text('Test Connection', style: TextStyle(color: Colors.white)),
            ),
            const SizedBox(height: 30),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Result:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _result.isEmpty ? 'No test performed yet' : _result,
                    style: TextStyle(
                      color: _result.contains('Successful') ? Colors.green : Colors.red,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Troubleshooting Tips:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              '• Make sure you have internet connection\n'
              '• Check if backend is deployed and running\n'
              '• Render free tier may take 1-2 minutes to wake up\n'
              '• Try again if first attempt fails',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
