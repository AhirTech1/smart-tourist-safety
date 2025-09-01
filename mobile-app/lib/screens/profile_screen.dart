import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smart_tourist_safety_app/theme/theme_notifier.dart';
import 'package:smart_tourist_safety_app/screens/kyc_prompt_screen.dart';

class ProfileScreen extends StatefulWidget {
  final Map<String, dynamic> tourist;

  const ProfileScreen({super.key, required this.tourist});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);
    final tourist = widget.tourist;
    final isKycValid = tourist['digitalId'] != null && tourist['kycStatus'] != 'expired';

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Profile Picture and Basic Info
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      child: Text(
                        tourist['name']?.substring(0, 1).toUpperCase() ?? 'T',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      tourist['name'] ?? 'Tourist',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      tourist['email'] ?? 'No email provided',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 16),
                    // KYC Status Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isKycValid ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isKycValid ? Colors.green : Colors.red,
                        ),
                      ),
                      child: Text(
                        isKycValid ? 'KYC Verified' : 'KYC Required',
                        style: TextStyle(
                          color: isKycValid ? Colors.green : Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Account Information
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.person),
                    title: const Text('Personal Information'),
                    subtitle: Text('Tourist ID: ${tourist['id'] ?? 'N/A'}'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Navigate to personal info edit screen
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.verified_user),
                    title: const Text('Digital Identity'),
                    subtitle: Text(isKycValid ? 'Verified' : 'Not Verified'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      if (!isKycValid) {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const KycPromptScreen()),
                        );
                      }
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.location_on),
                    title: const Text('Location Services'),
                    subtitle: const Text('Manage location sharing'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Navigate to location settings
                    },
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Settings
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: Icon(
                      themeNotifier.themeMode == ThemeMode.light 
                        ? Icons.light_mode 
                        : Icons.dark_mode
                    ),
                    title: const Text('Theme'),
                    subtitle: Text(
                      themeNotifier.themeMode == ThemeMode.light 
                        ? 'Light Mode' 
                        : 'Dark Mode'
                    ),
                    trailing: Switch(
                      value: themeNotifier.themeMode == ThemeMode.dark,
                      onChanged: (value) {
                        themeNotifier.toggleTheme();
                      },
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.notifications),
                    title: const Text('Notifications'),
                    subtitle: const Text('Manage alert preferences'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Navigate to notification settings
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.language),
                    title: const Text('Language'),
                    subtitle: const Text('English'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Navigate to language settings
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.help),
                    title: const Text('Help & Support'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Navigate to help screen
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.info),
                    title: const Text('About'),
                    subtitle: const Text('App version 1.0.0'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Show about dialog
                      showAboutDialog(
                        context: context,
                        applicationName: 'Smart Tourist Safety',
                        applicationVersion: '1.0.0',
                        applicationLegalese: '© 2025 Smart Tourist Safety App',
                      );
                    },
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
            
            // Logout Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Logout'),
                      content: const Text('Are you sure you want to logout?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                            Navigator.of(context).pushReplacementNamed('/');
                          },
                          child: const Text('Logout'),
                        ),
                      ],
                    ),
                  );
                },
                icon: const Icon(Icons.logout),
                label: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.error,
                  foregroundColor: Theme.of(context).colorScheme.onError,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
            
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
