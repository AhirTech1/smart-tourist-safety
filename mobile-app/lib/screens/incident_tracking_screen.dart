import 'package:flutter/material.dart';
import '../services/api_service.dart';

class IncidentTrackingScreen extends StatefulWidget {
  const IncidentTrackingScreen({super.key});

  @override
  State<IncidentTrackingScreen> createState() => _IncidentTrackingScreenState();
}

class _IncidentTrackingScreenState extends State<IncidentTrackingScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _incidents = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadIncidents();
  }

  Future<void> _loadIncidents() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      // TODO: Get tourist ID from user session/storage
      final incidents = await _apiService.getIncidentReports();
      setState(() {
        _incidents = incidents;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'reported':
        return Colors.orange;
      case 'investigating':
        return Colors.blue;
      case 'resolved':
        return Colors.green;
      case 'closed':
        return Colors.grey;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Icon _getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'theft':
        return const Icon(Icons.shopping_bag, color: Colors.red);
      case 'harassment':
        return const Icon(Icons.person_off, color: Colors.orange);
      case 'fraud':
        return const Icon(Icons.warning, color: Colors.amber);
      case 'assault':
        return const Icon(Icons.personal_injury, color: Colors.red);
      case 'vandalism':
        return const Icon(Icons.broken_image, color: Colors.purple);
      case 'pickpocketing':
        return const Icon(Icons.wallet, color: Colors.orange);
      case 'suspicious':
        return const Icon(Icons.visibility, color: Colors.blue);
      case 'lost':
        return const Icon(Icons.search, color: Colors.teal);
      default:
        return const Icon(Icons.report, color: Colors.grey);
    }
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays == 0) {
        if (difference.inHours == 0) {
          return '${difference.inMinutes} minutes ago';
        }
        return '${difference.inHours} hours ago';
      } else if (difference.inDays < 7) {
        return '${difference.inDays} days ago';
      } else {
        return '${date.day}/${date.month}/${date.year}';
      }
    } catch (e) {
      return dateString;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Reports'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadIncidents,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadIncidents,
        child: _buildBody(),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/report-incident').then((_) {
            // Refresh the list when returning from report screen
            _loadIncidents();
          });
        },
        child: const Icon(Icons.add),
        tooltip: 'Report New Incident',
      ),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Loading your reports...'),
          ],
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              'Error loading reports',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadIncidents,
              child: const Text('Try Again'),
            ),
          ],
        ),
      );
    }

    if (_incidents.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.assignment,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              'No Reports Yet',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'You haven\'t reported any incidents yet.\nTap the + button to report an incident.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _incidents.length,
      itemBuilder: (context, index) {
        final incident = _incidents[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          elevation: 2,
          child: InkWell(
            onTap: () => _showIncidentDetails(incident),
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Row
                  Row(
                    children: [
                      _getTypeIcon(incident['type'] ?? 'other'),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _formatIncidentType(incident['type'] ?? 'Other'),
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              _formatDate(incident['createdAt'] ?? ''),
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: _getStatusColor(incident['status'] ?? 'reported').withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: _getStatusColor(incident['status'] ?? 'reported'),
                          ),
                        ),
                        child: Text(
                          _formatStatus(incident['status'] ?? 'Reported'),
                          style: TextStyle(
                            color: _getStatusColor(incident['status'] ?? 'reported'),
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  
                  // Description
                  Text(
                    incident['description'] ?? 'No description available',
                    style: TextStyle(color: Colors.grey.shade700),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Footer Row
                  Row(
                    children: [
                      // Priority Indicator
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: _getPriorityColor(incident['priority'] ?? 'medium').withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _getPriorityIcon(incident['priority'] ?? 'medium'),
                              size: 12,
                              color: _getPriorityColor(incident['priority'] ?? 'medium'),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _formatPriority(incident['priority'] ?? 'Medium'),
                              style: TextStyle(
                                color: _getPriorityColor(incident['priority'] ?? 'medium'),
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      
                      // Location indicator
                      if (incident['location'] != null) ...[
                        Icon(
                          Icons.location_on,
                          size: 14,
                          color: Colors.grey.shade600,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Location saved',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  String _formatIncidentType(String type) {
    switch (type.toLowerCase()) {
      case 'theft':
        return 'Theft/Robbery';
      case 'harassment':
        return 'Harassment';
      case 'fraud':
        return 'Fraud/Scam';
      case 'assault':
        return 'Physical Assault';
      case 'vandalism':
        return 'Vandalism';
      case 'pickpocketing':
        return 'Pickpocketing';
      case 'suspicious':
        return 'Suspicious Activity';
      case 'lost':
        return 'Lost/Missing Person';
      default:
        return 'Other Incident';
    }
  }

  String _formatStatus(String status) {
    switch (status.toLowerCase()) {
      case 'reported':
        return 'Reported';
      case 'investigating':
        return 'Under Investigation';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      case 'rejected':
        return 'Rejected';
      default:
        return status.toUpperCase();
    }
  }

  String _formatPriority(String priority) {
    return priority.toUpperCase();
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'low':
        return Colors.green;
      case 'medium':
        return Colors.orange;
      case 'high':
        return Colors.red;
      case 'critical':
        return Colors.red.shade900;
      default:
        return Colors.grey;
    }
  }

  IconData _getPriorityIcon(String priority) {
    switch (priority.toLowerCase()) {
      case 'low':
        return Icons.low_priority;
      case 'medium':
        return Icons.priority_high;
      case 'high':
        return Icons.priority_high;
      case 'critical':
        return Icons.emergency;
      default:
        return Icons.priority_high;
    }
  }

  void _showIncidentDetails(Map<String, dynamic> incident) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              
              // Header
              Row(
                children: [
                  _getTypeIcon(incident['type'] ?? 'other'),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _formatIncidentType(incident['type'] ?? 'Other'),
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Reported on ${_formatDate(incident['createdAt'] ?? '')}',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status and Priority
                      Row(
                        children: [
                          Expanded(
                            child: _buildDetailItem(
                              'Status',
                              _formatStatus(incident['status'] ?? 'Reported'),
                              _getStatusColor(incident['status'] ?? 'reported'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildDetailItem(
                              'Priority',
                              _formatPriority(incident['priority'] ?? 'Medium'),
                              _getPriorityColor(incident['priority'] ?? 'medium'),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Description
                      _buildDetailSection(
                        'Description',
                        incident['description'] ?? 'No description available',
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Location
                      if (incident['location'] != null) ...[
                        _buildDetailSection(
                          'Location',
                          'Latitude: ${incident['location']['coordinates']?[1]?.toStringAsFixed(6) ?? 'N/A'}\n'
                          'Longitude: ${incident['location']['coordinates']?[0]?.toStringAsFixed(6) ?? 'N/A'}',
                        ),
                        const SizedBox(height: 20),
                      ],
                      
                      // Report Info
                      _buildDetailSection(
                        'Report Information',
                        'Report ID: ${incident['_id'] ?? 'N/A'}\n'
                        'Anonymous: ${incident['isAnonymous'] == true ? 'Yes' : 'No'}\n'
                        'Created: ${_formatDate(incident['createdAt'] ?? '')}',
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Close'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/report-incident');
                      },
                      child: const Text('Report Another'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailItem(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey.shade600,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailSection(String title, String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Text(
            content,
            style: TextStyle(
              color: Colors.grey.shade700,
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }
}
