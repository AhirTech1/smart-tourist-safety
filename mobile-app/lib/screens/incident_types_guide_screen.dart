import 'package:flutter/material.dart';

class IncidentTypesGuideScreen extends StatelessWidget {
  const IncidentTypesGuideScreen({super.key});

  final List<Map<String, dynamic>> _incidentGuides = const [
    {
      'type': 'theft',
      'title': 'Theft & Robbery',
      'icon': Icons.shopping_bag,
      'color': Colors.red,
      'description': 'Theft of personal belongings, bag snatching, or robbery with force/threats.',
      'examples': [
        'Someone stole my bag while I was at a cafe',
        'My phone was pickpocketed on public transport',
        'Robbery at gunpoint or knifepoint',
        'Hotel room burglary'
      ],
      'tips': [
        'Keep valuables secure and out of sight',
        'Use hotel safes for important documents',
        'Be extra cautious in crowded tourist areas',
        'Consider using a money belt or hidden wallet'
      ]
    },
    {
      'type': 'harassment',
      'title': 'Harassment',
      'icon': Icons.person_off,
      'color': Colors.orange,
      'description': 'Unwanted attention, verbal harassment, stalking, or inappropriate behavior.',
      'examples': [
        'Persistent following or stalking',
        'Unwanted verbal or physical advances',
        'Street harassment or catcalling',
        'Discrimination based on appearance/nationality'
      ],
      'tips': [
        'Trust your instincts and remove yourself from the situation',
        'Seek help from nearby authorities or establishments',
        'Travel in groups when possible',
        'Know the local emergency numbers'
      ]
    },
    {
      'type': 'fraud',
      'title': 'Fraud & Scams',
      'icon': Icons.warning,
      'color': Colors.amber,
      'description': 'Tourist scams, overcharging, fake services, or financial fraud.',
      'examples': [
        'Fake taxi drivers charging excessive amounts',
        'Restaurant bill scams or overcharging',
        'Fake tour guides or attraction tickets',
        'ATM skimming or credit card fraud'
      ],
      'tips': [
        'Research common local scams before traveling',
        'Use official taxi services or apps',
        'Check restaurant prices before ordering',
        'Use ATMs inside banks when possible'
      ]
    },
    {
      'type': 'assault',
      'title': 'Physical Assault',
      'icon': Icons.personal_injury,
      'color': Colors.red,
      'description': 'Physical violence, attacks, or threats of bodily harm.',
      'examples': [
        'Physical attack or beating',
        'Sexual assault or attempted assault',
        'Threats of violence',
        'Fight or altercation resulting in injury'
      ],
      'tips': [
        'Seek immediate medical attention if injured',
        'Report to local police immediately',
        'Contact your embassy if you\'re a foreign tourist',
        'Preserve any evidence (photos, witnesses)'
      ]
    },
    {
      'type': 'suspicious',
      'title': 'Suspicious Activity',
      'icon': Icons.visibility,
      'color': Colors.blue,
      'description': 'Unusual behavior, potential criminal activity, or security concerns.',
      'examples': [
        'People following tourists repeatedly',
        'Individuals acting suspiciously around tourist areas',
        'Unusual activity around accommodations',
        'Potential planning of criminal activities'
      ],
      'tips': [
        'Report even if you\'re not sure it\'s criminal',
        'Note descriptions, time, and location',
        'Don\'t confront suspicious individuals',
        'Alert other tourists if safe to do so'
      ]
    },
    {
      'type': 'lost',
      'title': 'Lost/Missing Person',
      'icon': Icons.search,
      'color': Colors.teal,
      'description': 'Missing persons, lost tourists, or separation from travel group.',
      'examples': [
        'Travel companion has gone missing',
        'Lost child in tourist area',
        'Group member hasn\'t returned to meeting point',
        'Someone appears to be lost and distressed'
      ],
      'tips': [
        'Establish meeting points and check-in times',
        'Share itineraries with trusted contacts',
        'Keep emergency contact information handy',
        'Use location sharing apps when possible'
      ]
    },
    {
      'type': 'emergency',
      'title': 'Medical Emergency',
      'icon': Icons.local_hospital,
      'color': Colors.red,
      'description': 'Medical emergencies, accidents, or health-related incidents.',
      'examples': [
        'Tourist accident or injury',
        'Medical emergency requiring immediate attention',
        'Food poisoning outbreak',
        'Dangerous conditions causing injuries'
      ],
      'tips': [
        'Call emergency medical services immediately',
        'Know your travel insurance coverage',
        'Keep medical information accessible',
        'Know locations of nearest hospitals'
      ]
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Incident Reporting Guide'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header Card
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.info,
                        color: Theme.of(context).primaryColor,
                        size: 28,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Text(
                          'When to Report Incidents',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Understanding different types of incidents helps you report effectively and keeps everyone safer. '
                    'Don\'t hesitate to report something that doesn\'t feel right.',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Emergency Note
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.red.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.red.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.emergency, color: Colors.red, size: 24),
                    const SizedBox(width: 8),
                    const Text(
                      'IMMEDIATE DANGER?',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'If you are in immediate danger, call emergency services first:\n'
                  '• 112 (Europe)\n'
                  '• 911 (US/Canada)\n'
                  '• Your local emergency number',
                  style: TextStyle(color: Colors.red),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Incident Types
          ...._incidentGuides.map((guide) => _buildIncidentGuide(context, guide)).toList(),
          
          const SizedBox(height: 20),
          
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => Navigator.pushNamed(context, '/report-incident'),
                  icon: const Icon(Icons.report),
                  label: const Text('Report Incident'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => Navigator.pushNamed(context, '/incident-tracking'),
                  icon: const Icon(Icons.track_changes),
                  label: const Text('Track Reports'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIncidentGuide(BuildContext context, Map<String, dynamic> guide) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: ExpansionTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: guide['color'].withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            guide['icon'],
            color: guide['color'],
            size: 24,
          ),
        ),
        title: Text(
          guide['title'],
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        subtitle: Text(
          guide['description'],
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 14,
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Examples Section
                const Text(
                  'Common Examples:',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                ...((guide['examples'] as List<String>).map(
                  (example) => Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: const EdgeInsets.only(top: 6, right: 8),
                          width: 4,
                          height: 4,
                          decoration: BoxDecoration(
                            color: guide['color'],
                            shape: BoxShape.circle,
                          ),
                        ),
                        Expanded(
                          child: Text(
                            example,
                            style: TextStyle(
                              color: Colors.grey.shade700,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                )).toList(),
                
                const SizedBox(height: 16),
                
                // Safety Tips Section
                const Text(
                  'Safety Tips:',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.blue.shade200),
                  ),
                  child: Column(
                    children: (guide['tips'] as List<String>).map(
                      (tip) => Padding(
                        padding: const EdgeInsets.only(bottom: 4),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.lightbulb,
                              color: Colors.blue.shade600,
                              size: 16,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                tip,
                                style: TextStyle(
                                  color: Colors.blue.shade800,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ).toList(),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Report Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(
                        context,
                        '/report-incident',
                        arguments: {'preselectedType': guide['type']},
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: guide['color'],
                      foregroundColor: Colors.white,
                    ),
                    child: Text('Report ${guide['title']}'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
