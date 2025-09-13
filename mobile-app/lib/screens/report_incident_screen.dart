import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import 'dart:convert';

class ReportIncidentScreen extends StatefulWidget {
  final String? preselectedType;
  
  const ReportIncidentScreen({super.key, this.preselectedType});

  @override
  State<ReportIncidentScreen> createState() => _ReportIncidentScreenState();
}

class _ReportIncidentScreenState extends State<ReportIncidentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  final ApiService _apiService = ApiService();
  
  String? _selectedIncidentType;
  String? _selectedPriority;
  Position? _currentPosition;
  bool _isAnonymous = false;
  bool _isSubmitting = false;
  bool _isLocationLoading = true;
  
  final List<Map<String, dynamic>> _incidentTypes = [
    {'value': 'theft', 'label': 'Theft/Robbery', 'icon': Icons.shopping_bag, 'color': Colors.red},
    {'value': 'harassment', 'label': 'Harassment', 'icon': Icons.person_off, 'color': Colors.orange},
    {'value': 'fraud', 'label': 'Fraud/Scam', 'icon': Icons.warning, 'color': Colors.amber},
    {'value': 'assault', 'label': 'Physical Assault', 'icon': Icons.personal_injury, 'color': Colors.red.shade900},
    {'value': 'vandalism', 'label': 'Vandalism', 'icon': Icons.broken_image, 'color': Colors.purple},
    {'value': 'pickpocketing', 'label': 'Pickpocketing', 'icon': Icons.wallet, 'color': Colors.orange.shade800},
    {'value': 'suspicious', 'label': 'Suspicious Activity', 'icon': Icons.visibility, 'color': Colors.blue},
    {'value': 'lost', 'label': 'Lost/Missing Person', 'icon': Icons.search, 'color': Colors.teal},
    {'value': 'other', 'label': 'Other', 'icon': Icons.more_horiz, 'color': Colors.grey},
  ];
  
  final List<Map<String, dynamic>> _priorityLevels = [
    {'value': 'low', 'label': 'Low Priority', 'description': 'Non-urgent, informational', 'color': Colors.green},
    {'value': 'medium', 'label': 'Medium Priority', 'description': 'Requires attention', 'color': Colors.orange},
    {'value': 'high', 'label': 'High Priority', 'description': 'Urgent response needed', 'color': Colors.red},
    {'value': 'critical', 'label': 'EMERGENCY', 'description': 'Immediate danger', 'color': Colors.red.shade900},
  ];

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    
    // Set preselected type if provided
    if (widget.preselectedType != null) {
      _selectedIncidentType = widget.preselectedType;
    }
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _getCurrentLocation() async {
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() {
            _isLocationLoading = false;
            _locationController.text = 'Location permission denied';
          });
          return;
        }
      }
      
      if (permission == LocationPermission.deniedForever) {
        setState(() {
          _isLocationLoading = false;
          _locationController.text = 'Location permissions are permanently denied';
        });
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      
      setState(() {
        _currentPosition = position;
        _isLocationLoading = false;
        _locationController.text = 
            '${position.latitude.toStringAsFixed(6)}, ${position.longitude.toStringAsFixed(6)}';
      });
    } catch (e) {
      setState(() {
        _isLocationLoading = false;
        _locationController.text = 'Unable to get current location';
      });
    }
  }

  Future<void> _submitIncident() async {
    if (!_formKey.currentState!.validate() || _selectedIncidentType == null || _selectedPriority == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Please fill all required fields',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: Colors.orange.shade700,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      // Prepare location data
      Map<String, dynamic>? locationData;
      if (_currentPosition != null) {
        locationData = {
          'latitude': _currentPosition!.latitude,
          'longitude': _currentPosition!.longitude,
          'accuracy': _currentPosition!.accuracy,
          'timestamp': DateTime.now().toIso8601String(),
        };
      }

      // Submit incident report
      final response = await _apiService.reportIncident(
        type: _selectedIncidentType!,
        description: _descriptionController.text.trim(),
        priority: _selectedPriority!,
        location: locationData,
        isAnonymous: _isAnonymous,
        touristId: null, // We'll need to get this from user session/storage
      );

      if (mounted) {
        if (response['error'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Failed to report incident: ${response['message']}',
                style: const TextStyle(color: Colors.white),
              ),
              backgroundColor: Colors.red.shade700,
              behavior: SnackBarBehavior.floating,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text(
                'Incident reported successfully!',
                style: TextStyle(color: Colors.white),
              ),
              backgroundColor: Colors.green.shade700,
              behavior: SnackBarBehavior.floating,
              action: SnackBarAction(
                label: 'View Status',
                textColor: Colors.white,
                onPressed: () {
                  // Navigate to incident tracking screen
                },
              ),
            ),
          );
          
          // Show confirmation dialog
          _showConfirmationDialog();
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to report incident: ${e.toString()}',
              style: const TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.red.shade700,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  void _showConfirmationDialog() {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.green, size: 28),
            const SizedBox(width: 12),
            const Text('Report Submitted'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your incident has been reported successfully.',
              style: textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: colorScheme.primary.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'What happens next:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onPrimaryContainer,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('• Local authorities have been notified',
                      style: textTheme.bodyMedium?.copyWith(color: colorScheme.onPrimaryContainer.withOpacity(0.9))),
                  Text('• You will receive updates on your report',
                      style: textTheme.bodyMedium?.copyWith(color: colorScheme.onPrimaryContainer.withOpacity(0.9))),
                  Text('• Emergency contacts may be informed if needed',
                      style: textTheme.bodyMedium?.copyWith(color: colorScheme.onPrimaryContainer.withOpacity(0.9))),
                ],
              ),
            ),
            if (_selectedPriority == 'critical' || _selectedPriority == 'high') ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: colorScheme.error.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.priority_high, color: colorScheme.error),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'High priority reports receive immediate attention from emergency services.',
                        style: TextStyle(
                          color: colorScheme.onErrorContainer,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.of(context).pop(); // Go back to previous screen
            },
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              _resetForm(); // Reset form for another report
            },
            child: const Text('Report Another'),
          ),
        ],
      ),
    );
  }

  void _resetForm() {
    setState(() {
      _selectedIncidentType = null;
      _selectedPriority = null;
      _isAnonymous = false;
      _descriptionController.clear();
    });
    _getCurrentLocation(); // Refresh location
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Incident'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: () => _showHelpDialog(),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Header Card
            Card(
              elevation: 2,
              child: Padding(
                const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.report, color: Theme.of(context).primaryColor, size: 28),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Report Safety Incident',
                            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Help keep tourists safe by reporting incidents. Your report helps improve safety for everyone.',
                      style: textTheme.bodyMedium?.copyWith(
                        color: textTheme.bodyMedium?.color?.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Incident Type Selection
            const Text(
              'Incident Type *',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                const EdgeInsets.all(8),
                child: GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 3,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: _incidentTypes.length,
                  itemBuilder: (context, index) {
                    final type = _incidentTypes[index];
                    final isSelected = _selectedIncidentType == type['value'];
                    
                    return InkWell(
                      onTap: () => setState(() => _selectedIncidentType = type['value']),
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: isSelected ? type['color'] : Colors.grey.shade300,
                            width: isSelected ? 2 : 1,
                          ),
                          borderRadius: BorderRadius.circular(8),
                          color: isSelected ? type['color'].withOpacity(0.1) : null,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              type['icon'],
                              size: 20,
                              color: isSelected ? type['color'] : Colors.grey.shade600,
                            ),
                            const SizedBox(width: 8),
                            Flexible(
                              child: Text(
                                type['label'],
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                  color: isSelected ? type['color'] : Colors.grey.shade800,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  },
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Priority Level
            const Text(
              'Priority Level *',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            ..._priorityLevels.map((priority) {
              final isSelected = _selectedPriority == priority['value'];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: RadioListTile<String>(
                  value: priority['value'],
                  groupValue: _selectedPriority,
                  onChanged: (value) => setState(() => _selectedPriority = value),
                  title: Row(
                    children: [
                      Icon(
                        priority['value'] == 'critical' ? Icons.emergency : Icons.priority_high,
                        color: priority['color'],
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        priority['label'],
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: isSelected ? priority['color'] : null,
                        ),
                      ),
                    ],
                  ),
                  subtitle: Text(priority['description']),
                  activeColor: priority['color'],
                ),
              );
            }).toList(),
            
            const SizedBox(height: 20),
            
            // Description
            const Text(
              'Description *',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                const EdgeInsets.all(16),
                child: TextFormField(
                  controller: _descriptionController,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    hintText: 'Describe the incident in detail. Include time, people involved, what happened, etc.',
                    border: InputBorder.none,
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please provide a description of the incident';
                    }
                    if (value.trim().length < 10) {
                      return 'Please provide more details (at least 10 characters)';
                    }
                    return null;
                  },
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Location
            const Text(
              'Location',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.location_on, color: Theme.of(context).primaryColor),
                        const SizedBox(width: 8),
                        const Text('Current Location', style: TextStyle(fontWeight: FontWeight.w600)),
                        const Spacer(),
                        if (_isLocationLoading)
                          const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        else
                          IconButton(
                            icon: const Icon(Icons.refresh),
                            onPressed: _getCurrentLocation,
                            tooltip: 'Refresh location',
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _locationController,
                      decoration: const InputDecoration(
                        hintText: 'Getting current location...',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.gps_fixed),
                      ),
                      readOnly: true,
                    ),
                    if (_currentPosition != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        'Accuracy: ±${_currentPosition!.accuracy.toStringAsFixed(1)}m',
                        style: textTheme.bodySmall?.copyWith(
                          color: textTheme.bodySmall?.color?.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Anonymous Reporting
            Card(
              child: CheckboxListTile(
                value: _isAnonymous,
                onChanged: (value) => setState(() => _isAnonymous = value ?? false),
                title: const Text('Report Anonymously'),
                subtitle: const Text('Your identity will not be shared with authorities'),
                secondary: const Icon(Icons.visibility_off),
              ),
            ),
            
            const SizedBox(height: 30),
            
            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitIncident,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _selectedPriority == 'critical' 
                      ? Colors.red 
                      : Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                ),
                child: _isSubmitting
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(width: 12),
                          Text('Submitting Report...'),
                        ],
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(_selectedPriority == 'critical' 
                              ? Icons.emergency 
                              : Icons.send),
                          const SizedBox(width: 8),
                          Text(_selectedPriority == 'critical' 
                              ? 'SEND EMERGENCY REPORT' 
                              : 'Submit Report'),
                        ],
                      ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Emergency Note
            if (_selectedPriority == 'critical') 
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: colorScheme.error.withOpacity(0.3)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.warning, color: colorScheme.error),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'EMERGENCY SITUATION',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: colorScheme.onErrorContainer,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'If you are in immediate danger, please call local emergency services directly: 112 (EU), 911 (US), or your local emergency number.',
                            style: TextStyle(color: colorScheme.onErrorContainer.withOpacity(0.9)),
                          ),
                        ],
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

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('How to Report an Incident'),
        content: const SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Follow these steps for effective incident reporting:'),
              SizedBox(height: 16),
              Text('1. Select the type of incident', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Choose the category that best describes what happened.'),
              SizedBox(height: 12),
              Text('2. Set the priority level', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('• Low: Non-urgent, informational\n• Medium: Needs attention\n• High: Urgent response needed\n• Critical: Immediate danger'),
              SizedBox(height: 12),
              Text('3. Provide detailed description', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Include when, where, who was involved, and what exactly happened.'),
              SizedBox(height: 12),
              Text('4. Verify your location', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Make sure the location is accurate for proper response.'),
              SizedBox(height: 12),
              Text('5. Choose reporting preference', style: TextStyle(fontWeight: FontWeight.bold)),
              Text('Decide if you want to report anonymously or not.'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Got it'),
          ),
        ],
      ),
    );
  }
}