import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smart_tourist_safety_app/screens/home_screen.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';
import 'package:smart_tourist_safety_app/theme/theme_notifier.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final _apiService = ApiService();
  bool _isLoading = false;

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
  }

  @override
  void dispose() {
    _tabController.dispose();
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Tourist Safety'),
        actions: [
          IconButton(
            icon: Icon(themeNotifier.themeMode == ThemeMode.light ? Icons.dark_mode : Icons.light_mode),
            onPressed: () => themeNotifier.toggleTheme(),
          )
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Login'),
            Tab(text: 'Register'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildLoginForm(),
          _buildRegisterForm(),
        ],
      ),
    );
  }

  Widget _buildLoginForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          TextField(
            controller: _loginEmailController,
            decoration: const InputDecoration(labelText: 'Email'),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _loginPasswordController,
            decoration: const InputDecoration(labelText: 'Password'),
            obscureText: true,
          ),
          const SizedBox(height: 32),
          _isLoading
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: _login,
                  child: const Text('Login'),
                ),
        ],
      ),
    );
  }

   Widget _buildRegisterForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          TextField(controller: _regNameController, decoration: const InputDecoration(labelText: 'Full Name*')),
          const SizedBox(height: 16),
          TextField(controller: _regEmailController, decoration: const InputDecoration(labelText: 'Email*'), keyboardType: TextInputType.emailAddress,),
          const SizedBox(height: 16),
          TextField(controller: _regPhoneController, decoration: const InputDecoration(labelText: 'Phone Number*'), keyboardType: TextInputType.phone,),
          const SizedBox(height: 16),
          TextField(controller: _regPasswordController, decoration: const InputDecoration(labelText: 'Password*'), obscureText: true,),
          const SizedBox(height: 16),
          TextField(controller: _regDurationController, decoration: const InputDecoration(labelText: 'Duration of Visit (days)*'), keyboardType: TextInputType.number,),
          const SizedBox(height: 16),
          TextField(controller: _regIdNumberController, decoration: const InputDecoration(labelText: 'Passport/Aadhar Number*')),
          const SizedBox(height: 16),
          TextField(controller: _regItineraryController, decoration: const InputDecoration(labelText: 'Trip Itinerary (optional)'), maxLines: 3,),
          const SizedBox(height: 24),
          const Text('Emergency Contact', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
           const SizedBox(height: 16),
          TextField(controller: _regEmergencyNameController, decoration: const InputDecoration(labelText: 'Contact Name*')),
           const SizedBox(height: 16),
          TextField(controller: _regEmergencyRelationshipController, decoration: const InputDecoration(labelText: 'Relationship*')),
           const SizedBox(height: 16),
          TextField(controller: _regEmergencyPhoneController, decoration: const InputDecoration(labelText: 'Contact Phone*'), keyboardType: TextInputType.phone,),
          const SizedBox(height: 32),
          _isLoading
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: _register,
                  child: const Text('Register'),
                ),
        ],
      ),
    );
  }
}
