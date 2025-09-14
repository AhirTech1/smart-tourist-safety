import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:smart_tourist_safety_app/screens/home_screen.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';
import 'package:smart_tourist_safety_app/theme/theme_notifier.dart';

class KycRenewalScreen extends StatefulWidget {
  final Map<String, dynamic> tourist;
  
  const KycRenewalScreen({
    super.key,
    required this.tourist,
  });

  @override
  State<KycRenewalScreen> createState() => _KycRenewalScreenState();
}

class _KycRenewalScreenState extends State<KycRenewalScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final _apiService = ApiService();
  bool _isLoading = false;

  // Form controllers
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _durationController = TextEditingController();
  final _itineraryController = TextEditingController();
  final _idNumberController = TextEditingController();
  final _emergencyNameController = TextEditingController();
  final _emergencyRelationshipController = TextEditingController();
  final _emergencyPhoneController = TextEditingController();

  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutCubic,
    ));
    _animationController.forward();

    // Pre-fill existing data if available
    _prefillExistingData();
  }

  void _prefillExistingData() {
    if (widget.tourist['name'] != null) {
      _nameController.text = widget.tourist['name'];
    }
    if (widget.tourist['phoneNumber'] != null) {
      _phoneController.text = widget.tourist['phoneNumber'];
    }
    if (widget.tourist['tripItinerary'] != null) {
      _itineraryController.text = widget.tourist['tripItinerary'];
    }
    if (widget.tourist['idNumber'] != null) {
      _idNumberController.text = widget.tourist['idNumber'];
    }
    // Pre-fill emergency contact if exists
    if (widget.tourist['emergencyContacts'] != null &&
        widget.tourist['emergencyContacts'].isNotEmpty) {
      final emergency = widget.tourist['emergencyContacts'][0];
      _emergencyNameController.text = emergency['name'] ?? '';
      _emergencyRelationshipController.text = emergency['relationship'] ?? '';
      _emergencyPhoneController.text = emergency['phoneNumber'] ?? '';
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _durationController.dispose();
    _itineraryController.dispose();
    _idNumberController.dispose();
    _emergencyNameController.dispose();
    _emergencyRelationshipController.dispose();
    _emergencyPhoneController.dispose();
    super.dispose();
  }

  Future<void> _renewKyc() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Call API to update tourist information and renew KYC
      final result = await _apiService.updateTouristKyc(
        touristId: widget.tourist['_id'],
        name: _nameController.text,
        phoneNumber: _phoneController.text,
        tripDuration: int.tryParse(_durationController.text) ?? 7,
        tripItinerary: _itineraryController.text,
        idNumber: _idNumberController.text,
        emergencyContacts: [
          {
            "name": _emergencyNameController.text,
            "relationship": _emergencyRelationshipController.text,
            "phoneNumber": _emergencyPhoneController.text,
          }
        ],
      );

      setState(() => _isLoading = false);

      if (mounted) {
        if (result.containsKey('error')) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('KYC renewal failed: ${result['message']}'),
              backgroundColor: Colors.red,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('KYC renewed successfully!'),
              backgroundColor: Colors.green,
            ),
          );
          
          // Navigate to home screen with updated tourist data and clear navigation stack
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(
              builder: (context) => HomeScreen(
                tourist: result['tourist'] ?? widget.tourist,
              ),
            ),
            (Route<dynamic> route) => false, // Remove all previous routes
          );
        }
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('An error occurred: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);
    final isDarkMode = themeNotifier.themeMode == ThemeMode.dark;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isDarkMode
                ? [
                    const Color(0xFF1A1A1A),
                    const Color(0xFF2D2D2D),
                    const Color(0xFF1A1A1A),
                  ]
                : [
                    const Color(0xFF4A90E2),
                    const Color(0xFF7BB3F0),
                    const Color(0xFF9BC5F5),
                  ],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: SlideTransition(
              position: _slideAnimation,
              child: Column(
                children: [
                  // Header Section
                  Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.arrow_back,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const Expanded(
                          child: Text(
                            'Renew KYC Verification',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(width: 48), // Balance for back button
                      ],
                    ),
                  ),

                  // Form Section
                  Expanded(
                    child: Container(
                      margin: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.95),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.all(24),
                          child: Form(
                            key: _formKey,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Info Card
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.blue.withOpacity(0.3),
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.info_outline,
                                        color: Colors.blue[700],
                                        size: 24,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          'Please update your information to renew your KYC verification and continue using safety features.',
                                          style: TextStyle(
                                            color: Colors.blue[700],
                                            fontSize: 14,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 24),

                                // Personal Information Section
                                _buildSectionTitle('Personal Information'),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _nameController,
                                  label: 'Full Name',
                                  icon: Icons.person,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter your full name';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _phoneController,
                                  label: 'Phone Number',
                                  icon: Icons.phone,
                                  keyboardType: TextInputType.phone,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter your phone number';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _idNumberController,
                                  label: 'ID Number (Passport/License)',
                                  icon: Icons.badge,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter your ID number';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 24),

                                // Trip Information Section
                                _buildSectionTitle('Trip Information'),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _durationController,
                                  label: 'Trip Duration (days)',
                                  icon: Icons.calendar_today,
                                  keyboardType: TextInputType.number,
                                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter trip duration';
                                    }
                                    final days = int.tryParse(value);
                                    if (days == null || days <= 0 || days > 365) {
                                      return 'Please enter a valid duration (1-365 days)';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _itineraryController,
                                  label: 'Trip Itinerary (Optional)',
                                  icon: Icons.map,
                                  maxLines: 3,
                                  hintText: 'Brief description of your trip plans...',
                                ),
                                const SizedBox(height: 24),

                                // Emergency Contact Section
                                _buildSectionTitle('Emergency Contact'),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _emergencyNameController,
                                  label: 'Emergency Contact Name',
                                  icon: Icons.contact_emergency,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter emergency contact name';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _emergencyRelationshipController,
                                  label: 'Relationship',
                                  icon: Icons.family_restroom,
                                  hintText: 'e.g., Spouse, Parent, Friend',
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter relationship';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                _buildTextFormField(
                                  controller: _emergencyPhoneController,
                                  label: 'Emergency Contact Phone',
                                  icon: Icons.phone_in_talk,
                                  keyboardType: TextInputType.phone,
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Please enter emergency contact phone';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 32),

                                // Renew Button
                                SizedBox(
                                  width: double.infinity,
                                  height: 56,
                                  child: ElevatedButton(
                                    onPressed: _isLoading ? null : _renewKyc,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF4A90E2),
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      elevation: 4,
                                    ),
                                    child: _isLoading
                                        ? const SizedBox(
                                            height: 20,
                                            width: 20,
                                            child: CircularProgressIndicator(
                                              color: Colors.white,
                                              strokeWidth: 2,
                                            ),
                                          )
                                        : const Text(
                                            'Renew KYC Verification',
                                            style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                  ),
                                ),
                                const SizedBox(height: 16),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Color(0xFF2D3748),
      ),
    );
  }

  Widget _buildTextFormField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? hintText,
    TextInputType? keyboardType,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      validator: validator,
      maxLines: maxLines,
      style: const TextStyle(
        fontSize: 16,
        color: Color(0xFF2D3748),
      ),
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        prefixIcon: Icon(icon, color: const Color(0xFF4A90E2)),
        labelStyle: const TextStyle(
          color: Color(0xFF4A90E2),
          fontWeight: FontWeight.w500,
        ),
        hintStyle: TextStyle(
          color: Colors.grey[400],
          fontSize: 14,
        ),
        filled: true,
        fillColor: Colors.grey[50],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF4A90E2), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }
}
