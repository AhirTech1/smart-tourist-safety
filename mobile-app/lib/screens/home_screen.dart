import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:smart_tourist_safety_app/screens/kyc_prompt_screen.dart';
import 'package:smart_tourist_safety_app/screens/kyc_renewal_screen.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';
import 'package:smart_tourist_safety_app/theme/theme_notifier.dart';
import 'alerts_screen.dart';
import 'contacts_screen.dart';
import 'maps_screen.dart';
import 'profile_screen.dart';
import 'report_incident_screen.dart';
import 'safety_tips_screen.dart';
import 'sos_confirmation_screen.dart';

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
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(
                  builder: (_) => KycRenewalScreen(tourist: widget.tourist),
                ),
              );
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

  void _showSOSConfirmation(Map<String, dynamic> response) {
    if (!mounted) return;
    
    bool isSuccess = !response.containsKey('error');
    
    // Haptic feedback for SOS result
    if (isSuccess) {
      HapticFeedback.heavyImpact(); // Success vibration
    } else {
      HapticFeedback.mediumImpact(); // Error vibration  
    }
    
    // Show a clean snackbar instead of dialog for SOS confirmation
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isSuccess ? Icons.check_circle : Icons.error,
              color: Colors.white,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                isSuccess 
                  ? '🚨 Emergency alert sent successfully!'
                  : 'Failed to send emergency alert. Please try again.',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: isSuccess ? Colors.green.shade600 : Colors.red.shade600,
        duration: const Duration(seconds: 4),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        margin: const EdgeInsets.all(16),
      ),
    );
    
    // If successful, also show a brief success overlay
    if (isSuccess) {
      _showSOSSuccessOverlay();
    }
  }

  void _showSOSSuccessOverlay() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        // Auto-dismiss after 2 seconds
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted && Navigator.of(context).canPop()) {
            Navigator.of(context).pop();
          }
        });
        
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.green.shade600,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 10,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  color: Colors.white,
                  size: 60,
                ),
                const SizedBox(height: 16),
                const Text(
                  'SOS Alert Sent!',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Emergency services have been notified',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _sendLocation(double lat, double lng) async {
    final id = widget.tourist['id'];
    if (id == null) return;
    final response = await _apiService.updateLocation(id, lat, lng);
    debugPrint("Location sent: $lat, $lng → $response");
  }

  void _triggerPanic() {
    // Show SOS confirmation screen with 5-second countdown
    Navigator.of(context).push(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => SOSConfirmationScreen(
          onConfirm: () {
            Navigator.of(context).pop(); // Close confirmation screen
            _executePanicAlert(); // Execute the actual SOS alert
          },
          onCancel: () {
            Navigator.of(context).pop(); // Just close the confirmation screen
          },
        ),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          // Slide up animation for dramatic effect
          const begin = Offset(0.0, 1.0);
          const end = Offset.zero;
          const curve = Curves.easeInOut;
          var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
          return SlideTransition(position: animation.drive(tween), child: child);
        },
        transitionDuration: const Duration(milliseconds: 300),
      ),
    );
  }

  Future<void> _executePanicAlert() async {
    final id = widget.tourist['id'];
    if (id == null) return;
    
    // Try to get current location for the panic alert
    double? latitude;
    double? longitude;
    
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (serviceEnabled) {
        // Check location permission
        LocationPermission permission = await Geolocator.checkPermission();
        if (permission == LocationPermission.denied) {
          permission = await Geolocator.requestPermission();
        }
        
        if (permission != LocationPermission.denied && permission != LocationPermission.deniedForever) {
          // Get current position with a timeout
          Position position = await Geolocator.getCurrentPosition(
            desiredAccuracy: LocationAccuracy.high,
            timeLimit: const Duration(seconds: 10),
          );
          latitude = position.latitude;
          longitude = position.longitude;
          debugPrint("Emergency location captured: $latitude, $longitude");
        }
      }
    } catch (e) {
      debugPrint("Could not get location for panic alert: $e");
      // Continue without location - panic alert is more important than location
    }
    
    final response = await _apiService.triggerPanic(id, latitude: latitude, longitude: longitude);
    if (mounted) _showSOSConfirmation(response);
  }

  Future<void> _startLiveLocation() async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        debugPrint('Location services are disabled.');
        return;
      }

      // Ask for permission
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          debugPrint('Location permissions are denied');
          return;
        }
      }
      if (permission == LocationPermission.deniedForever) {
        debugPrint('Location permissions are permanently denied');
        return;
      }

      // Start location stream
      _positionStream = Geolocator.getPositionStream(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 10, // update every 10 meters
        ),
      );

      _positionStream!.listen(
        (Position position) {
          _sendLocation(position.latitude, position.longitude);
        },
        onError: (error) {
          debugPrint('Location stream error: $error');
        },
      );
    } catch (e) {
      debugPrint('Error starting live location: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);
    final isKycValid = widget.tourist['digitalId'] != null;

    final List<Widget> screens = [
      _buildHomeTab(isKycValid),
      MapsScreen(tourist: widget.tourist),
      ProfileScreen(tourist: widget.tourist),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${widget.tourist['name'] ?? "Tourist"}'),
        actions: [
          IconButton(
            icon: Icon(themeNotifier.themeMode == ThemeMode.light ? Icons.dark_mode : Icons.light_mode),
            onPressed: () => themeNotifier.toggleTheme(),
          ),
        ],
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Maps'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
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
              try {
                // Check if location services are enabled
                bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
                if (!serviceEnabled) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please enable location services')),
                    );
                  }
                  return;
                }

                // Check permissions
                LocationPermission permission = await Geolocator.checkPermission();
                if (permission == LocationPermission.denied) {
                  permission = await Geolocator.requestPermission();
                  if (permission == LocationPermission.denied) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Location permission denied')),
                      );
                    }
                    return;
                  }
                }

                if (permission == LocationPermission.deniedForever) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Location permission permanently denied. Please enable in settings.')),
                    );
                  }
                  return;
                }

                final pos = await Geolocator.getCurrentPosition(
                  desiredAccuracy: LocationAccuracy.high,
                );
                await _sendLocation(pos.latitude, pos.longitude);
                
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Location sent successfully')),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error getting location: $e')),
                  );
                }
              }
            },
          ),
          const SizedBox(height: 24),
          _buildDashboardGrid(isKycValid),
        ],
      ),
    );
  }

  Widget _buildSosButton() {
    return Column(
      children: [
        Container(
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
                elevation: 8,
              ),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('SOS', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, letterSpacing: 2)),
                  SizedBox(height: 4),
                ],
              ),
            ),
          ),
        ),
      ],
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
          _buildDashboardCard('Safety Tips', Icons.lightbulb, Colors.amber, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SafetyTipsScreen()));
          } : null),
          _buildDashboardCard('Safety Alerts', Icons.warning, Colors.orange, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AlertsScreen()));
          } : null),
          _buildDashboardCard('Emergency Contacts', Icons.contact_phone, Colors.green, isKycValid ? () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => ContactsScreen(tourist: widget.tourist)));
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