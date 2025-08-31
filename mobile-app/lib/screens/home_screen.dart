import 'package:flutter/material.dart';
import 'package:smart_tourist_safety_app/screens/alerts_screen.dart';
import 'package:smart_tourist_safety_app/screens/contacts_screen.dart';
import 'package:smart_tourist_safety_app/screens/live_location_screen.dart';
import 'package:smart_tourist_safety_app/screens/report_incident_screen.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const HomeScreen({super.key, required this.onToggleTheme});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Safety Dashboard'),
        backgroundColor: Theme.of(context).appBarTheme.backgroundColor,
        foregroundColor: Theme.of(context).appBarTheme.foregroundColor,
        actions: [
          IconButton(
            icon: Icon(Theme.of(context).brightness == Brightness.light
                ? Icons.dark_mode
                : Icons.light_mode),
            onPressed: widget.onToggleTheme,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.of(context).pushReplacementNamed('/');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildSosButton(),
              const SizedBox(height: 24),
              _buildDashboardGrid(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Map',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildSosButton() {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.red.shade50,
        boxShadow: [
          BoxShadow(
            color: Colors.red.withOpacity(0.3),
            spreadRadius: 8,
            blurRadius: 24,
          ),
        ],
      ),
      child: Center(
        child: ElevatedButton(
          onPressed: () {
            // Placeholder: Send SOS signal to the backend
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('SOS Signal Sent!')),
            );
          },
          style: ElevatedButton.styleFrom(
            shape: const CircleBorder(),
            padding: const EdgeInsets.all(60),
            backgroundColor: Colors.red.shade600,
            foregroundColor: Colors.white,
          ),
          child: const Text(
            'SOS',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardGrid() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      children: [
        _buildDashboardCard('Live Location', Icons.location_on, Colors.blue, () {
          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const LiveLocationScreen()));
        }),
        _buildDashboardCard('Safety Alerts', Icons.warning, Colors.orange, () {
          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const AlertsScreen()));
        }),
        _buildDashboardCard('Emergency Contacts', Icons.contact_phone, Colors.green, () {
          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ContactsScreen()));
        }),
        _buildDashboardCard('Report Incident', Icons.report_problem, Colors.purple, () {
          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const ReportIncidentScreen()));
        }),
      ],
    );
  }

  Widget _buildDashboardCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: color),
            const SizedBox(height: 16),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}

// Placeholder screens for navigation
class LiveLocationScreen extends StatelessWidget {
  const LiveLocationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Location')),
      body: const Center(child: Text('Live Location functionality will be implemented here.')),
    );
  }
}

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Safety Alerts')),
      body: const Center(child: Text('Safety Alerts functionality will be implemented here.')),
    );
  }
}

class ContactsScreen extends StatelessWidget {
  const ContactsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Emergency Contacts')),
      body: const Center(child: Text('Emergency Contacts functionality will be implemented here.')),
    );
  }
}

class ReportIncidentScreen extends StatelessWidget {
  const ReportIncidentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Report Incident')),
      body: const Center(child: Text('Report Incident functionality will be implemented here.')),
    );
  }
}