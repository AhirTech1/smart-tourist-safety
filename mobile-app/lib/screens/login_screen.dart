import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smart_tourist_safety_app/screens/home_screen.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';
import 'package:smart_tourist_safety_app/theme/theme_notifier.dart';
import 'package:flutter/services.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final _apiService = ApiService();
  bool _isLoading = false;
  bool _obscureLoginPassword = true;
  bool _obscureRegPassword = true;

  // Login controllers
  final _loginEmailController = TextEditingController();
  final _loginPasswordController = TextEditingController();

  // Registration controllers
  final _regNameController = TextEditingController();
  final _regEmailController = TextEditingController();
  final _regPhoneController = TextEditingController();
  final _regPasswordController = TextEditingController();
  final _regDurationController = TextEditingController();
  final _regItineraryController = TextEditingController();
  final _regIdNumberController = TextEditingController();
  final _regEmergencyNameController = TextEditingController();
  final _regEmergencyRelationshipController = TextEditingController();
  final _regEmergencyPhoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
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
  }

  @override
  void dispose() {
    _tabController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _login() async {
     setState(() => _isLoading = true);
    final result = await _apiService.login(
        _loginEmailController.text, _loginPasswordController.text);
    setState(() => _isLoading = false);

    if (mounted) {
      if (result.containsKey('error')) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${result['message']}')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login successful!')),
        );
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => HomeScreen(
              tourist: result['tourist'],
            ),
          ),
        );
      }
    }
  }

  void _register() async {
    // Basic validation
    if (_regNameController.text.isEmpty ||
        _regEmailController.text.isEmpty ||
        _regPhoneController.text.isEmpty ||
        _regPasswordController.text.isEmpty ||
        _regDurationController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields.')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final result = await _apiService.registerTourist(
      name: _regNameController.text,
      email: _regEmailController.text,
      phoneNumber: _regPhoneController.text,
      password: _regPasswordController.text,
      tripDuration: int.tryParse(_regDurationController.text) ?? 7,
      tripItinerary: _regItineraryController.text,
      idNumber: _regIdNumberController.text,
      emergencyContacts: [
        {
          "name": _regEmergencyNameController.text,
          "relationship": _regEmergencyRelationshipController.text,
          "phoneNumber": _regEmergencyPhoneController.text,
        }
      ],
    );
     setState(() => _isLoading = false);

    if (mounted) {
        if (result.containsKey('error')) {
            ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Registration failed: ${result['message']}')),
            );
        } else {
             ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Registration successful! Please log in.')),
            );
            _tabController.animateTo(0);
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SizedBox(width: 40), // For balance
                        Column(
                          children: [
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
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
                                child: Image.asset(
                                  'assets/Logo.png',
                                  width: 60,
                                  height: 60,
                                  fit: BoxFit.contain,
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Smart Tourist Safety',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                shadows: [
                                  Shadow(
                                    color: Colors.black.withOpacity(0.3),
                                    offset: const Offset(0, 2),
                                    blurRadius: 4,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Your safety companion',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.white.withOpacity(0.9),
                                fontWeight: FontWeight.w300,
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              isDarkMode ? Icons.light_mode : Icons.dark_mode,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                          onPressed: () => themeNotifier.toggleTheme(),
                        ),
                      ],
                    ),
                  ),
                  
                  // Tab Section
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 20),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(25),
                      child: BackdropFilter(
                        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(25),
                          ),
                          child: TabBar(
                            controller: _tabController,
                            indicator: BoxDecoration(
                              color: Colors.white.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            indicatorPadding: const EdgeInsets.all(4),
                            indicatorSize: TabBarIndicatorSize.tab,
                            labelColor: Colors.white,
                            unselectedLabelColor: Colors.white.withOpacity(0.7),
                            labelStyle: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                            unselectedLabelStyle: const TextStyle(
                              fontWeight: FontWeight.w400,
                              fontSize: 16,
                            ),
                            dividerColor: Colors.transparent,
                            tabs: const [
                              Tab(
                                child: Padding(
                                  padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                                  child: Text('Sign In'),
                                ),
                              ),
                              Tab(
                                child: Padding(
                                  padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                                  child: Text('Sign Up'),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  
                  // Form Section
                  Expanded(
                    child: Container(
                      margin: const EdgeInsets.only(top: 20),
                      decoration: BoxDecoration(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: const Offset(0, -5),
                          ),
                        ],
                      ),
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          _buildLoginForm(),
                          _buildRegisterForm(),
                        ],
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

  Widget _buildLoginForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),
          Text(
            'Welcome Back!',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Sign in to continue your journey',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              fontWeight: FontWeight.w400,
            ),
          ),
          const SizedBox(height: 40),
          
          // Email Field
          _buildInputField(
            controller: _loginEmailController,
            label: 'Email Address',
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value?.isEmpty ?? true) return 'Email is required';
              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                return 'Enter a valid email';
              }
              return null;
            },
          ),
          
          const SizedBox(height: 20),
          
          // Password Field
          _buildInputField(
            controller: _loginPasswordController,
            label: 'Password',
            icon: Icons.lock_outlined,
            obscureText: _obscureLoginPassword,
            suffixIcon: IconButton(
              icon: Icon(
                _obscureLoginPassword ? Icons.visibility_off : Icons.visibility,
                color: Colors.grey[600],
              ),
              onPressed: () {
                setState(() {
                  _obscureLoginPassword = !_obscureLoginPassword;
                });
              },
            ),
          ),
          
          const SizedBox(height: 12),
          
          // Forgot Password
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () {
                // TODO: Implement forgot password
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Forgot password feature coming soon!')),
                );
              },
              child: Text(
                'Forgot Password?',
                style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 32),
          
          // Login Button
          _buildPrimaryButton(
            text: 'Sign In',
            onPressed: _login,
            isLoading: _isLoading,
          ),
          
          const SizedBox(height: 24),
          
          // Or Divider
          Row(
            children: [
              Expanded(child: Divider(color: Colors.grey[300])),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'or',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Expanded(child: Divider(color: Colors.grey[300])),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Guest Login
          _buildSecondaryButton(
            text: 'Continue as Guest',
            icon: Icons.person_outline,
            onPressed: () {
              // TODO: Implement guest mode
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Guest mode coming soon!')),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),
          Text(
            'Create Account',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Join us for a safer travel experience',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              fontWeight: FontWeight.w400,
            ),
          ),
          const SizedBox(height: 32),
          
          // Personal Information Section
          _buildSectionHeader('Personal Information'),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regNameController,
            label: 'Full Name',
            icon: Icons.person_outline,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regEmailController,
            label: 'Email Address',
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regPhoneController,
            label: 'Phone Number',
            icon: Icons.phone_outlined,
            keyboardType: TextInputType.phone,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regPasswordController,
            label: 'Password',
            icon: Icons.lock_outlined,
            obscureText: _obscureRegPassword,
            isRequired: true,
            suffixIcon: IconButton(
              icon: Icon(
                _obscureRegPassword ? Icons.visibility_off : Icons.visibility,
                color: Colors.grey[600],
              ),
              onPressed: () {
                setState(() {
                  _obscureRegPassword = !_obscureRegPassword;
                });
              },
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Travel Information Section
          _buildSectionHeader('Travel Information'),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regDurationController,
            label: 'Duration of Visit (days)',
            icon: Icons.calendar_today_outlined,
            keyboardType: TextInputType.number,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regIdNumberController,
            label: 'Passport/Aadhar Number',
            icon: Icons.credit_card_outlined,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regItineraryController,
            label: 'Trip Itinerary (optional)',
            icon: Icons.map_outlined,
            maxLines: 3,
          ),
          
          const SizedBox(height: 24),
          
          // Emergency Contact Section
          _buildSectionHeader('Emergency Contact'),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regEmergencyNameController,
            label: 'Contact Name',
            icon: Icons.contact_emergency_outlined,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regEmergencyRelationshipController,
            label: 'Relationship',
            icon: Icons.family_restroom_outlined,
            isRequired: true,
          ),
          const SizedBox(height: 16),
          
          _buildInputField(
            controller: _regEmergencyPhoneController,
            label: 'Contact Phone',
            icon: Icons.phone_in_talk_outlined,
            keyboardType: TextInputType.phone,
            isRequired: true,
          ),
          
          const SizedBox(height: 32),
          
          // Register Button
          _buildPrimaryButton(
            text: 'Create Account',
            onPressed: _register,
            isLoading: _isLoading,
          ),
          
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Container(
      padding: const EdgeInsets.only(left: 4),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Theme.of(context).primaryColor,
        ),
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    bool obscureText = false,
    bool isRequired = false,
    int maxLines = 1,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        maxLines: maxLines,
        validator: validator,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
        decoration: InputDecoration(
          labelText: isRequired ? '$label *' : label,
          labelStyle: TextStyle(
            color: Colors.grey[600],
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
          prefixIcon: Container(
            margin: const EdgeInsets.only(left: 12, right: 8),
            child: Icon(
              icon,
              color: Theme.of(context).primaryColor.withOpacity(0.7),
              size: 24,
            ),
          ),
          suffixIcon: suffixIcon,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey[300]!, width: 1.5),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey[300]!, width: 1.5),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Colors.red, width: 1.5),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Colors.red, width: 2),
          ),
          filled: true,
          fillColor: Theme.of(context).scaffoldBackgroundColor,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        ),
      ),
    );
  }

  Widget _buildPrimaryButton({
    required String text,
    required VoidCallback onPressed,
    bool isLoading = false,
  }) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [
            Theme.of(context).primaryColor,
            Theme.of(context).primaryColor.withOpacity(0.8),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).primaryColor.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: isLoading
            ? const SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2.5,
                ),
              )
            : Text(
                text,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
    );
  }

  Widget _buildSecondaryButton({
    required String text,
    required IconData icon,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.grey[300]!,
          width: 1.5,
        ),
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: TextButton.icon(
        onPressed: onPressed,
        icon: Icon(
          icon,
          color: Colors.grey[700],
          size: 24,
        ),
        label: Text(
          text,
          style: TextStyle(
            color: Colors.grey[700],
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        style: TextButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
    );
  }
}
