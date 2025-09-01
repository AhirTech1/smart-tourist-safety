import 'package:flutter/material.dart';

class SafetyTipsScreen extends StatelessWidget {
  const SafetyTipsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Safety Tips'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.info_outline,
                        color: Theme.of(context).colorScheme.primary,
                        size: 28,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Important Safety Information',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Your safety is our priority. Follow these guidelines to ensure a safe and enjoyable travel experience.',
                    style: TextStyle(fontSize: 16),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          _buildSafetyTipCard(
            context,
            'General Safety',
            Icons.security,
            Colors.blue,
            [
              'Always keep your digital ID updated and verified',
              'Share your location with trusted contacts',
              'Stay aware of your surroundings at all times',
              'Keep emergency numbers readily available',
              'Avoid displaying expensive items in public',
            ],
          ),
          
          _buildSafetyTipCard(
            context,
            'Emergency Situations',
            Icons.warning,
            Colors.red,
            [
              'Use the SOS button for immediate help',
              'Stay calm and try to move to a safe location',
              'Contact local authorities if needed',
              'Report incidents through the app',
              'Trust your instincts - if something feels wrong, leave',
            ],
          ),
          
          _buildSafetyTipCard(
            context,
            'Transportation Safety',
            Icons.directions_car,
            Colors.green,
            [
              'Use official transportation services',
              'Share your ride details with contacts',
              'Verify driver and vehicle details',
              'Avoid traveling alone at night',
              'Keep transportation receipts',
            ],
          ),
          
          _buildSafetyTipCard(
            context,
            'Accommodation Safety',
            Icons.hotel,
            Colors.orange,
            [
              'Research accommodation reviews beforehand',
              'Check security measures at your stay',
              'Keep copies of important documents',
              'Use hotel safes for valuables',
              'Know the location of emergency exits',
            ],
          ),
          
          _buildSafetyTipCard(
            context,
            'Health & Medical',
            Icons.medical_services,
            Colors.pink,
            [
              'Carry necessary medications with you',
              'Know the location of nearby hospitals',
              'Keep health insurance information handy',
              'Stay hydrated and eat safely',
              'Get required vaccinations before travel',
            ],
          ),
          
          _buildSafetyTipCard(
            context,
            'Digital Security',
            Icons.phone_android,
            Colors.purple,
            [
              'Use secure Wi-Fi connections only',
              'Keep your phone charged at all times',
              'Backup important data regularly',
              'Avoid sharing personal information online',
              'Use official apps and websites only',
            ],
          ),
          
          const SizedBox(height: 20),
          
          Card(
            color: Theme.of(context).colorScheme.primaryContainer,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Icon(
                    Icons.phone,
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                    size: 32,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Emergency Contacts',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Police: 100 | Fire: 101 | Ambulance: 102\nTourist Helpline: 1363',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 20),
        ],
      ),
    );
  }
  
  Widget _buildSafetyTipCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    List<String> tips,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ExpansionTile(
        leading: Icon(icon, color: color, size: 28),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: tips.map((tip) => Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        tip,
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ],
                ),
              )).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
