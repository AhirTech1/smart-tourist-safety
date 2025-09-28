import 'package:flutter/material.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';

class RecommendationsScreen extends StatefulWidget {
  const RecommendationsScreen({Key? key}) : super(key: key);

  @override
  _RecommendationsScreenState createState() => _RecommendationsScreenState();
}

class _RecommendationsScreenState extends State<RecommendationsScreen> {
  List<dynamic> _recommendations = [];
  bool _isLoading = false;

  // Example preferences. You can build a UI to let the user set these.
  final Map<String, dynamic> _userPreferences = {
    'preferredCategory': 'history',
    'minSafety': 7,
  };

  Future<void> _fetchRecommendations() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final recommendations = await ApiService().getRecommendations(_userPreferences);
      setState(() {
        _recommendations = recommendations;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to fetch recommendations: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchRecommendations();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Safe Recommendations'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _recommendations.length,
              itemBuilder: (context, index) {
                final item = _recommendations[index];
                return Card(
                  margin: const EdgeInsets.all(8.0),
                  child: ListTile(
                    title: Text(item['name']),
                    subtitle: Text('Category: ${item['category']}'),
                    trailing: Chip(
                      label: Text('Safety: ${item['safetyScore']}'),
                      backgroundColor: item['safetyScore'] > 8 ? Colors.green[100] : Colors.amber[100],
                    ),
                  ),
                );
              },
            ),
    );
  }
}