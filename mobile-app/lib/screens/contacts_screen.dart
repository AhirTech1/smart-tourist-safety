import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';

class ContactsScreen extends StatefulWidget {
  final Map<String, dynamic>? tourist;
  
  const ContactsScreen({super.key, this.tourist});

  @override
  State<ContactsScreen> createState() => _ContactsScreenState();
}

class _ContactsScreenState extends State<ContactsScreen> {
  final ApiService _apiService = ApiService();
  List<Map<String, String>> _userEmergencyContacts = [];
  bool _isLoading = false;

  // Common emergency contacts in India
  final List<Map<String, String>> _commonContacts = [
    {
      'name': 'Police Emergency',
      'phone': '100',
      'icon': 'police',
      'description': 'For immediate police assistance',
    },
    {
      'name': 'Fire Brigade',
      'phone': '101',
      'icon': 'fire',
      'description': 'Fire emergency services',
    },
    {
      'name': 'Ambulance/Medical Emergency',
      'phone': '108',
      'icon': 'medical',
      'description': 'Emergency medical services',
    },
    {
      'name': 'Tourist Helpline',
      'phone': '1363',
      'icon': 'tourism',
      'description': 'National tourist helpline',
    },
  ];

  @override
  void initState() {
    super.initState();
    // For now, we'll use static data. In a real app, you'd get the tourist ID from login
    // and fetch their emergency contacts via API
    _loadUserContacts();
  }

  void _loadUserContacts() {
    setState(() {
      _isLoading = true;
    });

    // Get emergency contacts from tourist data
    if (widget.tourist != null && widget.tourist!['emergencyContacts'] != null) {
      final contacts = widget.tourist!['emergencyContacts'] as List<dynamic>;
      _userEmergencyContacts = contacts.map((contact) {
        return {
          'name': contact['name']?.toString() ?? '',
          'relationship': contact['relationship']?.toString() ?? '',
          'phoneNumber': contact['phoneNumber']?.toString() ?? '',
        };
      }).toList();
    } else {
      _userEmergencyContacts = [];
    }

    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path: phoneNumber,
    );
    
    try {
      if (await canLaunchUrl(launchUri)) {
        await launchUrl(launchUri);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Could not launch phone app for $phoneNumber'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error making call: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  IconData _getContactIcon(String iconType) {
    switch (iconType) {
      case 'police':
        return Icons.local_police;
      case 'fire':
        return Icons.local_fire_department;
      case 'medical':
        return Icons.local_hospital;
      case 'tourism':
        return Icons.info_outline;
      default:
        return Icons.phone;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Contacts'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Emergency notice
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.errorContainer,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Theme.of(context).colorScheme.outline.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.warning, color: Theme.of(context).colorScheme.onErrorContainer),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Emergency Contacts',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).colorScheme.onErrorContainer,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                'Tap any contact to call immediately in case of emergency',
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.onErrorContainer.withOpacity(0.8),
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Common Emergency Numbers Section
                  Text(
                    'National Emergency Numbers',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  ..._commonContacts.map((contact) => _buildContactCard(
                    name: contact['name']!,
                    phone: contact['phone']!,
                    subtitle: contact['description']!,
                    icon: _getContactIcon(contact['icon']!),
                    isEmergency: true,
                  )),
                  
                  const SizedBox(height: 32),
                  
                  // User's Personal Emergency Contacts Section
                  Text(
                    'Your Emergency Contacts',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  if (_userEmergencyContacts.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.surfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'No personal emergency contacts found. Add contacts during registration.',
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    ..._userEmergencyContacts.map((contact) => _buildContactCard(
                      name: contact['name']!,
                      phone: contact['phoneNumber']!,
                      subtitle: contact['relationship']!,
                      icon: Icons.person,
                      isEmergency: false,
                    )),
                  
                  const SizedBox(height: 24),
                  
                  // Additional info card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Theme.of(context).colorScheme.outline.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.lightbulb_outline, color: Theme.of(context).colorScheme.onPrimaryContainer),
                            const SizedBox(width: 8),
                            Text(
                              'Quick Tips',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.onPrimaryContainer,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '• Save these numbers in your phone for quick access\n'
                          '• In extreme emergencies, use the SOS button on home screen\n'
                          '• Keep your phone charged and network accessible\n'
                          '• Share your location with trusted contacts when traveling',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onPrimaryContainer,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildContactCard({
    required String name,
    required String phone,
    required String subtitle,
    required IconData icon,
    required bool isEmergency,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: isEmergency 
              ? Theme.of(context).colorScheme.errorContainer 
              : Theme.of(context).colorScheme.secondaryContainer,
          child: Icon(
            icon,
            color: isEmergency 
                ? Theme.of(context).colorScheme.onErrorContainer 
                : Theme.of(context).colorScheme.onSecondaryContainer,
          ),
        ),
        title: Text(
          name,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(subtitle),
            const SizedBox(height: 4),
            Text(
              phone,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
                fontWeight: FontWeight.w500,
                fontSize: 14,
              ),
            ),
          ],
        ),
        trailing: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.tertiary.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: Icon(
              Icons.phone,
              color: Theme.of(context).colorScheme.tertiary,
            ),
            onPressed: () => _makePhoneCall(phone),
            tooltip: 'Call $name',
          ),
        ),
        onTap: () => _makePhoneCall(phone),
      ),
    );
  }
}