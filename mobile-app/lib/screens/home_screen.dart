import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
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
  Stream<Position>? _positionStream;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.tourist['kycStatus'] == 'expired') {
        _showKycPrompt();
      }
    });
    _startLiveLocation();
  }

  void _showKycPrompt() {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('KYC Required'),
        content: const Text('Your Digital ID has expired. Please complete KYC to access safety features.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).push(MaterialPageRoute(builder: (_) => const KycPromptScreen()));
            },
            child: const Text('Complete KYC'),
          ),
        ],
      ),
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

  Future<void> _sendLocation(double lat, double lng) async {
    final id = widget.tourist['id'];
    if (id == null) return;
    final response = await _apiService.updateLocation(id, lat, lng);
    debugPrint("Location sent: $lat, $lng → $response");
  }

  Future<void> _triggerPanic() async {
    final id = widget.tourist['id'];
    if (id == null) return;
    final response = await _apiService.triggerPanic(id);
    if (mounted) _showApiResponse('Panic Alert', response);
  }

  Future<void> _startLiveLocation() async {
    // Ask for permission
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    if (permission == LocationPermission.deniedForever) {
      // Permissions are permanently denied
      return;
    }

    // Start location stream
    _positionStream = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10, // update every 10 meters
      ),
    );

    _positionStream!.listen((Position position) {
      _sendLocation(position.latitude, position.longitude);
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);
    final isKycValid = widget.tourist['digitalId'] != null;

    final List<Widget> screens = [
      _buildHomeTab(isKycValid),
      const LiveLocationScreen(),
      const KycPromptScreen(), // Replace with actual profile screen
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${widget.tourist['name'] ?? "Tourist"}'),
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
      body: screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.map_outlined), label: 'Map'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildHomeTab(bool isKycValid) {
    return SingleChildScrollView(
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
            icon: const Icon(Icons.my_location),
            label: const Text('Send Current Location Once'),
            onPressed: () async {
              final pos = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
              _sendLocation(pos.latitude, pos.longitude);
            },
          ),
          const SizedBox(height: 24),
          _buildDashboardGrid(isKycValid),
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
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const LiveLocationScreen()));
          } : null),
          _buildDashboardCard('Safety Alerts', Icons.warning, Colors.orange, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AlertsScreen()));
          } : null),
          _buildDashboardCard('Emergency Contacts', Icons.contact_phone, Colors.green, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ContactsScreen()));
          } : null),
          _buildDashboardCard('Report Incident', Icons.report_problem, Colors.purple, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ReportIncidentScreen()));
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
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: onTap != null ? null : Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
