import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:smart_tourist_safety_app/services/api_service.dart';
import 'package:geolocator/geolocator.dart';

class LiveLocationScreen extends StatefulWidget {
  const LiveLocationScreen({super.key});

  @override
  State<LiveLocationScreen> createState() => _LiveLocationScreenState();
}

class _LiveLocationScreenState extends State<LiveLocationScreen> {
  final Completer<GoogleMapController> _controller = Completer();
  final ApiService _apiService = ApiService();
  Set<Circle> _highRiskZones = {};
  Marker? _currentLocationMarker;

  static const CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(21.1702, 72.8311),
    zoom: 14.4746,
  );

  @override
  void initState() {
    super.initState();
    _fetchHighRiskZones();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      return;
    }
    final position = await Geolocator.getCurrentPosition();
    _animateToUser(position);
  }

  Future<void> _animateToUser(Position position) async {
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(CameraUpdate.newCameraPosition(
      CameraPosition(
        target: LatLng(position.latitude, position.longitude),
        zoom: 15,
      ),
    ));
    setState(() {
      _currentLocationMarker = Marker(
        markerId: const MarkerId('currentLocation'),
        position: LatLng(position.latitude, position.longitude),
        infoWindow: const InfoWindow(title: 'Your Location'),
      );
    });
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
    return GoogleMap(
      mapType: MapType.normal,
      initialCameraPosition: _kGooglePlex,
      onMapCreated: (GoogleMapController controller) {
        _controller.complete(controller);
      },
      circles: _highRiskZones,
      markers: _currentLocationMarker != null ? {_currentLocationMarker!} : {},
      myLocationEnabled: true,
      myLocationButtonEnabled: true,
    );
  }
}