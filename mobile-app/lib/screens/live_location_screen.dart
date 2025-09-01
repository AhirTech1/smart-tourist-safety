import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';

class LiveLocationScreen extends StatefulWidget {
  const LiveLocationScreen({super.key});

  @override
  State<LiveLocationScreen> createState() => _LiveLocationScreenState();
}

class _LiveLocationScreenState extends State<LiveLocationScreen> {
  final Completer<GoogleMapController> _controller = Completer();
  final ApiService _apiService = ApiService();
  Set<Circle> _highRiskZones = {};

  static const CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(21.1702, 72.8311),
    zoom: 14.4746,
  );

  @override
  void initState() {
    super.initState();
    _fetchHighRiskZones();
  }

  Future<void> _fetchHighRiskZones() async {
    final zones = await _apiService.getHighRiskZones();
    if (mounted) {
      setState(() {
        _highRiskZones = zones.map((zone) {
          return Circle(
            circleId: CircleId(zone['id'].toString()),
            center: LatLng(zone['location']['latitude'], zone['location']['longitude']),
            radius: zone['radius'].toDouble(),
            fillColor: Colors.red.withOpacity(0.2),
            strokeColor: Colors.red,
            strokeWidth: 1,
          );
        }).toSet();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Scaffold is no longer needed here as it's part of the HomeScreen
    return GoogleMap(
      mapType: MapType.normal,
      initialCameraPosition: _kGooglePlex,
      onMapCreated: (GoogleMapController controller) {
        _controller.complete(controller);
      },
      circles: _highRiskZones,
    );
  }
}