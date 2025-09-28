import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';

class MapsScreen extends StatefulWidget {
  final Map<String, dynamic> tourist;

  const MapsScreen({super.key, required this.tourist});

  @override
  State<MapsScreen> createState() => _MapsScreenState();
}

class _MapsScreenState extends State<MapsScreen> {
  GoogleMapController? _mapController;
  Position? _currentPosition;
  Set<Marker> _markers = {};
  Set<Circle> _circles = {};
  bool _isLoading = true;
  final ApiService _apiService = ApiService();

  static const CameraPosition _initialPosition = CameraPosition(
    target: LatLng(28.6139, 77.2090), // Default to Delhi
    zoom: 14.0,
  );

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    _loadSafetyZones();
  }

  Future<void> _getCurrentLocation() async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Please enable location services')),
          );
        }
        setState(() => _isLoading = false);
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Location permission denied')),
            );
          }
          setState(() => _isLoading = false);
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Location permission permanently denied. Please enable in settings.')),
          );
        }
        setState(() => _isLoading = false);
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _currentPosition = position;
        _markers.add(
          Marker(
            markerId: const MarkerId('current_location'),
            position: LatLng(position.latitude, position.longitude),
            infoWindow: const InfoWindow(
              title: 'Your Location',
              snippet: 'You are here',
            ),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
          ),
        );
        _isLoading = false;
      });

      _mapController?.animateCamera(
        CameraUpdate.newLatLng(LatLng(position.latitude, position.longitude)),
      );
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error getting location: ${e.toString()}')),
        );
      }
    }
  }

  void _loadSafetyZones() {
    _loadHighRiskZonesFromBackend();
    _loadEmergencyServices();
  }

  // In _MapsScreenState

  Future<void> _getAndDisplayPredictedZones() async {
    try {
      final zones = await ApiService().getPredictedHighRiskZones(
        _currentPosition!.latitude,
        _currentPosition!.longitude,
      );
      // ... (logic to display the zones on the map)
    } catch (e) {
      // Handle error
    }
  }

  Future<void> _loadHighRiskZonesFromBackend() async {
    try {
      final highRiskZones = await _apiService.getHighRiskZones();
      
      if (highRiskZones.isNotEmpty) {
        setState(() {
          // Clear existing high-risk zone circles and markers
          _circles.removeWhere((circle) => circle.circleId.value.startsWith('high_risk'));
          _markers.removeWhere((marker) => marker.markerId.value.startsWith('high_risk_marker'));
          
          // Add high-risk zones from backend
          for (int i = 0; i < highRiskZones.length; i++) {
            final zone = highRiskZones[i];
            final location = zone['location'] ?? zone; // Handle both nested and flat structure
            final lat = double.parse((location['latitude'] ?? zone['latitude']).toString());
            final lng = double.parse((location['longitude'] ?? zone['longitude']).toString());
            
            _circles.add(
              Circle(
                circleId: CircleId('high_risk_$i'),
                center: LatLng(lat, lng),
                radius: double.parse(zone['radius']?.toString() ?? '300'),
                fillColor: Colors.red.withOpacity(0.3),
                strokeColor: Colors.red,
                strokeWidth: 2,
              ),
            );
            
            // Add a marker at the center of each high-risk zone
            _markers.add(
              Marker(
                markerId: MarkerId('high_risk_marker_$i'),
                position: LatLng(lat, lng),
                infoWindow: InfoWindow(
                  title: zone['name'] ?? 'High Risk Zone',
                  snippet: '${zone['riskType'] ?? 'High-Alert'} - ${zone['description'] ?? 'Stay alert in this area'}',
                ),
                icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
              ),
            );
          }
        });
      } else {
        // Fallback to sample data if backend doesn't return data
        setState(() {
          _circles.addAll([
            Circle(
              circleId: const CircleId('high_risk_sample_1'),
              center: const LatLng(28.6129, 77.2295),
              radius: 500,
              fillColor: Colors.red.withOpacity(0.3),
              strokeColor: Colors.red,
              strokeWidth: 2,
            ),
            Circle(
              circleId: const CircleId('high_risk_sample_2'),
              center: const LatLng(28.6304, 77.2177),
              radius: 300,
              fillColor: Colors.red.withOpacity(0.3),
              strokeColor: Colors.red,
              strokeWidth: 2,
            ),
          ]);
        });
      }
    } catch (e) {
      debugPrint('Error loading high-risk zones: $e');
      // Fallback to sample data on error
      setState(() {
        _circles.addAll([
          Circle(
            circleId: const CircleId('high_risk_fallback_1'),
            center: const LatLng(28.6129, 77.2295),
            radius: 500,
            fillColor: Colors.red.withOpacity(0.3),
            strokeColor: Colors.red,
            strokeWidth: 2,
          ),
          Circle(
            circleId: const CircleId('high_risk_fallback_2'),
            center: const LatLng(28.6304, 77.2177),
            radius: 300,
            fillColor: Colors.red.withOpacity(0.3),
            strokeColor: Colors.red,
            strokeWidth: 2,
          ),
        ]);
      });
    }
  }

  void _loadEmergencyServices() {
    // Add emergency service markers (hospitals and police stations)
    setState(() {
      _markers.addAll([
        Marker(
          markerId: const MarkerId('hospital_1'),
          position: const LatLng(28.6304, 77.2177),
          infoWindow: const InfoWindow(
            title: 'City Hospital',
            snippet: 'Emergency Medical Services',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        ),
        Marker(
          markerId: const MarkerId('police_1'),
          position: const LatLng(28.6195, 77.2085),
          infoWindow: const InfoWindow(
            title: 'Police Station',
            snippet: 'Emergency Services',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueViolet),
        ),
        Marker(
          markerId: const MarkerId('hospital_2'),
          position: const LatLng(28.6250, 77.2100),
          infoWindow: const InfoWindow(
            title: 'General Hospital',
            snippet: 'Emergency Medical Services',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        ),
        Marker(
          markerId: const MarkerId('police_2'),
          position: const LatLng(28.6080, 77.2200),
          infoWindow: const InfoWindow(
            title: 'Local Police Station',
            snippet: 'Emergency Services',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueViolet),
        ),
      ]);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          if (_isLoading)
            const Center(child: CircularProgressIndicator())
          else
            GoogleMap(
              onMapCreated: (GoogleMapController controller) {
                _mapController = controller;
                if (_currentPosition != null) {
                  controller.animateCamera(
                    CameraUpdate.newLatLng(
                      LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
                    ),
                  );
                }
              },
              initialCameraPosition: _initialPosition,
              markers: _markers,
              circles: _circles,
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
              mapType: MapType.normal,
              zoomControlsEnabled: false,
            ),
          // Legend
          Positioned(
            top: 50,
            right: 10,
            child: Card(
              child: Container(
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Legend',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    _buildLegendItem(Colors.red, 'High Risk Zones'),
                    _buildLegendItem(Colors.blue, 'Your Location'),
                    _buildLegendItem(Colors.red.shade700, 'Hospital'),
                    _buildLegendItem(Colors.purple, 'Police'),
                  ],
                ),
              ),
            ),
          ),
          // My Location Button
          Positioned(
            bottom: 100,
            right: 10,
            child: Column(
              children: [
                FloatingActionButton(
                  mini: true,
                  onPressed: () async {
                    setState(() => _isLoading = true);
                    await _loadHighRiskZonesFromBackend();
                    setState(() => _isLoading = false);
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('High-risk zones updated'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    }
                  },
                  backgroundColor: Colors.white,
                  heroTag: "refresh",
                  child: const Icon(Icons.refresh, color: Colors.orange),
                ),
                const SizedBox(height: 8),
                FloatingActionButton(
                  mini: true,
                  onPressed: _getCurrentLocation,
                  backgroundColor: Colors.white,
                  heroTag: "location",
                  child: const Icon(Icons.my_location, color: Colors.blue),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}
