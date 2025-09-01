import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smart_tourist_safety_app/screens/kyc_prompt_screen.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';
import 'package:smart_tourist_safety_app/theme/theme_notifier.dart';
import 'alerts_screen.dart';
import 'contacts_screen.dart';
import 'live_location_screen.dart';
import 'report_incident_screen.dart';

class HomeScreen extends StatefulWidget {
  final Map<String, dynamic> tourist;

  const HomeScreen({super.key, required this.tourist});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.tourist['kycStatus'] == 'expired') {
        _showKycPrompt();
      }
    });
  }

  void _showKycPrompt() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const KycPromptScreen(),
    );
  }

  void _showApiResponse(String title, Map<String, dynamic> response) {
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(response.toString()),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('OK')),
        ],
      ),
    );
  }

  Future<void> _sendLocation() async {
    final response = await _apiService.updateLocation(widget.tourist['id'], 21.1702, 72.8311);
    _showApiResponse('Location Update', response);
  }

  Future<void> _triggerPanic() async {
    final response = await _apiService.triggerPanic(widget.tourist['id']);
    _showApiResponse('Panic Alert', response);
  }

  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);
    final isKycValid = widget.tourist['digitalId'] != null;

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${widget.tourist['name']}'),
        actions: [
          IconButton(
            icon: Icon(themeNotifier.themeMode == ThemeMode.light ? Icons.dark_mode : Icons.light_mode),
            onPressed: () => themeNotifier.toggleTheme(),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => Navigator.of(context).pushReplacementNamed('/'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (isKycValid)
              _buildSosButton()
            else
              Card(
                color: Theme.of(context).colorScheme.errorContainer,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    'Your Digital ID is expired. Please complete KYC to access safety features.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Theme.of(context).colorScheme.onErrorContainer),
                  ),
                ),
              ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              icon: const Icon(Icons.location_on),
              label: const Text('Send Location Update'),
              onPressed: _sendLocation,
            ),
            const SizedBox(height: 24),
            _buildDashboardGrid(isKycValid),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildSosButton() {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.red.withOpacity(0.1),
        boxShadow: [
          BoxShadow(color: Colors.red.withOpacity(0.2), spreadRadius: 8, blurRadius: 24),
        ],
      ),
      child: Center(
        child: ElevatedButton(
          onPressed: _triggerPanic,
          style: ElevatedButton.styleFrom(
            shape: const CircleBorder(),
            padding: const EdgeInsets.all(60),
            backgroundColor: Theme.of(context).colorScheme.error,
            foregroundColor: Theme.of(context).colorScheme.onError,
          ),
          child: const Text('SOS', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: 2)),
        ),
      ),
    );
  }

  Widget _buildDashboardGrid(bool isKycValid) {
    return Opacity(
      opacity: isKycValid ? 1.0 : 0.5,
      child: GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          _buildDashboardCard('Live Location', Icons.location_on, Colors.blue, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const LiveLocationScreen()));
          } : null),
          _buildDashboardCard('Safety Alerts', Icons.warning, Colors.orange, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const AlertsScreen()));
          } : null),
          _buildDashboardCard('Emergency Contacts', Icons.contact_phone, Colors.green, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ContactsScreen()));
          } : null),
          _buildDashboardCard('Report Incident', Icons.report_problem, Colors.purple, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ReportIncidentScreen()));
          } : null),
        ],
      ),
    );
  }

  Widget _buildDashboardCard(String title, IconData icon, Color color, VoidCallback? onTap) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: onTap != null ? color : Colors.grey),
            const SizedBox(height: 16),
            Text(title, textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: onTap != null ? null : Colors.grey)),
          ],
        ),
      ),
    );
  }
}
